import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ARMY_COLORS,
  buildClassicDeck,
  resolveColorKey,
  shuffleArray
} from '../src/domain/objectives.ts';

describe('buildClassicDeck', () => {
  it('generates exactly 14 classic objective cards', () => {
    const deck = buildClassicDeck(DEFAULT_ARMY_COLORS);
    expect(deck).toHaveLength(14);
  });

  it('contains 2 territory cards, 6 continent cards, and 6 destroy cards', () => {
    const deck = buildClassicDeck(DEFAULT_ARMY_COLORS);
    expect(deck.filter((c) => c.type === 'territories')).toHaveLength(2);
    expect(deck.filter((c) => c.type === 'continents')).toHaveLength(6);
    expect(deck.filter((c) => c.type === 'destroy')).toHaveLength(6);
  });

  it('uses English by default and supports Italian localization', () => {
    const enDeck = buildClassicDeck(DEFAULT_ARMY_COLORS, 'en');
    const enRed = enDeck.find((c) => c.id === 'destroy-red');
    expect(enRed?.text).toBe('Destroy all Red armies.');

    const itDeck = buildClassicDeck(DEFAULT_ARMY_COLORS, 'it');
    const itRed = itDeck.find((c) => c.id === 'destroy-red');
    expect(itRed?.text).toBe('Devi distruggere completamente le armate Rosse.');
  });

  it('uses custom box colors when provided', () => {
    const customColors = DEFAULT_ARMY_COLORS.map((c, idx) =>
      idx === 5
        ? { id: c.id, key: 'orange' as const, name: 'Orange', adjective: 'Orange', hex: '#D96B27' }
        : c
    );
    const itDeck = buildClassicDeck(customColors, 'it');
    const orangeCard = itDeck.find((c) => c.id === 'destroy-purple');
    expect(orangeCard?.type).toBe('destroy');
    if (orangeCard?.type === 'destroy') {
      expect(orangeCard.targetColorAdjective).toBe('Arancioni');
      expect(orangeCard.targetColorHex).toBe('#D96B27');
    }
  });

  it('resolves ColorKey cleanly from legacy color entries', () => {
    expect(resolveColorKey({ id: 'purple', name: 'Viola', hex: '#7A54A8' })).toBe('purple');
    expect(resolveColorKey({ id: 'custom', name: 'Arancione', hex: '#D96B27' })).toBe('orange');
  });
});

describe('shuffleArray', () => {
  it('preserves all elements without mutating original array', () => {
    const original = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffleArray(original, () => 0.42);
    expect(original).toEqual([1, 2, 3, 4, 5, 6]);
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(original);
  });
});
