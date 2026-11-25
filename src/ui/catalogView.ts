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
    const deck = buildClassicDeck(this.store.getState().armyColors);
    this.catalogGridEl.innerHTML = deck.map((card) => renderObjectiveCardHtml(card)).join('');
  }
}
