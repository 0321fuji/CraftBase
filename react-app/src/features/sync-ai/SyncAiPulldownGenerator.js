import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { SYNC_AI_PULLDOWN_DEFAULTS } from './defaults.js';
import { buildSyncAiPulldownHtml } from './template.js';

function cloneDefaults() {
  return {
    ...SYNC_AI_PULLDOWN_DEFAULTS,
    items: SYNC_AI_PULLDOWN_DEFAULTS.items.map((item) => ({ ...item }))
  };
}

function getPromptKey(index) {
  let current = index;
  let key = '';

  do {
    key = String.fromCharCode(97 + (current % 26)) + key;
    current = Math.floor(current / 26) - 1;
  } while (current >= 0);

  return key;
}

function updateItemAt(items, index, patch) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

export function useSyncAiPulldownGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const outputHtml = useMemo(() => buildSyncAiPulldownHtml(form), [form]);

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
          menuLabel: `メニュー${String.fromCharCode(65 + current.items.length)}`,
          prompt: ''
        }
      ]
    }));
    setOpenIndexes((current) => [...current, form.items.length]);
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
        title="プルダウン"
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
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">① ラベル</label>
            <input
              type="text"
              value=${form.dropdownLabel}
              onChange=${(event) => updateField('dropdownLabel', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="例: 相談内容"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">② プレースホルダー</label>
            <input
              type="text"
              value=${form.placeholder}
              onChange=${(event) => updateField('placeholder', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="例: メッセージを入力"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">③ 送信ボタン名</label>
            <input
              type="text"
              value=${form.buttonText}
              onChange=${(event) => updateField('buttonText', event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="例: 送信"
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div>
            <div className="text-sm font-bold text-slate-700">④ 選択肢ごとの設定</div>
          </div>

          <div className="space-y-3">
            ${form.items.map((item, index) => {
              const promptKey = getPromptKey(index);
              return html`
                <details
                  key=${promptKey}
                  open=${openIndexes.includes(index)}
                  onToggle=${(event) => {
                    if (event.currentTarget.open) {
                      setOpenIndexes((current) => (current.includes(index) ? current : [...current, index]));
                    } else {
                      setOpenIndexes((current) => current.filter((itemIndex) => itemIndex !== index));
                    }
                  }}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        key: ${promptKey}
                      </span>
                      <span className="truncate text-sm font-bold text-slate-700">${item.menuLabel || `選択肢 ${index + 1}`}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">開閉</span>
                  </summary>

                  <div className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-slate-700">選択肢 ${index + 1}</span>
                      <button
                        type="button"
                        onClick=${() => removeItem(index)}
                        disabled=${form.items.length <= 1}
                        className="text-[11px] font-bold text-rose-600 transition-colors hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40"
                      >
                        削除
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">プルダウン表示名</label>
                      <input
                        type="text"
                        value=${item.menuLabel}
                        onChange=${(event) => updateItem(index, { menuLabel: event.target.value })}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="例: メニューA"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">対応プロンプト</label>
                      <textarea
                        rows="5"
                        value=${item.prompt}
                        onChange=${(event) => updateItem(index, { prompt: event.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="ここに回答ルールを入力"
                      />
                    </div>
                  </div>
                </details>
              `;
            })}
            <button
              type="button"
              onClick=${addItem}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm font-bold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100"
            >
              <span className="text-lg leading-none">＋</span>
              <span>選択肢を追加</span>
            </button>
          </div>
        </div>
      </${SectionCard}>
    `,
    preview: null,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
          プルダウンの選択肢とプロンプトの紐付けキーは自動生成しています。既存データを編集するときは、回答ルールの本文を消しすぎないよう注意してください。
        </div>
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `,
    layoutMode: 'balanced'
  };
}
