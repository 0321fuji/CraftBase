import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { FontSizeField } from '../../components/ui/FontSizeField.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { CHECKLIST_DEFAULTS } from './defaults.js';
import { buildChecklistHtml } from './template.js';

function cloneDefaults() {
  return {
    ...CHECKLIST_DEFAULTS,
    items: CHECKLIST_DEFAULTS.items.map((item) => ({ ...item }))
  };
}

function updateItemAt(items, index, patch) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

export function useChecklistGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildChecklistHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateItem(index, patch) {
    setForm((current) => ({ ...current, items: updateItemAt(current.items, index, patch) }));
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [...current.items, { text: '新しいチェック項目', checked: false }]
    }));
    setOpenIndexes([form.items.length]);
  }

  function removeItem(index) {
    setForm((current) => {
      if (current.items.length <= 1) return current;
      return { ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) };
    });
    setOpenIndexes([0]);
  }

  function resetAll() {
    setForm(cloneDefaults());
    setOpenIndexes([0]);
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return {
    controls: html`
      <${SectionCard}
        title="チェックリスト"
        action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-700">チェック項目</label>
            <button type="button" onClick=${addItem} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100">
              項目を追加
            </button>
          </div>
          <div className="space-y-3">
            ${form.items.map(
              (item, index) => html`
                <details
                  key=${index}
                  open=${openIndexes.includes(index)}
                  onToggle=${(event) => {
                    if (event.currentTarget.open) {
                      setOpenIndexes((current) => (current.includes(index) ? current : [...current, index]));
                    } else {
                      setOpenIndexes((current) => current.filter((itemIndex) => itemIndex !== index));
                    }
                  }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
                    <span className="truncate pr-3">${item.text || '項目を入力'}</span>
                    <span className="text-xs text-slate-400">開閉</span>
                  </summary>
                  <div className="space-y-3 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">項目 ${index + 1}</span>
                      <button type="button" onClick=${() => removeItem(index)} disabled=${form.items.length <= 1} className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40">
                        削除
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">テキスト</label>
                      <input type="text" value=${item.text} onChange=${(event) => updateItem(index, { text: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
                    </div>
                    <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input type="checkbox" checked=${item.checked} onChange=${(event) => updateItem(index, { checked: event.target.checked })} className="rounded border-slate-300 text-indigo-600" />
                      初期状態でチェック済みにする
                    </label>
                  </div>
                </details>
              `
            )}
          </div>
        </div>

        <details className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50" open>
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
            <span>デザイン調整</span>
            <span className="text-xs text-slate-400">開閉</span>
          </summary>
          <div className="grid grid-cols-2 gap-3 p-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">テキストカラー</label>
              <input type="color" value=${form.textColor} onChange=${(event) => updateField('textColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">チェック後のテキストカラー</label>
              <input type="color" value=${form.checkedTextColor} onChange=${(event) => updateField('checkedTextColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">チェックアイコン</label>
              <input type="color" value=${form.checkmarkColor} onChange=${(event) => updateField('checkmarkColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">ボックス色</label>
              <input type="color" value=${form.checkColor} onChange=${(event) => updateField('checkColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <${FontSizeField} label="文字サイズ" value=${form.fontSize} onChange=${(value) => updateField('fontSize', value)} inputClassName="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-xs font-mono" />
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">項目間の余白</label>
              <select value=${form.itemGap} onChange=${(event) => updateField('itemGap', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="6px">狭め</option>
                <option value="10px">標準</option>
                <option value="14px">広め</option>
              </select>
            </div>
            <label className="col-span-2 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked=${form.strikeChecked} onChange=${(event) => updateField('strikeChecked', event.target.checked)} className="rounded border-slate-300 text-indigo-600" />
              チェック済みに打ち消し線を入れる
            </label>
          </div>
        </details>
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
