# eModal v2

eModal is a modern Bootstrap modal helper for developers who want dialogs without ceremony.

Version 2 is a clean reboot: Bootstrap 5.3.8, TypeScript, native promises, no jQuery, no Bower, and a React adapter. The original idea survives: make alerts, confirms, prompts, Ajax views, iframes, and custom dialogs quick to create.

## Install

```bash
npm install emodal bootstrap
```

```ts
import 'bootstrap/dist/css/bootstrap.min.css';
import eModal from 'emodal';

await eModal.alert('Build the room, light the path, ship the fight.', 'Mission update');
```

## API

### Alert

```ts
await eModal.alert('You shall not pass!', 'Attention');
```

### Confirm

```ts
try {
  await eModal.confirm('Deploy v2?', 'Confirm deploy');
  // confirmed
} catch {
  // canceled
}
```

### Prompt

```ts
try {
  const codename = await eModal.prompt({
    label: 'Package codename',
    defaultValue: 'Reload',
    required: true
  });
} catch {
  // canceled
}
```

### Ajax

```ts
const html = await eModal.ajax({
  url: '/partials/settings.html',
  title: 'Settings',
  size: eModal.size.lg
});
```

### iFrame

```ts
await eModal.iframe({
  url: 'https://getbootstrap.com',
  title: 'Bootstrap docs',
  size: eModal.size.xl
});
```

### Custom Modal

```ts
const choice = await eModal.modal<string>({
  title: 'Choose your v2 weapon',
  subtitle: 'Custom buttons, same clean core.',
  message: '<p>Every button can resolve, reject, dismiss, or run async work.</p>',
  size: eModal.size.lg,
  buttons: [
    { text: 'Docs', variant: 'secondary', value: 'docs' },
    { text: 'Core API', variant: 'info', value: 'core' },
    { text: 'React Hook', variant: 'primary', value: 'react', autofocus: true }
  ]
});
```

## React

```tsx
import { useEModal } from 'emodal/react';

export function Toolbar() {
  const modal = useEModal();

  return (
    <button onClick={() => modal.alert('React-ready.', 'eModal v2')}>
      Open modal
    </button>
  );
}
```

## Options

Common options work across `modal`, `alert`, `confirm`, `prompt`, `ajax`, and `iframe` where applicable.

```ts
type EModalOptions = {
  title?: string;
  subtitle?: string;
  message?: string | Node;
  size?: '' | 'sm' | 'lg' | 'xl' | 'fullscreen';
  fullscreen?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  closeButton?: boolean;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  buttons?: EModalButton[] | false;
};
```

Button variants use Bootstrap button styles:

```ts
{
  text: 'Ship it',
  variant: 'primary',
  value: true,
  autofocus: true
}
```

## Migration from v1

v2 intentionally breaks with the old implementation.

- Bootstrap 5.3.8 is the target.
- jQuery, Popper v1, Bower, and Q integration are gone.
- Bootstrap 4 `data-dismiss` attributes are replaced by Bootstrap 5 `data-bs-dismiss`.
- Native promises replace jQuery Deferred.
- `addLabel` label presets are removed. Use explicit button text.
- ESM/CJS package entry points are `dist/index.js` and `dist/index.cjs`.
- The React adapter is available from `emodal/react`.

The old flow survives: `alert`, `confirm`, `prompt`, `ajax`, `iframe`, `modal`, `close`, `setEModalOptions`, and `size`.

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

The demo app lives in `apps/demo` and deploys to Vercel using `vercel.json`.

## Release

```bash
npm run build
npm publish --workspace packages/emodal --access public
```

## License

MIT
