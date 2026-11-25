import type { Language } from '../domain/types.ts';
import type { AppStore } from '../state/store.ts';
import { getRequiredElement } from './icons.ts';

/**
 * Controllo di cambio lingua EN / IT posto in alto:
 * supporta sia lo swipe orizzontale (drag touch/mouse) sia il click diretto o tastiera.
 */
export class LanguageSwipeSwitch {
  private switchEl = getRequiredElement<HTMLButtonElement>('lang-swipe-switch');
  private thumbEl = getRequiredElement<HTMLSpanElement>('lang-swipe-thumb');
  private store: AppStore;

  private isDragging = false;
  private startX = 0;
  private currentOffset = 0;
  private maxTravel = 0;
  private hasMoved = false;

  constructor(store: AppStore) {
    this.store = store;
    this.bindEvents();
  }

  private getMaxTravel(): number {
    const trackWidth = this.switchEl.clientWidth;
    const thumbWidth = this.thumbEl.offsetWidth;
    // 3px padding su entrambi i lati (6px totali) + 4px bordi
    return Math.max(0, trackWidth - thumbWidth - 10);
  }

  private bindEvents(): void {
    this.switchEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      this.isDragging = true;
      this.hasMoved = false;
      this.startX = e.clientX;
      this.maxTravel = this.getMaxTravel();

      const currentLang = this.store.getState().lang;
      this.currentOffset = currentLang === 'it' ? this.maxTravel : 0;
      this.switchEl.classList.add('is-dragging');
      this.switchEl.setPointerCapture(e.pointerId);
    });

    this.switchEl.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.startX;
      if (Math.abs(deltaX) > 4) {
        this.hasMoved = true;
      }

      const base = this.store.getState().lang === 'it' ? this.maxTravel : 0;
      const clamped = Math.max(0, Math.min(this.maxTravel, base + deltaX));
      this.currentOffset = clamped;
      this.thumbEl.style.transform = `translateX(${clamped}px)`;
    });

    const finishDrag = (e: PointerEvent): void => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.switchEl.classList.remove('is-dragging');
      this.thumbEl.style.transform = '';

      if (this.switchEl.hasPointerCapture(e.pointerId)) {
        this.switchEl.releasePointerCapture(e.pointerId);
      }

      if (this.hasMoved) {
        const nextLang: Language = this.currentOffset >= this.maxTravel / 2 ? 'it' : 'en';
        this.store.setLanguage(nextLang);
      } else {
        // Click diretto: se clicchi sulla metà destra attiva IT, su quella sinistra EN, o alterna
        const rect = this.switchEl.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const currentLang = this.store.getState().lang;
        if (e.clientX === 0 && e.clientY === 0) {
          // Attivazione da tastiera
          this.store.setLanguage(currentLang === 'en' ? 'it' : 'en');
        } else {
          const targetLang: Language = clickX >= rect.width / 2 ? 'it' : 'en';
          this.store.setLanguage(
            targetLang === currentLang ? (currentLang === 'en' ? 'it' : 'en') : targetLang
          );
        }
      }
    };

    this.switchEl.addEventListener('pointerup', finishDrag);
    this.switchEl.addEventListener('pointercancel', finishDrag);

    this.switchEl.addEventListener('click', (e) => {
      // Gestisce l'attivazione da tastiera (Space/Enter) dove pointerup non viene emesso
      if (e.detail === 0) {
        const currentLang = this.store.getState().lang;
        this.store.setLanguage(currentLang === 'en' ? 'it' : 'en');
      }
    });

    this.switchEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.store.setLanguage('it');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.store.setLanguage('en');
      }
    });
  }

  render(): void {
    const lang = this.store.getState().lang;
    const isIt = lang === 'it';
    this.switchEl.dataset.lang = lang;
    this.switchEl.setAttribute('aria-checked', String(isIt));
    this.switchEl.setAttribute(
      'aria-label',
      isIt ? 'Lingua: Italiano (scorri o clicca per Inglese)' : 'Language: English (swipe or click for Italian)'
    );
  }
}
