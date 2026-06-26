import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Code2, ExternalLink, Frame, MessageSquare, MousePointerClick, ShieldQuestion, Sparkles, Terminal } from 'lucide-react';
import eModal, { size } from 'emodal';
import { useEModal } from 'emodal/react';
import './styles.css';

const examples = [
  {
    icon: MessageSquare,
    title: 'Alert',
    summary: 'Fast feedback with Bootstrap 5 styling.',
    code: `eModal.alert('Build the room, light the path, ship the fight.', 'Mission update');`
  },
  {
    icon: ShieldQuestion,
    title: 'Confirm',
    summary: 'Promise-driven decisions without callback mud.',
    code: `const ok = await eModal.confirm('Deploy v2 to production?', 'Confirm deploy');`
  },
  {
    icon: Terminal,
    title: 'Prompt',
    summary: 'Collect one clean value and keep moving.',
    code: `const name = await eModal.prompt({ label: 'Package codename', defaultValue: 'Reload' });`
  },
  {
    icon: Frame,
    title: 'iFrame',
    summary: 'Open embedded content in a full-size dialog.',
    code: `eModal.iframe({ url: 'https://getbootstrap.com', title: 'Bootstrap docs', size: eModal.size.xl });`
  }
];

function App() {
  const modal = useEModal();
  const [lastResult, setLastResult] = useState('Ready.');

  const runAlert = async () => {
    await modal.alert('Build the room, light the path, ship the fight.', 'Mission update');
    setLastResult('Alert closed.');
  };

  const runConfirm = async () => {
    try {
      await modal.confirm('Deploy v2 to production?', 'Confirm deploy');
      setLastResult('Confirmed. Fire it up.');
    } catch {
      setLastResult('Canceled. Back to the forge.');
    }
  };

  const runPrompt = async () => {
    try {
      const value = await modal.prompt({ label: 'Package codename', defaultValue: 'Reload', required: true });
      setLastResult(`Prompt value: ${value}`);
    } catch {
      setLastResult('Prompt canceled.');
    }
  };

  const runCustom = async () => {
    const choice = await eModal.modal<string>({
      title: 'Choose your v2 weapon',
      subtitle: 'Custom buttons, same clean core.',
      message: '<p class="mb-0">Every button can resolve, reject, dismiss, or run async work.</p>',
      size: size.lg,
      buttons: [
        { text: 'Docs', variant: 'secondary', value: 'docs' },
        { text: 'Core API', variant: 'info', value: 'core' },
        { text: 'React Hook', variant: 'primary', value: 'react', autofocus: true }
      ]
    });

    setLastResult(`Custom choice: ${choice}`);
  };

  const actions = [
    { label: 'Alert', icon: MessageSquare, run: runAlert },
    { label: 'Confirm', icon: ShieldQuestion, run: runConfirm },
    { label: 'Prompt', icon: Terminal, run: runPrompt },
    { label: 'Custom', icon: MousePointerClick, run: runCustom }
  ];

  return (
    <main>
      <section className="hero">
        <nav className="topbar" aria-label="Primary">
          <div className="brand">
            <Sparkles size={24} aria-hidden="true" />
            <span>eModal</span>
          </div>
          <a className="repo-link" href="https://github.com/saribe/eModal" target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={16} aria-hidden="true" />
          </a>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Version {eModal.version} | Bootstrap 5.3.8 | React-ready</p>
            <h1>Dialogs for developers who want flow, not ceremony.</h1>
            <p className="lede">
              eModal v2 keeps the original idea: alerts, confirms, prompts, Ajax, iframes, and custom dialogs that are
              easy to summon. The wiring is new: TypeScript, native promises, Bootstrap 5, and a React hook.
            </p>
            <div className="action-row" aria-label="Live examples">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button className="btn btn-primary action-button" type="button" onClick={action.run} key={action.label}>
                    <Icon size={18} aria-hidden="true" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="stage" aria-label="Example modal preview">
            <div className="window">
              <div className="window-header">
                <span>Deploy v2?</span>
                <button className="btn-close" type="button" aria-label="Close preview" />
              </div>
              <div className="window-body">
                <Code2 size={40} aria-hidden="true" />
                <p>Native promises. Bootstrap 5. Zero jQuery.</p>
                <code>{lastResult}</code>
              </div>
              <div className="window-footer">
                <button className="btn btn-secondary" type="button">Cancel</button>
                <button className="btn btn-primary" type="button">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-band" id="examples">
        <div className="section-heading">
          <p className="eyebrow">API flow</p>
          <h2>Same spellbook, modern engine.</h2>
        </div>

        <div className="example-grid">
          {examples.map((example) => {
            const Icon = example.icon;
            return (
              <article className="example-card" key={example.title}>
                <div className="example-icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3>{example.title}</h3>
                <p>{example.summary}</p>
                <pre><code>{example.code}</code></pre>
              </article>
            );
          })}
        </div>
      </section>

      <section className="install-band">
        <div>
          <p className="eyebrow">Install</p>
          <h2>One package. Core API plus React adapter.</h2>
        </div>
        <pre><code>{`npm install emodal bootstrap

import 'bootstrap/dist/css/bootstrap.min.css';
import eModal from 'emodal';
import { useEModal } from 'emodal/react';`}</code></pre>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
