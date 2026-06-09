import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { PreviewPanel } from '../../components/ui/PreviewPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { generateRandomId } from '../../utils/randomId.js';
import { FAQ_DEFAULTS } from './defaults.js';
import { buildFaqHtml } from './template.js';

function cloneDefaults() {
  return {
    ...FAQ_DEFAULTS,
    items: FAQ_DEFAULTS.items.map((item) => ({ ...item }))
  };
}

function updateItemAt(items, index, patch) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

export function useFaqGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openEditorIndexes, setOpenEditorIndexes] = useState([0]);
  const blockId = useMemo(() => generateRandomId(7), [JSON.stringify(form)]);
  const outputHtml = useMemo(() => buildFaqHtml(form, blockId), [form, blockId]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateItem(index, patch) {
    setForm((current) => ({
      ...current,
      items: updateItemAt(current.items, index, patch)
    }));
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          question: `Q${current.items.length + 1}: 質問を記載します。`,
          answer: '回答を記載します。'
        }
      ]
    }));
    setOpenEditorIndexes([form.items.length]);
  }

  function removeItem(index) {
    setForm((current) => {
      if (current.items.length <= 1) {
        return current;
      }
      return {
        ...current,
        items: current.items.filter((_, itemIndex) => itemIndex !== index)
      };
    });
    setOpenEditorIndexes([0]);
  }

  function resetAll() {
    setForm(cloneDefaults());
    setOpenEditorIndexes([0]);
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return {
    controls: html`
      <${SectionCard}
        title="FAQアコーディオン"
        action=${html`
          <button
            type="button"
            onClick=${resetAll}
            className="text-xs text-slate-500 transition-colors hover:text-indigo-600"
          >
            初期化
          </button>
        `}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-700">FAQ項目</label>
            <button
              type="button"
              onClick=${addItem}
              className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
            >
              質問を追加
            </button>
          </div>

          <div className="space-y-3">
            ${form.items.map(
              (item, index) => html`
                <details
                  key=${index}
                  open=${openEditorIndexes.includes(index)}
                  onToggle=${(event) => {
                    if (event.currentTarget.open) {
                      setOpenEditorIndexes((current) => (current.includes(index) ? current : [...current, index]));
                    } else {
                      setOpenEditorIndexes((current) => current.filter((itemIndex) => itemIndex !== index));
                    }
                  }}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700">
                    <span className="truncate pr-3">${item.question || '質問を入力'}</span>
                    <span className="text-xs text-slate-400">開閉</span>
                  </summary>
                  <div className="space-y-2 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">FAQ ${index + 1}</span>
                      <button
                        type="button"
                        onClick=${() => removeItem(index)}
                        disabled=${form.items.length <= 1}
                        className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40"
                      >
                        削除
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">質問</label>
                      <input
                        type="text"
                        value=${item.question}
                        onChange=${(event) => updateItem(index, { question: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">回答</label>
                      <textarea
                        rows="3"
                        value=${item.answer}
                        onChange=${(event) => updateItem(index, { answer: event.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </details>
              `
            )}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <label className="block text-sm font-bold text-slate-700">デザイン調整</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">質問文字色</label>
              <input
                type="color"
                value=${form.questionColor}
                onChange=${(event) => updateField('questionColor', event.target.value)}
                className="mt-1 h-9 w-full rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">質問背景色</label>
              <input
                type="color"
                value=${form.questionBgColor}
                onChange=${(event) => updateField('questionBgColor', event.target.value)}
                className="mt-1 h-9 w-full rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">回答文字色</label>
              <input
                type="color"
                value=${form.answerColor}
                onChange=${(event) => updateField('answerColor', event.target.value)}
                className="mt-1 h-9 w-full rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">アイコン色</label>
              <input
                type="color"
                value=${form.iconColor}
                onChange=${(event) => updateField('iconColor', event.target.value)}
                className="mt-1 h-9 w-full rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">質問文字サイズ</label>
              <select
                value=${form.questionSize}
                onChange=${(event) => updateField('questionSize', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
              >
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">回答文字サイズ</label>
              <select
                value=${form.answerSize}
                onChange=${(event) => updateField('answerSize', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
              >
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">アイコンサイズ</label>
              <select
                value=${form.iconSize}
                onChange=${(event) => updateField('iconSize', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
              >
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">質問背景色の角丸</label>
              <select
                value=${form.radius}
                onChange=${(event) => updateField('radius', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs"
              >
                <option value="4px">4px</option>
                <option value="5px">5px</option>
                <option value="8px">8px</option>
                <option value="12px">12px</option>
              </select>
            </div>
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
        ${copied
          ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>`
          : null}
      </div>
    `
  };
}
