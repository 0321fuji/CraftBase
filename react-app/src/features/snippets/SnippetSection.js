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

const HINT_ID_PREFIX = 'hint_content_';

export function normalizeHintId(value) {
  return value.trim().replace(/^#?hint_content_/, '');
}

export function createHideHintCode(hintId) {
  const normalizedHintId = normalizeHintId(hintId);

  if (!normalizedHintId) {
    return '';
  }

  return `<style>
  #${HINT_ID_PREFIX}${normalizedHintId} {
    display: none !important;
  }
</style>`;
}

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
          <span className="text-xs font-bold text-slate-900">開閉</span>
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

function HideHintSnippetCard({ copied, onCopy }) {
  const [hintId, setHintId] = useState('');
  const normalizedHintId = normalizeHintId(hintId);
  const isEmpty = normalizedHintId === '';
  const isValid = /^[a-zA-Z0-9]{32}$/.test(normalizedHintId);
  const code = isValid ? createHideHintCode(hintId) : '';

  return html`
    <section className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">ヒントの吹き出しを非表示にする</h3>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">コード自動生成</span>
        </div>
        <p className="text-sm leading-6 text-slate-500">対象のヒントIDを入力し、生成されたコードをヒント内のHTMLブロックに貼り付けます。</p>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="hide-hint-id" className="block text-sm font-bold text-slate-700">ヒントID</label>
        <input
          id="hide-hint-id"
          type="text"
          value=${hintId}
          onChange=${(event) => setHintId(event.target.value)}
          placeholder="例：92d63a2a580daa9ec254c2b16e0956ca"
          spellCheck="false"
          autoComplete="off"
          aria-invalid=${!isEmpty && !isValid}
          className=${`w-full rounded-xl border bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:ring-2 ${
            isEmpty || isValid
              ? 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              : 'border-red-300 focus:border-red-500 focus:ring-red-100'
          }`}
        />
        <p className=${`text-xs leading-5 ${isEmpty || isValid ? 'text-slate-500' : 'text-red-600'}`}>
          ${isEmpty
            ? '半角英数字32文字のIDを入力してください。'
            : isValid
              ? '32/32文字：正しい形式です。'
              : `${normalizedHintId.length}/32文字：ヒントIDは半角英数字32文字で入力してください。`}
        </p>
      </div>

      <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-slate-700">
          <span>コードを表示</span>
          <span className="text-xs font-bold text-slate-900">開閉</span>
        </summary>
        <div className="border-t border-slate-200 p-4">
          <pre className="code-scrollbar min-h-[7.5rem] overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-slate-100">
            <code className="font-mono">${code || (isEmpty ? 'ヒントIDを入力するとコードが生成されます。' : '入力内容を確認してください。')}</code>
          </pre>
        </div>
      </details>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick=${() => onCopy(code)}
          disabled=${!code}
          className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
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

  async function handleGeneratedCodeCopy(code) {
    if (!code) {
      return;
    }

    await copyText(code);
    setCopiedStates((current) => ({ ...current, 'hide-hint': true }));
    window.setTimeout(() => {
      setCopiedStates((current) => ({ ...current, 'hide-hint': false }));
    }, 1500);
  }

  return html`
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <${HideHintSnippetCard}
        copied=${Boolean(copiedStates['hide-hint'])}
        onCopy=${handleGeneratedCodeCopy}
      />
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
