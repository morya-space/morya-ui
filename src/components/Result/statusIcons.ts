/** Built-in HTTP status illustrations. Use currentColor for theming. */

export type ResultHttpStatus = "403" | "404" | "500" | "418";

export const RESULT_HTTP_ILLUSTRATIONS: Record<ResultHttpStatus, string> = {
  "403": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" fill="none" aria-hidden="true" focusable="false">
  <ellipse cx="120" cy="118" rx="88" ry="12" fill="currentColor" opacity="0.08"/>
  <rect x="70" y="36" width="100" height="72" rx="12" fill="currentColor" opacity="0.12"/>
  <rect x="86" y="52" width="68" height="40" rx="6" fill="currentColor" opacity="0.18"/>
  <path d="M104 52v-8a16 16 0 0 1 32 0v8" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.55"/>
  <circle cx="120" cy="72" r="6" fill="currentColor" opacity="0.7"/>
  <path d="M120 78v10" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
  <text x="120" y="28" text-anchor="middle" font-size="28" font-weight="700" fill="currentColor" opacity="0.85" font-family="var(--m-font-sans),system-ui,sans-serif">403</text>
</svg>`,
  "404": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" fill="none" aria-hidden="true" focusable="false">
  <ellipse cx="120" cy="118" rx="88" ry="12" fill="currentColor" opacity="0.08"/>
  <circle cx="108" cy="68" r="28" stroke="currentColor" stroke-width="6" opacity="0.35"/>
  <path d="M128 88l22 22" stroke="currentColor" stroke-width="6" stroke-linecap="round" opacity="0.55"/>
  <path d="M98 68h20M108 58v20" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
  <text x="120" y="28" text-anchor="middle" font-size="28" font-weight="700" fill="currentColor" opacity="0.85" font-family="var(--m-font-sans),system-ui,sans-serif">404</text>
</svg>`,
  "500": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" fill="none" aria-hidden="true" focusable="false">
  <ellipse cx="120" cy="118" rx="88" ry="12" fill="currentColor" opacity="0.08"/>
  <rect x="78" y="48" width="84" height="56" rx="10" fill="currentColor" opacity="0.12"/>
  <rect x="90" y="60" width="60" height="8" rx="2" fill="currentColor" opacity="0.35"/>
  <rect x="90" y="76" width="40" height="8" rx="2" fill="currentColor" opacity="0.25"/>
  <circle cx="156" cy="48" r="18" fill="currentColor" opacity="0.18"/>
  <path d="M156 40v10" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>
  <circle cx="156" cy="56" r="2" fill="currentColor" opacity="0.75"/>
  <text x="120" y="28" text-anchor="middle" font-size="28" font-weight="700" fill="currentColor" opacity="0.85" font-family="var(--m-font-sans),system-ui,sans-serif">500</text>
</svg>`,
  "418": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" fill="none" aria-hidden="true" focusable="false">
  <ellipse cx="120" cy="118" rx="88" ry="12" fill="currentColor" opacity="0.08"/>
  <path d="M88 86c0-22 14-40 32-40s32 18 32 40v8H88v-8z" fill="currentColor" opacity="0.14"/>
  <path d="M100 54c4-10 12-16 20-16s16 6 20 16" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
  <circle cx="110" cy="72" r="3" fill="currentColor" opacity="0.65"/>
  <circle cx="130" cy="72" r="3" fill="currentColor" opacity="0.65"/>
  <path d="M112 84c4 4 12 4 16 0" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
  <path d="M120 46v-10M112 40h16" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
  <text x="120" y="28" text-anchor="middle" font-size="28" font-weight="700" fill="currentColor" opacity="0.85" font-family="var(--m-font-sans),system-ui,sans-serif">418</text>
</svg>`,
};
