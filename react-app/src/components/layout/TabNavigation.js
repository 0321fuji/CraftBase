import { html } from '../../lib/react.js';

export function TabNavigation({ tabs, activeTab, onChange }) {
  return html`
    <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1 text-sm">
      ${tabs.map(
        (tab) => html`
          <button
            key=${tab.id}
            type="button"
            onClick=${() => onChange(tab.id)}
            className=${activeTab === tab.id
              ? 'rounded-xl bg-white px-4 py-2 font-bold text-slate-900 shadow-sm transition-all'
              : 'rounded-xl px-4 py-2 font-bold text-slate-600 transition-all hover:text-slate-900'}
          >
            ${tab.label}
          </button>
        `
      )}
    </div>
  `;
}
