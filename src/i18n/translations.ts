import type { ColorKey, ContinentId, Language } from '../domain/types.ts';

export interface LocalizedColorLabel {
  name: string;
  adjective: string;
}

export const COLOR_LABELS: Record<Language, Record<ColorKey, LocalizedColorLabel>> = {
  en: {
    red: { name: 'Red', adjective: 'Red' },
    blue: { name: 'Blue', adjective: 'Blue' },
    yellow: { name: 'Yellow', adjective: 'Yellow' },
    black: { name: 'Black', adjective: 'Black' },
    green: { name: 'Green', adjective: 'Green' },
    purple: { name: 'Purple', adjective: 'Purple' },
    orange: { name: 'Orange', adjective: 'Orange' },
    white: { name: 'White', adjective: 'White' },
    cyan: { name: 'Cyan', adjective: 'Cyan' },
    pink: { name: 'Pink', adjective: 'Pink' },
    brown: { name: 'Brown', adjective: 'Brown' },
    gray: { name: 'Gray', adjective: 'Gray' }
  },
  it: {
    red: { name: 'Rosso', adjective: 'Rosse' },
    blue: { name: 'Blu', adjective: 'Blu' },
    yellow: { name: 'Giallo', adjective: 'Gialle' },
    black: { name: 'Nero', adjective: 'Nere' },
    green: { name: 'Verde', adjective: 'Verdi' },
    purple: { name: 'Viola', adjective: 'Viola' },
    orange: { name: 'Arancione', adjective: 'Arancioni' },
    white: { name: 'Bianco', adjective: 'Bianche' },
    cyan: { name: 'Celeste', adjective: 'Celesti' },
    pink: { name: 'Rosa', adjective: 'Rosa' },
    brown: { name: 'Marrone', adjective: 'Marroni' },
    gray: { name: 'Grigio', adjective: 'Grigie' }
  }
};

export const CONTINENT_NAMES: Record<Language, Record<ContinentId, string>> = {
  en: {
    na: 'North America',
    sa: 'South America',
    eu: 'Europe',
    af: 'Africa',
    as: 'Asia',
    oc: 'Oceania'
  },
  it: {
    na: 'Nord America',
    sa: 'Sud America',
    eu: 'Europa',
    af: 'Africa',
    as: 'Asia',
    oc: 'Oceania'
  }
};

export interface LocalizedObjectiveText {
  categoryLabel: string;
  text: string;
  note?: string;
}

export const OBJECTIVE_TEXTS: Record<Language, Record<string, LocalizedObjectiveText>> = {
  en: {
    'terr-24': {
      categoryLabel: 'Territories',
      text: 'Conquer 24 territories.',
      note: 'You may choose any 24 territories across the board.'
    },
    'terr-18-2': {
      categoryLabel: 'Territories & garrison',
      text: 'Conquer 18 territories and occupy each with at least two armies.',
      note: 'Every one of the 18 territories must hold at least 2 armies when declaring victory.'
    },
    'cont-na-af': {
      categoryLabel: 'Continents',
      text: 'Conquer all of North America and Africa.'
    },
    'cont-na-oc': {
      categoryLabel: 'Continents',
      text: 'Conquer all of North America and Oceania.'
    },
    'cont-as-sa': {
      categoryLabel: 'Continents',
      text: 'Conquer all of Asia and South America.'
    },
    'cont-as-af': {
      categoryLabel: 'Continents',
      text: 'Conquer all of Asia and Africa.'
    },
    'cont-eu-sa-any': {
      categoryLabel: 'Continents',
      text: 'Conquer all of Europe, South America, and a third continent of your choice.'
    },
    'cont-eu-oc-any': {
      categoryLabel: 'Continents',
      text: 'Conquer all of Europe, Oceania, and a third continent of your choice.'
    }
  },
  it: {
    'terr-24': {
      categoryLabel: 'Territori',
      text: 'Devi conquistare 24 territori.',
      note: 'Puoi scegliere liberamente qualsiasi territorio sulla plancia.'
    },
    'terr-18-2': {
      categoryLabel: 'Territori e presidio',
      text: 'Devi conquistare 18 territori presidiandoli con almeno due armate ciascuno.',
      note: 'Ogni territorio dei 18 richiesti deve avere almeno 2 carri armati al momento della vittoria.'
    },
    'cont-na-af': {
      categoryLabel: 'Continenti',
      text: "Devi conquistare la totalità del Nord America e dell'Africa."
    },
    'cont-na-oc': {
      categoryLabel: 'Continenti',
      text: "Devi conquistare la totalità del Nord America e dell'Oceania."
    },
    'cont-as-sa': {
      categoryLabel: 'Continenti',
      text: "Devi conquistare la totalità dell'Asia e del Sud America."
    },
    'cont-as-af': {
      categoryLabel: 'Continenti',
      text: "Devi conquistare la totalità dell'Asia e dell'Africa."
    },
    'cont-eu-sa-any': {
      categoryLabel: 'Continenti',
      text: "Devi conquistare la totalità dell'Europa, del Sud America e di un terzo continente a scelta."
    },
    'cont-eu-oc-any': {
      categoryLabel: 'Continenti',
      text: "Devi conquistare la totalità dell'Europa, dell'Oceania e di un terzo continente a scelta."
    }
  }
};

export const UI_STRINGS = {
  en: {
    docTitle: 'RisikoObjective — Classic Objectives Manager',
    brandTitle: 'Classic objectives',
    brandSubtitle: 'Traditional 14-card deck',
    tabMatch: 'Table match',
    tabQuick: 'Quick deck',
    tabCatalog: '14 cards',
    setupTitle: 'Match setup',
    setupSubtitle: 'Choose players and army colors, then deal the secret objectives.',
    btnCustomizeColors: 'Customize colors',
    labelPlayerCount: 'Number of players',
    labelPlayersAndColors: 'Players and army colors',
    labelDeckRule: 'Missing color rule',
    ruleClassicTitle: 'Classic rule (14 cards)',
    ruleClassicDesc:
      'All 14 cards stay in the deck. Drawing your own or an absent color becomes 24 territories.',
    ruleActiveOnlyTitle: 'Active colors only',
    ruleActiveOnlyDesc:
      'Excludes destroy cards for absent colors. Drawing your own color becomes 24 territories.',
    btnStartMatch: 'Shuffle and deal',
    playerDefaultName: (n: number) => `Player ${n}`,
    playerNameAria: (n: number) => `Player ${n} name`,
    playerColorAria: (n: number) => `Player ${n} army color`,
    progressSeen: (seen: number, total: number) =>
      `${seen} of ${total} players viewed their objective`,
    btnRevealAll: 'Reveal all',
    btnRematch: 'New draw',
    btnResetSetup: 'Change players',
    matchHelperBanner:
      'Pass the device around: each player taps their name to privately view their objective.',
    revealAllTitle: 'Revealed objectives',
    revealAllSubtitle: 'End-of-game summary to verify the winner.',
    btnHideSummary: 'Hide summary',
    playerArmies: (adj: string) => `${adj} armies`,
    statusToDraw: 'To draw',
    statusAssigned: 'Assigned',
    statusEliminated: 'Eliminated',
    btnDrawObjective: 'Draw objective',
    btnViewObjective: 'View objective',
    btnEliminated: 'Eliminated',
    btnRestore: 'Restore',
    btnEliminatedTitle: 'Mark if this color was eliminated during the game',
    confirmRevealAllTitle: 'Reveal all objectives?',
    confirmRevealAllMsg:
      'All player objectives will be shown on screen. Use this only at the end of the game.',
    confirmRematchTitle: 'New draw?',
    confirmRematchMsg: 'A fresh deck will be shuffled while keeping the same players and colors.',
    confirmResetTitle: 'Back to setup?',
    confirmResetMsg:
      'The current match will be closed so you can change players or rules.',
    quickTitle: 'Quick deck',
    quickSubtitle: 'Draw one card at a time from the shuffled deck and pass the device.',
    btnReshuffle: 'Reshuffle deck',
    cardsRemaining: 'cards left',
    quickNoneDrawn: 'No cards drawn yet.',
    quickDrawnCount: (n: number) => `Drawn so far: ${n} of 14`,
    quickCardBackSub: 'Objectives',
    quickHintReady: 'Tap the button to draw the next secret card.',
    quickHintEmpty: 'All 14 cards have been drawn. Reshuffle to start over.',
    btnQuickDraw: 'Draw objective',
    btnQuickHide: 'Hide and pass',
    catalogTitle: 'The 14 classic cards',
    catalogSubtitle: 'Complete list of the 14 traditional secret objectives for strategy games.',
    fallbackBoxTitle: 'Fallback rule',
    fallbackBoxDesc:
      'If you draw the objective to destroy your own armies, a color not in the match, or an army eliminated by another player, your objective automatically becomes conquering 24 territories.',
    shieldBadge: 'Private',
    shieldKicker: 'Pass the screen to',
    shieldWarning: 'Make sure nobody else is looking before opening the card.',
    btnShowObjective: 'Show my objective',
    btnCancel: 'Cancel',
    modalObjectiveOf: 'Objective of',
    btnHideAndClose: 'Hide and close',
    colorsModalTitle: 'Army colors',
    colorsModalSubtitle:
      'Classic colors are Red, Blue, Yellow, Black, Green, and Purple. If your edition uses different colors, customize them here.',
    colorSlotLabel: (n: number) => `Color ${n}`,
    btnResetColors: 'Reset classic',
    btnSaveColors: 'Save colors',
    duplicateColorsAlert: 'Select 6 different colors to avoid duplicate cards in the deck.',
    confirmTitleDefault: 'Confirm',
    btnConfirmOk: 'Confirm',
    cardTerritoriesAny: 'Territories anywhere<br>on the board',
    cardTerritoriesTwoArmies: (min: number) => `Territories with at least<br>${min} armies each`,
    cardThirdContinent: '+ 3rd continent of choice',
    cardDestroyCategory: 'Eliminate armies',
    cardDestroyLabel: (adj: string) => `${adj} armies`,
    cardDestroyText: (adj: string) => `Destroy all ${adj} armies.`,
    cardDestroyNote:
      'If these are your own armies, are not in the match, or are eliminated by an opponent, conquer 24 territories instead.',
    cardFallbackHeading: 'Fallback objective: 24 territories',
    fallbackOwnColor:
      'This is your own color: under classic rules your objective becomes conquering 24 territories.',
    fallbackAbsentColor: (adj: string) =>
      `${adj} armies are not in this match: your objective becomes conquering 24 territories.`,
    fallbackEliminatedColor: (adj: string, name: string) =>
      `${adj} armies (${name}) are already eliminated: unless you dealt the final blow, your objective becomes conquering 24 territories.`,
    footerDisclaimer:
      'RisikoObjective is an independent hobby project for drawing classic tabletop objectives. No cookies, no analytics, no external tracking. Not affiliated with any registered trademark.'
  },
  it: {
    docTitle: 'RisikoObjective — Gestore Obiettivi Classici',
    brandTitle: 'Obiettivi classici',
    brandSubtitle: 'Mazzo tradizionale da 14 carte',
    tabMatch: 'Partita al tavolo',
    tabQuick: 'Mazzo rapido',
    tabCatalog: 'Le 14 carte',
    setupTitle: 'Configura la partita',
    setupSubtitle: 'Scegli i giocatori e i colori delle armate, poi distribuisci gli obiettivi segreti.',
    btnCustomizeColors: 'Personalizza colori',
    labelPlayerCount: 'Numero di giocatori',
    labelPlayersAndColors: 'Giocatori e colori delle armate',
    labelDeckRule: 'Gestione dei colori assenti',
    ruleClassicTitle: 'Regola classica (14 carte)',
    ruleClassicDesc:
      "Tutte le 14 carte restano nel mazzo. Se peschi il tuo colore o un colore assente, l'obiettivo diventa 24 territori.",
    ruleActiveOnlyTitle: 'Solo colori in partita',
    ruleActiveOnlyDesc:
      'Esclude dal mazzo le carte di distruzione dei colori assenti. Se peschi il tuo colore, diventa 24 territori.',
    btnStartMatch: 'Mescola e distribuisci',
    playerDefaultName: (n: number) => `Giocatore ${n}`,
    playerNameAria: (n: number) => `Nome giocatore ${n}`,
    playerColorAria: (n: number) => `Colore armata giocatore ${n}`,
    progressSeen: (seen: number, total: number) =>
      `${seen} di ${total} giocatori hanno visto l'obiettivo`,
    btnRevealAll: 'Rivela tutti',
    btnRematch: 'Nuova estrazione',
    btnResetSetup: 'Cambia giocatori',
    matchHelperBanner:
      'Passa il dispositivo a turno: ogni giocatore tocca il proprio nome per vedere in segreto il proprio obiettivo.',
    revealAllTitle: 'Obiettivi rivelati',
    revealAllSubtitle: 'Riepilogo di fine partita per controllare il vincitore.',
    btnHideSummary: 'Nascondi riepilogo',
    playerArmies: (adj: string) => `Armate ${adj}`,
    statusToDraw: 'Da pescare',
    statusAssigned: 'Assegnato',
    statusEliminated: 'Eliminato',
    btnDrawObjective: 'Pesca obiettivo',
    btnViewObjective: 'Rivedi obiettivo',
    btnEliminated: 'Eliminato',
    btnRestore: 'Ripristina',
    btnEliminatedTitle: 'Segna se questo colore è stato eliminato durante la partita',
    confirmRevealAllTitle: 'Rivelare tutti gli obiettivi?',
    confirmRevealAllMsg:
      'Tutti gli obiettivi dei giocatori verranno mostrati sullo schermo. Usalo solo a fine partita.',
    confirmRematchTitle: 'Nuova estrazione?',
    confirmRematchMsg: 'Verrà mescolato un nuovo mazzo mantenendo gli stessi giocatori e colori.',
    confirmResetTitle: 'Tornare alla configurazione?',
    confirmResetMsg:
      'La partita attuale verrà chiusa per permetterti di cambiare giocatori o regole.',
    quickTitle: 'Mazzo rapido',
    quickSubtitle: 'Pesca una carta alla volta dal mazzo mescolato e passa il dispositivo.',
    btnReshuffle: 'Rimescola mazzo',
    cardsRemaining: 'carte rimaste',
    quickNoneDrawn: 'Nessuna carta pescata.',
    quickDrawnCount: (n: number) => `Pescate finora: ${n} su 14`,
    quickCardBackSub: 'Obiettivi',
    quickHintReady: 'Tocca il pulsante per pescare la prossima carta segreta.',
    quickHintEmpty: 'Tutte le 14 carte sono state pescate. Rimescola per ricominciare.',
    btnQuickDraw: 'Pesca obiettivo',
    btnQuickHide: 'Nascondi e passa',
    catalogTitle: 'Le 14 carte classiche',
    catalogSubtitle: 'Elenco completo dei 14 obiettivi segreti tradizionali per partite di strategia.',
    fallbackBoxTitle: 'Regola di riserva',
    fallbackBoxDesc:
      "Se peschi l'obiettivo di distruggere le tue stesse armate, un colore non presente in partita, oppure un'armata eliminata da un altro giocatore, il tuo obiettivo diventa automaticamente conquistare 24 territori.",
    shieldBadge: 'Riservato',
    shieldKicker: 'Passa lo schermo a',
    shieldWarning: 'Assicurati che nessun altro stia guardando prima di aprire la carta.',
    btnShowObjective: 'Mostra il mio obiettivo',
    btnCancel: 'Annulla',
    modalObjectiveOf: 'Obiettivo di',
    btnHideAndClose: 'Nascondi e chiudi',
    colorsModalTitle: 'Colori delle armate',
    colorsModalSubtitle:
      'I colori classici sono Rosso, Blu, Giallo, Nero, Verde e Viola. Se la tua edizione usa colori diversi, puoi cambiarli qui.',
    colorSlotLabel: (n: number) => `Colore ${n}`,
    btnResetColors: 'Ripristina classici',
    btnSaveColors: 'Salva colori',
    duplicateColorsAlert: 'Seleziona 6 colori diversi per evitare carte duplicate nel mazzo.',
    confirmTitleDefault: 'Conferma',
    btnConfirmOk: 'Conferma',
    cardTerritoriesAny: 'Territori a scelta<br>sul planisfero',
    cardTerritoriesTwoArmies: (min: number) => `Territori con almeno<br>${min} armate ciascuno`,
    cardThirdContinent: '+ 3° Continente a scelta',
    cardDestroyCategory: 'Distruzione armate',
    cardDestroyLabel: (adj: string) => `Armate ${adj}`,
    cardDestroyText: (adj: string) => `Devi distruggere completamente le armate ${adj}.`,
    cardDestroyNote:
      'Se sono le tue armate, non sono in gioco o vengono eliminate da un avversario, conquista 24 territori.',
    cardFallbackHeading: 'Obiettivo sostitutivo: 24 territori',
    fallbackOwnColor:
      'Questo è il tuo stesso colore: per regolamento classico il tuo obiettivo diventa conquistare 24 territori.',
    fallbackAbsentColor: (adj: string) =>
      `Le armate ${adj.toLowerCase()} non sono in gioco in questa partita: il tuo obiettivo diventa conquistare 24 territori.`,
    fallbackEliminatedColor: (adj: string, name: string) =>
      `Le armate ${adj.toLowerCase()} (${name}) risultano già eliminate: se non sei stato tu a darle il colpo di grazia, il tuo obiettivo diventa conquistare 24 territori.`,
    footerDisclaimer:
      "RisikoObjective è un progetto amatoriale indipendente per l'estrazione di obiettivi classici da tavolo. Nessun cookie, nessuna statistica, nessun tracciamento esterno. Non è affiliato ad alcun marchio registrato."
  }
} as const;

export function getStrings(lang: Language) {
  return UI_STRINGS[lang];
}

export function getLocalizedColor(colorKey: ColorKey, lang: Language): LocalizedColorLabel {
  return COLOR_LABELS[lang][colorKey];
}

export function getLocalizedContinentName(continentId: ContinentId, lang: Language): string {
  return CONTINENT_NAMES[lang][continentId];
}

export function isDefaultPlayerName(name: string, index: number): boolean {
  const trimmed = name.trim();
  const num = index + 1;
  return (
    trimmed === '' ||
    trimmed === `Player ${num}` ||
    trimmed === `Giocatore ${num}`
  );
}
