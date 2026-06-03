import { createRoot, html } from './lib/react.js';
import { App } from './App.js';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(html`<${App} />`);
