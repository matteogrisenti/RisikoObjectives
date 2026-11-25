import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ARMY_COLORS,
  buildClassicDeck,
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

  it('uses custom box colors when provided', () => {
    const customColors = DEFAULT_ARMY_COLORS.map((c, idx) =>
      idx === 5
        ? { id: c.id, name: 'Arancione', adjective: 'Arancioni', hex: '#dd6b20' }
        : c
    );
    const deck = buildClassicDeck(customColors);
    const orangeCard = deck.find((c) => c.id === 'destroy-purple');
    expect(orangeCard?.type).toBe('destroy');
    if (orangeCard?.type === 'destroy') {
      expect(orangeCard.targetColorAdjective).toBe('Arancioni');
      expect(orangeCard.targetColorHex).toBe('#dd6b20');
    }
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
