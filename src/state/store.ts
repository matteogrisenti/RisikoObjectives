import {
  DEFAULT_ARMY_COLORS,
  buildClassicDeck,
  resolveColorKey,
  shuffleArray
} from '../domain/objectives.ts';
import { dealMatchObjectives } from '../domain/rules.ts';
import type {
  AppState,
  ArmyColor,
  DeckMode,
  Language,
  SetupPlayer
} from '../domain/types.ts';
import {
  getLocalizedColor,
  getStrings,
  isDefaultPlayerName
} from '../i18n/translations.ts';

const STORAGE_KEY = 'risiko_classic_state_v1';

export type Listener = (state: AppState) => void;

export class AppStore {
  private state: AppState;
  private listeners = new Set<Listener>();

  constructor() {
    this.state = this.loadState();
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.saveState();
    this.listeners.forEach((listener) => listener(this.state));
  }

  private createInitialState(): AppState {
    const lang: Language = 'en';
    const strings = getStrings(lang);
    const armyColors = DEFAULT_ARMY_COLORS.map((c) => ({ ...c }));
    const setupPlayers: SetupPlayer[] = [0, 1, 2, 3].map((idx) => ({
      name: strings.playerDefaultName(idx + 1),
      colorId: armyColors[idx].id
    }));

    return {
      lang,
      armyColors,
      playerCount: 4,
      deckMode: 'classic',
      setupPlayers,
      activeMatch: null,
      quickDeck: {
        cards: shuffleArray(buildClassicDeck(armyColors, lang)),
        drawnCount: 0,
        currentCard: null
      }
    };
  }

  private loadState(): AppState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.createInitialState();
      const parsed = JSON.parse(raw) as Partial<AppState>;
      if (!parsed || !Array.isArray(parsed.armyColors) || parsed.armyColors.length !== 6) {
        return this.createInitialState();
      }

      const lang: Language = parsed.lang === 'it' ? 'it' : 'en';
      const armyColors: ArmyColor[] = parsed.armyColors.map((c) => ({
        ...c,
        key: resolveColorKey(c)
      }));

      const quickDeck =
        parsed.quickDeck && Array.isArray(parsed.quickDeck.cards)
          ? parsed.quickDeck
          : {
              cards: shuffleArray(buildClassicDeck(armyColors, lang)),
              drawnCount: 0,
              currentCard: null
            };

      return {
        lang,
        armyColors,
        playerCount: parsed.playerCount ?? 4,
        deckMode: parsed.deckMode ?? 'classic',
        setupPlayers: parsed.setupPlayers ?? this.createInitialState().setupPlayers,
        activeMatch: parsed.activeMatch ?? null,
        quickDeck
      };
    } catch {
      return this.createInitialState();
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignora errori di quota o storage disabilitato
    }
  }

  getColorById(colorId: string): ArmyColor {
    return this.state.armyColors.find((c) => c.id === colorId) ?? this.state.armyColors[0];
  }

  getLocalizedArmyColor(colorId: string): ArmyColor {
    const color = this.getColorById(colorId);
    const key = resolveColorKey(color);
    const localized = getLocalizedColor(key, this.state.lang);
    return {
      ...color,
      key,
      name: localized.name,
      adjective: localized.adjective
    };
  }

  setLanguage(lang: Language): void {
    if (this.state.lang === lang) return;
    this.state.lang = lang;
    const strings = getStrings(lang);

    this.state.setupPlayers.forEach((p, idx) => {
      if (isDefaultPlayerName(p.name, idx)) {
        p.name = strings.playerDefaultName(idx + 1);
      }
    });

    if (this.state.activeMatch) {
      this.state.activeMatch.players.forEach((p, idx) => {
        if (isDefaultPlayerName(p.name, idx)) {
          p.name = strings.playerDefaultName(idx + 1);
        }
      });
    }

    this.notify();
  }

  setPlayerCount(count: number): void {
    const clamped = Math.max(2, Math.min(6, count));
    const strings = getStrings(this.state.lang);
    this.state.playerCount = clamped;

    while (this.state.setupPlayers.length < clamped) {
      const usedIds = new Set(this.state.setupPlayers.map((p) => p.colorId));
      const freeColor =
        this.state.armyColors.find((c) => !usedIds.has(c.id)) ?? this.state.armyColors[0];
      const idx = this.state.setupPlayers.length;
      this.state.setupPlayers.push({
        name: strings.playerDefaultName(idx + 1),
        colorId: freeColor.id
      });
    }
    if (this.state.setupPlayers.length > clamped) {
      this.state.setupPlayers = this.state.setupPlayers.slice(0, clamped);
    }

    this.notify();
  }

  updateSetupPlayerName(index: number, name: string): void {
    if (!this.state.setupPlayers[index]) return;
    this.state.setupPlayers[index].name = name;
    this.saveState();
  }

  updateSetupPlayerColor(index: number, newColorId: string): void {
    const player = this.state.setupPlayers[index];
    if (!player) return;

    const oldColorId = player.colorId;
    const conflictIdx = this.state.setupPlayers.findIndex(
      (p, i) => i !== index && p.colorId === newColorId
    );
    if (conflictIdx !== -1) {
      this.state.setupPlayers[conflictIdx].colorId = oldColorId;
    }
    player.colorId = newColorId;
    this.notify();
  }

  setDeckMode(mode: DeckMode): void {
    this.state.deckMode = mode;
    this.notify();
  }

  setArmyColors(colors: ArmyColor[]): void {
    this.state.armyColors = colors;
    const validIds = new Set(colors.map((c) => c.id));
    this.state.setupPlayers.forEach((p, idx) => {
      if (!validIds.has(p.colorId)) {
        p.colorId = colors[idx % colors.length].id;
      }
    });
    this.resetQuickDeckInternal();
    this.notify();
  }

  resetArmyColorsToClassic(): void {
    this.setArmyColors(DEFAULT_ARMY_COLORS.map((c) => ({ ...c })));
  }

  startNewMatch(): void {
    this.state.activeMatch = dealMatchObjectives({
      setupPlayers: this.state.setupPlayers,
      playerCount: this.state.playerCount,
      armyColors: this.state.armyColors,
      deckMode: this.state.deckMode,
      lang: this.state.lang
    });
    this.notify();
  }

  closeActiveMatch(): void {
    this.state.activeMatch = null;
    this.notify();
  }

  markPlayerObjectiveSeen(playerIdx: number): void {
    const player = this.state.activeMatch?.players[playerIdx];
    if (!player) return;
    player.seen = true;
    this.notify();
  }

  togglePlayerEliminated(playerIdx: number): void {
    const player = this.state.activeMatch?.players[playerIdx];
    if (!player) return;
    player.eliminated = !player.eliminated;
    this.notify();
  }

  setRevealAll(reveal: boolean): void {
    if (!this.state.activeMatch) return;
    this.state.activeMatch.revealAll = reveal;
    this.notify();
  }

  private resetQuickDeckInternal(): void {
    this.state.quickDeck = {
      cards: shuffleArray(buildClassicDeck(this.state.armyColors, this.state.lang)),
      drawnCount: 0,
      currentCard: null
    };
  }

  drawQuickCard(): void {
    const qd = this.state.quickDeck;
    if (qd.cards.length === 0) return;
    const nextCard = qd.cards.pop() ?? null;
    qd.currentCard = nextCard;
    qd.drawnCount += 1;
    this.notify();
  }

  hideCurrentQuickCard(): void {
    this.state.quickDeck.currentCard = null;
    this.notify();
  }

  shuffleQuickDeck(): void {
    this.resetQuickDeckInternal();
    this.notify();
  }
}
