import { escapeAttribute, escapeHtml, escapeSingleQuotedJsString } from '../../utils/escape.js';

function normalizeHexColor(value, fallback = '#3b82f6') {
  const trimmed = String(value || '').trim();

  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, number));
}

function hexToRgb(hexColor) {
  const hex = normalizeHexColor(hexColor).replace('#', '');

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  };
}

function formatAlpha(value) {
  return Number(value).toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function getEffectConfig(effectMode, blur, opacity) {
  if (effectMode === 'beacon') {
    return {
      duration: '0s',
      liftY: 0,
      animateShell: false,
      spreadOne: Math.max(14, Math.round(blur * 0.95)),
      spreadTwo: Math.max(30, Math.round(blur * 1.75)),
      liftShadow: Math.max(18, Math.round(blur * 1.08)),
      outlineLow: formatAlpha(opacity * 0.24),
      outlineMid: formatAlpha(opacity * 0.38),
      outlineHigh: formatAlpha(opacity * 0.54),
      lowA: formatAlpha(opacity * 0.28),
      midA: formatAlpha(opacity * 0.42),
      highA: formatAlpha(opacity * 0.58),
      liftLow: formatAlpha(opacity * 0.14),
      liftMid: formatAlpha(opacity * 0.22),
      liftHigh: formatAlpha(opacity * 0.3),
      ring: {
        duration: '2.1s',
        inset: Math.max(8, Math.round(blur * 0.3)),
        borderWidth: 2,
        alpha: formatAlpha(opacity * 0.46),
        finalScale: 1.14
      }
    };
  }

  if (effectMode === 'intense') {
    return {
      duration: '2.8s',
      liftY: -2,
      animateShell: true,
      spreadOne: Math.max(12, Math.round(blur * 0.82)),
      spreadTwo: Math.max(26, Math.round(blur * 1.58)),
      liftShadow: Math.max(18, Math.round(blur * 0.98)),
      outlineLow: formatAlpha(opacity * 0.22),
      outlineMid: formatAlpha(opacity * 0.34),
      outlineHigh: formatAlpha(opacity * 0.5),
      lowA: formatAlpha(opacity * 0.24),
      midA: formatAlpha(opacity * 0.36),
      highA: formatAlpha(opacity * 0.52),
      liftLow: formatAlpha(opacity * 0.12),
      liftMid: formatAlpha(opacity * 0.18),
      liftHigh: formatAlpha(opacity * 0.24),
      ring: null
    };
  }

  return {
    duration: '3.6s',
    liftY: -1,
    animateShell: true,
    spreadOne: Math.max(10, Math.round(blur * 0.65)),
    spreadTwo: Math.max(22, Math.round(blur * 1.35)),
    liftShadow: Math.max(16, Math.round(blur * 0.82)),
    outlineLow: formatAlpha(opacity * 0.18),
    outlineMid: formatAlpha(opacity * 0.28),
    outlineHigh: formatAlpha(opacity * 0.42),
    lowA: formatAlpha(opacity * 0.18),
    midA: formatAlpha(opacity * 0.26),
    highA: formatAlpha(opacity * 0.4),
    liftLow: formatAlpha(opacity * 0.1),
    liftMid: formatAlpha(opacity * 0.14),
    liftHigh: formatAlpha(opacity * 0.18),
    ring: null
  };
}

function buildGlowCss(prefix, state) {
  const color = hexToRgb(state.glowColor);
  const blur = clampNumber(state.blur, 12, 48, 28);
  const opacity = clampNumber(state.opacity, 0.2, 1, 0.8);
  const effectMode = String(state.effectMode || 'standard');
  const config = getEffectConfig(effectMode, blur, opacity);

  if (effectMode === 'beacon') {
    const ringInset = Math.max(6, Math.round(blur * 0.18));
    const ringStart = Math.max(14, Math.round(config.spreadTwo * 0.5));
    const ringEnd = Math.max(34, Math.round(config.spreadTwo * 1.36));
    const ringAlpha = formatAlpha(opacity * 0.56);
    const staticOuter = Math.max(22, Math.round(config.spreadTwo * 0.92));
    const staticOuterAlpha = formatAlpha(opacity * 0.26);

    return `
.${prefix} {
  position: relative !important;
  z-index: 1;
  isolation: isolate;
  overflow: visible !important;
  transform: translateY(0);
  box-shadow:
    0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${config.outlineMid}),
    0 0 ${config.spreadOne}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.midA}),
    0 0 ${config.spreadTwo}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.lowA}),
    0 0 ${staticOuter}px rgba(${color.r}, ${color.g}, ${color.b}, ${staticOuterAlpha}) !important;
  transition: box-shadow 0.35s ease;
}

.${prefix}::after {
  content: '';
  position: absolute;
  inset: -${ringInset}px;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  box-shadow: 0 0 0 0 rgba(${color.r}, ${color.g}, ${color.b}, ${ringAlpha});
  animation: ${prefix}-glow-beacon-ring 2.2s ease-out infinite;
}

@keyframes ${prefix}-glow-beacon-ring {
  0% {
    opacity: 0.95;
    box-shadow: 0 0 0 ${ringStart}px rgba(${color.r}, ${color.g}, ${color.b}, ${ringAlpha});
  }
  100% {
    opacity: 0;
    box-shadow: 0 0 0 ${ringEnd}px rgba(${color.r}, ${color.g}, ${color.b}, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .${prefix} {
    animation: none !important;
  }
  .${prefix}::after {
    animation: none !important;
    opacity: 0.45;
    box-shadow: 0 0 0 ${Math.round((ringStart + ringEnd) / 2)}px rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(opacity * 0.24)});
  }
}`;
  }

  const ringCss = config.ring
    ? `

.${prefix}::after {
  content: '';
  position: absolute;
  inset: -${config.ring.inset}px;
  border-radius: inherit;
  border: ${config.ring.borderWidth}px solid rgba(${color.r}, ${color.g}, ${color.b}, ${config.ring.alpha});
  pointer-events: none;
  opacity: 0;
  transform: scale(0.96);
  animation: ${prefix}-glow-ring ${config.ring.duration} ease-out infinite;
}

@keyframes ${prefix}-glow-ring {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  18% {
    opacity: 0.92;
  }
  100% {
    opacity: 0;
    transform: scale(${config.ring.finalScale});
  }
}`
    : '';
  const shellAnimation = config.animateShell
    ? `animation: ${prefix}-glow-shell ${config.duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;`
    : 'animation: none;';

  return `
.${prefix} {
  position: relative !important;
  z-index: 1;
  isolation: isolate;
  transform: translateY(${config.liftY}px);
  box-shadow:
    0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${config.outlineMid}),
    0 0 ${config.spreadOne}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.midA}),
    0 0 ${config.spreadTwo}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.lowA}),
    0 12px ${config.liftShadow}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.liftMid}) !important;
  transition: box-shadow 0.35s ease, transform 0.35s ease;
  ${shellAnimation}
}

@keyframes ${prefix}-glow-shell {
  0% {
    transform: translateY(0);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${config.outlineLow}),
      0 0 ${Math.max(10, Math.round(config.spreadOne * 0.68))}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.lowA}),
      0 0 ${Math.max(20, Math.round(config.spreadTwo * 0.74))}px rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(opacity * 0.16)}),
      0 8px ${Math.max(12, Math.round(config.liftShadow * 0.72))}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.liftLow});
  }
  34% {
    transform: translateY(${config.liftY}px);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${config.outlineHigh}),
      0 0 ${Math.round(config.spreadOne * 1.22)}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.highA}),
      0 0 ${Math.round(config.spreadTwo * 1.18)}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.midA}),
      0 14px ${Math.round(config.liftShadow * 1.08)}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.liftHigh});
  }
  68% {
    transform: translateY(${config.liftY}px);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${config.outlineMid}),
      0 0 ${config.spreadOne}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.midA}),
      0 0 ${config.spreadTwo}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.lowA}),
      0 10px ${Math.round(config.liftShadow * 0.9)}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.liftMid});
  }
  100% {
    transform: translateY(0);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${config.outlineLow}),
      0 0 ${Math.max(10, Math.round(config.spreadOne * 0.68))}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.lowA}),
      0 0 ${Math.max(20, Math.round(config.spreadTwo * 0.74))}px rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(opacity * 0.16)}),
      0 8px ${Math.max(12, Math.round(config.liftShadow * 0.72))}px rgba(${color.r}, ${color.g}, ${color.b}, ${config.liftLow});
  }
}
${ringCss}

@media (prefers-reduced-motion: reduce) {
  .${prefix} {
    animation: none !important;
  }
  .${prefix}::after {
    animation: none !important;
    opacity: 0.55;
    transform: scale(1.02);
  }
}`;
}

function parseSelectorInput(selectorValue) {
  const rawSelector = String(selectorValue || '').trim();
  const textMatches = [];

  const selector = rawSelector.replace(/:contains\((['"])(.*?)\1\)/g, (_, __, text) => {
    textMatches.push(text);
    return '';
  }).trim();

  return {
    selector,
    textMatches
  };
}

export function buildGlowHighlightHtml(state, blockId) {
  const prefix = `onb-glow-highlight-${blockId}`;
  const pageUrl = escapeSingleQuotedJsString(String(state.pageUrl || '').trim());
  const parsedSelector = parseSelectorInput(state.selector);
  const selector = escapeSingleQuotedJsString(parsedSelector.selector);
  const textMatches = parsedSelector.textMatches.map((text) => escapeSingleQuotedJsString(text));
  const css = buildGlowCss(prefix, state);
  const textMatchesJs = `[${textMatches.map((text) => `'${text}'`).join(', ')}]`;

  return `<!-- GLOW HIGHLIGHT START -->
<style>
${css}
</style>
<script>
(function() {
  var targetUrl = '${pageUrl}';
  var selector = '${selector}';
  var textMatches = ${textMatchesJs};

  if (!selector) return;
  if (targetUrl && window.location.href.indexOf(targetUrl) === -1) return;

  function findTarget() {
    var candidates;
    try {
      candidates = Array.prototype.slice.call(document.querySelectorAll(selector));
    } catch (error) {
      console.warn('Glow highlight: invalid selector', selector, error);
      return null;
    }

    if (!textMatches.length) {
      return candidates[0] || null;
    }

    return candidates.find(function(candidate) {
      var text = (candidate.textContent || '').trim();
      return textMatches.every(function(keyword) {
        return text.indexOf(keyword) !== -1;
      });
    }) || null;
  }

  function applyGlow() {
    var target = findTarget();
    if (!target) return false;
    target.classList.add('${prefix}');
    return true;
  }

  if (applyGlow()) return;

  var observer = new MutationObserver(function() {
    if (applyGlow()) observer.disconnect();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.setTimeout(function() {
    observer.disconnect();
  }, 10000);
})();
</script>
<!-- GLOW HIGHLIGHT END -->`;
}

export function buildGlowHighlightPreviewHtml(state, blockId) {
  const prefix = `onb-glow-highlight-preview-${blockId}`;
  const css = buildGlowCss(`${prefix}__target`, state);
  const previewColor = escapeAttribute(normalizeHexColor(state.glowColor));
  const previewBlur = clampNumber(state.blur, 12, 48, 28);
  const verticalPadding = Math.max(40, Math.round(previewBlur * 1.6));
  const horizontalPadding = Math.max(20, Math.round(previewBlur * 0.8));

  return `<div class="${prefix}">
  <div class="${prefix}__canvas">
    <button type="button" class="${prefix}__target" aria-label="Glow highlight preview"></button>
  </div>
</div>
<style>
  .${prefix} {
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  }
  .${prefix}__canvas {
    display: flex;
    justify-content: center;
    overflow: visible;
    padding: ${verticalPadding}px ${horizontalPadding}px;
  }
  .${prefix}__target {
    min-width: 320px;
    max-width: 100%;
    padding: 24px 28px;
    border: 1px solid ${previewColor};
    border-radius: 20px;
    background: #ffffff;
    color: #1e293b;
    font-size: 18px;
    line-height: 1.6;
    font-weight: 500;
    text-align: center;
    cursor: default;
  }
${css}
</style>`;
}
