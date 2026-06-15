import { html, useState } from '../../lib/react.js';
import { copyText } from '../../utils/clipboard.js';

export const SNIPPET_ITEMS = [
  {
    id: 'hide-next-btn',
    title: '「次へ」「終了」ボタンを非表示にする',
    description: 'ステップ・イントロのナビゲーションボタンを非表示にする',
    warning: 'ステップ・イントロが対象です。ヒントには効きません。',
    code: `<style>
  .gBtn.g-modal-next, .gBtn-manage.g-modal-next-manage {
    display: none;
  }
</style>`
  },
  {
    id: 'hide-close-btn',
    title: '✕ボタンを非表示にする',
    description: 'ステップ・イントロの閉じるボタンを非表示にする',
    warning: 'ステップ・イントロが対象です。ヒントには効きません。',
    code: `<style>
  .g-modal-close, .g-modal-close-manage {
    display: none !important;
  }
</style>`
  }
];

function SnippetCard({ snippet, copied, onCopy }) {
  return html`
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-900">${snippet.title}</h3>
        <p className="text-sm leading-6 text-slate-500">${snippet.description}</p>
      </div>

      <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-slate-700">
          <span>コードを表示</span>
          <span className="text-xs font-medium text-slate-400">開閉</span>
        </summary>
        <div className="border-t border-slate-200 p-4">
          <pre className="code-scrollbar overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">
            <code className="font-mono">${snippet.code}</code>
          </pre>
        </div>
      </details>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-h-[2.5rem]">
          ${snippet.warning
            ? html`
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                  <span aria-hidden="true" className="text-sm leading-5">⚠️</span>
                  <span>${snippet.warning}</span>
                </div>
              `
            : null}
        </div>
        <button
          type="button"
          onClick=${onCopy}
          className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
        >
          ${copied ? 'コピーしました！' : 'コピー'}
        </button>
      </div>
    </section>
  `;
}

export function SnippetSection() {
  const [copiedStates, setCopiedStates] = useState({});

  function handleCopy(snippetId, code) {
    return async () => {
      await copyText(code);
      setCopiedStates((current) => ({ ...current, [snippetId]: true }));
      window.setTimeout(() => {
        setCopiedStates((current) => ({ ...current, [snippetId]: false }));
      }, 1500);
    };
  }

  return html`
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      ${SNIPPET_ITEMS.map((snippet) => html`
        <${SnippetCard}
          key=${snippet.id}
          snippet=${snippet}
          copied=${Boolean(copiedStates[snippet.id])}
          onCopy=${handleCopy(snippet.id, snippet.code)}
        />
      `)}
    </div>
  `;
}
