import { html } from '../../lib/react.js';

export function SectionCard({ title, action, children }) {
  return html`
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900">${title}</h2>
        ${action || null}
      </div>
      ${children}
    </div>
  `;
}
