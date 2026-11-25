import { getStrings } from '../i18n/translations.ts';
import type { AppStore } from '../state/store.ts';
import { renderObjectiveCardHtml } from './cardRenderer.ts';
import {
  getCannonLineArtSvg,
  getInfantryLineArtSvg,
  getRequiredElement
} from './icons.ts';

export class QuickDeckView {
  private quickRemainingEl = getRequiredElement<HTMLSpanElement>('quick-remaining');
  private quickDrawnInfoEl = getRequiredElement<HTMLDivElement>('quick-drawn-info');
  private quickCardBackEl = getRequiredElement<HTMLDivElement>('quick-card-back');
  private quickBackHintEl = getRequiredElement<HTMLParagraphElement>('quick-back-hint');
  private quickCardRevealedEl = getRequiredElement<HTMLDivElement>('quick-card-revealed');
  private quickCardSlotEl = getRequiredElement<HTMLDivElement>('quick-card-slot');
  private quickBackArtLeft = getRequiredElement<HTMLDivElement>('quick-back-art-left');
  private quickBackArtRight = getRequiredElement<HTMLDivElement>('quick-back-art-right');
  private btnQuickDraw = getRequiredElement<HTMLButtonElement>('btn-quick-draw');
  private btnQuickHide = getRequiredElement<HTMLButtonElement>('btn-quick-hide');
  private btnQuickShuffle = getRequiredElement<HTMLButtonElement>('btn-quick-shuffle');

  private store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
    this.quickBackArtLeft.innerHTML = getCannonLineArtSvg();
    this.quickBackArtRight.innerHTML = getInfantryLineArtSvg();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.btnQuickDraw.addEventListener('click', () => {
      this.store.drawQuickCard();
    });

    this.btnQuickHide.addEventListener('click', () => {
      this.store.hideCurrentQuickCard();
    });

    this.btnQuickShuffle.addEventListener('click', () => {
      this.store.shuffleQuickDeck();
    });
  }

  render(): void {
    const state = this.store.getState();
    const strings = getStrings(state.lang);
    const qd = state.quickDeck;
    const remaining = qd.cards.length;
    this.quickRemainingEl.textContent = String(remaining);

    this.quickDrawnInfoEl.textContent =
      qd.drawnCount === 0
        ? strings.quickNoneDrawn
        : strings.quickDrawnCount(qd.drawnCount);

    if (qd.currentCard) {
      this.quickCardBackEl.classList.add('hidden');
      this.quickCardRevealedEl.classList.remove('hidden');
      this.quickCardSlotEl.innerHTML = renderObjectiveCardHtml(
        qd.currentCard,
        null,
        state.lang,
        state.armyColors
      );
    } else {
      this.quickCardBackEl.classList.remove('hidden');
      this.quickCardRevealedEl.classList.add('hidden');
      this.quickCardSlotEl.innerHTML = '';

      if (remaining === 0) {
        this.quickBackHintEl.textContent = strings.quickHintEmpty;
        this.btnQuickDraw.disabled = true;
      } else {
        this.quickBackHintEl.textContent = strings.quickHintReady;
        this.btnQuickDraw.disabled = false;
      }
    }
  }
}
