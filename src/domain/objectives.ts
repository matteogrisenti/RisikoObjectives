import { COLOR_LABELS, OBJECTIVE_TEXTS } from '../i18n/translations.ts';
import type {
  ArmyColor,
  ColorKey,
  ColorPreset,
  ContinentId,
  ContinentMeta,
  ContinentObjective,
  DestroyObjective,
  Language,
  ObjectiveCard,
  TerritoryObjective
} from './types.ts';

export const DEFAULT_ARMY_COLORS: readonly ArmyColor[] = [
  { id: 'red', key: 'red', name: 'Red', adjective: 'Red', hex: '#C82027' },
  { id: 'blue', key: 'blue', name: 'Blue', adjective: 'Blue', hex: '#23599C' },
  { id: 'yellow', key: 'yellow', name: 'Yellow', adjective: 'Yellow', hex: '#E0AE1B' },
  { id: 'black', key: 'black', name: 'Black', adjective: 'Black', hex: '#222426' },
  { id: 'green', key: 'green', name: 'Green', adjective: 'Green', hex: '#388E4A' },
  { id: 'purple', key: 'purple', name: 'Purple', adjective: 'Purple', hex: '#7A54A8' }
];

export const COLOR_PRESET_PALETTE: readonly ColorPreset[] = [
  { key: 'red', name: 'Red', adjective: 'Red', hex: '#C82027' },
  { key: 'blue', name: 'Blue', adjective: 'Blue', hex: '#23599C' },
  { key: 'yellow', name: 'Yellow', adjective: 'Yellow', hex: '#E0AE1B' },
  { key: 'black', name: 'Black', adjective: 'Black', hex: '#222426' },
  { key: 'green', name: 'Green', adjective: 'Green', hex: '#388E4A' },
  { key: 'purple', name: 'Purple', adjective: 'Purple', hex: '#7A54A8' },
  { key: 'orange', name: 'Orange', adjective: 'Orange', hex: '#D96B27' },
  { key: 'white', name: 'White', adjective: 'White', hex: '#EFECE6' },
  { key: 'cyan', name: 'Cyan', adjective: 'Cyan', hex: '#3A8CA3' },
  { key: 'pink', name: 'Pink', adjective: 'Pink', hex: '#C95A8B' },
  { key: 'brown', name: 'Brown', adjective: 'Brown', hex: '#7F5237' },
  { key: 'gray', name: 'Gray', adjective: 'Gray', hex: '#747B82' }
];

// Colori dei continenti ispirati alla plancia strategica classica
export const CONTINENT_META: Record<ContinentId, ContinentMeta> = {
  na: { name: 'North America', bonus: '+5', color: '#E2A265' },
  sa: { name: 'South America', bonus: '+2', color: '#7BB8CF' },
  eu: { name: 'Europe', bonus: '+5', color: '#7E6FB0' },
  af: { name: 'Africa', bonus: '+3', color: '#C29160' },
  as: { name: 'Asia', bonus: '+7', color: '#7FA845' },
  oc: { name: 'Oceania', bonus: '+2', color: '#C47F9D' }
};

export const BASE_OBJECTIVES: readonly (TerritoryObjective | ContinentObjective)[] = [
  {
    id: 'terr-24',
    type: 'territories',
    categoryLabel: OBJECTIVE_TEXTS.en['terr-24'].categoryLabel,
    title: '24 Territories',
    text: OBJECTIVE_TEXTS.en['terr-24'].text,
    note: OBJECTIVE_TEXTS.en['terr-24'].note ?? '',
    count: 24,
    minArmies: 1
  },
  {
    id: 'terr-18-2',
    type: 'territories',
    categoryLabel: OBJECTIVE_TEXTS.en['terr-18-2'].categoryLabel,
    title: '18 Territories (x2 Armies)',
    text: OBJECTIVE_TEXTS.en['terr-18-2'].text,
    note: OBJECTIVE_TEXTS.en['terr-18-2'].note ?? '',
    count: 18,
    minArmies: 2
  },
  {
    id: 'cont-na-af',
    type: 'continents',
    categoryLabel: OBJECTIVE_TEXTS.en['cont-na-af'].categoryLabel,
    title: 'North America & Africa',
    text: OBJECTIVE_TEXTS.en['cont-na-af'].text,
    continents: ['na', 'af'],
    extraContinent: false
  },
  {
    id: 'cont-na-oc',
    type: 'continents',
    categoryLabel: OBJECTIVE_TEXTS.en['cont-na-oc'].categoryLabel,
    title: 'North America & Oceania',
    text: OBJECTIVE_TEXTS.en['cont-na-oc'].text,
    continents: ['na', 'oc'],
    extraContinent: false
  },
  {
    id: 'cont-as-sa',
    type: 'continents',
    categoryLabel: OBJECTIVE_TEXTS.en['cont-as-sa'].categoryLabel,
    title: 'Asia & South America',
    text: OBJECTIVE_TEXTS.en['cont-as-sa'].text,
    continents: ['as', 'sa'],
    extraContinent: false
  },
  {
    id: 'cont-as-af',
    type: 'continents',
    categoryLabel: OBJECTIVE_TEXTS.en['cont-as-af'].categoryLabel,
    title: 'Asia & Africa',
    text: OBJECTIVE_TEXTS.en['cont-as-af'].text,
    continents: ['as', 'af'],
    extraContinent: false
  },
  {
    id: 'cont-eu-sa-any',
    type: 'continents',
    categoryLabel: OBJECTIVE_TEXTS.en['cont-eu-sa-any'].categoryLabel,
    title: 'Europe, South America & 1 choice',
    text: OBJECTIVE_TEXTS.en['cont-eu-sa-any'].text,
    continents: ['eu', 'sa'],
    extraContinent: true
  },
  {
    id: 'cont-eu-oc-any',
    type: 'continents',
    categoryLabel: OBJECTIVE_TEXTS.en['cont-eu-oc-any'].categoryLabel,
    title: 'Europe, Oceania & 1 choice',
    text: OBJECTIVE_TEXTS.en['cont-eu-oc-any'].text,
    continents: ['eu', 'oc'],
    extraContinent: true
  }
];

/**
 * Ricava la ColorKey anche da oggetti salvati in versioni precedenti (0.1.0).
 */
export function resolveColorKey(color: Pick<ArmyColor, 'id' | 'hex' | 'name'> & { key?: ColorKey }): ColorKey {
  if (color.key && color.key in COLOR_LABELS.en) {
    return color.key;
  }
  const byHex = COLOR_PRESET_PALETTE.find(
    (p) => p.hex.toLowerCase() === (color.hex || '').toLowerCase()
  );
  if (byHex) return byHex.key;

  const byId = COLOR_PRESET_PALETTE.find((p) => p.key === color.id);
  return byId ? byId.key : 'red';
}

/**
 * Costruisce il mazzo completo di 14 carte classiche combinando gli 8 obiettivi
 * territoriali/continentali con i 6 obiettivi di distruzione armate.
 */
export function buildClassicDeck(
  armyColors: readonly ArmyColor[] = DEFAULT_ARMY_COLORS,
  lang: Language = 'en'
): ObjectiveCard[] {
  const colors = armyColors.length === 6 ? armyColors : DEFAULT_ARMY_COLORS;

  const destroyCards: DestroyObjective[] = colors.map((c) => {
    const colorKey = resolveColorKey(c);
    const label = COLOR_LABELS[lang][colorKey];
    return {
      id: `destroy-${c.id}`,
      type: 'destroy',
      categoryLabel: lang === 'it' ? 'Distruzione armate' : 'Eliminate armies',
      title:
        lang === 'it'
          ? `Distruggi armate ${label.adjective}`
          : `Destroy ${label.adjective} armies`,
      text:
        lang === 'it'
          ? `Devi distruggere completamente le armate ${label.adjective}.`
          : `Destroy all ${label.adjective} armies.`,
      note:
        lang === 'it'
          ? 'Se sono le tue armate, non sono in gioco o vengono eliminate da un avversario, conquista 24 territori.'
          : 'If these are your own armies, are not in the match, or are eliminated by an opponent, conquer 24 territories instead.',
      targetColorId: c.id,
      targetColorKey: colorKey,
      targetColorName: label.name,
      targetColorAdjective: label.adjective,
      targetColorHex: c.hex
    };
  });

  return [...BASE_OBJECTIVES, ...destroyCards];
}

/**
 * Mescola un array usando l'algoritmo Fisher-Yates senza mutare l'input.
 */
export function shuffleArray<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
