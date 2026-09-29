import { describe, it, expect } from 'vitest';
import { selectStory, illustrativeStories } from '../stories';
import { computePersonalScenario } from '../actuarialMath';
import type { UserProfile } from '../types';

const profile = (over: Partial<UserProfile> = {}): UserProfile => ({
  name: 'Jordan',
  countryCode: 'US',
  currentAge: 30,
  incomePercentile: 60,
  riskAppetite: 40,
  treatmentYear: 2040,
  ...over,
});

describe('illustrativeStories', () => {
  const all = illustrativeStories();

  it('exposes every vignette with a unique id and a persona', () => {
    expect(all.length).toBeGreaterThanOrEqual(9);
    expect(new Set(all.map((s) => s.id)).size).toBe(all.length);
    all.forEach((s) => {
      expect(s.personaName).toBeTruthy();
      expect(s.personaTag).toBeTruthy();
      expect(s.paragraphs.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('fills every template token', () => {
    all.forEach((s) => s.paragraphs.forEach((p) => {
      expect(p).not.toMatch(/\{name\}|\{place\}|\{country\}/);
    }));
  });

  it('uses the specific locales the personas were given', () => {
    const text = all.map((s) => s.paragraphs.join(' ')).join(' ');
    expect(text).toContain('New York');
    expect(text).toContain('Uttar Pradesh');
    expect(text).toContain('Lagos');
  });
});

describe('selectStory', () => {
  it('a young, early, safe, wealthy person gets the long-morning story', () => {
    const p = profile({ currentAge: 25, treatmentYear: 2030, incomePercentile: 95, riskAppetite: 10, countryCode: 'CH' });
    const story = selectStory(p, computePersonalScenario(p, 'moderate'));
    expect(story.id).toBe('early-survivor');
  });

  it('an old person facing a late launch gets the near-thing story', () => {
    const p = profile({ currentAge: 80, treatmentYear: 2065 });
    const story = selectStory(p, computePersonalScenario(p, 'moderate'));
    expect(story.id).toBe('missed-it');
  });

  it('high everyday exposure gets the close-to-the-edge story', () => {
    const p = profile({ currentAge: 25, treatmentYear: 2030, incomePercentile: 85, riskAppetite: 90 });
    const story = selectStory(p, computePersonalScenario(p, 'moderate'));
    expect(story.id).toBe('high-exposure');
  });

  it('substitutes the name and a naturally-phrased country', () => {
    const p = profile();
    const story = selectStory(p, computePersonalScenario(p, 'moderate'));
    const text = story.paragraphs.join(' ');
    expect(text).toContain('Jordan');
    expect(text).toContain('the United States');
    expect(text).not.toMatch(/\bin United States\b/);
  });

  it('falls back to "You" when no name is given', () => {
    const p = profile({ name: '   ' });
    const story = selectStory(p, computePersonalScenario(p, 'moderate'));
    expect(story.paragraphs.join(' ')).toContain('You');
  });
});
