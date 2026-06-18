import { escapeHtml } from '../../utils/escape.js';
import { normalizeFontSize } from '../../utils/size.js';

export function buildCompareHtml(state, blockId) {
  const prefix = `onb-compare-project-${blockId}`;
  const header = escapeHtml(state.headerLabel || '比較項目');
  const colA = escapeHtml(state.colALabel || '項目A');
  const colB = escapeHtml(state.colBLabel || '項目B');
  const baseHeaderFontSize = normalizeFontSize(state.baseHeaderFontSize, '16px');
  const colAHeaderFontSize = normalizeFontSize(state.colAHeaderFontSize, '16px');
  const colBHeaderFontSize = normalizeFontSize(state.colBHeaderFontSize, '16px');
  const bodyRows = state.rows
    .map((row) => {
      const labelFontSize = normalizeFontSize(row.labelFontSize, '16px');
      const aFontSize = normalizeFontSize(row.aFontSize, '16px');
      const bFontSize = normalizeFontSize(row.bFontSize, '16px');
      return `    <tr>
      <td class="${prefix}__cell ${prefix}__cell--label" style="font-size: ${labelFontSize}; color: ${row.labelTextColor}; background-color: ${row.labelBgColor};">${escapeHtml(row.label)}</td>
      <td class="${prefix}__cell" style="font-size: ${aFontSize}; color: ${row.aTextColor}; background-color: ${row.aBgColor};">${escapeHtml(row.a)}</td>
      <td class="${prefix}__cell" style="font-size: ${bFontSize}; color: ${row.bTextColor}; background-color: ${row.bBgColor};">${escapeHtml(row.b)}</td>
    </tr>`;
    })
    .join('\n');

  return `<div class="${prefix}__wrap">
  <table class="${prefix}">
    <colgroup>
      <col class="${prefix}__col ${prefix}__col--label" />
      <col class="${prefix}__col ${prefix}__col--a" />
      <col class="${prefix}__col ${prefix}__col--b" />
    </colgroup>
    <thead>
      <tr>
        <th class="${prefix}__head ${prefix}__head--base">${header}</th>
        <th class="${prefix}__head ${prefix}__head--a">${colA}</th>
        <th class="${prefix}__head ${prefix}__head--b">${colB}</th>
      </tr>
    </thead>
    <tbody>
${bodyRows}
    </tbody>
  </table>
</div>
<style>
  .${prefix}__wrap {
    width: 100%;
    overflow-x: hidden;
  }
  .${prefix} {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 14px;
  }
  .${prefix}__col--label {
    width: 36%;
  }
  .${prefix}__col--a,
  .${prefix}__col--b {
    width: 32%;
  }
  .${prefix}__head,
  .${prefix}__cell {
    border: 1px solid #e2e8f0;
    padding: 12px 12px;
    text-align: left;
    line-height: 1.5;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
  .${prefix}__head {
    font-weight: 700;
  }
  .${prefix}__head--base {
    font-size: ${baseHeaderFontSize};
    background-color: ${state.baseHeaderBgColor};
    color: ${state.baseHeaderTextColor};
  }
  .${prefix}__head--a {
    font-size: ${colAHeaderFontSize};
    background-color: ${state.colABgColor};
    color: ${state.colATextColor};
  }
  .${prefix}__head--b {
    font-size: ${colBHeaderFontSize};
    background-color: ${state.colBBgColor};
    color: ${state.colBTextColor};
  }
  .${prefix}__cell {
    color: #334155;
  }
  .${prefix}__cell--label {
    font-weight: 600;
  }
</style>`;
}
