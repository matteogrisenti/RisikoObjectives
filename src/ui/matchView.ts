import { resolveEffectiveObjective } from '../domain/rules.ts';
import type { AppStore } from '../state/store.ts';
import { renderObjectiveCardHtml } from './cardRenderer.ts';
import { escapeHtml, getRequiredElement, getTankSvg } from './icons.ts';
import type { ModalController } from './modals.ts';

export class MatchView {
  private activeMatchViewEl = getRequiredElement<HTMLDivElement>('active-match-view');
  private matchRuleBadge = getRequiredElement<HTMLSpanElement>('match-rule-badge');
  private matchProgressText = getRequiredElement<HTMLParagraphElement>('match-progress-text');
  private matchPlayersGrid = getRequiredElement<HTMLDivElement>('match-players-grid');
  private btnRevealAll = getRequiredElement<HTMLButtonElement>('btn-reveal-all');
  private btnHideAll = getRequiredElement<HTMLButtonElement>('btn-hide-all');
  private btnRematch = getRequiredElement<HTMLButtonElement>('btn-rematch');
  private btnResetSetup = getRequiredElement<HTMLButtonElement>('btn-reset-setup');
  private revealAllSection = getRequiredElement<HTMLDivElement>('reveal-all-section');
  private revealAllGrid = getRequiredElement<HTMLDivElement>('reveal-all-grid');

  private store: AppStore;
  private modals: ModalController;

  constructor(store: AppStore, modals: ModalController) {
    this.store = store;
    this.modals = modals;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.matchPlayersGrid.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const openBtn = target.closest<HTMLButtonElement>('.btn-open-objective');
      if (openBtn && openBtn.dataset.idx !== undefined) {
        this.modals.openObjectiveModal(Number(openBtn.dataset.idx));
        return;
      }

      const elimBtn = target.closest<HTMLButtonElement>('.btn-toggle-elim');
      if (elimBtn && elimBtn.dataset.idx !== undefined) {
        this.store.togglePlayerEliminated(Number(elimBtn.dataset.idx));
      }
    });

    this.btnRevealAll.addEventListener('click', () => {
      const match = this.store.getState().activeMatch;
      if (!match) return;
      if (match.revealAll) {
        this.revealAllSection.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      this.modals.openConfirm(
        'Rivelare tutti gli obiettivi?',
        'Tutti gli obiettivi dei giocatori verranno mostrati sullo schermo. Usalo solo a fine partita.',
        () => {
          this.store.setRevealAll(true);
          this.revealAllSection.scrollIntoView({ behavior: 'smooth' });
        }
      );
    });

    this.btnHideAll.addEventListener('click', () => {
      this.store.setRevealAll(false);
    });

    this.btnRematch.addEventListener('click', () => {
      this.modals.openConfirm(
        'Nuova estrazione?',
        'Verrà mescolato un nuovo mazzo mantenendo gli stessi giocatori e colori.',
        () => this.store.startNewMatch()
      );
    });

    this.btnResetSetup.addEventListener('click', () => {
      this.modals.openConfirm(
        'Tornare alla configurazione?',
        'La partita attuale verrà chiusa per permetterti di cambiare giocatori o regole.',
        () => this.store.closeActiveMatch()
      );
    });
  }

  render(): void {
    const match = this.store.getState().activeMatch;
    this.activeMatchViewEl.classList.toggle('hidden', match === null);
    if (!match) return;

    this.matchRuleBadge.textContent =
      match.deckMode === 'classic' ? 'Regola classica (14 carte)' : 'Solo colori in partita';

    const seenCount = match.players.filter((p) => p.seen).length;
    this.matchProgressText.textContent = `${seenCount} di ${match.players.length} giocatori hanno visto l'obiettivo`;

    this.matchPlayersGrid.innerHTML = '';
    match.players.forEach((player, idx) => {
      const color = this.store.getColorById(player.colorId);
      const card = document.createElement('div');
      card.className = `player-card${player.eliminated ? ' is-eliminated' : ''}`;

      let pillClass = player.seen ? 'seen' : 'unseen';
      let pillText = player.seen ? 'Assegnato' : 'Da pescare';
      if (player.eliminated) {
        pillClass = 'eliminated';
        pillText = 'Eliminato';
      }

      const openBtnLabel = player.seen ? 'Rivedi obiettivo' : 'Pesca obiettivo';
      const openBtnClass = player.seen ? 'btn-secondary' : 'btn-primary';
      const elimBtnLabel = player.eliminated ? 'Ripristina' : 'Eliminato';

      card.innerHTML = `
        <div class="player-card-top">
          <div class="player-identity">
            <div class="army-chip" style="background:${color.hex}">
              ${getTankSvg(color.hex)}
            </div>
            <div>
              <div class="player-card-name">${escapeHtml(player.name)}</div>
              <div class="player-card-color">Armate ${escapeHtml(color.adjective)}</div>
            </div>
          </div>
          <span class="state-pill ${pillClass}">${pillText}</span>
        </div>
        <div class="player-card-actions">
          <button type="button" class="btn ${openBtnClass} btn-open-objective" data-idx="${idx}">
            ${openBtnLabel}
          </button>
          <button type="button" class="btn btn-ghost btn-sm btn-toggle-elim" data-idx="${idx}" title="Segna se questo colore è stato eliminato durante la partita">
            ${elimBtnLabel}
          </button>
        </div>
      `;

      this.matchPlayersGrid.appendChild(card);
    });

    if (match.revealAll) {
      this.revealAllSection.classList.remove('hidden');
      this.revealAllGrid.innerHTML = '';
      match.players.forEach((player) => {
        const color = this.store.getColorById(player.colorId);
        const fallbackInfo = resolveEffectiveObjective(player.objective, player, match.players);

        const wrapper = document.createElement('div');
        wrapper.className = 'reveal-all-item';
        wrapper.innerHTML = `
          <div class="reveal-all-owner">
            <span class="color-dot" style="background:${color.hex}"></span>
            <span>${escapeHtml(player.name)} (${escapeHtml(color.name)})</span>
          </div>
          ${renderObjectiveCardHtml(player.objective, fallbackInfo)}
        `;
        this.revealAllGrid.appendChild(wrapper);
      });
    } else {
      this.revealAllSection.classList.add('hidden');
    }
  }
}
