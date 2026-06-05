import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { PULLDOWN_DEFAULTS } from './defaults.js';
import { buildPulldownHtml } from './template.js';

function cloneDefaults() {
  return {
    ...PULLDOWN_DEFAULTS,
    items: PULLDOWN_DEFAULTS.items.map((item) => ({ ...item }))
  };
}

function updateItemAt(items, index, patch) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

function createAdditionalItem(index) {
  return {
    optionLabel: `選択肢${index + 1}`,
    body: 'この選択肢に応じた案内文をここに入れます。必要な操作や注意点を簡潔にまとめられます。',
  };
}

export function usePulldownGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildPulldownHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateItem(index, patch) {
    setForm((current) => ({ ...current, items: updateItemAt(current.items, index, patch) }));
  }

  function addItem() {
    setForm((current) => {
      if (current.items.length >= 4) return current;
      return { ...current, items: [...current.items, createAdditionalItem(current.items.length)] };
    });
    setOpenIndexes((current) => [...current, form.items.length]);
  }

  function removeItem(index) {
    setForm((current) => {
      if (current.items.length <= 2) return current;
      return { ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) };
    });
    setOpenIndexes((current) => current.filter((itemIndex) => itemIndex !== index).map((itemIndex) => (itemIndex > index ? itemIndex - 1 : itemIndex)));
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
        title="プルダウン設定"
        action=${html`<button type="button" onClick=${resetAll} className="text-xs text-slate-500 transition-colors hover:text-indigo-600">初期化</button>`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-700">選択肢</label>
            ${form.items.length < 4
              ? html`<button type="button" onClick=${addItem} className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100">選択肢を追加</button>`
              : html`<span className="text-xs font-medium text-slate-400">最大4つ</span>`}
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
                    <span className="truncate pr-3">${item.optionLabel || `選択肢${index + 1}`}</span>
                    <span className="text-xs text-slate-400">開閉</span>
                  </summary>
                  <div className="space-y-3 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">選択肢 ${index + 1}</span>
                      ${form.items.length > 2
                        ? html`<button type="button" onClick=${() => removeItem(index)} className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700">削除</button>`
                        : null}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">プルダウン文言</label>
                      <input type="text" value=${item.optionLabel} onChange=${(event) => updateItem(index, { optionLabel: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">本文</label>
                      <textarea rows="3" value=${item.body || ''} onChange=${(event) => updateItem(index, { body: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm" />
                    </div>
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">表示幅</label>
              <select value=${form.width} onChange=${(event) => updateField('width', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="100%">100%</option>
                <option value="320px">320px</option>
                <option value="360px">360px</option>
                <option value="420px">420px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">角丸</label>
              <select value=${form.radius} onChange=${(event) => updateField('radius', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="8px">8px</option>
                <option value="12px">12px</option>
                <option value="16px">16px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">内容背景色</label>
              <input type="color" value=${form.panelBgColor} onChange=${(event) => updateField('panelBgColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">本文色</label>
              <input type="color" value=${form.bodyColor} onChange=${(event) => updateField('bodyColor', event.target.value)} className="mt-1 h-9 w-full rounded border border-slate-300" />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">本文文字サイズ</label>
              <select value=${form.bodyFontSize} onChange=${(event) => updateField('bodyFontSize', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs">
                <option value="11px">11px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
              </select>
            </div>
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
