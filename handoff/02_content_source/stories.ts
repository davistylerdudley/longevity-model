import type { UserProfile, PersonalScenario, StoryScenario } from './types';
import { lookupCountry } from './actuarialMath';

// A library of short science-fiction vignettes. One is selected for the user
// based on the outcome the model computes for them. Each also carries a
// representative "persona" (a named person in a specific place) so the closing
// section can show illustrative versions of every other outcome.
//
// Templates use two tokens: {name} and {place}. For the user's own story, place
// is their country; for the illustrative personas, place is a specific locale.

interface Persona {
  name: string;
  place: string; // specific locale used in the text
  tag: string;   // short label for the browse menu
}

interface Vignette extends StoryScenario {
  match: (ctx: StoryContext) => boolean;
  weight: number; // higher wins when several match
  persona: Persona;
}

interface StoryContext {
  asymptote: number;
  waitYears: number;
  medianLifespan: number;
  survivesToTreatment: number;
  riskAppetite: number;
  incomePercentile: number;
  countryName: string;
}

const VIGNETTES: Vignette[] = [
  {
    id: 'high-exposure',
    title: 'Close to the edge',
    weight: 5,
    match: (c) => c.riskAppetite >= 70,
    persona: { name: 'Dmitri', place: 'Chelyabinsk', tag: 'High-exposure life · Russia' },
    paragraphs: [
      "Every March, {name} sat in a reclining chair in a strip-mall clinic in {place} while a technician threaded the reset line into a vein and watched thirty years of wear roll backward on the screen: fatty liver clearing, arteries opening, the small scar tissue of a hard life smoothing out over ninety minutes. The methylation readout ticked down to a biological twenty-nine. Then {name} drove straight to the depot and clocked in for the night haul, because the reset fixed the body and did exactly nothing about black ice on the mountain grade.",
      "The odds scrolled across the transit screens now, updated hourly by the city's models, blunt and without comfort. Solving aging deletes the slow death that waits at the end of a span. It leaves every fast one exactly where it was: the jackknife on the pass, the misjudged corner, the stranger outside the all-night depot with a grudge and a knife. {name} worked where all of those live, and knew it, and set the alarm for the next shift anyway.",
      "The winter of 2071 the depot buried four drivers, every one of them biologically thirty, every one gone in a single afternoon. {name} went to the services, ate the cold food, and was back on the road by Monday. A body that will never age is a strange chip to push across the table. {name} pushed it every night, slept fine, and could never quite explain why the wager felt worth it — only that a careful forever had never once tempted them.",
    ],
  },
  {
    id: 'missed-it',
    title: 'A near thing',
    weight: 6,
    match: (c) => c.survivesToTreatment < 0.4,
    persona: { name: 'Yusuf', place: 'the Nile Delta', tag: 'Arrived too late · Egypt' },
    paragraphs: [
      "{name} kept a folder — real paper, in {place}, where paper still meant something — of every clipping about the reset since the first mouse trials made the news. The folder got fat. The therapy walked from a Boston lab to a Zurich clinic to a price that roughly halved every four years, always visible on the feed, always one border and one bank balance out of reach.",
      "The trouble was never the science. It was the calendar. By the time the reset came within range of an ordinary person in {place}, {name} was already deep in the years the old body charges interest on: a bad fall in 2059, a fever the next winter that the antibiotics only half-answered, a heart that had started keeping its own private schedule. Each season was a toll booth. {name} paid at every one, counting the distance to the clinic the way a tiring swimmer counts strokes against a current that is quietly, politely winning.",
      "Maybe {name} made the last stretch. Asked straight, the model puts the odds against it and does not soften the answer. That is the sentence the launch parties never say out loud: a cure can be real, and certain, and still arrive the season after the funeral. The whole distance between \"humanity solved it\" and \"you got there in time\" is measured in people exactly like {name}, and the model refuses to look away from them.",
    ],
  },
  {
    id: 'early-survivor',
    title: 'The long morning',
    weight: 4,
    match: (c) => c.asymptote >= 0.5 && c.waitYears <= 25,
    persona: { name: 'Amara', place: 'New York', tag: 'First in line · New York City' },
    paragraphs: [
      "{name} took the reset the first winter it cleared the regulators, in a clinic in {place} that still had the plastic wrap on the waiting-room chairs. It cost more than an apartment. Nine years later it cost less than a phone — but by then {name} had a decade's head start, and in this particular arithmetic a decade's head start compounds, quietly and without mercy, into centuries.",
      "By 2400 {name} had outlived three architectural fashions and every map that tried to hold {place} still. The animal fear of running out of time gave way to a discipline no earlier human ever needed: deciding, over and over, what an unbounded life is actually for. {name} kept the answer on a single sheet of paper, recopied whenever it wore through — two hundred and fourteen entries and lengthening: learn the cello properly, watch one comet come back around, find and apologize to the descendants of someone wronged four hundred years ago.",
      "There were costs the brochure skipped. A friend who chose an ending in 2180 and left a note that only said \"enough.\" Whole decades gone soft, because memory has a working capacity no reset extends. But on the balance of a very long morning, {name} will tell you plainly, with a paper list in one pocket and no particular hurry: more time was the rarest thing anyone was ever handed, and the one gift {name} never once caught themselves regretting.",
    ],
  },
  {
    id: 'compounding',
    title: 'Compounding',
    weight: 3,
    match: (c) => c.asymptote >= 0.5,
    persona: { name: 'Kenji', place: 'Singapore', tag: 'Odds that compound · Singapore' },
    paragraphs: [
      "The math favored whoever cleared the first century, and {name} cleared it in {place} by being boringly, deliberately careful in exactly the years the model flagged red. Then the world did the rest. The cars stopped colliding around 2050. The outbreaks got caught in days, then hours. Each decade arrived a shade safer than the one before, and the odds, patient and cumulative, bent year over year toward staying alive.",
      "Past the fourth century {name} stopped marking birthdays and started counting careers. Two hundred years of medicine, retired the day the machines got quietly better at it. A stint hauling water ice on the orbital run when {place} pushed its shipping lanes past the atmosphere. Then, at an age when earlier humans would simply have stopped, the cello — badly for the first forty years, and after that well. Mastery stopped being a finish line and became a neighborhood you moved into and never left.",
      "This is the quiet engine under the whole model: stay alive, and every advance that lands after you is a gift you were present to collect. {name} collected a few centuries of them — the anti-cancer edit in 2090, sleep compressed to two hours, and the thing in 2312 that finally, properly fixed memory. The only trick, start to end, was to still be there when the next one arrived.",
    ],
  },
  {
    id: 'moderate-odds',
    title: 'A weighted coin',
    weight: 2,
    match: (c) => c.asymptote >= 0.2,
    persona: { name: 'Sofia', place: 'Lisbon', tag: 'A real chance · Portugal' },
    paragraphs: [
      "{name} did not get a promise. {name} got a coin, weighted a little toward staying, and spent a long time in {place} learning to live beside it. The reset lowered the chance of dying in any given year; it never drove it to zero. Forever sat on the table next to an ordinary long life that simply ends one clear Tuesday, and nobody, not even the model, could say which one {name} would draw.",
      "So {name} lived the way the odds recommended, because no other way made sense: careful in the years the model marked dangerous, generous in the ones it marked safe, holding both futures in the same hand without needing to know which would be spent. Still took the six a.m. shift. Still crossed at the same corner. In 2140 a colleague who had drawn the short straw left {name} a heavy wool coat and a good mechanical watch, and {name} wound the watch every morning after that, a small argument with the odds.",
      "On balance {name} found the live coin easier to carry than the old certainty ever was. A future still spinning is its own kind of hope — arguably the only honest kind anyone ever really had, before the reset or after it. {name} kept winding the watch, and kept not knowing, and found, to some surprise, that not knowing was survivable for a very long time.",
    ],
  },
  {
    id: 'long-finite',
    title: 'An astonishing amount of time',
    weight: 2,
    match: (c) => c.medianLifespan >= 250,
    persona: { name: 'Liam', place: 'Wellington', tag: 'Long but finite · New Zealand' },
    paragraphs: [
      "Nobody promised {name} immortality, and the model does not either. What it handed someone young and lucky in {place} was stranger and larger than any promise: not the end of death, but the end of the schedule. {name} would still die someday — the background risks never fully close — just not on any timetable a human being had ever been able to plan a life around.",
      "Eight hundred years, the readout suggested, give or take a couple of centuries. Long enough to train as a marine ecologist, then spend two hundred years watching the reef {name} had first mapped as a student bleach, collapse, and — slowly, with enormous help and a rebuilt current — come back. Long enough to hold a confident, wrong opinion and live the entire arc of being corrected. Long enough to lose the thread of one whole life and pick up a different one at what used to be called retirement age.",
      "Not forever, then. But so far past the old three-score-and-ten that the word \"lifespan\" quietly stopped meaning what it used to. {name}, who had expected eighty years and a garden, treated every extra century as exactly what it was: unearned, statistically unlikely, and far too rare to waste any of it worrying about the far end.",
    ],
  },
  {
    id: 'the-wait',
    title: 'The waiting years',
    weight: 3,
    match: (c) => c.waitYears >= 45 && c.survivesToTreatment >= 0.4,
    persona: { name: 'Priya', place: 'Uttar Pradesh', tag: 'Decades in the queue · India' },
    paragraphs: [
      "The whole of {name}'s strategy was to be young when the news broke, and {name} was — nineteen, in {place}, watching the reset arrive everywhere else first. It lived on the feeds for thirty years before it reached a clinic {name} could afford: routine in Zurich, routine in Shanghai, a rumor at home, with a price that fell one stubborn increment a year and eligibility rules that read like a locked door.",
      "So {name} did the only thing the odds allowed: stayed alive and let the queue crawl forward. Skipped the second-hand motorbike a cousin swore by. Took every vaccine when the trucks rolled through the district. Watched the price chart down, watched the eligibility widen village by village, watched the far edge of the wait come into reach the way a far shore does if you simply, stubbornly refuse to stop swimming. Two friends from school did not make it. {name} still had their photographs.",
      "On the morning the local clinic in {place} finally opened its ordinary, unglamorous doors — 2068, monsoon just breaking — the line went around the block and around again, full of people who had spent half a life hoping to become exactly this: bored, safe, unremarkably and permanently alive. {name} stood in it six hours in the wet heat, appointment slip reading 3:40 p.m., and counted those hours, later, among the best of the several centuries that followed.",
    ],
  },
  {
    id: 'low-odds',
    title: 'The old rules, mostly',
    weight: 3,
    match: (c) => c.asymptote < 0.2,
    persona: { name: 'Grace', place: 'Lagos', tag: 'The old rules held · Nigeria' },
    paragraphs: [
      "The headlines said aging was solved, and in {place} that was true the way a cure is true for a person who cannot reach it. The reset was real. So was the distance: the cost of a working lifetime, the nearest clinic three cities away, the years of ordinary risk to be crossed first in a place the global models had always, quietly, rounded down to a footnote.",
      "{name} lived those years the way people always had — the same courage, the same exposure — in a city that got the future late and secondhand. The great acceleration reached {place} first as rumor, then as an import for the few who could fly out for it, then finally as a public program a full generation after it might have changed everything. By then {name} had already spent a great deal of one human life under the older, harder arithmetic: a sister lost to an infection a richer district had stopped fearing, a decade of skilled work a machine somewhere else had made obsolete over a weekend.",
      "This is the part the launch events skip and the model keeps in frame. A breakthrough can be genuine, inevitable, and still not arrive in time, or in reach, for everyone alive when it lands. {name}'s long life was never guaranteed by the discovery. It hung, as it always had, on the oldest and least romantic question there is: who gets it, and when, and who is left to wait.",
    ],
  },
  {
    id: 'middle',
    title: 'An ordinary infinity',
    weight: 1,
    match: () => true, // fallback
    persona: { name: 'Ana', place: 'Bogotá', tag: 'An ordinary widening · Colombia' },
    paragraphs: [
      "{name} did not expect to live forever, and the model mostly agreed. What the reset offered someone in {place}, with {name}'s ordinary mix of luck and exposure, was not a guarantee but a widening: more time, more chances, more room to be badly wrong about something and still live long enough to make it right.",
      "So {name} waded in a decade at a time, the way you enter cold water. Some of those decades careful, some reckless. Retrained twice — once by choice, once because a machine learned the old job over a single weekend and never asked for it back. Buried some people. Outlived two governments and a currency. {place} rearranged itself at a pace that once took three generations and now took part of one life, and {name} was somehow still standing at the far side of the change, faintly surprised to be there.",
      "Whether the whole run came to a few more decades or a great many more was, {name} decided somewhere in the muddled middle of it, a far worse question than the only one that ever really mattered: what to actually do with the years that were already, improbably, certain.",
    ],
  },
];

function fill(paragraphs: string[], name: string, place: string): string[] {
  return paragraphs.map((p) => p.replace(/\{name\}/g, name).replace(/\{place\}/g, place));
}

// Make a country name read naturally inside "in {place}" / "reached {place}".
function naturalPlace(countryName: string): string {
  const withArticle = ['United States', 'United Kingdom', 'United Arab Emirates'];
  if (withArticle.includes(countryName)) return `the ${countryName}`;
  if (countryName === 'Somewhere else') return 'your corner of the world';
  return countryName;
}

export function selectStory(
  profile: UserProfile,
  personal: PersonalScenario,
): StoryScenario {
  const ctx: StoryContext = {
    asymptote: personal.asymptote,
    waitYears: personal.waitYears,
    medianLifespan: personal.medianLifespan,
    survivesToTreatment: personal.survivesToTreatment,
    riskAppetite: profile.riskAppetite,
    incomePercentile: profile.incomePercentile,
    countryName: lookupCountry(profile.countryCode).name,
  };

  const matches = VIGNETTES.filter((v) => v.match(ctx)).sort((a, b) => b.weight - a.weight);
  const chosen = matches[0] ?? VIGNETTES[VIGNETTES.length - 1];

  const name = profile.name.trim() || 'You';
  return {
    id: chosen.id,
    title: chosen.title,
    paragraphs: fill(chosen.paragraphs, name, naturalPlace(ctx.countryName)),
  };
}

export interface IllustrativeStory extends StoryScenario {
  personaName: string;
  personaTag: string;
}

// Every vignette rendered with its representative persona, for the browse menu.
export function illustrativeStories(): IllustrativeStory[] {
  return VIGNETTES.map((v) => ({
    id: v.id,
    title: v.title,
    personaName: v.persona.name,
    personaTag: v.persona.tag,
    paragraphs: fill(v.paragraphs, v.persona.name, v.persona.place),
  }));
}
