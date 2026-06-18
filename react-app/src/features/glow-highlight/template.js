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

function buildGlowCss(prefix, state) {
  const color = hexToRgb(state.glowColor);
  const blur = clampNumber(state.blur, 12, 48, 28);
  const opacity = clampNumber(state.opacity, 0.2, 1, 0.8);
  const spreadOne = Math.max(10, Math.round(blur * 0.65));
  const spreadTwo = Math.max(22, Math.round(blur * 1.35));
  const liftShadow = Math.max(16, Math.round(blur * 0.82));

  const lowA = formatAlpha(opacity * 0.18);
  const midA = formatAlpha(opacity * 0.26);
  const highA = formatAlpha(opacity * 0.4);
  const outlineLow = formatAlpha(opacity * 0.18);
  const outlineMid = formatAlpha(opacity * 0.28);
  const outlineHigh = formatAlpha(opacity * 0.42);
  const liftLow = formatAlpha(opacity * 0.1);
  const liftMid = formatAlpha(opacity * 0.14);
  const liftHigh = formatAlpha(opacity * 0.18);

  return `
.${prefix} {
  position: relative !important;
  z-index: 1;
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${outlineMid}),
    0 0 ${spreadOne}px rgba(${color.r}, ${color.g}, ${color.b}, ${midA}),
    0 0 ${spreadTwo}px rgba(${color.r}, ${color.g}, ${color.b}, ${lowA}),
    0 10px ${liftShadow}px rgba(${color.r}, ${color.g}, ${color.b}, ${liftMid}) !important;
  transition: box-shadow 0.4s ease, transform 0.4s ease;
  animation: ${prefix}-glow-shell 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes ${prefix}-glow-shell {
  0% {
    transform: translateY(0);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${outlineLow}),
      0 0 ${Math.max(8, Math.round(spreadOne * 0.65))}px rgba(${color.r}, ${color.g}, ${color.b}, ${lowA}),
      0 0 ${Math.max(18, Math.round(spreadTwo * 0.7))}px rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(opacity * 0.12)}),
      0 6px ${Math.max(12, Math.round(liftShadow * 0.72))}px rgba(${color.r}, ${color.g}, ${color.b}, ${liftLow});
  }
  34% {
    transform: translateY(-1px);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${outlineHigh}),
      0 0 ${Math.round(spreadOne * 1.15)}px rgba(${color.r}, ${color.g}, ${color.b}, ${highA}),
      0 0 ${Math.round(spreadTwo * 1.12)}px rgba(${color.r}, ${color.g}, ${color.b}, ${midA}),
      0 10px ${Math.round(liftShadow * 1.05)}px rgba(${color.r}, ${color.g}, ${color.b}, ${liftHigh});
  }
  68% {
    transform: translateY(-1px);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${outlineMid}),
      0 0 ${spreadOne}px rgba(${color.r}, ${color.g}, ${color.b}, ${midA}),
      0 0 ${spreadTwo}px rgba(${color.r}, ${color.g}, ${color.b}, ${lowA}),
      0 8px ${Math.round(liftShadow * 0.88)}px rgba(${color.r}, ${color.g}, ${color.b}, ${liftMid});
  }
  100% {
    transform: translateY(0);
    box-shadow:
      0 0 0 1px rgba(${color.r}, ${color.g}, ${color.b}, ${outlineLow}),
      0 0 ${Math.max(8, Math.round(spreadOne * 0.65))}px rgba(${color.r}, ${color.g}, ${color.b}, ${lowA}),
      0 0 ${Math.max(18, Math.round(spreadTwo * 0.7))}px rgba(${color.r}, ${color.g}, ${color.b}, ${formatAlpha(opacity * 0.12)}),
      0 6px ${Math.max(12, Math.round(liftShadow * 0.72))}px rgba(${color.r}, ${color.g}, ${color.b}, ${liftLow});
  }
}

@media (prefers-reduced-motion: reduce) {
  .${prefix} {
    animation: none !important;
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
