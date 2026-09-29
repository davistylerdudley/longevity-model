"""
Longevity Projection Model — Excel Workbook Generator
Produces longevity_model.xlsx with 8 sheets.
All math mirrors actuarialMath.ts; see verify_parity.py for cross-check.

Usage:
    pip install -r requirements.txt
    python generate_workbook.py
"""

import math
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, numbers
)
from openpyxl.chart import LineChart, BarChart, Reference
from openpyxl.chart.series import DataPoint
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import ColorScaleRule
import numpy as np

# ─── Core math (mirrors actuarialMath.ts) ─────────────────────────────────────

def survival_static(t, p):
    return math.exp(-p * t)

def survival_with_improvement(t, p0, r):
    if r < 1e-10:
        return survival_static(t, p0)
    integral = (p0 / r) * (1 - math.exp(-r * t))
    return math.exp(-integral)

def survival_asymptote(p0, r):
    if r < 1e-10:
        return 0.0
    return math.exp(-p0 / r)

def lev_threshold_r(p0):
    return p0 / math.log(2)

def density_at(t, p0, r):
    pt = p0 if r < 1e-10 else p0 * math.exp(-r * t)
    return pt * survival_with_improvement(t, p0, r)

def survival_percentile(p0, r, percentile, t_max=2000):
    target = 1 - percentile / 100
    S_prev = 1.0
    for t in range(1, t_max + 1):
        S = survival_with_improvement(t, p0, r)
        if S <= target:
            frac = (target - S_prev) / (S - S_prev)
            return (t - 1) + frac
        S_prev = S
    return float('inf')

# ─── Style helpers ────────────────────────────────────────────────────────────

BLUE = "2563EB"
LIGHT_BLUE = "EFF6FF"
AMBER = "F59E0B"
LIGHT_AMBER = "FFFBEB"
ZINC_900 = "18181B"
ZINC_500 = "71717A"
ZINC_100 = "F4F4F5"
WHITE = "FFFFFF"
YELLOW_FILL = "FEF9C3"  # user-editable cells

def hfill(color):
    return PatternFill("solid", fgColor=color)

def hfont(bold=False, color=ZINC_900, size=11, italic=False):
    return Font(bold=bold, color=color, size=size, italic=italic)

def center():
    return Alignment(horizontal="center", vertical="center")

def left():
    return Alignment(horizontal="left", vertical="center", wrap_text=True)

def thin_border():
    s = Side(style="thin", color="E4E4E7")
    return Border(bottom=s)

def set_col_width(ws, col_letter, width):
    ws.column_dimensions[col_letter].width = width

def header_row(ws, row, values, bg=BLUE, fg=WHITE, bold=True):
    for col, val in enumerate(values, 1):
        c = ws.cell(row=row, column=col, value=val)
        c.fill = hfill(bg)
        c.font = hfont(bold=bold, color=fg, size=10)
        c.alignment = center()
        c.border = thin_border()

def section_header(ws, row, col, text, span=1, bg=ZINC_100):
    c = ws.cell(row=row, column=col, value=text)
    c.fill = hfill(bg)
    c.font = hfont(bold=True, color=ZINC_900, size=10)
    c.alignment = left()

# ─── Model parameters ─────────────────────────────────────────────────────────

PARAMS = {
    "p0_base": 0.0009,
    "r_static": 0.0,
    "r_moderate": 0.005,
    "r_aggressive": 0.020,
    # r_lev computed from p0_base
    "aging_slow_factor": 0.5,
    "biological_age_halt": 30,
    "max_access_delay_q1": 50,
    "suicide_rate": 0.000137,
}
PARAMS["r_lev"] = lev_threshold_r(PARAMS["p0_base"])

RISK_PROFILES = [
    ("Ultra-Low Risk",  0.3),
    ("Low Risk",        0.6),
    ("Moderate Risk",   1.0),
    ("Elevated Risk",   2.5),
    ("Extreme Risk",    8.0),
]

MORTALITY_COMPONENTS = [
    ("Accidents",          45.0, "high",   "CDC NVSS 2024 (DB548); Drug Overdose Deaths DB549"),
    ("Suicide",            13.7, "high",   "CDC NVSS 2024 (DB548)"),
    ("Homicide",            5.9, "high",   "CDC FastStats Homicide 2024; FBI 2025 Reported Crimes"),
    ("Infectious Disease", 15.0, "medium", "GBD 2019; CDC NVSS 2024"),
    ("Medical Error",       7.5, "low",    "Makary & Daniel, BMJ 2016 (contested)"),
    ("Armed Conflict",      1.0, "medium", "Our World in Data; UNODC 2023"),
    ("Other / Residual",    1.9, "low",    "CDC NVSS 2024 residual calculation"),
]

ADVANCEMENT_SCENARIOS = [
    ("Static",     0.000,  "Null hypothesis — no technological improvement"),
    ("Moderate",   0.005,  "~Vehicle safety improvement rate (historical)"),
    ("Aggressive", 0.020,  "~20th-century infectious disease reduction rate"),
    ("LEV",        PARAMS["r_lev"], "Minimum r for >50% survival asymptote"),
]

QUINTILE_DELAY_FRACTIONS = {5: 0.0, 4: 0.15, 3: 0.40, 2: 0.70, 1: 1.0}

T_RANGE = list(range(0, 301, 5))  # 0 to 300 in steps of 5

# ─── Sheet 1: Assumptions Dashboard ──────────────────────────────────────────

def build_assumptions(wb):
    ws = wb.create_sheet("1. Assumptions")
    ws.freeze_panes = "A2"

    header_row(ws, 1, ["Variable", "Value", "Confidence", "Source / Citation", "Notes"], bg=ZINC_900)
    set_col_width(ws, "A", 32)
    set_col_width(ws, "B", 14)
    set_col_width(ws, "C", 12)
    set_col_width(ws, "D", 48)
    set_col_width(ws, "E", 40)

    rows = [
        # Label, value, confidence, source, notes
        ("BACKGROUND MORTALITY", None, None, None, None),
        ("p₀ baseline (annual mortality rate)", PARAMS["p0_base"], "HIGH",
         "CDC NVSS 2024 final; Xu J et al., NCHS Data Brief No. 548, 2026",
         "US non-aging background mortality. ~90/100k/yr total."),
        ("", None, None, None, None),
        ("MORTALITY COMPONENTS (per 100k/yr)", None, None, None, None),
    ]
    for name, rate, conf, source in MORTALITY_COMPONENTS:
        rows.append((f"  {name}", rate / 100000, conf, source, f"{rate}/100k/yr"))

    rows += [
        ("", None, None, None, None),
        ("TECHNOLOGICAL IMPROVEMENT RATE", None, None, None, None),
        ("r — static scenario", PARAMS["r_static"], "N/A (anchor)", "Null hypothesis", "Background mortality unchanged"),
        ("r — moderate scenario", PARAMS["r_moderate"], "MEDIUM",
         "National Safety Council 2023; NHTSA 2023",
         "~Historical vehicle safety improvement (1%/yr motor vehicles → 0.5%/yr blended)"),
        ("r — aggressive scenario", PARAMS["r_aggressive"], "LOW",
         "GBD 2019; CDC historical infectious disease data",
         "~20th-century infectious disease reduction (~3.3%/yr). Aggressive for all-cause."),
        ("r — LEV threshold", PARAMS["r_lev"], "COMPUTED",
         "Derived: r_lev = p₀/ln(2)",
         "Minimum r for >50% survival asymptote"),
        ("", None, None, None, None),
        ("AGING SCENARIOS", None, None, None, None),
        ("Aging slow factor", PARAMS["aging_slow_factor"], "LOW",
         "Harrison DE et al. Nature 2009; Barzilai N et al. Cell Metabolism 2016",
         "Fraction of normal aging rate that persists under 'slowed' scenario"),
        ("Biological age at halt", PARAMS["biological_age_halt"], "SPECULATIVE",
         "No human clinical evidence for aging halt",
         "Age at which halted-aging intervention is applied"),
        ("", None, None, None, None),
        ("ACCESS STRATIFICATION", None, None, None, None),
        ("Max access delay (Q1, years)", PARAMS["max_access_delay_q1"], "LOW",
         "Bach PB, NEJM 2009; FDA CAR-T records 2017–2024",
         "Years before bottom wealth quintile accesses treatment"),
        ("", None, None, None, None),
        ("RISK PROFILES", None, None, None, None),
    ]
    for label, mult in RISK_PROFILES:
        rows.append((f"  {label} — multiplier", mult, "MEDIUM",
                     "BLS Fatal Occupational Injuries 2022; Monasterio et al. 2012",
                     f"Effective p₀ = {PARAMS['p0_base'] * mult:.6f}"))

    rows += [
        ("", None, None, None, None),
        ("OTHER", None, None, None, None),
        ("Suicide annual rate", PARAMS["suicide_rate"], "HIGH",
         "Xu J et al., CDC NVSS 2024 (DB548); WHO Suicide 2021",
         "13.7/100k/yr. Used for cumulative suicide probability calculations."),
    ]

    dv = DataValidation(type="list", formula1='"HIGH,MEDIUM,LOW,SPECULATIVE,COMPUTED,N/A (anchor)"', allow_blank=True)
    ws.add_data_validation(dv)

    current_row = 2
    named_ranges = {}
    for label, value, confidence, source, notes in rows:
        ws.cell(current_row, 1, label).font = hfont(bold=(value is None and label), size=10)
        ws.cell(current_row, 1).alignment = left()

        if value is not None:
            c = ws.cell(current_row, 2, value)
            c.fill = hfill(YELLOW_FILL)
            c.font = hfont(size=10)
            c.alignment = center()
            if isinstance(value, float) and value < 0.01:
                c.number_format = "0.000000"
            elif isinstance(value, float):
                c.number_format = "0.0##"
            named_ranges[label] = (ws.title, f"B{current_row}")

        if confidence:
            cc = ws.cell(current_row, 3, confidence)
            cc.font = hfont(size=10, color=ZINC_500)
            cc.alignment = center()
            dv.add(cc)

        if source:
            ws.cell(current_row, 4, source).font = hfont(size=9, italic=True, color=ZINC_500)
            ws.cell(current_row, 4).alignment = left()

        if notes:
            ws.cell(current_row, 5, notes).font = hfont(size=9, color=ZINC_500)
            ws.cell(current_row, 5).alignment = left()

        current_row += 1

    ws.cell(1, 1).font = hfont(bold=True, color=WHITE)
    ws.row_dimensions[1].height = 18

    # Add legend note
    current_row += 1
    note = ws.cell(current_row, 1, "🟡 Yellow cells are user-editable model inputs. Other sheets reference these cells dynamically.")
    note.font = hfont(size=9, color=ZINC_500, italic=True)
    note.alignment = left()
    ws.merge_cells(f"A{current_row}:E{current_row}")

    return ws, named_ranges

# ─── Sheet 2: Background Mortality Decomposition ──────────────────────────────

def build_mortality_decomp(wb):
    ws = wb.create_sheet("2. Mortality Decomp")
    ws.freeze_panes = "A2"

    header_row(ws, 1, ["Cause", "Rate (per 100k/yr)", "Annual Rate (fraction)", "% of Total", "Confidence", "Source", "Historical Trend"])
    set_col_width(ws, "A", 22); set_col_width(ws, "B", 18); set_col_width(ws, "C", 20)
    set_col_width(ws, "D", 12); set_col_width(ws, "E", 14); set_col_width(ws, "F", 40)
    set_col_width(ws, "G", 22)

    total = sum(r for _, r, _, _ in MORTALITY_COMPONENTS)
    trends = ["Rising (overdose surge)", "Flat", "Volatile", "Declining", "Declining (contested)", "Volatile", "Declining"]

    for i, ((name, rate, conf, source), trend) in enumerate(zip(MORTALITY_COMPONENTS, trends), 2):
        ws.cell(i, 1, name).font = hfont(size=10)
        ws.cell(i, 2, rate).number_format = "0.0"
        ws.cell(i, 3, rate / 100000).number_format = "0.000000"
        ws.cell(i, 4, rate / total).number_format = "0.0%"
        ws.cell(i, 5, conf.upper()).font = hfont(size=10, color=ZINC_500)
        ws.cell(i, 6, source).font = hfont(size=9, italic=True, color=ZINC_500)
        ws.cell(i, 7, trend).font = hfont(size=10, color=ZINC_500)
        for col in range(1, 8):
            ws.cell(i, col).border = thin_border()
            ws.cell(i, col).alignment = left()

    total_row = len(MORTALITY_COMPONENTS) + 2
    ws.cell(total_row, 1, "TOTAL").font = hfont(bold=True, size=10)
    ws.cell(total_row, 2, total).font = hfont(bold=True, size=10)
    ws.cell(total_row, 2).number_format = "0.0"
    ws.cell(total_row, 3, total / 100000).font = hfont(bold=True, size=10)
    ws.cell(total_row, 3).number_format = "0.000000"
    ws.cell(total_row, 4, 1.0).font = hfont(bold=True)
    ws.cell(total_row, 4).number_format = "0.0%"
    ws.cell(total_row, 1).fill = hfill(ZINC_100)

    # Chart
    chart = BarChart()
    chart.type = "bar"
    chart.title = "Background Mortality by Cause (deaths per 100k/year)"
    chart.style = 2
    chart.y_axis.title = "Deaths per 100,000/yr"
    chart.x_axis.title = "Cause"

    data = Reference(ws, min_col=2, min_row=1, max_row=len(MORTALITY_COMPONENTS) + 1)
    cats = Reference(ws, min_col=1, min_row=2, max_row=len(MORTALITY_COMPONENTS) + 1)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.shape = 4
    chart.height = 12
    chart.width = 22

    ws.add_chart(chart, "I2")
    return ws

# ─── Sheet 3: Aging Scenarios ────────────────────────────────────────────────

def build_aging_scenarios(wb):
    ws = wb.create_sheet("3. Aging Scenarios")
    ws.freeze_panes = "A2"

    p0 = PARAMS["p0_base"]
    r = PARAMS["r_moderate"]

    scenarios = [
        ("Halted Aging (base)", p0, r, False),
        ("Slowed Aging (50% rate)", p0 * (1 + PARAMS["aging_slow_factor"]), r, True),
        ("Reversed Aging (25% lower p₀)", p0 * 0.75, r, True),
        ("No Intervention (with aging)", p0 * 10, 0, True),
    ]

    header_vals = ["Year"] + [s[0] for s in scenarios]
    header_row(ws, 1, header_vals)

    for t_idx, t in enumerate(T_RANGE, 2):
        ws.cell(t_idx, 1, t).font = hfont(size=10)
        for col, (_, p, r_val, _) in enumerate(scenarios, 2):
            s = survival_with_improvement(t, p, r_val)
            c = ws.cell(t_idx, col, s)
            c.number_format = "0.0%"
            c.font = hfont(size=10)

    for col in range(1, len(scenarios) + 2):
        set_col_width(ws, get_column_letter(col), 20)

    # Chart
    chart = LineChart()
    chart.title = "Survival Curves by Aging Scenario (Moderate Technological Advancement)"
    chart.style = 2
    chart.y_axis.title = "Survival Probability"
    chart.x_axis.title = "Years from now"
    chart.y_axis.numFmt = "0%"
    chart.y_axis.scaling.min = 0
    chart.y_axis.scaling.max = 1

    data = Reference(ws, min_col=2, max_col=len(scenarios) + 1, min_row=1, max_row=len(T_RANGE) + 1)
    cats = Reference(ws, min_col=1, min_row=2, max_row=len(T_RANGE) + 1)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.height = 14; chart.width = 26

    ws.add_chart(chart, f"G2")
    return ws

# ─── Sheet 4: Concurrent Advancement ─────────────────────────────────────────

def build_advancement(wb):
    ws = wb.create_sheet("4. Advancement Scenarios")
    ws.freeze_panes = "A2"

    p0 = PARAMS["p0_base"]
    scenario_r = [(s[0], s[1]) for s in ADVANCEMENT_SCENARIOS]

    header_vals = ["Year"] + [s[0] for s in ADVANCEMENT_SCENARIOS] + ["Notes"]
    header_row(ws, 1, header_vals)

    for t_idx, t in enumerate(T_RANGE, 2):
        ws.cell(t_idx, 1, t).font = hfont(size=10)
        for col, (_, r) in enumerate(scenario_r, 2):
            s = survival_with_improvement(t, p0, r)
            c = ws.cell(t_idx, col, s)
            c.number_format = "0.0%"
            c.font = hfont(size=10)

    # Asymptote row
    asym_row = len(T_RANGE) + 3
    ws.cell(asym_row, 1, "S(∞) — Survival Asymptote").font = hfont(bold=True, size=10)
    ws.cell(asym_row, 1).fill = hfill(LIGHT_BLUE)
    for col, (_, r) in enumerate(scenario_r, 2):
        asym = survival_asymptote(p0, r)
        c = ws.cell(asym_row, col, asym if asym > 0 else "0 (all die eventually)")
        if isinstance(asym, float) and asym > 0:
            c.number_format = "0.0%"
        c.fill = hfill(LIGHT_BLUE)
        c.font = hfont(bold=True, size=10)

    # LEV note
    lev_row = asym_row + 1
    ws.cell(lev_row, 1, f"LEV threshold r = {PARAMS['r_lev']:.5f} ({PARAMS['r_lev']*100:.3f}%/yr)").font = hfont(size=9, italic=True, color=ZINC_500)

    for col in range(1, len(scenario_r) + 2):
        set_col_width(ws, get_column_letter(col), 18)

    # Chart
    chart = LineChart()
    chart.title = "Survival Curves by Technological Advancement Scenario"
    chart.style = 2
    chart.y_axis.title = "Survival Probability"
    chart.x_axis.title = "Years from now"
    chart.y_axis.numFmt = "0%"
    chart.y_axis.scaling.min = 0
    chart.y_axis.scaling.max = 1

    data = Reference(ws, min_col=2, max_col=len(ADVANCEMENT_SCENARIOS) + 1, min_row=1, max_row=len(T_RANGE) + 1)
    cats = Reference(ws, min_col=1, min_row=2, max_row=len(T_RANGE) + 1)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.height = 14; chart.width = 26

    ws.add_chart(chart, "G2")
    return ws

# ─── Sheet 5: Access Stratification ──────────────────────────────────────────

def build_stratification(wb):
    ws = wb.create_sheet("5. Access Stratification")
    ws.freeze_panes = "A2"

    p0 = PARAMS["p0_base"]
    r = PARAMS["r_moderate"]
    p0_aging = p0 * 10  # aging-inclusive mortality
    max_delay = PARAMS["max_access_delay_q1"]

    quintiles = [5, 4, 3, 2, 1]
    labels = {5: "Q5 Top 20%", 4: "Q4 Upper-Mid", 3: "Q3 Middle", 2: "Q2 Lower-Mid", 1: "Q1 Bottom 20%"}
    delays = {q: max_delay * QUINTILE_DELAY_FRACTIONS[q] for q in quintiles}

    header_vals = ["Year"] + [labels[q] for q in quintiles]
    header_row(ws, 1, header_vals)

    # Compute pre-access survival for each quintile
    pre_survival = {q: survival_static(delays[q], p0_aging) for q in quintiles}

    t_max = 200
    for t_idx, t in enumerate(range(0, t_max + 1, 5), 2):
        ws.cell(t_idx, 1, t).font = hfont(size=10)
        for col, q in enumerate(quintiles, 2):
            delay = delays[q]
            if t <= delay:
                s = survival_static(t, p0_aging)
            else:
                s = pre_survival[q] * survival_with_improvement(t - delay, p0, r)
            c = ws.cell(t_idx, col, s)
            c.number_format = "0.0%"
            c.font = hfont(size=10)

    t_count = t_max // 5 + 1

    # Summary rows
    asym_row = t_count + 3
    ws.cell(asym_row, 1, "Survival Asymptote S(∞)").font = hfont(bold=True, size=10)
    ws.cell(asym_row, 1).fill = hfill(LIGHT_BLUE)
    for col, q in enumerate(quintiles, 2):
        asym = pre_survival[q] * survival_asymptote(p0, r)
        c = ws.cell(asym_row, col, asym)
        c.number_format = "0.0%"
        c.fill = hfill(LIGHT_BLUE)
        c.font = hfont(bold=True, size=10)

    delay_row = asym_row + 1
    ws.cell(delay_row, 1, "Access Delay (years)").font = hfont(size=10, italic=True, color=ZINC_500)
    for col, q in enumerate(quintiles, 2):
        ws.cell(delay_row, col, delays[q]).number_format = "0"

    for col in range(1, len(quintiles) + 2):
        set_col_width(ws, get_column_letter(col), 16)

    # Chart
    chart = LineChart()
    chart.title = f"Survival by Wealth Quintile (max access delay Q1: {max_delay} years)"
    chart.style = 2
    chart.y_axis.title = "Survival Probability"
    chart.x_axis.title = "Years from now"
    chart.y_axis.numFmt = "0%"
    chart.y_axis.scaling.min = 0
    chart.y_axis.scaling.max = 1

    data = Reference(ws, min_col=2, max_col=len(quintiles) + 1, min_row=1, max_row=t_count + 1)
    cats = Reference(ws, min_col=1, min_row=2, max_row=t_count + 1)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.height = 14; chart.width = 26

    ws.add_chart(chart, "H2")
    return ws

# ─── Sheet 6: Risk Profile Scenarios ─────────────────────────────────────────

def build_risk_profiles(wb):
    ws = wb.create_sheet("6. Risk Profiles")
    ws.freeze_panes = "A2"

    p0 = PARAMS["p0_base"]
    r = PARAMS["r_moderate"]

    header_row(ws, 1, ["Risk Profile", "Multiplier", "Effective p₀", "Expected Lifespan", "Median Lifespan", "S(∞) Asymptote", "Prob. die before 100y", "Prob. die before 500y"])
    col_widths = [20, 12, 16, 18, 16, 16, 20, 20]
    for i, w in enumerate(col_widths, 1):
        set_col_width(ws, get_column_letter(i), w)

    for row, (label, mult) in enumerate(RISK_PROFILES, 2):
        p_eff = p0 * mult
        asym = survival_asymptote(p_eff, r)
        exp_life = 1 / p_eff if r < 1e-10 else float('inf')
        med_life = survival_percentile(p_eff, r, 50)
        p100 = 1 - survival_with_improvement(100, p_eff, r)
        p500 = 1 - survival_with_improvement(500, p_eff, r)

        ws.cell(row, 1, label).font = hfont(size=10, bold=True)
        ws.cell(row, 2, mult).number_format = "0.0x"
        ws.cell(row, 3, p_eff).number_format = "0.00000%"
        ws.cell(row, 4, f"{exp_life:,.0f} years" if not math.isinf(exp_life) else "∞ (asymptote > 0)")
        ws.cell(row, 5, f"{med_life:,.0f} years" if not math.isinf(med_life) else "∞")
        ws.cell(row, 6, asym).number_format = "0.0%"
        ws.cell(row, 7, p100).number_format = "0.0%"
        ws.cell(row, 8, p500).number_format = "0.0%"

        for col in range(1, 9):
            ws.cell(row, col).border = thin_border()
            ws.cell(row, col).alignment = left()
            if row % 2 == 0:
                ws.cell(row, col).fill = hfill(ZINC_100)

    return ws

# ─── Sheet 7: Distributions and Percentiles ──────────────────────────────────

def build_distributions(wb):
    ws = wb.create_sheet("7. Distributions")
    ws.freeze_panes = "A2"

    p0 = PARAMS["p0_base"]

    scenarios_r = [(label, r) for label, r, _ in ADVANCEMENT_SCENARIOS]
    header_vals = ["Year"] + [f"S(t) — {label}" for label, _ in scenarios_r] + [f"f(t) — {label}" for label, _ in scenarios_r]
    header_row(ws, 1, header_vals)

    for t_idx, t in enumerate(T_RANGE, 2):
        ws.cell(t_idx, 1, t).font = hfont(size=10)
        for col, (_, r) in enumerate(scenarios_r, 2):
            s = survival_with_improvement(t, p0, r)
            ws.cell(t_idx, col, s).number_format = "0.0%"
        for col2, (_, r) in enumerate(scenarios_r, 2 + len(scenarios_r)):
            d = density_at(t, p0, r)
            ws.cell(t_idx, col2, d).number_format = "0.00000%"

    # Percentile table
    pct_start = len(T_RANGE) + 4
    ws.cell(pct_start, 1, "Percentile Analysis").font = hfont(bold=True, size=11)
    ws.cell(pct_start + 1, 1, "Scenario").font = hfont(bold=True)
    for col, pct in enumerate([10, 25, 50, 75, 90], 2):
        ws.cell(pct_start + 1, col, f"P{pct}").font = hfont(bold=True)
        set_col_width(ws, get_column_letter(col), 16)
    ws.cell(pct_start + 1, len(scenarios_r) + 2, "S(∞)").font = hfont(bold=True)

    for row, (label, r) in enumerate(scenarios_r, pct_start + 2):
        ws.cell(row, 1, label).font = hfont(size=10)
        for col, pct in enumerate([10, 25, 50, 75, 90], 2):
            v = survival_percentile(p0, r, pct)
            ws.cell(row, col, f"{v:,.0f}y" if not math.isinf(v) else "∞").font = hfont(size=10)
        asym = survival_asymptote(p0, r)
        ws.cell(row, len(scenarios_r) + 2, asym).number_format = "0.0%"

    # Suicide accumulation table
    suic_start = pct_start + len(scenarios_r) + 5
    ws.cell(suic_start, 1, "Cumulative Suicide Probability").font = hfont(bold=True, size=11)
    ws.cell(suic_start, 1).fill = hfill(LIGHT_AMBER)
    sr = PARAMS["suicide_rate"]
    for t_idx, t in enumerate([100, 200, 500, 1000, 2000], suic_start + 1):
        prob = 1 - math.exp(-sr * t)
        ws.cell(t_idx, 1, f"By year {t}").font = hfont(size=10)
        ws.cell(t_idx, 2, prob).number_format = "0.0%"
        ws.cell(t_idx, 3, f"(US suicide rate: {sr*100000:.1f}/100k/yr)").font = hfont(size=9, italic=True, color=ZINC_500)

    for col in range(1, 2 * len(scenarios_r) + 2):
        set_col_width(ws, get_column_letter(col), 16)
    set_col_width(ws, "A", 20)

    return ws

# ─── Sheet 8: Sensitivity Analysis ───────────────────────────────────────────

def build_sensitivity(wb):
    ws = wb.create_sheet("8. Sensitivity Analysis")
    ws.freeze_panes = "A2"

    p0 = PARAMS["p0_base"]
    r_base = PARAMS["r_moderate"]
    base_asym = survival_asymptote(p0, r_base)

    sensitivity_params = [
        ("Background Mortality (p₀)",     "p0",  p0,             0.5),
        ("Technological Improvement (r)", "r",   r_base,         0.5),
        ("Max Access Delay (Q1)",         "del", PARAMS["max_access_delay_q1"], 0.5),
    ]

    def asym_for(param_key, value):
        if param_key == "p0":
            return survival_asymptote(value, r_base)
        elif param_key == "r":
            return survival_asymptote(p0, value)
        else:
            return base_asym  # access delay doesn't affect asymptote directly

    header_row(ws, 1, ["Parameter", "Base Value", "Low (−50%)", "High (+50%)", "Base Asymptote", "Low Asymptote", "High Asymptote", "Low Delta (pp)", "High Delta (pp)"])

    col_widths = [30, 14, 14, 14, 16, 16, 16, 16, 16]
    for i, w in enumerate(col_widths, 1):
        set_col_width(ws, get_column_letter(i), w)

    entries = []
    for row, (label, key, base_val, frac) in enumerate(sensitivity_params, 2):
        low_val = base_val * (1 - frac)
        high_val = base_val * (1 + frac)
        low_asym = asym_for(key, low_val)
        high_asym = asym_for(key, high_val)
        low_delta = (low_asym - base_asym) * 100
        high_delta = (high_asym - base_asym) * 100

        ws.cell(row, 1, label).font = hfont(size=10)
        ws.cell(row, 2, base_val).number_format = "0.00000"
        ws.cell(row, 3, low_val).number_format = "0.00000"
        ws.cell(row, 4, high_val).number_format = "0.00000"
        ws.cell(row, 5, base_asym).number_format = "0.0%"
        ws.cell(row, 6, low_asym).number_format = "0.0%"
        ws.cell(row, 7, high_asym).number_format = "0.0%"
        ws.cell(row, 8, low_delta).number_format = '+0.0;-0.0;0.0'
        ws.cell(row, 9, high_delta).number_format = '+0.0;-0.0;0.0'

        for col in range(1, 10):
            ws.cell(row, col).border = thin_border()
            ws.cell(row, col).alignment = center()

        entries.append((label, low_delta, high_delta))

    # Tornado chart note
    note_row = len(sensitivity_params) + 4
    ws.cell(note_row, 1, "Note: A full tornado chart would require a dedicated visualization tool.").font = hfont(size=9, italic=True, color=ZINC_500)
    ws.cell(note_row, 1).alignment = left()
    ws.cell(note_row + 1, 1, "The interactive website (website/) provides a real-time tornado chart under Section 6.").font = hfont(size=9, italic=True, color=ZINC_500)
    ws.cell(note_row + 1, 1).alignment = left()

    return ws

# ─── House style ──────────────────────────────────────────────────────────────

def apply_house_style(wb):
    for ws in wb.worksheets:
        ws.sheet_view.showGridLines = True
        ws.print_options.horizontalCentered = False
        ws.page_margins.left = 0.5
        ws.page_margins.right = 0.5
        # Row height
        for row in ws.iter_rows():
            for cell in row:
                if cell.row == 1:
                    ws.row_dimensions[cell.row].height = 20

# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    wb = Workbook()
    wb.remove(wb.active)  # remove default sheet

    print("Building Assumptions Dashboard...")
    build_assumptions(wb)

    print("Building Mortality Decomposition...")
    build_mortality_decomp(wb)

    print("Building Aging Scenarios...")
    build_aging_scenarios(wb)

    print("Building Advancement Scenarios...")
    build_advancement(wb)

    print("Building Access Stratification...")
    build_stratification(wb)

    print("Building Risk Profiles...")
    build_risk_profiles(wb)

    print("Building Distributions & Percentiles...")
    build_distributions(wb)

    print("Building Sensitivity Analysis...")
    build_sensitivity(wb)

    apply_house_style(wb)

    output = "longevity_model.xlsx"
    wb.save(output)
    print(f"\n✓ Saved: {output}")
    print(f"  Sheets: {[ws.title for ws in wb.worksheets]}")

if __name__ == "__main__":
    main()
