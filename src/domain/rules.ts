import { COLOR_LABELS, getStrings } from '../i18n/translations.ts';
import { buildClassicDeck, resolveColorKey, shuffleArray } from './objectives.ts';
import type {
  ActiveMatch,
  ArmyColor,
  DeckMode,
  FallbackResolution,
  Language,
  MatchPlayer,
  ObjectiveCard,
  SetupPlayer
} from './types.ts';

/**
 * Risolve l'obiettivo effettivo secondo la regola classica di riserva.
 */
export function resolveEffectiveObjective(
  objective: ObjectiveCard,
  ownerPlayer: Pick<MatchPlayer, 'colorId' | 'name'> | null,
  allPlayers: readonly Pick<MatchPlayer, 'colorId' | 'name' | 'eliminated'>[],
  lang: Language = 'en',
  armyColors?: readonly ArmyColor[]
): FallbackResolution {
  if (objective.type !== 'destroy') {
    return { isFallback: false, reason: null };
  }

  const strings = getStrings(lang);
  const targetId = objective.targetColorId;

  const matchedColor = armyColors?.find((c) => c.id === targetId);
  const targetKey =
    objective.targetColorKey ??
    (matchedColor ? resolveColorKey(matchedColor) : resolveColorKey({
      id: targetId,
      hex: objective.targetColorHex,
      name: objective.targetColorName
    }));
  const targetAdjective = COLOR_LABELS[lang][targetKey].adjective;

  if (ownerPlayer && ownerPlayer.colorId === targetId) {
    return {
      isFallback: true,
      reason: strings.fallbackOwnColor
    };
  }

  const targetPlayer = allPlayers.find((p) => p.colorId === targetId);
  if (!targetPlayer) {
    return {
      isFallback: true,
      reason: strings.fallbackAbsentColor(targetAdjective)
    };
  }

  if (targetPlayer.eliminated) {
    return {
      isFallback: true,
      reason: strings.fallbackEliminatedColor(targetAdjective, targetPlayer.name)
    };
  }

  return { isFallback: false, reason: null };
}

/**
 * Distribuisce gli obiettivi ai giocatori configurati creando una nuova partita.
 */
export function dealMatchObjectives(params: {
  setupPlayers: readonly SetupPlayer[];
  playerCount: number;
  armyColors: readonly ArmyColor[];
  deckMode: DeckMode;
  lang?: Language;
  rng?: () => number;
}): ActiveMatch {
  const {
    setupPlayers,
    playerCount,
    armyColors,
    deckMode,
    lang = 'en',
    rng = Math.random
  } = params;
  const clampedCount = Math.max(2, Math.min(6, playerCount));
  const selectedSetup = setupPlayers.slice(0, clampedCount);
  const strings = getStrings(lang);

  const fullDeck = buildClassicDeck(armyColors, lang);
  const activeColorIds = new Set(selectedSetup.map((p) => p.colorId));

  const eligibleDeck =
    deckMode === 'active-only'
      ? fullDeck.filter(
          (card) => card.type !== 'destroy' || activeColorIds.has(card.targetColorId)
        )
      : fullDeck;

  const shuffled = shuffleArray(eligibleDeck, rng);

  const players: MatchPlayer[] = selectedSetup.map((p, idx) => ({
    name: p.name.trim() || strings.playerDefaultName(idx + 1),
    colorId: p.colorId,
    seen: false,
    eliminated: false,
    objective: shuffled[idx]
  }));

  return {
    deckMode,
    players,
    revealAll: false,
    createdAt: Date.now()
  };
}
