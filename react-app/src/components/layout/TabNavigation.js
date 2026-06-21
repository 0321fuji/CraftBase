import { html } from '../../lib/react.js';

export function TabNavigation({ tabs, activeTab, onChange }) {
  return html`
    <div className="inline-flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1 text-sm">
      ${tabs.map(
        (tab) => html`
          <button
            key=${tab.id}
            type="button"
            disabled=${tab.disabled}
            title=${tab.disabled ? tab.disabledReason || '現在は選択できません' : ''}
            onClick=${() => {
              if (!tab.disabled) onChange(tab.id);
            }}
            className=${tab.disabled
              ? 'cursor-not-allowed rounded-xl px-4 py-2 font-bold text-slate-400 opacity-70'
              : activeTab === tab.id
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
