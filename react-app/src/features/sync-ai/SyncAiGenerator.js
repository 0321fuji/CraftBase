import { html, useMemo, useState } from '../../lib/react.js';
import { CodeOutputPanel } from '../../components/ui/CodeOutputPanel.js';
import { SectionCard } from '../../components/ui/SectionCard.js';
import { copyText } from '../../utils/clipboard.js';
import { SYNC_AI_DEFAULTS } from './defaults.js';
import { buildSyncAiHtml } from './template.js';

function cloneDefaults() {
  return { ...SYNC_AI_DEFAULTS };
}

export function useSyncAiGenerator() {
  const [form, setForm] = useState(cloneDefaults);
  const [copied, setCopied] = useState(false);
  const outputHtml = useMemo(() => buildSyncAiHtml(form), [form]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetAll() {
    setForm(cloneDefaults());
  }

  async function handleCopy() {
    await copyText(outputHtml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return {
    controls: html`
      <${SectionCard}
        title="基本フォーム"
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
        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm font-bold text-slate-700">
            <span>① 事前プロンプト</span>
            <span className="text-xs font-normal text-slate-400">画面には表示されず、AIへの指示として埋め込まれます</span>
          </label>
          <textarea
            rows="10"
            value=${form.systemPrompt}
            onChange=${(event) => updateField('systemPrompt', event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="ここにSync-AIへ渡したい事前プロンプトを入力"
          />
          <p className="text-xs leading-5 text-slate-500">改行を保ったままコードへ反映します。長めの指示でもこの画面で編集しやすくしています。</p>
        </div>

        <div className="grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
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
      </${SectionCard}>
    `,
    preview: null,
    code: html`
      <div className="space-y-3">
        <${CodeOutputPanel} value=${outputHtml} onCopy=${handleCopy} />
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
          事前プロンプトは <code>onb-ai-system-prompt</code> に入り、画面上には出ません。見た目で変わるのは入力欄の案内文と送信ボタン名です。
        </div>
        ${copied ? html`<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">HTMLコードをコピーしました。</div>` : null}
      </div>
    `,
    layoutMode: 'balanced'
  };
}
