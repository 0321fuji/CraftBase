import { escapeAttribute, escapeHtml, escapeMultilineTextToHtml } from '../../utils/escape.js';

export function extractYoutubeId(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  try {
    const parsed = new URL(raw);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] || '';
    }
    if (parsed.pathname.includes('/embed/')) {
      return parsed.pathname.split('/embed/')[1]?.split('/')[0] || '';
    }
    if (parsed.pathname.includes('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] || '';
    }
    return parsed.searchParams.get('v') || '';
  } catch (error) {
    return raw;
  }
}

export function buildYoutubeEmbedUrl(value) {
  const id = extractYoutubeId(value);
  return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0` : '';
}

export function buildVideoGuideHtml(state, blockId) {
  const prefix = `onb-yt-guide-${blockId}`;
  const embedUrl = buildYoutubeEmbedUrl(state.youtubeUrl);
  const format = state.format || 'button-bottom';
  const titleBlock = state.showTitle ? `    <h3 class="${prefix}__title">${escapeHtml(state.title)}</h3>\n` : '';
  const bodyBlock = state.showBody ? `    <p class="${prefix}__text">${escapeMultilineTextToHtml(state.body)}</p>\n` : '';
  const actionBlock = state.showActionButton
    ? `    <a class="${prefix}__button" href="${escapeAttribute(state.actionUrl || '#')}" target="_blank" rel="noopener noreferrer">${escapeHtml(state.actionButtonText)}</a>\n`
    : '';
  const mediaBlock = `    <div class="${prefix}__video-wrapper">
      <iframe
        class="${prefix}__iframe"
        src="${escapeAttribute(embedUrl)}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    </div>\n`;

  const contentBlock = `${titleBlock}${bodyBlock}`;
  const innerBlock = format === 'button-side'
    ? `    <div class="${prefix}__top ${prefix}__top--side">
${mediaBlock}      <div class="${prefix}__side-content">
${contentBlock}${actionBlock}      </div>
    </div>
`
    : `${mediaBlock}${titleBlock}${bodyBlock}${actionBlock}`;

  return `<div class="${prefix}__container">
  <div class="${prefix}__card">
${innerBlock}  </div>
</div>
<style>
  .${prefix}__container {
    width: 100%;
    box-sizing: border-box;
    font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
  }
  .${prefix}__card {
    width: 100%;
    max-width: ${state.cardWidth};
    box-sizing: border-box;
    color: ${state.bodyColor};
    padding: ${state.cardPadding};
    border-radius: ${state.cardRadius};
    text-align: left;
  }
  .${prefix}__top--side {
    display: flex;
    align-items: stretch;
    gap: 12px;
  }
  .${prefix}__video-wrapper {
    width: 100%;
    flex: 1 1 auto;
    min-width: 0;
    aspect-ratio: 16 / 9;
    border-radius: ${state.videoRadius};
    overflow: hidden;
    background: #000000;
    margin-bottom: 14px;
  }
  .${prefix}__top--side .${prefix}__video-wrapper {
    margin-bottom: 0;
  }
  .${prefix}__side-content {
    width: 46%;
    flex: 0 0 46%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
  }
  .${prefix}__iframe {
    width: 100% !important;
    height: 100% !important;
    border: none !important;
    display: block;
  }
  .${prefix}__title {
    margin: 0 0 6px;
    color: ${state.titleColor};
    font-size: ${state.titleFontSize};
    font-weight: 700;
    line-height: 1.5;
  }
  .${prefix}__text {
    margin: 0 0 14px;
    color: ${state.bodyColor};
    font-size: ${state.bodyFontSize};
    line-height: 1.6;
  }
  .${prefix}__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    background: ${state.buttonBgColor} !important;
    color: ${state.buttonTextColor} !important;
    border: 1px solid transparent;
    padding: 8px 10px;
    border-radius: 6px;
    font-family: inherit;
    font-weight: 700;
    font-size: 12px;
    line-height: 1.4;
    cursor: pointer;
    text-align: center;
    text-decoration: none !important;
    transition: background-color 0.2s, color 0.2s;
  }
  .${prefix}__content .${prefix}__title:last-child,
  .${prefix}__content .${prefix}__text:last-child,
  .${prefix}__content:empty {
    margin-bottom: 0;
  }
  .${prefix}__card > .${prefix}__button,
  .${prefix}__card > .${prefix}__text + .${prefix}__button,
  .${prefix}__card > .${prefix}__title + .${prefix}__button,
  .${prefix}__card > .${prefix}__text + .${prefix}__button {
    margin-top: 6px;
  }
  .${prefix}__side-content .${prefix}__title {
    margin-top: 0;
  }
  .${prefix}__side-content .${prefix}__text:last-of-type {
    margin-bottom: 0;
  }
  .${prefix}__side-content .${prefix}__button {
    margin-top: 14px;
  }
  .${prefix}__button:hover {
    filter: brightness(0.97);
  }
  @media (max-width: 520px) {
    .${prefix}__top--side {
      flex-direction: column;
    }
    .${prefix}__side-content {
      width: 100%;
      flex: 0 0 auto;
    }
  }
</style>`;
}
