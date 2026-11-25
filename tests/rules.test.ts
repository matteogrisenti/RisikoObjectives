import { describe, expect, it } from 'vitest';
import { DEFAULT_ARMY_COLORS, buildClassicDeck } from '../src/domain/objectives.ts';
import { dealMatchObjectives, resolveEffectiveObjective } from '../src/domain/rules.ts';

describe('resolveEffectiveObjective', () => {
  const deck = buildClassicDeck(DEFAULT_ARMY_COLORS);
  const destroyRed = deck.find((c) => c.id === 'destroy-red')!;
  const destroyBlue = deck.find((c) => c.id === 'destroy-blue')!;
  const terr18 = deck.find((c) => c.id === 'terr-18-2')!;

  it('does not trigger fallback for territory or continent cards', () => {
    const res = resolveEffectiveObjective(
      terr18,
      { name: 'Marco', colorId: 'red' },
      [{ name: 'Marco', colorId: 'red', eliminated: false }]
    );
    expect(res.isFallback).toBe(false);
    expect(res.reason).toBeNull();
  });

  it('falls back to 24 territories when drawing own color', () => {
    const res = resolveEffectiveObjective(
      destroyRed,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: false }
      ]
    );
    expect(res.isFallback).toBe(true);
    expect(res.reason).toContain('tuo stesso colore');
  });

  it('falls back to 24 territories when target color is not in match', () => {
    const res = resolveEffectiveObjective(
      destroyBlue,
      { name: 'Marco', colorId: 'red' },
      [{ name: 'Marco', colorId: 'red', eliminated: false }]
    );
    expect(res.isFallback).toBe(true);
    expect(res.reason).toContain('non sono in gioco');
  });

  it('falls back to 24 territories when target player is marked eliminated', () => {
    const res = resolveEffectiveObjective(
      destroyBlue,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: true }
      ]
    );
    expect(res.isFallback).toBe(true);
    expect(res.reason).toContain('eliminate');
  });

  it('keeps destroy objective when target opponent is active', () => {
    const res = resolveEffectiveObjective(
      destroyBlue,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: false }
      ]
    );
    expect(res.isFallback).toBe(false);
  });
});

describe('dealMatchObjectives', () => {
  const setupPlayers = [
    { name: 'Alice', colorId: 'red' },
    { name: 'Bob', colorId: 'blue' },
    { name: 'Carla', colorId: 'green' },
    { name: 'Dario', colorId: 'yellow' }
  ];

  it('deals unique objectives to each player', () => {
    const match = dealMatchObjectives({
      setupPlayers,
      playerCount: 4,
      armyColors: DEFAULT_ARMY_COLORS,
      deckMode: 'classic'
    });

    expect(match.players).toHaveLength(4);
    const ids = new Set(match.players.map((p) => p.objective.id));
    expect(ids.size).toBe(4);
  });

  it('excludes absent army destroy cards in active-only mode', () => {
    const match = dealMatchObjectives({
      setupPlayers,
      playerCount: 4,
      armyColors: DEFAULT_ARMY_COLORS,
      deckMode: 'active-only'
    });

    for (const player of match.players) {
      if (player.objective.type === 'destroy') {
        expect(['red', 'blue', 'green', 'yellow']).toContain(
          player.objective.targetColorId
        );
      }
    }
  });
});
