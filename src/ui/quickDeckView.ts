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
    const qd = this.store.getState().quickDeck;
    const remaining = qd.cards.length;
    this.quickRemainingEl.textContent = String(remaining);

    this.quickDrawnInfoEl.textContent =
      qd.drawnCount === 0
        ? 'Nessuna carta pescata.'
        : `Pescate finora: ${qd.drawnCount} su 14`;

    if (qd.currentCard) {
      this.quickCardBackEl.classList.add('hidden');
      this.quickCardRevealedEl.classList.remove('hidden');
      this.quickCardSlotEl.innerHTML = renderObjectiveCardHtml(qd.currentCard);
    } else {
      this.quickCardBackEl.classList.remove('hidden');
      this.quickCardRevealedEl.classList.add('hidden');
      this.quickCardSlotEl.innerHTML = '';

      if (remaining === 0) {
        this.quickBackHintEl.textContent =
          'Tutte le 14 carte sono state pescate. Rimescola per ricominciare.';
        this.btnQuickDraw.disabled = true;
      } else {
        this.quickBackHintEl.textContent =
          'Tocca il pulsante per pescare la prossima carta segreta.';
        this.btnQuickDraw.disabled = false;
      }
    }
  }
}
