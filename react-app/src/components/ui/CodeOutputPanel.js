import { html } from '../../lib/react.js';

export function CodeOutputPanel({
  value,
  onCopy,
  helperText = 'OnboardingのHTMLブロックにそのまま貼り付け対応',
  title = 'HTMLコードコピー',
  buttonLabel = 'HTMLコードをコピーする',
  rows = 7
}) {
  return html`
    <div className="space-y-4 rounded-2xl bg-slate-900 p-6 text-slate-300 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-sm font-bold text-slate-100">${title}</span>
        <span className="text-[10px] text-slate-500">${helperText}</span>
      </div>
      <textarea
        readOnly
        rows=${rows}
        value=${value}
        className="code-scrollbar w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-indigo-300 focus:outline-none"
      />
      <button
        type="button"
        onClick=${onCopy}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98]"
      >
        ${buttonLabel}
      </button>
    </div>
  `;
}
