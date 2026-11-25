import type { DeckMode } from '../domain/types.ts';
import { getStrings } from '../i18n/translations.ts';
import type { AppStore } from '../state/store.ts';
import { escapeHtml, getRequiredElement, sanitizeHex } from './icons.ts';
import type { ModalController } from './modals.ts';

export class SetupView {
  private setupViewEl = getRequiredElement<HTMLDivElement>('setup-view');
  private playerCountPills = getRequiredElement<HTMLDivElement>('player-count-pills');
  private playersSetupList = getRequiredElement<HTMLDivElement>('players-setup-list');
  private deckModeRadios = document.querySelectorAll<HTMLInputElement>('input[name="deckMode"]');
  private btnStartMatch = getRequiredElement<HTMLButtonElement>('btn-start-match');
  private btnOpenColors = getRequiredElement<HTMLButtonElement>('btn-open-colors');

  private store: AppStore;
  private modals: ModalController;

  constructor(store: AppStore, modals: ModalController) {
    this.store = store;
    this.modals = modals;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.playerCountPills.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.pill-btn');
      if (!btn || !btn.dataset.count) return;
      this.store.setPlayerCount(Number(btn.dataset.count));
    });

    this.deckModeRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const value = (e.target as HTMLInputElement).value as DeckMode;
        this.store.setDeckMode(value);
      });
    });

    this.btnStartMatch.addEventListener('click', () => {
      this.store.startNewMatch();
    });

    this.btnOpenColors.addEventListener('click', () => {
      this.modals.openColorsModal();
    });
  }

  render(): void {
    const state = this.store.getState();
    const strings = getStrings(state.lang);
    const isVisible = state.activeMatch === null;
    this.setupViewEl.classList.toggle('hidden', !isVisible);
    if (!isVisible) return;

    this.playerCountPills.querySelectorAll<HTMLButtonElement>('.pill-btn').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.count) === state.playerCount);
    });

    this.deckModeRadios.forEach((radio) => {
      radio.checked = radio.value === state.deckMode;
    });

    this.playersSetupList.innerHTML = '';
    state.setupPlayers.slice(0, state.playerCount).forEach((player, idx) => {
      const currentColor = this.store.getLocalizedArmyColor(player.colorId);
      const row = document.createElement('div');
      row.className = 'player-setup-row';

      const optionsHtml = state.armyColors
        .map((c) => {
          const localized = this.store.getLocalizedArmyColor(c.id);
          return `<option value="${escapeHtml(c.id)}" ${c.id === player.colorId ? 'selected' : ''}>${escapeHtml(localized.name)}</option>`;
        })
        .join('');

      row.innerHTML = `
        <span class="player-index-badge">${idx + 1}</span>
        <input
          type="text"
          class="player-name-input"
          value="${escapeHtml(player.name)}"
          maxlength="24"
          placeholder="${escapeHtml(strings.playerDefaultName(idx + 1))}"
          aria-label="${escapeHtml(strings.playerNameAria(idx + 1))}"
        >
        <div class="color-select-wrap">
          <span class="color-dot" style="background:${sanitizeHex(currentColor.hex)}"></span>
          <select class="color-select" aria-label="${escapeHtml(strings.playerColorAria(idx + 1))}">
            ${optionsHtml}
          </select>
        </div>
      `;

      const nameInput = row.querySelector<HTMLInputElement>('.player-name-input');
      nameInput?.addEventListener('input', (e) => {
        this.store.updateSetupPlayerName(idx, (e.target as HTMLInputElement).value);
      });

      const selectEl = row.querySelector<HTMLSelectElement>('.color-select');
      selectEl?.addEventListener('change', (e) => {
        this.store.updateSetupPlayerColor(idx, (e.target as HTMLSelectElement).value);
      });

      this.playersSetupList.appendChild(row);
    });
  }
}
