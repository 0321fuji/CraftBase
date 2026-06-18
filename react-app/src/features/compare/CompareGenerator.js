import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { FontSizeField } from '../../components/ui/FontSizeField.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { COMPARE_DEFAULTS, createCompareRow } from './defaults.js';
import { buildCompareHtml } from './template.js';

function cloneDefaults() {
  return {
    ...COMPARE_DEFAULTS,
    rows: COMPARE_DEFAULTS.rows.map((row) => ({ ...row }))
  };
}

function updateRowAt(rows, index, patch) {
  return rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row));
}

function HeaderColumnEditor({ title, labelValue, labelKey, fontValue, fontKey, textColorValue, textColorKey, bgColorValue, bgColorKey, onChange }) {
  return html`
    <div className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
      <div className="text-xs font-bold text-slate-700">${title}</div>
      <input type="text" value=${labelValue} onChange=${(event) => onChange(labelKey, event.target.value)} className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
      <div className="grid grid-cols-3 gap-2">
        <${FontSizeField}
          label="フォント"
          value=${fontValue}
          onChange=${(value) => onChange(fontKey, value)}
          labelClassName="block text-[11px] text-slate-500"
          inputClassName="mt-1 h-8 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-mono"
        />
        <div>
          <label className="block text-[11px] text-slate-500">文字色</label>
          <input type="color" value=${textColorValue} onChange=${(event) => onChange(textColorKey, event.target.value)} className="mt-1 h-8 w-full rounded border border-slate-300" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500">背景色</label>
          <input type="color" value=${bgColorValue} onChange=${(event) => onChange(bgColorKey, event.target.value)} className="mt-1 h-8 w-full rounded border border-slate-300" />
        </div>
      </div>
    </div>
  `;
}

function RowCellEditor({ title, value, valueKey, fontValue, fontKey, textColorValue, textColorKey, bgColorValue, bgColorKey, placeholder, onChange }) {
  return html`
    <div className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5">
      <div className="text-xs font-bold text-slate-700">${title}</div>
      <input type="text" value=${value} placeholder=${placeholder} onChange=${(event) => onChange({ [valueKey]: event.target.value })} className="w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
      <div className="grid grid-cols-3 gap-2">
        <${FontSizeField}
          label="フォント"
          value=${fontValue}
          onChange=${(value) => onChange({ [fontKey]: value })}
          labelClassName="block text-[11px] text-slate-500"
          inputClassName="mt-1 h-8 w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-mono"
        />
        <div>
          <label className="block text-[11px] text-slate-500">文字色</label>
          <input type="color" value=${textColorValue} onChange=${(event) => onChange({ [textColorKey]: event.target.value })} className="mt-1 h-8 w-full rounded border border-slate-300" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-500">背景色</label>
          <input type="color" value=${bgColorValue} onChange=${(event) => onChange({ [bgColorKey]: event.target.value })} className="mt-1 h-8 w-full rounded border border-slate-300" />
        </div>
      </div>
    </div>
  `;
}

export function useCompareGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openRowIndexes, setOpenRowIndexes] = useState([0]);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildCompareHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateRow(index, patch) {
    setForm((current) => ({ ...current, rows: updateRowAt(current.rows, index, patch) }));
  }

  function addRow() {
    setForm((current) => ({
      ...current,
      rows: [...current.rows, createCompareRow({ label: '比較項目', a: '', b: '' })]
    }));
    setOpenRowIndexes([form.rows.length]);
  }

  function removeRow(index) {
    setForm((current) => {
      if (current.rows.length <= 1) return current;
      return { ...current, rows: current.rows.filter((_, rowIndex) => rowIndex !== index) };
    });
    setOpenRowIndexes([0]);
  }

  function resetAll() {
    setForm(cloneDefaults());
    setOpenRowIndexes([0]);
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return {
    controls: html`
      <${SectionCard}
        title="比較表"
        action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
      >
        <details className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50" open>
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
            <span>見出し設定</span>
            <span className="text-xs text-slate-400">開閉</span>
          </summary>
          <div className="space-y-2 p-3">
            <${HeaderColumnEditor}
              title="比較項目列"
              labelValue=${form.headerLabel}
              labelKey="headerLabel"
              fontValue=${form.baseHeaderFontSize}
              fontKey="baseHeaderFontSize"
              textColorValue=${form.baseHeaderTextColor}
              textColorKey="baseHeaderTextColor"
              bgColorValue=${form.baseHeaderBgColor}
              bgColorKey="baseHeaderBgColor"
              onChange=${updateField}
            />
            <${HeaderColumnEditor}
              title="プランA列"
              labelValue=${form.colALabel}
              labelKey="colALabel"
              fontValue=${form.colAHeaderFontSize}
              fontKey="colAHeaderFontSize"
              textColorValue=${form.colATextColor}
              textColorKey="colATextColor"
              bgColorValue=${form.colABgColor}
              bgColorKey="colABgColor"
              onChange=${updateField}
            />
            <${HeaderColumnEditor}
              title="プランB列"
              labelValue=${form.colBLabel}
              labelKey="colBLabel"
              fontValue=${form.colBHeaderFontSize}
              fontKey="colBHeaderFontSize"
              textColorValue=${form.colBTextColor}
              textColorKey="colBTextColor"
              bgColorValue=${form.colBBgColor}
              bgColorKey="colBBgColor"
              onChange=${updateField}
            />
          </div>
        </details>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-700">行データ</label>
            <button type="button" onClick=${addRow} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100">行を追加</button>
          </div>
          <div className="space-y-3">
            ${form.rows.map(
              (row, index) => html`
                <details
                  key=${index}
                  open=${openRowIndexes.includes(index)}
                  onToggle=${(event) => {
                    if (event.currentTarget.open) {
                      setOpenRowIndexes((current) => (current.includes(index) ? current : [...current, index]));
                    } else {
                      setOpenRowIndexes((current) => current.filter((rowIndex) => rowIndex !== index));
                    }
                  }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
                    <span className="truncate pr-3">${row.label || '比較項目を入力'}</span>
                    <span className="text-xs text-slate-400">開閉</span>
                  </summary>
                  <div className="space-y-3 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">行 ${index + 1}</span>
                      <button type="button" onClick=${() => removeRow(index)} disabled=${form.rows.length <= 1} className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40">削除</button>
                    </div>
                    <${RowCellEditor}
                      title="比較項目セル"
                      value=${row.label}
                      valueKey="label"
                      fontValue=${row.labelFontSize}
                      fontKey="labelFontSize"
                      textColorValue=${row.labelTextColor}
                      textColorKey="labelTextColor"
                      bgColorValue=${row.labelBgColor}
                      bgColorKey="labelBgColor"
                      placeholder="比較項目"
                      onChange=${(patch) => updateRow(index, patch)}
                    />
                    <${RowCellEditor}
                      title=${`${form.colALabel || 'プランA'}セル`}
                      value=${row.a}
                      valueKey="a"
                      fontValue=${row.aFontSize}
                      fontKey="aFontSize"
                      textColorValue=${row.aTextColor}
                      textColorKey="aTextColor"
                      bgColorValue=${row.aBgColor}
                      bgColorKey="aBgColor"
                      placeholder=${form.colALabel}
                      onChange=${(patch) => updateRow(index, patch)}
                    />
                    <${RowCellEditor}
                      title=${`${form.colBLabel || 'プランB'}セル`}
                      value=${row.b}
                      valueKey="b"
                      fontValue=${row.bFontSize}
                      fontKey="bFontSize"
                      textColorValue=${row.bTextColor}
                      textColorKey="bTextColor"
                      bgColorValue=${row.bBgColor}
                      bgColorKey="bBgColor"
                      placeholder=${form.colBLabel}
                      onChange=${(patch) => updateRow(index, patch)}
                    />
                  </div>
                </details>
              `
            )}
          </div>
        </div>
      </${SectionCard}>
    `,
    preview: html`
      <${PreviewPanel} darkMode=${false}>
        <div className="py-2" dangerouslySetInnerHTML=${{ __html: outputHtml }} />
      </${PreviewPanel}>
    `,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} />
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `
  };
}
