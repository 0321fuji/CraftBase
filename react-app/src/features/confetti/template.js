import { escapeAttribute, escapeHtml } from '../../utils/escape.js';
import { CONFETTI_CARD_BACKGROUND_OPTIONS, CONFETTI_OUTER_BACKGROUND_OPTIONS, CONFETTI_PALETTE_OPTIONS } from './defaults.js';

function sanitizeToken(value, fallback = 'block') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || fallback;
}

function getPaletteColors(paletteId) {
  const palette = CONFETTI_PALETTE_OPTIONS.find((option) => option.value === paletteId) || CONFETTI_PALETTE_OPTIONS[0];
  return palette.colors;
}

function getSpreadProfile(spread) {
  if (spread === 'tight') {
    return { x: 140, y: 220 };
  }

  if (spread === 'wide') {
    return { x: 320, y: 420 };
  }

  return { x: 220, y: 320 };
}

function getCardBackgroundColor(cardBackground) {
  const option = CONFETTI_CARD_BACKGROUND_OPTIONS.find((item) => item.value === cardBackground) || CONFETTI_CARD_BACKGROUND_OPTIONS[0];
  return option.color;
}

function getOuterBackgroundColor(outerBackground) {
  const option = CONFETTI_OUTER_BACKGROUND_OPTIONS.find((item) => item.value === outerBackground) || CONFETTI_OUTER_BACKGROUND_OPTIONS[0];
  return option.color;
}

function getOuterBackgroundTexture(outerBackground) {
  if (outerBackground === 'white') {
    return 'none';
  }

  if (outerBackground === 'blue') {
    return 'radial-gradient(circle at 20% 18%, rgba(59, 130, 246, 0.08), transparent 28%), radial-gradient(circle at 78% 20%, rgba(14, 165, 233, 0.1), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.3))';
  }

  if (outerBackground === 'green') {
    return 'radial-gradient(circle at 20% 18%, rgba(34, 197, 94, 0.08), transparent 28%), radial-gradient(circle at 78% 20%, rgba(16, 185, 129, 0.1), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.3))';
  }

  if (outerBackground === 'cream') {
    return 'radial-gradient(circle at 20% 18%, rgba(245, 158, 11, 0.07), transparent 28%), radial-gradient(circle at 78% 20%, rgba(251, 191, 36, 0.08), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.2))';
  }

  if (outerBackground === 'pink') {
    return 'radial-gradient(circle at 20% 18%, rgba(244, 114, 182, 0.08), transparent 28%), radial-gradient(circle at 78% 20%, rgba(251, 113, 133, 0.1), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.28))';
  }

  return 'radial-gradient(circle at 20% 18%, rgba(148, 163, 184, 0.08), transparent 28%), radial-gradient(circle at 78% 20%, rgba(226, 232, 240, 0.95), transparent 24%), linear-gradient(180deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.18))';
}

function buildPieceMarkup(prefix, index, colors, spreadProfile, burstCount, totalCount) {
  const isBurst = index < burstCount;
  const burstIndex = isBurst ? index : index - burstCount;
  const burstTotal = Math.max(1, burstCount);
  const tailTotal = Math.max(1, totalCount - burstCount);
  const xBias = index % 2 === 0 ? -1 : 1;
  const yBias = index % 3 === 0 ? -1 : 1;
  const centerDrift = isBurst ? 1.4 : 2.8;
  const startX = 50 + ((index % 7) - 3) * centerDrift + (index % 2 === 0 ? 0.35 : -0.35);
  const startY = 50 + ((index % 5) - 2) * (isBurst ? 0.9 : 1.5) + (index % 3 === 0 ? -0.25 : 0.25);
  const spreadScale = isBurst ? 0.18 : 0.28;
  const xOffset = (xBias * (spreadProfile.x * (spreadScale + ((index % 5) * 0.04)))).toFixed(0);
  const yOffset = (yBias * (spreadProfile.y * (spreadScale - 0.03 + ((index % 6) * 0.03)))).toFixed(0);
  const duration = `${isBurst ? 3400 + ((index % 4) * 120) : 4200 + ((index % 4) * 180)}ms`;
  const delay = isBurst
    ? `${Math.floor((burstIndex / burstTotal) * 850)}ms`
    : `${900 + Math.floor((burstIndex / tailTotal) * 1800)}ms`;
  const width = `${isBurst ? 5 + (index % 3) : 6 + (index % 4)}px`;
  const height = `${isBurst ? 7 + (index % 2) * 2 : 8 + (index % 3) * 2}px`;
  const radius = index % 4 === 0 ? '999px' : index % 3 === 0 ? '6px' : '3px';
  const color = colors[index % colors.length];
  const rotate = `${(index % 2 === 0 ? 1 : -1) * (520 + (index % 5) * 70)}deg`;

  return `<span
    class="${prefix}__piece"
    style="left:${startX}%;top:${startY}px;--x:${xOffset}px;--y:${yOffset}px;--rot:${rotate};--duration:${duration};--delay:${delay};width:${width};height:${height};background:${color};border-radius:${radius};"
  ></span>`;
}

function buildParticlePieces(prefix, colors, spreadProfile, count) {
  const total = Math.min(140, Math.max(24, Number(count) || 96));
  const burstCount = Math.min(28, Math.max(18, Math.round(total * 0.3)));
  return Array.from({ length: total }, (_, index) => buildPieceMarkup(prefix, index, colors, spreadProfile, burstCount, total)).join('\n');
}

function buildConfettiBaseCss(prefix, state) {
  const placement = state.placement || 'center';
  const cardBackground = getCardBackgroundColor(state.cardBackground);
  const outerBackground = getOuterBackgroundColor(state.outerBackground);
  const outerTexture = getOuterBackgroundTexture(state.outerBackground);

  return `
  .${prefix} {
    position: relative;
    display: flex;
    align-items: ${placement === 'top' ? 'flex-start' : placement === 'bottom' ? 'flex-end' : 'center'};
    justify-content: center;
    min-height: 240px;
    padding: 24px 16px;
    box-sizing: border-box;
    background: ${outerBackground};
    pointer-events: none;
    overflow: hidden;
    isolation: isolate;
  }

  .${prefix}.is-preview {
    border-radius: 24px;
    background-image: ${outerTexture};
  }

  .${prefix}__backdrop {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${outerBackground};
    opacity: 0;
    animation: ${prefix}__fade-in 180ms ease-out forwards;
  }

  .${prefix}.is-preview .${prefix}__backdrop {
    background: ${outerBackground};
  }

  .${prefix}__stage {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .${prefix}__card {
    position: relative;
    z-index: 1;
    width: min(92vw, 420px);
    padding: 22px 24px 20px;
    border-radius: 24px;
    background: ${cardBackground};
    box-shadow: 0 20px 48px rgba(15, 23, 42, 0.14);
    text-align: center;
    backdrop-filter: blur(12px);
    opacity: 0;
    transform: scale(0.92);
    animation: ${prefix}__card-pop 760ms cubic-bezier(0.18, 0.89, 0.18, 1.16) 90ms forwards;
  }

  .${prefix}[data-onb-confetti-placement="top"] {
    justify-content: flex-start;
  }

  .${prefix}[data-onb-confetti-placement="center"] {
    justify-content: center;
  }

  .${prefix}[data-onb-confetti-placement="bottom"] {
    justify-content: flex-end;
  }

  .${prefix}__emoji {
    margin-bottom: 10px;
    font-size: 32px;
    line-height: 1;
  }

  .${prefix}__message {
    color: #0f172a;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.45;
    letter-spacing: 0.01em;
  }

  .${prefix}__subtext {
    margin-top: 8px;
    color: #475569;
    font-size: 13px;
    line-height: 1.75;
  }

  .${prefix}__piece {
    position: absolute;
    top: 0;
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(0deg);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35);
    animation: ${prefix}__piece-fall var(--duration) cubic-bezier(0.15, 0.8, 0.25, 1) forwards;
    animation-delay: var(--delay);
  }

  @keyframes ${prefix}__fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes ${prefix}__card-pop {
    0% {
      opacity: 0;
      transform: scale(0.88);
    }
    60% {
      opacity: 1;
      transform: scale(1.03);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes ${prefix}__piece-fall {
    0% {
      opacity: 0;
      transform: translate3d(0, -10px, 0) rotate(0deg);
    }
    10% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate3d(var(--x), var(--y), 0) rotate(var(--rot));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .${prefix}__backdrop,
    .${prefix}__card,
    .${prefix}__piece {
      animation: none !important;
    }

    .${prefix}__card {
      opacity: 1;
      transform: none;
    }

    .${prefix}__piece {
      display: none;
    }
  }
  `;
}

function buildRuntimeScript(prefix, state) {
  return `
<script>
  (() => {
    const root = document.querySelector('.${prefix}');
    if (!root) return;

    const stage = root.querySelector('.${prefix}__stage');
    if (!stage) return;

    const repeatMode = root.getAttribute('data-onb-confetti-repeat') || 'every';
    const storageKey = root.getAttribute('data-onb-confetti-storage-key') || '';
    const duration = Math.min(6000, Math.max(900, Number(root.getAttribute('data-onb-confetti-duration')) || 2200));

    if (repeatMode === 'session' && storageKey) {
      try {
        if (window.sessionStorage.getItem(storageKey) === '1') {
          stage.replaceChildren();
          return;
        }
        window.sessionStorage.setItem(storageKey, '1');
      } catch (error) {
        // sessionStorage may be unavailable in privacy-restricted contexts.
      }
    }

    window.setTimeout(() => {
      stage.replaceChildren();
    }, duration + 1200);
  })();
</script>
  `;
}

function buildConfettiShell(state, blockId, { preview = false } = {}) {
  const prefix = `onb-confetti-${sanitizeToken(blockId, 'block')}`;
  const palette = getPaletteColors(state.paletteId);
  const spreadProfile = getSpreadProfile(state.spread);
  const messageText = String(state.messageText || '').trim();
  const subText = String(state.subText || '').trim();
  const emoji = String(state.emoji || '').trim();
  const pieceCount = state.particleCount;

  const wrapper = preview ? `${prefix} is-preview` : prefix;
  const pieces = buildParticlePieces(prefix, palette, spreadProfile, pieceCount);
  const backdrop = `<div class="${prefix}__backdrop"></div>`;
  const cardTopLevel = `<div class="${prefix}__card" role="status" aria-live="polite"><div class="${prefix}__emoji">${escapeHtml(emoji)}</div><div class="${prefix}__message">${escapeHtml(messageText)}</div><div class="${prefix}__subtext">${escapeHtml(subText)}</div></div>`;

  return `
<div class="${wrapper}" data-onb-confetti-placement="${escapeAttribute(state.placement)}" data-onb-confetti-repeat="${escapeAttribute(state.repeatMode)}" data-onb-confetti-storage-key="${escapeAttribute(`${prefix}-played`)}" data-onb-confetti-count="${escapeAttribute(state.particleCount)}" data-onb-confetti-duration="${escapeAttribute(state.durationMs)}" data-onb-confetti-spread="${escapeAttribute(state.spread)}" data-onb-confetti-colors="${escapeAttribute(palette.join(','))}" data-onb-confetti-card-background="${escapeAttribute(state.cardBackground)}" data-onb-confetti-outer-background="${escapeAttribute(state.outerBackground)}">
  ${backdrop}
  <div class="${prefix}__stage" aria-hidden="true">
    ${pieces}
  </div>
  ${cardTopLevel}
</div>
<style>
${buildConfettiBaseCss(prefix, state)}
</style>
${preview ? '' : buildRuntimeScript(prefix, state)}`.trim();
}

export function buildConfettiHtml(state, blockId) {
  return buildConfettiShell(state, blockId, { preview: false });
}

export function buildConfettiPreviewHtml(state, blockId) {
  return buildConfettiShell(state, blockId, { preview: true });
}
