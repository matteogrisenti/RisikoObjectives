import type {
  ArmyColor,
  ColorPreset,
  ContinentId,
  ContinentMeta,
  ContinentObjective,
  DestroyObjective,
  ObjectiveCard,
  TerritoryObjective
} from './types.ts';

export const DEFAULT_ARMY_COLORS: readonly ArmyColor[] = [
  { id: 'red', name: 'Rosso', adjective: 'Rosse', hex: '#C82027' },
  { id: 'blue', name: 'Blu', adjective: 'Blu', hex: '#23599C' },
  { id: 'yellow', name: 'Giallo', adjective: 'Gialle', hex: '#E0AE1B' },
  { id: 'black', name: 'Nero', adjective: 'Nere', hex: '#222426' },
  { id: 'green', name: 'Verde', adjective: 'Verdi', hex: '#388E4A' },
  { id: 'purple', name: 'Viola', adjective: 'Viola', hex: '#7A54A8' }
];

export const COLOR_PRESET_PALETTE: readonly ColorPreset[] = [
  { name: 'Rosso', adjective: 'Rosse', hex: '#C82027' },
  { name: 'Blu', adjective: 'Blu', hex: '#23599C' },
  { name: 'Giallo', adjective: 'Gialle', hex: '#E0AE1B' },
  { name: 'Nero', adjective: 'Nere', hex: '#222426' },
  { name: 'Verde', adjective: 'Verdi', hex: '#388E4A' },
  { name: 'Viola', adjective: 'Viola', hex: '#7A54A8' },
  { name: 'Arancione', adjective: 'Arancioni', hex: '#D96B27' },
  { name: 'Bianco', adjective: 'Bianche', hex: '#EFECE6' },
  { name: 'Celeste', adjective: 'Celesti', hex: '#3A8CA3' },
  { name: 'Rosa', adjective: 'Rosa', hex: '#C95A8B' },
  { name: 'Marrone', adjective: 'Marroni', hex: '#7F5237' },
  { name: 'Grigio', adjective: 'Grigie', hex: '#747B82' }
];

// Colori dei continenti ispirati alla plancia classica Editrice Giochi
export const CONTINENT_META: Record<ContinentId, ContinentMeta> = {
  na: { name: 'Nord America', bonus: '+5', color: '#E2A265' },
  sa: { name: 'Sud America', bonus: '+2', color: '#7BB8CF' },
  eu: { name: 'Europa', bonus: '+5', color: '#7E6FB0' },
  af: { name: 'Africa', bonus: '+3', color: '#C29160' },
  as: { name: 'Asia', bonus: '+7', color: '#7FA845' },
  oc: { name: 'Oceania', bonus: '+2', color: '#C47F9D' }
};

export const BASE_OBJECTIVES: readonly (TerritoryObjective | ContinentObjective)[] = [
  {
    id: 'terr-24',
    type: 'territories',
    categoryLabel: 'Territori',
    title: '24 Territori',
    text: 'Devi conquistare 24 territori.',
    note: 'Puoi scegliere liberamente qualsiasi territorio sulla plancia.',
    count: 24,
    minArmies: 1
  },
  {
    id: 'terr-18-2',
    type: 'territories',
    categoryLabel: 'Territori e presidio',
    title: '18 Territori (x2 Armate)',
    text: 'Devi conquistare 18 territori presidiandoli con almeno due armate ciascuno.',
    note: 'Ogni territorio dei 18 richiesti deve avere almeno 2 carri armati al momento della vittoria.',
    count: 18,
    minArmies: 2
  },
  {
    id: 'cont-na-af',
    type: 'continents',
    categoryLabel: 'Continenti',
    title: 'Nord America e Africa',
    text: "Devi conquistare la totalità del Nord America e dell'Africa.",
    continents: ['na', 'af'],
    extraContinent: false
  },
  {
    id: 'cont-na-oc',
    type: 'continents',
    categoryLabel: 'Continenti',
    title: 'Nord America e Oceania',
    text: "Devi conquistare la totalità del Nord America e dell'Oceania.",
    continents: ['na', 'oc'],
    extraContinent: false
  },
  {
    id: 'cont-as-sa',
    type: 'continents',
    categoryLabel: 'Continenti',
    title: 'Asia e Sud America',
    text: "Devi conquistare la totalità dell'Asia e del Sud America.",
    continents: ['as', 'sa'],
    extraContinent: false
  },
  {
    id: 'cont-as-af',
    type: 'continents',
    categoryLabel: 'Continenti',
    title: 'Asia e Africa',
    text: "Devi conquistare la totalità dell'Asia e dell'Africa.",
    continents: ['as', 'af'],
    extraContinent: false
  },
  {
    id: 'cont-eu-sa-any',
    type: 'continents',
    categoryLabel: 'Continenti',
    title: 'Europa, Sud America e 1 continente a scelta',
    text: "Devi conquistare la totalità dell'Europa, del Sud America e di un terzo continente a scelta.",
    continents: ['eu', 'sa'],
    extraContinent: true
  },
  {
    id: 'cont-eu-oc-any',
    type: 'continents',
    categoryLabel: 'Continenti',
    title: 'Europa, Oceania e 1 continente a scelta',
    text: "Devi conquistare la totalità dell'Europa, dell'Oceania e di un terzo continente a scelta.",
    continents: ['eu', 'oc'],
    extraContinent: true
  }
];

/**
 * Costruisce il mazzo completo di 14 carte classiche combinando gli 8 obiettivi
 * territoriali/continentali con i 6 obiettivi di distruzione armate.
 */
export function buildClassicDeck(
  armyColors: readonly ArmyColor[] = DEFAULT_ARMY_COLORS
): ObjectiveCard[] {
  const colors = armyColors.length === 6 ? armyColors : DEFAULT_ARMY_COLORS;

  const destroyCards: DestroyObjective[] = colors.map((c) => ({
    id: `destroy-${c.id}`,
    type: 'destroy',
    categoryLabel: 'Distruzione armate',
    title: `Distruggi armate ${c.adjective}`,
    text: `Devi distruggere completamente le armate ${c.adjective}.`,
    note: 'Se sono le tue armate, non sono in gioco o vengono eliminate da un avversario, conquista 24 territori.',
    targetColorId: c.id,
    targetColorName: c.name,
    targetColorAdjective: c.adjective,
    targetColorHex: c.hex
  }));

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
