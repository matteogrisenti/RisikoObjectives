import './styles/main.css';
import { getStrings } from './i18n/translations.ts';
import { AppStore } from './state/store.ts';
import { CatalogView } from './ui/catalogView.ts';
import { LanguageSwipeSwitch } from './ui/languageSwitch.ts';
import { MatchView } from './ui/matchView.ts';
import { ModalController } from './ui/modals.ts';
import { QuickDeckView } from './ui/quickDeckView.ts';
import { SetupView } from './ui/setupView.ts';

function initTabs(): void {
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab-btn');
  const tabPanels = document.querySelectorAll<HTMLElement>('.tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
      tabPanels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === `tab-${target}`);
      });
    });
  });
}

function applyStaticTranslations(store: AppStore): void {
  const lang = store.getState().lang;
  const strings = getStrings(lang);

  document.documentElement.lang = lang;
  document.title = strings.docTitle;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as keyof typeof strings | undefined;
    if (!key) return;
    const value = strings[key];
    if (typeof value === 'string') {
      el.textContent = value;
    }
  });
}

function bootstrap(): void {
  const store = new AppStore();
  const modals = new ModalController(store);

  const languageSwitch = new LanguageSwipeSwitch(store);
  const setupView = new SetupView(store, modals);
  const matchView = new MatchView(store, modals);
  const quickDeckView = new QuickDeckView(store);
  const catalogView = new CatalogView(store);

  const renderAll = (): void => {
    applyStaticTranslations(store);
    languageSwitch.render();
    setupView.render();
    matchView.render();
    quickDeckView.render();
    catalogView.render();
  };

  initTabs();
  store.subscribe(renderAll);
  renderAll();
}

bootstrap();
