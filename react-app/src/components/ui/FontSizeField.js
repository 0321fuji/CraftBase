import { html } from '../../lib/react.js';

export function FontSizeField({
  label,
  value,
  onChange,
  placeholder = '例: 16px',
  containerClassName = '',
  labelClassName = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500',
  inputClassName = 'mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm font-mono',
  hint = '',
  hintClassName = 'mt-1 text-[11px] leading-5 text-slate-500'
}) {
  return html`
    <div className=${containerClassName}>
      <label className=${labelClassName}>${label}</label>
      <input
        type="text"
        value=${value}
        onChange=${(event) => onChange(event.target.value)}
        className=${inputClassName}
        placeholder=${placeholder}
      />
      ${hint ? html`<p className=${hintClassName}>${hint}</p>` : null}
    </div>
  `;
}
