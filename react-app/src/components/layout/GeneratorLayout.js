import { html } from '../../lib/react.js';

export function GeneratorLayout({ title, badge, headerNav, TabComponent, tabItems, activeTab, onTabChange, controls, preview, code, layoutMode = 'template' }) {
  const isAiMode = layoutMode === 'ai';
  const isBalancedMode = layoutMode === 'balanced';
  const isSinglePanelMode = !preview && !code;
  return html`
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight text-slate-950">${title}</h1>
            ${headerNav || null}
          </div>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500"></span>${badge}
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        ${tabItems && tabItems.length ? html`<div><${TabComponent} tabs=${tabItems} activeTab=${activeTab} onChange=${onTabChange} /></div>` : null}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <section className=${`space-y-6 ${isSinglePanelMode ? 'lg:col-span-12' : isBalancedMode ? 'lg:col-span-6' : 'lg:col-span-5'} ${isAiMode ? 'lg:sticky lg:top-24 lg:h-[calc(100vh-8.5rem)]' : ''}`.trim()}>${controls}</section>
          ${isSinglePanelMode
            ? null
            : html`
                <section className=${`space-y-6 ${isBalancedMode ? 'lg:col-span-6' : 'lg:col-span-7'} ${isAiMode ? 'lg:sticky lg:top-24 lg:h-[calc(100vh-8.5rem)] lg:overflow-y-auto lg:pr-1' : ''}`.trim()}>${preview}${code}</section>
              `}
        </div>
      </main>
    </div>
  `;
}
