import { escapeAttribute, escapeHtml } from '../../utils/escape.js';

function sanitizeToken(value, fallback = 'variable') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || fallback;
}

function buildPreviewText(state) {
  const previewValue = String(state.previewValue || '').trim();
  const prefixText = String(state.prefixText || '');
  const suffixText = String(state.suffixText || '');
  const useSuffix = Boolean(state.useSuffix);
  const fallbackText = String(state.fallbackText || '').trim();

  if (previewValue) {
    return `${prefixText}${previewValue}${useSuffix ? suffixText : ''}`;
  }

  return `${prefixText}${fallbackText}`;
}

function buildInitialText(state) {
  const prefixText = String(state.prefixText || '');
  const fallbackText = String(state.fallbackText || '').trim();

  return `${prefixText}${fallbackText}`;
}

export function buildVariableInsertHtml(state, blockId) {
  const prefix = `onb-variable-${sanitizeToken(blockId, 'block')}`;
  const variableKey = String(state.variableKey || '').trim();
  const initialText = buildInitialText(state);

  return `
<div class="${prefix}" data-onb-variable-key="${escapeAttribute(variableKey)}" data-onb-variable-prefix="${escapeAttribute(state.prefixText || '')}" data-onb-variable-suffix="${escapeAttribute(state.suffixText || '')}" data-onb-variable-use-suffix="${state.useSuffix ? '1' : '0'}" data-onb-variable-fallback="${escapeAttribute(state.fallbackText || '')}">
  <span class="${prefix}__text">${escapeHtml(initialText)}</span>
</div>

<style>
  .${prefix} {
    padding-top: ${state.paddingTop};
    padding-bottom: ${state.paddingBottom};
    text-align: ${state.alignment};
  }

  .${prefix}__text {
    display: inline-block;
    font-size: ${state.fontSize};
    font-weight: ${state.fontWeight};
    color: ${state.textColor};
    font-family: ${state.fontFamily};
    line-height: ${state.lineHeight};
    letter-spacing: ${state.letterSpacing};
    background: ${state.useLabelBackground ? state.labelBackgroundColor : 'transparent'};
    border-radius: ${state.useLabelBackground ? state.labelBorderRadius : '0px'};
    padding: ${state.useLabelBackground ? `${state.labelPaddingY} ${state.labelPaddingX}` : '0'};
  }
</style>

<script>
  (() => {
    const root = document.querySelector('.${prefix}');
    if (!root) return;

    const text = root.querySelector('.${prefix}__text');
    if (!text) return;

    const variableKeyValue = root.getAttribute('data-onb-variable-key') || '';
    const prefixTextValue = root.getAttribute('data-onb-variable-prefix') || '';
    const suffixTextValue = root.getAttribute('data-onb-variable-suffix') || '';
    const useSuffixValue = root.getAttribute('data-onb-variable-use-suffix') === '1';
    const fallbackTextValue = root.getAttribute('data-onb-variable-fallback') || '';
    let resolvedValue = '';

    if (
      variableKeyValue &&
      window.ONB &&
      window.ONB._queryparam &&
      typeof window.ONB._queryparam[variableKeyValue] !== 'undefined' &&
      window.ONB._queryparam[variableKeyValue] !== null
    ) {
      resolvedValue = String(window.ONB._queryparam[variableKeyValue]).trim();
    }

    if (!resolvedValue) {
      const script = document.querySelector('#stands_onbd_point');

      if (script && script.src) {
        try {
          const url = new URL(script.src);
          resolvedValue = String(url.searchParams.get(variableKeyValue) || '').trim();
        } catch (error) {
          resolvedValue = '';
        }
      }
    }

    text.textContent = resolvedValue
      ? prefixTextValue + resolvedValue + (useSuffixValue ? suffixTextValue : '')
      : prefixTextValue + fallbackTextValue;
  })();
</script>`.trim();
}
