import { CONTINENT_META } from '../domain/objectives.ts';
import type { FallbackResolution, ObjectiveCard } from '../domain/types.ts';
import { escapeHtml, getTankSvg, isLightHex } from './icons.ts';

export function renderObjectiveCardHtml(
  objective: ObjectiveCard,
  fallbackInfo: FallbackResolution | null = null
): string {
  let visualHtml = '';

  if (objective.type === 'territories') {
    const subLabel =
      objective.minArmies > 1
        ? `Territori con almeno<br>${objective.minArmies} armate ciascuno`
        : 'Territori a scelta<br>sul planisfero';
    visualHtml = `
      <div class="territory-badge">
        <div class="territory-num">${objective.count}</div>
        <div class="territory-sub">${subLabel}</div>
      </div>
    `;
  } else if (objective.type === 'continents') {
    const pills = objective.continents.map((cKey) => {
      const meta = CONTINENT_META[cKey];
      const textColor = isLightHex(meta.color) ? '#141414' : '#ffffff';
      return `<span class="continent-pill" style="background:${meta.color}; color:${textColor}">${escapeHtml(meta.name)}</span>`;
    });
    if (objective.extraContinent) {
      pills.push('<span class="continent-pill is-any">+ 3° Continente a scelta</span>');
    }
    visualHtml = pills.join('');
  } else {
    visualHtml = `
      <div class="destroy-visual">
        <div class="destroy-tank-badge" style="background:${objective.targetColorHex}">
          ${getTankSvg(objective.targetColorHex)}
        </div>
        <div class="destroy-label">Armate ${escapeHtml(objective.targetColorAdjective)}</div>
      </div>
    `;
  }

  const fallbackHtml =
    fallbackInfo && fallbackInfo.isFallback && fallbackInfo.reason
      ? `
        <div class="obj-fallback-box">
          <strong>Obiettivo sostitutivo: 24 territori</strong>
          ${escapeHtml(fallbackInfo.reason)}
        </div>
      `
      : '';

  const noteHtml = objective.note
    ? `<p class="obj-note">${escapeHtml(objective.note)}</p>`
    : '';

  return `
    <article class="objective-card">
      <div class="obj-card-header">
        <span class="obj-wordmark">RisiKo!</span>
        <span class="obj-category">${escapeHtml(objective.categoryLabel)}</span>
      </div>
      <div class="obj-visual">
        ${visualHtml}
      </div>
      <div class="obj-body">
        <p class="obj-text">${escapeHtml(objective.text)}</p>
        ${noteHtml}
        ${fallbackHtml}
      </div>
    </article>
  `;
}
