import { describe, expect, it } from 'vitest';
import { DEFAULT_ARMY_COLORS, buildClassicDeck } from '../src/domain/objectives.ts';
import { dealMatchObjectives, resolveEffectiveObjective } from '../src/domain/rules.ts';
import { isDefaultPlayerName } from '../src/i18n/translations.ts';
import { escapeHtml, sanitizeHex } from '../src/ui/icons.ts';

describe('resolveEffectiveObjective', () => {
  const deck = buildClassicDeck(DEFAULT_ARMY_COLORS, 'en');
  const destroyRed = deck.find((c) => c.id === 'destroy-red')!;
  const destroyBlue = deck.find((c) => c.id === 'destroy-blue')!;
  const terr18 = deck.find((c) => c.id === 'terr-18-2')!;

  it('does not trigger fallback for territory or continent cards', () => {
    const res = resolveEffectiveObjective(
      terr18,
      { name: 'Marco', colorId: 'red' },
      [{ name: 'Marco', colorId: 'red', eliminated: false }],
      'en'
    );
    expect(res.isFallback).toBe(false);
    expect(res.reason).toBeNull();
  });

  it('falls back to 24 territories when drawing own color (EN & IT)', () => {
    const enRes = resolveEffectiveObjective(
      destroyRed,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: false }
      ],
      'en'
    );
    expect(enRes.isFallback).toBe(true);
    expect(enRes.reason).toContain('your own color');

    const itRes = resolveEffectiveObjective(
      destroyRed,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: false }
      ],
      'it'
    );
    expect(itRes.isFallback).toBe(true);
    expect(itRes.reason).toContain('tuo stesso colore');
  });

  it('falls back to 24 territories when target color is not in match', () => {
    const res = resolveEffectiveObjective(
      destroyBlue,
      { name: 'Marco', colorId: 'red' },
      [{ name: 'Marco', colorId: 'red', eliminated: false }],
      'en'
    );
    expect(res.isFallback).toBe(true);
    expect(res.reason).toContain('not in this match');
  });

  it('falls back to 24 territories when target player is marked eliminated', () => {
    const res = resolveEffectiveObjective(
      destroyBlue,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: true }
      ],
      'en'
    );
    expect(res.isFallback).toBe(true);
    expect(res.reason).toContain('already eliminated');
  });

  it('keeps destroy objective when target opponent is active', () => {
    const res = resolveEffectiveObjective(
      destroyBlue,
      { name: 'Marco', colorId: 'red' },
      [
        { name: 'Marco', colorId: 'red', eliminated: false },
        { name: 'Luca', colorId: 'blue', eliminated: false }
      ],
      'en'
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

describe('i18n helpers', () => {
  it('identifies default player names in both English and Italian', () => {
    expect(isDefaultPlayerName('Player 1', 0)).toBe(true);
    expect(isDefaultPlayerName('Giocatore 1', 0)).toBe(true);
    expect(isDefaultPlayerName('', 0)).toBe(true);
    expect(isDefaultPlayerName('Marco', 0)).toBe(false);
  });
});

describe('security helpers', () => {
  it('escapes HTML special characters including single and double quotes', () => {
    expect(escapeHtml('<script>"alert(\'xss\')"</script>')).toBe(
      '&lt;script&gt;&quot;alert(&#39;xss&#39;)&quot;&lt;/script&gt;'
    );
  });

  it('sanitizes hex colors and rejects invalid CSS payloads', () => {
    expect(sanitizeHex('#C82027')).toBe('#C82027');
    expect(sanitizeHex('red; background: url(https://evil.test)')).toBe('#222426');
    expect(sanitizeHex('invalid', '#000000')).toBe('#000000');
  });
});
