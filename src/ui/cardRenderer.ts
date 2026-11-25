import { CONTINENT_META, resolveColorKey } from '../domain/objectives.ts';
import type { ArmyColor, FallbackResolution, Language, ObjectiveCard } from '../domain/types.ts';
import {
  OBJECTIVE_TEXTS,
  getLocalizedColor,
  getLocalizedContinentName,
  getStrings
} from '../i18n/translations.ts';
import { escapeHtml, getTankSvg, isLightHex, sanitizeHex } from './icons.ts';

export function renderObjectiveCardHtml(
  objective: ObjectiveCard,
  fallbackInfo: FallbackResolution | null = null,
  lang: Language = 'en',
  armyColors?: readonly ArmyColor[]
): string {
  const strings = getStrings(lang);
  let visualHtml = '';
  let categoryLabel = objective.categoryLabel;
  let cardText = objective.text;
  let cardNote = objective.note;

  if (objective.type === 'territories') {
    const localized = OBJECTIVE_TEXTS[lang][objective.id];
    if (localized) {
      categoryLabel = localized.categoryLabel;
      cardText = localized.text;
      cardNote = localized.note;
    }

    const subLabel =
      objective.minArmies > 1
        ? strings.cardTerritoriesTwoArmies(objective.minArmies)
        : strings.cardTerritoriesAny;
    visualHtml = `
      <div class="territory-badge">
        <div class="territory-num">${objective.count}</div>
        <div class="territory-sub">${subLabel}</div>
      </div>
    `;
  } else if (objective.type === 'continents') {
    const localized = OBJECTIVE_TEXTS[lang][objective.id];
    if (localized) {
      categoryLabel = localized.categoryLabel;
      cardText = localized.text;
      cardNote = localized.note;
    }

    const pills = objective.continents.map((cKey) => {
      const meta = CONTINENT_META[cKey];
      const safeBg = sanitizeHex(meta.color);
      const textColor = isLightHex(safeBg) ? '#141414' : '#ffffff';
      const continentName = getLocalizedContinentName(cKey, lang);
      return `<span class="continent-pill" style="background:${safeBg}; color:${textColor}">${escapeHtml(continentName)}</span>`;
    });
    if (objective.extraContinent) {
      pills.push(`<span class="continent-pill is-any">${escapeHtml(strings.cardThirdContinent)}</span>`);
    }
    visualHtml = pills.join('');
  } else {
    const matchedColor = armyColors?.find((c) => c.id === objective.targetColorId);
    const colorKey =
      objective.targetColorKey ??
      (matchedColor
        ? resolveColorKey(matchedColor)
        : resolveColorKey({
            id: objective.targetColorId,
            hex: objective.targetColorHex,
            name: objective.targetColorName
          }));
    const localizedColor = getLocalizedColor(colorKey, lang);

    categoryLabel = strings.cardDestroyCategory;
    cardText = strings.cardDestroyText(localizedColor.adjective);
    cardNote = strings.cardDestroyNote;

    const safeTargetHex = sanitizeHex(objective.targetColorHex);
    visualHtml = `
      <div class="destroy-visual">
        <div class="destroy-tank-badge" style="background:${safeTargetHex}">
          ${getTankSvg(safeTargetHex)}
        </div>
        <div class="destroy-label">${escapeHtml(strings.cardDestroyLabel(localizedColor.adjective))}</div>
      </div>
    `;
  }

  const fallbackHtml =
    fallbackInfo && fallbackInfo.isFallback && fallbackInfo.reason
      ? `
        <div class="obj-fallback-box">
          <strong>${escapeHtml(strings.cardFallbackHeading)}</strong>
          ${escapeHtml(fallbackInfo.reason)}
        </div>
      `
      : '';

  const noteHtml = cardNote ? `<p class="obj-note">${escapeHtml(cardNote)}</p>` : '';

  return `
    <article class="objective-card">
      <div class="obj-card-header">
        <span class="obj-wordmark">RisikoObjective</span>
        <span class="obj-category">${escapeHtml(categoryLabel)}</span>
      </div>
      <div class="obj-visual">
        ${visualHtml}
      </div>
      <div class="obj-body">
        <p class="obj-text">${escapeHtml(cardText)}</p>
        ${noteHtml}
        ${fallbackHtml}
      </div>
    </article>
  `;
}
