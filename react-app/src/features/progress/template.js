import { escapeHtml } from '../../utils/escape.js';

function getMarginValue(alignment) {
  if (alignment === 'left') return '16px 0';
  if (alignment === 'right') return '16px 0 16px auto';
  return '16px auto';
}

export function buildProgressHtml(state, blockId, stepNumber) {
  const prefix = `onb-progress-project-${blockId}`;
  const total = Math.min(8, Math.max(2, Number(state.totalSteps) || 4));
  const current = Math.min(total, Math.max(1, Number(stepNumber) || 1));
  const progressPercent = `${(current / total) * 100}%`;
  const prefixText = state.labelPrefix.trim();
  const headerBlock = state.showCounter
    ? `  <div class="${prefix}__meta">${prefixText ? `<span class="${prefix}__label">${escapeHtml(prefixText)}</span>` : `<span class="${prefix}__label">${current === total ? 'COMPLETE' : 'PROGRESS'}</span>`}<span class="${prefix}__count">${current} / ${total}</span></div>\n`
    : '';

  return `<!-- PROGRESS BAR STEP ${current}/${total} START -->
<div class="${prefix}">
${headerBlock}  <div class="${prefix}__track" aria-label="進捗 ${current} / ${total}">
    <div class="${prefix}__fill" style="width: ${progressPercent};"></div>
  </div>
</div>
<style>
  .${prefix} {
    width: ${state.width};
    margin: ${getMarginValue(state.alignment)};
    box-sizing: border-box;
  }
  .${prefix}__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 12px;
  }
  .${prefix}__label {
    color: ${state.labelColor};
    font-size: ${state.labelFontSize};
    font-weight: 700;
    letter-spacing: 0.08em;
  }
  .${prefix}__count {
    color: ${state.metaColor};
    font-size: ${state.labelFontSize};
    font-weight: 700;
  }
  .${prefix}__track {
    width: 100%;
    background-color: ${state.inactiveColor};
    border-radius: ${state.radius};
    overflow: hidden;
    height: ${state.barHeight};
  }
  .${prefix}__fill {
    height: 100%;
    background-color: ${state.activeColor};
    border-radius: ${state.radius};
    transition: width 0.2s ease;
  }
</style>
<!-- PROGRESS BAR STEP ${current}/${total} END -->`;
}

export function buildAllProgressHtml(state, blockId) {
  const total = Math.min(8, Math.max(2, Number(state.totalSteps) || 4));
  return Array.from({ length: total }, (_, index) => buildProgressHtml(state, blockId, index + 1));
}

