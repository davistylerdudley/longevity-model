import { describe, it, expect } from 'vitest';
import {
  BEATS,
  BEAT_NOTES,
  CAST,
  CHART_DATA,
  SPARK_DATA,
  TYPICAL_DATA,
  BRANCH_EPILOGUE,
  readoutForYear,
  START_YEAR,
  END_YEAR,
  LEV_YEAR,
} from '../scenario';

describe('Escape Velocity — narrative integrity', () => {
  it('has a substantial, chronologically ordered set of beats with unique ids', () => {
    expect(BEATS.length).toBeGreaterThanOrEqual(15);
    expect(new Set(BEATS.map((b) => b.id)).size).toBe(BEATS.length);
    for (let i = 1; i < BEATS.length; i++) expect(BEATS[i].year).toBeGreaterThanOrEqual(BEATS[i - 1].year);
    BEATS.forEach((b) => {
      expect(b.year).toBeGreaterThanOrEqual(START_YEAR);
      expect(b.year).toBeLessThanOrEqual(END_YEAR);
      expect(b.paragraphs.length).toBeGreaterThanOrEqual(2);
      b.paragraphs.forEach((p) => expect(p.length).toBeGreaterThan(200));
    });
  });

  it('starts documented, ends at the fork, and tags every beat', () => {
    expect(BEATS[0].basis).toBe('observed');
    expect(BEATS[0].sources?.length).toBeGreaterThan(0);
    expect(BEATS[BEATS.length - 1].id).toBe('fork');
    BEATS.forEach((b) => expect(['observed', 'forecast', 'implication']).toContain(b.basis));
  });

  it('opens on the observed 2025–2026 record, including the first human dosing', () => {
    const opening = BEATS[0];
    expect(opening.id).toBe('pieces');
    expect(opening.basis).toBe('observed');
    const text = opening.paragraphs.join(' ');
    expect(text).toContain('2026');
    expect(text).toContain('ER-100');
    expect(BEAT_NOTES.pieces).toBeTruthy();
  });

  it('never dates the first human reprogramming dosing to 2025', () => {
    BEATS.forEach((b) => {
      b.paragraphs.forEach((para) => {
        if (para.includes('ER-100')) expect(para).not.toContain('2025');
      });
      (b.sources ?? []).forEach((src) => {
        if (src.label.includes('ER-100')) expect(src.label).not.toContain('2025');
      });
    });
  });

  it('every "why this forecast" note points at a real beat', () => {
    const ids = new Set(BEATS.map((b) => b.id));
    Object.keys(BEAT_NOTES).forEach((k) => expect(ids.has(k)).toBe(true));
  });

  it('carries its recurring cast through the story', () => {
    const text = BEATS.map((b) => b.paragraphs.join(' ')).join(' ');
    ['Ines', 'Emeka', 'Teodora', 'Marcus Bellweather', 'Ravi Mehra', 'Agent-5'].forEach((n) => expect(text).toContain(n));
    expect(CAST.length).toBeGreaterThanOrEqual(5);
  });

  it('is re-timed to the AI Futures Dec 2025 medians: Agent-1 in 2029, LEV in 2039, ending 2048', () => {
    expect(LEV_YEAR).toBe(2039);
    expect(END_YEAR).toBe(2048);
    expect(BEATS.find((b) => b.id === 'weekend')?.period).toBe('2029');
    const slow = BEATS.find((b) => b.id === 'slow');
    expect(slow?.basis).toBe('forecast');
    expect(slow?.year).toBe(2027);
    expect(BEAT_NOTES).toHaveProperty('slow');
    expect(readoutForYear(2029).aiSystem).toBe('Agent-1');
    expect(readoutForYear(2039).aiSystem).toBe('Agent-5');
  });

  it('has a row for every year and beats in chronological order', () => {
    for (let y = START_YEAR; y <= END_YEAR; y++) expect(readoutForYear(y).year).toBe(y);
    for (let i = 1; i < BEATS.length; i++) expect(BEATS[i].year).toBeGreaterThanOrEqual(BEATS[i - 1].year);
    BEATS.forEach((b) => {
      const m = b.period.match(/\d{4}/);
      if (m) expect(+m[0]).toBe(b.year);
    });
  });

  it('keeps character ages consistent with the shifted dates', () => {
    const text = (id: string) => BEATS.find((b) => b.id === id)!.paragraphs.join(' ');
    expect(text('clock')).toContain('seventy-six');
    expect(text('moving')).toContain('seventy-seven');
    expect(text('queue')).toContain('thirty-seven in 2036');
    expect(text('letter')).toContain('2048, at forty-nine');
    expect(BRANCH_EPILOGUE.locked.text).toContain('2048, at 49');
  });

  it('both branch endings mention the person whose fate they decide', () => {
    expect(BRANCH_EPILOGUE.broad.text).toContain('Ravi');
    expect(BRANCH_EPILOGUE.locked.text).toContain('Ravi');
  });
});

describe('Escape Velocity — the dashboard math', () => {
  it('the frontier floor crosses 50% exactly at the escape-velocity year', () => {
    expect(readoutForYear(LEV_YEAR).asymptote).toBeGreaterThanOrEqual(0.5);
    expect(readoutForYear(LEV_YEAR - 1).asymptote).toBeLessThan(0.5);
  });

  it('progress is monotone: floor, research speed, and access never fall', () => {
    for (let i = 1; i < CHART_DATA.length; i++) expect(CHART_DATA[i].asymptote).toBeGreaterThanOrEqual(CHART_DATA[i - 1].asymptote);
    for (let i = 1; i < SPARK_DATA.length; i++) expect(SPARK_DATA[i].speed).toBeGreaterThanOrEqual(SPARK_DATA[i - 1].speed);
    for (let y = START_YEAR + 1; y <= END_YEAR; y++) expect(readoutForYear(y).accessShare).toBeGreaterThanOrEqual(readoutForYear(y - 1).accessShare);
  });

  it('the therapy is not for sale in 2025 and gets cheaper every year once it is', () => {
    expect(readoutForYear(2025).cost).toBeNull();
    let prev = Infinity;
    for (let y = START_YEAR; y <= END_YEAR; y++) {
      const c = readoutForYear(y).cost;
      if (c !== null) {
        expect(c).toBeLessThanOrEqual(prev);
        prev = c;
      }
    }
  });

  it('the shared future always does at least as well as the divided one', () => {
    TYPICAL_DATA.forEach((d) => expect(d.broad).toBeGreaterThanOrEqual(d.locked));
  });

  it('the median is finite before escape velocity and unbounded after', () => {
    expect(Number.isFinite(readoutForYear(2036).medianLifespan)).toBe(true);
    expect(readoutForYear(2043).medianLifespan).toBe(Infinity);
  });
});
