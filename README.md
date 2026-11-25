# RisikoObjective — Gestore Obiettivi Classici

Web app modulare in TypeScript + Vite per gestire l'estrazione del mazzo classico da **14 obiettivi segreti** al tavolo.

> Progetto amatoriale indipendente, non affiliato né associato a marchi registrati di giochi da tavolo.

## Struttura del Progetto

```text
├── index.html                  # Entry HTML Vite
├── package.json                # Dipendenze e script npm
├── tsconfig.json               # Configurazione TypeScript strict
├── vite.config.ts              # Configurazione bundler/dev server Vite
├── src/
│   ├── main.ts                 # Bootstrap applicativo
│   ├── domain/                 # Logica pura di dominio (senza dipendenze DOM)
│   │   ├── types.ts            # Modelli e interfacce TypeScript
│   │   ├── objectives.ts       # Mazzo tradizionale da 14 carte + colori scatola
│   │   └── rules.ts            # Regola di riserva (24 territori) e distribuzione
│   ├── state/
│   │   └── store.ts            # Store centralizzato con persistenza localStorage
│   ├── styles/
│   │   └── main.css            # Design system e carte stile pergamena
│   └── ui/                     # Componenti UI modulari
│       ├── cardRenderer.ts
│       ├── catalogView.ts
│       ├── icons.ts
│       ├── matchView.ts
│       ├── modals.ts
│       ├── quickDeckView.ts
│       └── setupView.ts
└── tests/                      # Unit test Vitest su dominio e regole
    ├── objectives.test.ts
    └── rules.test.ts
```

## Comandi npm

```bash
# Installa le dipendenze
npm install

# Avvia la demo in locale (Vite dev server)
npm run dev

# Esegue i test unitari
npm test

# Controllo tipi + build di produzione in dist/
npm run build

# Anteprima locale della build di produzione
npm run preview
```

> Nota Windows PowerShell: se `npm` è bloccato dalle policy di esecuzione sugli script `.ps1`, usa `npm.cmd` (es. `npm.cmd run dev`).
