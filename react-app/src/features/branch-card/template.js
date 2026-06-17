import { escapeAttribute, escapeHtml, escapeMultilineTextToHtml, escapeSingleQuotedJsString } from '../../utils/escape.js';

const CLOSE_VISIBLE_HINTS_SCRIPT = "document.querySelectorAll('.stands-hint-content').forEach(hint=>{if(window.getComputedStyle(hint).display!=='none'){const closeBtn=hint.querySelector('.stands-hint-close');if(closeBtn)closeBtn.click();}});";

function normalizePx(value, fallback) {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    return fallback;
  }

  if (/^\d+(\.\d+)?px$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}px`;
  }

  return fallback;
}

function buildDescriptionBlock(prefix, description) {
  const trimmed = String(description || '').trim();

  if (!trimmed) {
    return '';
  }

  return `  <p class="${prefix}__lead">${escapeMultilineTextToHtml(trimmed)}</p>\n`;
}

function buildItem(prefix, item, index) {
  const title = escapeHtml(item.title || `選択肢 ${index + 1}`);
  const description = String(item.description || '').trim();
  const popupId = escapeSingleQuotedJsString(String(item.popupId || '').trim());
  const bodyBlock = description
    ? `      <div class="${prefix}__item-body">${escapeMultilineTextToHtml(description)}</div>\n`
    : '';

  return `    <button type="button" class="${prefix}__item" onclick="STANDSMotion.changeGoal('${popupId}');${CLOSE_VISIBLE_HINTS_SCRIPT}">
      <div class="${prefix}__item-title">${title}</div>
${bodyBlock}    </button>`;
}

export function buildBranchCardHtml(state, blockId) {
  const prefix = `onb-branch-card-${blockId}`;
  const items = Array.isArray(state.items) ? state.items : [];
  const heading = escapeHtml(state.heading || '');
  const descriptionBlock = buildDescriptionBlock(prefix, state.description);
  const itemBlocks = items.map((item, index) => buildItem(prefix, item, index)).join('\n');
  const fontFamily = state.fontFamily || "'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif";
  const headingFontSize = normalizePx(state.headingFontSize, '20px');
  const descriptionFontSize = normalizePx(state.descriptionFontSize, '14px');
  const itemTitleFontSize = normalizePx(state.itemTitleFontSize, '16px');
  const itemBodyFontSize = normalizePx(state.itemBodyFontSize, '13px');

  return `<div class="${prefix}">
  <div class="${prefix}__header">
    <p class="${prefix}__heading">${heading}</p>
${descriptionBlock}  </div>
  <div class="${prefix}__list">
${itemBlocks}
  </div>
</div>
<style>
  .${prefix} {
    margin: 8px 0 0;
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  }
  .${prefix}__header {
    margin-bottom: 16px;
  }
  .${prefix}__heading {
    margin: 0 0 6px;
    color: ${escapeAttribute(state.titleColor || '#0f172a')};
    font-size: ${escapeAttribute(headingFontSize)};
    font-weight: 700;
    line-height: 1.5;
    font-family: ${escapeAttribute(fontFamily)};
  }
  .${prefix}__lead {
    margin: 0;
    color: ${escapeAttribute(state.descriptionColor || '#475569')};
    font-size: ${escapeAttribute(descriptionFontSize)};
    line-height: 1.7;
    font-family: ${escapeAttribute(fontFamily)};
  }
  .${prefix}__list {
    display: grid;
    gap: 12px;
  }
  .${prefix}__item {
    width: 100%;
    box-sizing: border-box;
    padding: 16px 18px;
    border: 1px solid ${escapeAttribute(state.borderColor || '#cbd5e1')};
    border-radius: ${escapeAttribute(state.radius || '14px')};
    background: ${escapeAttribute(state.backgroundColor || '#f8fafc')};
    text-align: left;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
  }
  .${prefix}__item:hover {
    transform: translateY(-2px);
    border-color: ${escapeAttribute(state.hoverBorderColor || '#94a3b8')};
    background: ${escapeAttribute(state.hoverBackgroundColor || '#ffffff')};
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  }
  .${prefix}__item:focus-visible {
    outline: none;
    border-color: ${escapeAttribute(state.hoverBorderColor || '#94a3b8')};
    background: ${escapeAttribute(state.hoverBackgroundColor || '#ffffff')};
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
  }
  .${prefix}__item-title {
    color: ${escapeAttribute(state.titleColor || '#0f172a')};
    font-size: ${escapeAttribute(itemTitleFontSize)};
    font-weight: 700;
    line-height: 1.5;
    font-family: ${escapeAttribute(fontFamily)};
  }
  .${prefix}__item-body {
    margin-top: 4px;
    color: ${escapeAttribute(state.itemBodyColor || '#64748b')};
    font-size: ${escapeAttribute(itemBodyFontSize)};
    line-height: 1.6;
    font-family: ${escapeAttribute(fontFamily)};
  }
</style>`;
}
