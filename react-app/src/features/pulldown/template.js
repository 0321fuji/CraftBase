import { escapeHtml, escapeMultilineTextToHtml } from '../../utils/escape.js';
import { normalizeFontSize } from '../../utils/size.js';

function buildPanelContent(prefix, item) {
  const bodyBlock = item.body ? `      <p class="${prefix}__text">${escapeMultilineTextToHtml(item.body)}</p>\n` : '';


  return `${bodyBlock}`;
}

export function buildPulldownHtml(state, blockId) {
  const prefix = `onb-pulldown-${blockId}`;
  const radioName = `${prefix}-group`;
  const items = state.items || [];
  const bodyFontSize = normalizeFontSize(state.bodyFontSize, '12px');

  const radios = items
    .map((item, index) => `  <input type="radio" id="${prefix}-opt${index + 1}" name="${radioName}" class="${prefix}__radio" ${index === 0 ? 'checked' : ''}>`)
    .join('\n');

  const optionButtons = items
    .map(
      (item, index) => `      <button type="button" class="${prefix}__option ${prefix}__option--${index + 1}" onclick="document.getElementById('${prefix}-opt${index + 1}').checked = true; this.closest('details')?.removeAttribute('open');">${escapeHtml(item.optionLabel || `項目 ${index + 1}`)}</button>`
    )
    .join('\n');

  const currentLabels = items
    .map(
      (item, index) => `      <span class="${prefix}__current ${prefix}__current--${index + 1}">${escapeHtml(item.optionLabel || `項目 ${index + 1}`)}</span>`
    )
    .join('\n');

  const panels = items
    .map(
      (item, index) => `    <div class="${prefix}__panel ${prefix}__panel--${index + 1}">\n${buildPanelContent(prefix, item)}    </div>`
    )
    .join('\n');

  const activeRules = items
    .map(
      (_, index) => `  #${prefix}-opt${index + 1}:checked ~ .${prefix}__wrap .${prefix}__panel--${index + 1} {
    display: block;
  }
  #${prefix}-opt${index + 1}:checked ~ .${prefix}__wrap .${prefix}__current--${index + 1} {
    display: inline;
  }
  #${prefix}-opt${index + 1}:checked ~ .${prefix}__wrap .${prefix}__option--${index + 1} {
    background: ${state.panelBgColor};
    color: #1f2937;
    font-weight: 700;
  }`
    )
    .join('\n');

  return `<div class="${prefix}">
${radios}
  <div class="${prefix}__wrap">
    <details class="${prefix}__details">
      <summary class="${prefix}__summary">
${currentLabels}
        <span class="${prefix}__arrow">▾</span>
      </summary>
      <div class="${prefix}__options">
${optionButtons}
      </div>
    </details>
${panels}
  </div>
</div>
<style>
  .${prefix} {
    width: 100%;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  }
  .${prefix}__radio {
    display: none !important;
  }
  .${prefix}__wrap {
    width: 100%;
    max-width: ${state.width};
  }
  .${prefix}__details {
    width: 100%;
    border: 1px solid ${state.selectorBorderColor};
    border-radius: ${state.radius};
    background: #ffffff;
    box-sizing: border-box;
    overflow: hidden;
  }
  .${prefix}__summary {
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
    cursor: pointer;
    padding: 12px 14px;
    color: #1f2937;
    font-size: 13px;
    font-weight: 600;
  }
  .${prefix}__summary::-webkit-details-marker {
    display: none;
  }
  .${prefix}__current {
    display: none;
    min-width: 0;
    flex: 1 1 auto;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .${prefix}__arrow {
    margin-left: auto;
    color: #64748b;
    transition: transform 0.2s ease;
  }
  .${prefix}__details[open] .${prefix}__arrow {
    transform: rotate(180deg);
  }
  .${prefix}__options {
    display: flex;
    flex-direction: column;
    border-top: 1px solid ${state.selectorBorderColor};
  }
  .${prefix}__option {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: none;
    background: transparent;
    text-align: left;
    padding: 11px 14px;
    color: #1f2937;
    font-size: 13px;
    line-height: 1.4;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .${prefix}__option:hover {
    background: #f8fafc;
  }
  .${prefix}__panel {
    display: none;
    margin-top: 12px;
    padding: 16px;
    border: 1px solid ${state.selectorBorderColor};
    border-radius: ${state.radius};
    background: ${state.panelBgColor};
    box-sizing: border-box;
  }
  .${prefix}__text {
    margin: 0 0 14px;
    color: ${state.bodyColor};
    font-size: ${bodyFontSize};
    line-height: 1.7;
  }
${activeRules}
</style>`;
}
