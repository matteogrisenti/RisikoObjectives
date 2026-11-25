export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function isLightHex(hex: string): boolean {
  const clean = (hex || '#000000').replace('#', '');
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 170;
}

export function getTankSvg(hexColor: string): string {
  const strokeColor = isLightHex(hexColor) ? '#141414' : '#ffffff';
  return `
    <svg viewBox="0 0 24 24" fill="${hexColor}" stroke="${strokeColor}" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14h16l1 4H3l1-4z"/>
      <path d="M7 10h7l2 4H6l1-4z"/>
      <path d="M14 11.5h7"/>
      <circle cx="6.5" cy="18" r="1.1"/>
      <circle cx="12" cy="18" r="1.1"/>
      <circle cx="17.5" cy="18" r="1.1"/>
    </svg>
  `;
}

/**
 * Icona stilizzata del cannone (ispirata alle carte classiche Editrice Giochi).
 */
export function getCannonLineArtSvg(): string {
  return `
    <svg viewBox="0 0 64 42" fill="none" stroke="#141414" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M10 22l34-9 2 6-33 10z" fill="#FAF8F2"/>
      <circle cx="24" cy="27" r="9.5" fill="#FAF8F2"/>
      <circle cx="24" cy="27" r="2.2"/>
      <path d="M24 17.5v19M14.5 27h19M17.3 20.3l13.4 13.4M30.7 20.3L17.3 33.7"/>
      <path d="M33 30l20 4.5-1.5 3.5-21-4.5"/>
    </svg>
  `;
}

/**
 * Icona stilizzata del fante/soldato classico.
 */
export function getInfantryLineArtSvg(): string {
  return `
    <svg viewBox="0 0 48 48" fill="none" stroke="#141414" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="19" y="6" width="10" height="7" rx="1.5" fill="#FAF8F2"/>
      <path d="M18 13h12"/>
      <circle cx="24" cy="16.5" r="3.2" fill="#FAF8F2"/>
      <path d="M18 22h12l-1 11h-10z" fill="#FAF8F2"/>
      <path d="M21 33v9M27 33v9M19 42h4M25 42h4"/>
      <path d="M31 12v25"/>
      <path d="M18 23l-4 5 5 2"/>
    </svg>
  `;
}

export function getRequiredElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Elemento DOM mancante: #${id}`);
  }
  return el as T;
}
