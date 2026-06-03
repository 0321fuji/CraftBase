import { html } from '../../lib/react.js';

export function PreviewPanel({ darkMode, onToggleDarkMode, children }) {
  return html`
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-400"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
          <span className="ml-2 text-xs font-bold text-slate-500">プレビュー表示</span>
        </div>
        ${onToggleDarkMode
          ? html`
              <button
                type="button"
                onClick=${onToggleDarkMode}
                className=${darkMode
                  ? 'inline-flex items-center gap-1.5 rounded-full border border-indigo-600 bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm transition-all'
                  : 'inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50'}
              >
                ${darkMode ? '通常モードに戻す' : 'ダークモードをテスト'}
              </button>
            `
          : null}
      </div>
      <div className=${`${darkMode ? 'bg-slate-800' : 'bg-white'} preview-scrollbar min-h-[200px] p-4 transition-all duration-300`}>
        <div className="w-full px-4">${children}</div>
      </div>
    </div>
  `;
}
