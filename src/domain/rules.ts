import { buildClassicDeck, shuffleArray } from './objectives.ts';
import type {
  ActiveMatch,
  ArmyColor,
  DeckMode,
  FallbackResolution,
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
  allPlayers: readonly Pick<MatchPlayer, 'colorId' | 'name' | 'eliminated'>[]
): FallbackResolution {
  if (objective.type !== 'destroy') {
    return { isFallback: false, reason: null };
  }

  const targetId = objective.targetColorId;
  if (ownerPlayer && ownerPlayer.colorId === targetId) {
    return {
      isFallback: true,
      reason:
        'Questo è il tuo stesso colore: per regolamento classico il tuo obiettivo diventa conquistare 24 territori.'
    };
  }

  const targetPlayer = allPlayers.find((p) => p.colorId === targetId);
  if (!targetPlayer) {
    return {
      isFallback: true,
      reason: `Le armate ${objective.targetColorAdjective.toLowerCase()} non sono in gioco in questa partita: il tuo obiettivo diventa conquistare 24 territori.`
    };
  }

  if (targetPlayer.eliminated) {
    return {
      isFallback: true,
      reason: `Le armate ${objective.targetColorAdjective.toLowerCase()} (${targetPlayer.name}) risultano già eliminate: se non sei stato tu a darle il colpo di grazia, il tuo obiettivo diventa conquistare 24 territori.`
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
  rng?: () => number;
}): ActiveMatch {
  const { setupPlayers, playerCount, armyColors, deckMode, rng = Math.random } = params;
  const clampedCount = Math.max(2, Math.min(6, playerCount));
  const selectedSetup = setupPlayers.slice(0, clampedCount);

  const fullDeck = buildClassicDeck(armyColors);
  const activeColorIds = new Set(selectedSetup.map((p) => p.colorId));

  const eligibleDeck =
    deckMode === 'active-only'
      ? fullDeck.filter(
          (card) => card.type !== 'destroy' || activeColorIds.has(card.targetColorId)
        )
      : fullDeck;

  const shuffled = shuffleArray(eligibleDeck, rng);

  const players: MatchPlayer[] = selectedSetup.map((p, idx) => ({
    name: p.name.trim() || `Giocatore ${idx + 1}`,
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
