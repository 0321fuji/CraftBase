import { escapeHtml, escapeMultilineTextToHtml } from '../../utils/escape.js';

function sanitizeToken(value, fallback = 'project') {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || fallback;
}

function getProjectTokenFromUrl(urlValue) {
  try {
    const parsed = new URL(urlValue || 'https://example.com');
    const hostname = sanitizeToken(parsed.hostname.replace(/^www\./, ''), 'project');
    const firstSegment = hostname.split('-')[0];
    return firstSegment || 'project';
  } catch (error) {
    return 'project';
  }
}

function getFaqClassPrefix(sourceUrl, blockId) {
  const projectToken = getProjectTokenFromUrl(sourceUrl);
  return `onb-faq-${projectToken}-${blockId}`;
}

export function buildFaqHtml(state, blockId) {
  const faqPrefix = getFaqClassPrefix(state.sourceUrl, blockId);
  const faqBlocks = state.items
    .map((item) => {
      return `<details class="${faqPrefix}">
  <summary>${escapeHtml(item.question)}</summary>
  <div class="${faqPrefix}__panel">
    <p class="${faqPrefix}__content">
      ${escapeMultilineTextToHtml(item.answer)}
    </p>
  </div>
</details>`;
    })
    .join('\n');

  return `${faqBlocks}
<style>
  .${faqPrefix}:not([open]) {
    margin-bottom: 7px;
  }

  .${faqPrefix} summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 0.7em 1.8em 0.7em 0.9em;
    border-radius: ${state.radius};
    background-color: ${state.questionBgColor};
    color: ${state.questionColor};
    font-size: ${state.questionSize};
    font-weight: bold;
    cursor: pointer;
  }

  .${faqPrefix} summary::-webkit-details-marker {
    display: none;
  }

  .${faqPrefix} summary::after {
    content: "+";
    position: absolute;
    right: 0.55em;
    top: 50%;
    transform: translateY(-50%);
    font-size: ${state.iconSize};
    font-weight: 400;
    line-height: 1;
    color: ${state.iconColor};
    transition: transform 0.3s ease;
  }

  .${faqPrefix}[open] summary::after {
    transform: translateY(-50%) rotate(45deg);
  }

  .${faqPrefix}__panel {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s ease;
  }

  .${faqPrefix}[open] .${faqPrefix}__panel {
    max-height: 500px;
  }

  .${faqPrefix}__content {
    transform: translateY(-10px);
    opacity: 0;
    margin: 0 0 0 10px;
    color: ${state.answerColor};
    font-size: ${state.answerSize};
    transition: transform 0.5s, opacity 0.5s;
  }

  .${faqPrefix}[open] .${faqPrefix}__content {
    transform: none;
    opacity: 1;
  }
</style>`;
}
