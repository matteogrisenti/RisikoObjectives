import { COLOR_PRESET_PALETTE, DEFAULT_ARMY_COLORS } from '../domain/objectives.ts';
import { resolveEffectiveObjective } from '../domain/rules.ts';
import type { AppStore } from '../state/store.ts';
import { renderObjectiveCardHtml } from './cardRenderer.ts';
import { escapeHtml, getRequiredElement } from './icons.ts';

export class ModalController {
  private activeModalPlayerIndex: number | null = null;
  private pendingConfirmCallback: (() => void) | null = null;

  private objectiveModal = getRequiredElement<HTMLDivElement>('objective-modal');
  private modalCloseX = getRequiredElement<HTMLButtonElement>('modal-close-x');
  private modalShieldStep = getRequiredElement<HTMLDivElement>('modal-shield-step');
  private modalCardStep = getRequiredElement<HTMLDivElement>('modal-card-step');
  private modalPlayerTitle = getRequiredElement<HTMLHeadingElement>('modal-player-title');
  private modalPlayerColorPill = getRequiredElement<HTMLDivElement>('modal-player-color-pill');
  private modalCardOwner = getRequiredElement<HTMLElement>('modal-card-owner');
  private modalCardSlot = getRequiredElement<HTMLDivElement>('modal-card-slot');
  private btnRevealCard = getRequiredElement<HTMLButtonElement>('btn-reveal-card');
  private btnCancelShield = getRequiredElement<HTMLButtonElement>('btn-cancel-shield');
  private btnHideCard = getRequiredElement<HTMLButtonElement>('btn-hide-card');

  private colorsModal = getRequiredElement<HTMLDivElement>('colors-modal');
  private colorsCloseX = getRequiredElement<HTMLButtonElement>('colors-close-x');
  private colorsEditorList = getRequiredElement<HTMLDivElement>('colors-editor-list');
  private btnResetColors = getRequiredElement<HTMLButtonElement>('btn-reset-colors');
  private btnSaveColors = getRequiredElement<HTMLButtonElement>('btn-save-colors');

  private confirmModal = getRequiredElement<HTMLDivElement>('confirm-modal');
  private confirmTitle = getRequiredElement<HTMLHeadingElement>('confirm-title');
  private confirmMessage = getRequiredElement<HTMLParagraphElement>('confirm-message');
  private btnConfirmCancel = getRequiredElement<HTMLButtonElement>('btn-confirm-cancel');
  private btnConfirmOk = getRequiredElement<HTMLButtonElement>('btn-confirm-ok');

  private store: AppStore;

  constructor(store: AppStore) {
    this.store = store;
    this.bindEvents();
  }

  private bindEvents(): void {
    this.btnRevealCard.addEventListener('click', () => {
      const match = this.store.getState().activeMatch;
      if (this.activeModalPlayerIndex === null || !match) return;
      const player = match.players[this.activeModalPlayerIndex];
      if (!player) return;

      const fallbackInfo = resolveEffectiveObjective(player.objective, player, match.players);
      this.store.markPlayerObjectiveSeen(this.activeModalPlayerIndex);

      this.modalCardOwner.textContent = player.name;
      this.modalCardSlot.innerHTML = renderObjectiveCardHtml(player.objective, fallbackInfo);
      this.modalShieldStep.classList.add('hidden');
      this.modalCardStep.classList.remove('hidden');
    });

    this.btnHideCard.addEventListener('click', () => this.closeObjectiveModal());
    this.btnCancelShield.addEventListener('click', () => this.closeObjectiveModal());
    this.modalCloseX.addEventListener('click', () => this.closeObjectiveModal());

    this.colorsCloseX.addEventListener('click', () => this.closeColorsModal());
    this.btnResetColors.addEventListener('click', () => {
      this.store.resetArmyColorsToClassic();
      this.closeColorsModal();
    });

    this.btnSaveColors.addEventListener('click', () => {
      const selects = this.colorsEditorList.querySelectorAll('select');
      const chosenNames = Array.from(selects).map((s) => s.value);
      if (new Set(chosenNames).size !== 6) {
        alert('Seleziona 6 colori diversi per evitare carte duplicate nel mazzo.');
        return;
      }

      const nextColors = chosenNames.map((name, idx) => {
        const preset =
          COLOR_PRESET_PALETTE.find((p) => p.name === name) ?? DEFAULT_ARMY_COLORS[idx];
        return {
          id: DEFAULT_ARMY_COLORS[idx].id,
          name: preset.name,
          adjective: preset.adjective,
          hex: preset.hex
        };
      });

      this.store.setArmyColors(nextColors);
      this.closeColorsModal();
    });

    this.btnConfirmCancel.addEventListener('click', () => this.closeConfirm());
    this.btnConfirmOk.addEventListener('click', () => {
      const cb = this.pendingConfirmCallback;
      this.closeConfirm();
      if (cb) cb();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!this.confirmModal.classList.contains('hidden')) this.closeConfirm();
      else if (!this.colorsModal.classList.contains('hidden')) this.closeColorsModal();
      else if (!this.objectiveModal.classList.contains('hidden')) this.closeObjectiveModal();
    });

    [this.objectiveModal, this.colorsModal, this.confirmModal].forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target !== overlay) return;
        if (overlay === this.objectiveModal) this.closeObjectiveModal();
        if (overlay === this.colorsModal) this.closeColorsModal();
        if (overlay === this.confirmModal) this.closeConfirm();
      });
    });
  }

  openObjectiveModal(playerIdx: number): void {
    const match = this.store.getState().activeMatch;
    if (!match) return;
    const player = match.players[playerIdx];
    if (!player) return;

    this.activeModalPlayerIndex = playerIdx;
    const color = this.store.getColorById(player.colorId);

    this.modalPlayerTitle.textContent = player.name;
    this.modalPlayerColorPill.innerHTML = `
      <span class="color-dot" style="background:${color.hex}"></span>
      <span>Armate ${escapeHtml(color.adjective)}</span>
    `;

    this.modalShieldStep.classList.remove('hidden');
    this.modalCardStep.classList.add('hidden');
    this.objectiveModal.classList.remove('hidden');
  }

  closeObjectiveModal(): void {
    this.objectiveModal.classList.add('hidden');
    this.modalCardSlot.innerHTML = '';
    this.activeModalPlayerIndex = null;
  }

  openColorsModal(): void {
    const { armyColors } = this.store.getState();
    this.colorsEditorList.innerHTML = '';

    armyColors.forEach((color, idx) => {
      const item = document.createElement('div');
      item.className = 'color-editor-item';

      const options = COLOR_PRESET_PALETTE.map((preset) => {
        const selected = preset.name === color.name ? 'selected' : '';
        return `<option value="${escapeHtml(preset.name)}" ${selected}>${escapeHtml(preset.name)}</option>`;
      }).join('');

      item.innerHTML = `
        <span class="color-dot" style="background:${color.hex}; width:18px; height:18px;"></span>
        <span>Colore ${idx + 1}</span>
        <select data-slot="${idx}">${options}</select>
      `;

      const sel = item.querySelector('select');
      const dot = item.querySelector<HTMLElement>('.color-dot');
      sel?.addEventListener('change', (e) => {
        const chosen = COLOR_PRESET_PALETTE.find(
          (p) => p.name === (e.target as HTMLSelectElement).value
        );
        if (chosen && dot) dot.style.background = chosen.hex;
      });

      this.colorsEditorList.appendChild(item);
    });

    this.colorsModal.classList.remove('hidden');
  }

  closeColorsModal(): void {
    this.colorsModal.classList.add('hidden');
  }

  openConfirm(title: string, message: string, onConfirm: () => void): void {
    this.confirmTitle.textContent = title;
    this.confirmMessage.textContent = message;
    this.pendingConfirmCallback = onConfirm;
    this.confirmModal.classList.remove('hidden');
  }

  closeConfirm(): void {
    this.confirmModal.classList.add('hidden');
    this.pendingConfirmCallback = null;
  }
}
