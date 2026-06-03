import { escapeHtml, escapeMultilineTextToHtml } from '../../utils/escape.js';

function getInformationIconConfig(type) {
  if (type === 'info') {
    return { shape: 'circle', label: 'i' };
  }
  if (type === 'forbidden') {
    return { shape: 'plain', label: '❌' };
  }
  return { shape: 'triangle', label: '!' };
}

export function buildInformationHtml(state, blockId) {
  const prefix = `onb-notice-project-${blockId}`;
  const iconConfig = getInformationIconConfig(state.type);
  const iconBlock = state.showIcon
    ? `  <div class="${prefix}__icon ${prefix}__icon--${iconConfig.shape}" aria-hidden="true"><span class="${prefix}__icon-label">${escapeHtml(iconConfig.label)}</span></div>\n`
    : '';

  return `<div class="${prefix}">
${iconBlock}  <div class="${prefix}__content">
    <p class="${prefix}__title">${escapeHtml(state.title)}</p>
    <p class="${prefix}__body">${escapeMultilineTextToHtml(state.body)}</p>
  </div>
</div>
<style>
  .${prefix} {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
    margin: 16px 0;
    padding: 14px 16px;
    border: 1px solid ${state.borderColor};
    border-radius: ${state.radius};
    background-color: ${state.bgColor};
  }
  .${prefix}__icon {
    position: relative;
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }
  .${prefix}__icon--plain {
    width: auto;
    height: auto;
    flex: 0 0 auto;
    display: inline-block;
    font-size: 18px;
    line-height: 1;
  }
  .${prefix}__icon--circle {
    border-radius: 999px;
    background-color: ${state.borderColor};
  }
  .${prefix}__icon--triangle {
    background-color: ${state.borderColor};
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
  .${prefix}__icon-label {
    position: relative;
    z-index: 1;
  }
  .${prefix}__icon--plain .${prefix}__icon-label {
    position: static;
  }
  .${prefix}__icon--triangle .${prefix}__icon-label {
    top: 3px;
  }
  .${prefix}__content {
    min-width: 0;
    flex: 1;
  }
  .${prefix}__title {
    margin: 0 0 6px;
    color: ${state.titleColor};
    font-size: ${state.titleFontSize};
    font-weight: 700;
    line-height: 1.5;
  }
  .${prefix}__body {
    margin: 0;
    color: ${state.bodyColor};
    font-size: ${state.bodyFontSize};
    line-height: 1.7;
  }
</style>`;
}

