import { resolveEffectiveObjective } from '../domain/rules.ts';
import { getStrings } from '../i18n/translations.ts';
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
      const state = this.store.getState();
      const match = state.activeMatch;
      if (!match) return;
      if (match.revealAll) {
        this.revealAllSection.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const strings = getStrings(state.lang);
      this.modals.openConfirm(
        strings.confirmRevealAllTitle,
        strings.confirmRevealAllMsg,
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
      const strings = getStrings(this.store.getState().lang);
      this.modals.openConfirm(
        strings.confirmRematchTitle,
        strings.confirmRematchMsg,
        () => this.store.startNewMatch()
      );
    });

    this.btnResetSetup.addEventListener('click', () => {
      const strings = getStrings(this.store.getState().lang);
      this.modals.openConfirm(
        strings.confirmResetTitle,
        strings.confirmResetMsg,
        () => this.store.closeActiveMatch()
      );
    });
  }

  render(): void {
    const state = this.store.getState();
    const match = state.activeMatch;
    this.activeMatchViewEl.classList.toggle('hidden', match === null);
    if (!match) return;

    const strings = getStrings(state.lang);

    this.matchRuleBadge.textContent =
      match.deckMode === 'classic' ? strings.ruleClassicTitle : strings.ruleActiveOnlyTitle;

    const seenCount = match.players.filter((p) => p.seen).length;
    this.matchProgressText.textContent = strings.progressSeen(seenCount, match.players.length);

    this.matchPlayersGrid.innerHTML = '';
    match.players.forEach((player, idx) => {
      const color = this.store.getLocalizedArmyColor(player.colorId);
      const card = document.createElement('div');
      card.className = `player-card${player.eliminated ? ' is-eliminated' : ''}`;

      let pillClass = player.seen ? 'seen' : 'unseen';
      let pillText: string = player.seen ? strings.statusAssigned : strings.statusToDraw;
      if (player.eliminated) {
        pillClass = 'eliminated';
        pillText = strings.statusEliminated;
      }

      const openBtnLabel = player.seen ? strings.btnViewObjective : strings.btnDrawObjective;
      const openBtnClass = player.seen ? 'btn-secondary' : 'btn-primary';
      const elimBtnLabel = player.eliminated ? strings.btnRestore : strings.btnEliminated;

      card.innerHTML = `
        <div class="player-card-top">
          <div class="player-identity">
            <div class="army-chip" style="background:${color.hex}">
              ${getTankSvg(color.hex)}
            </div>
            <div>
              <div class="player-card-name">${escapeHtml(player.name)}</div>
              <div class="player-card-color">${escapeHtml(strings.playerArmies(color.adjective))}</div>
            </div>
          </div>
          <span class="state-pill ${pillClass}">${escapeHtml(pillText)}</span>
        </div>
        <div class="player-card-actions">
          <button type="button" class="btn ${openBtnClass} btn-open-objective" data-idx="${idx}">
            ${escapeHtml(openBtnLabel)}
          </button>
          <button type="button" class="btn btn-ghost btn-sm btn-toggle-elim" data-idx="${idx}" title="${escapeHtml(strings.btnEliminatedTitle)}">
            ${escapeHtml(elimBtnLabel)}
          </button>
        </div>
      `;

      this.matchPlayersGrid.appendChild(card);
    });

    if (match.revealAll) {
      this.revealAllSection.classList.remove('hidden');
      this.revealAllGrid.innerHTML = '';
      match.players.forEach((player) => {
        const color = this.store.getLocalizedArmyColor(player.colorId);
        const fallbackInfo = resolveEffectiveObjective(
          player.objective,
          player,
          match.players,
          state.lang,
          state.armyColors
        );

        const wrapper = document.createElement('div');
        wrapper.className = 'reveal-all-item';
        wrapper.innerHTML = `
          <div class="reveal-all-owner">
            <span class="color-dot" style="background:${color.hex}"></span>
            <span>${escapeHtml(player.name)} (${escapeHtml(color.name)})</span>
          </div>
          ${renderObjectiveCardHtml(player.objective, fallbackInfo, state.lang, state.armyColors)}
        `;
        this.revealAllGrid.appendChild(wrapper);
      });
    } else {
      this.revealAllSection.classList.add('hidden');
    }
  }
}
