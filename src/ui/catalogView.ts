import { buildClassicDeck } from '../domain/objectives.ts';
import type { AppStore } from '../state/store.ts';
import { renderObjectiveCardHtml } from './cardRenderer.ts';
import { getRequiredElement } from './icons.ts';

export class CatalogView {
  private catalogGridEl = getRequiredElement<HTMLDivElement>('catalog-grid');
  private store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
  }

  render(): void {
    const state = this.store.getState();
    const deck = buildClassicDeck(state.armyColors, state.lang);
    this.catalogGridEl.innerHTML = deck
      .map((card) => renderObjectiveCardHtml(card, null, state.lang, state.armyColors))
      .join('');
  }
}
