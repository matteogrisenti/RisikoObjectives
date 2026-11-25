export type Language = 'en' | 'it';

export type ContinentId = 'na' | 'sa' | 'eu' | 'af' | 'as' | 'oc';

export type DeckMode = 'classic' | 'active-only';

export type ColorKey =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'black'
  | 'green'
  | 'purple'
  | 'orange'
  | 'white'
  | 'cyan'
  | 'pink'
  | 'brown'
  | 'gray';

export interface ArmyColor {
  id: string;
  key: ColorKey;
  name: string;
  adjective: string;
  hex: string;
}

export interface ColorPreset {
  key: ColorKey;
  name: string;
  adjective: string;
  hex: string;
}

export interface ContinentMeta {
  name: string;
  bonus: string;
  color: string;
}

export interface TerritoryObjective {
  id: string;
  type: 'territories';
  categoryLabel: string;
  title: string;
  text: string;
  note: string;
  count: number;
  minArmies: number;
}

export interface ContinentObjective {
  id: string;
  type: 'continents';
  categoryLabel: string;
  title: string;
  text: string;
  note?: string;
  continents: ContinentId[];
  extraContinent: boolean;
}

export interface DestroyObjective {
  id: string;
  type: 'destroy';
  categoryLabel: string;
  title: string;
  text: string;
  note: string;
  targetColorId: string;
  targetColorKey?: ColorKey;
  targetColorName: string;
  targetColorAdjective: string;
  targetColorHex: string;
}

export type ObjectiveCard = TerritoryObjective | ContinentObjective | DestroyObjective;

export interface SetupPlayer {
  name: string;
  colorId: string;
}

export interface MatchPlayer {
  name: string;
  colorId: string;
  seen: boolean;
  eliminated: boolean;
  objective: ObjectiveCard;
}

export interface ActiveMatch {
  deckMode: DeckMode;
  players: MatchPlayer[];
  revealAll: boolean;
  createdAt: number;
}

export interface QuickDeckState {
  cards: ObjectiveCard[];
  drawnCount: number;
  currentCard: ObjectiveCard | null;
}

export interface AppState {
  lang: Language;
  armyColors: ArmyColor[];
  playerCount: number;
  deckMode: DeckMode;
  setupPlayers: SetupPlayer[];
  activeMatch: ActiveMatch | null;
  quickDeck: QuickDeckState;
}

export interface FallbackResolution {
  isFallback: boolean;
  reason: string | null;
}
