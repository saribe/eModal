import BootstrapModal from 'bootstrap/js/dist/modal';

export type EModalSize = 'sm' | 'lg' | 'xl' | 'fullscreen' | '';
export type EModalVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';

export interface EModalButton<T = unknown> {
  text: string;
  variant?: EModalVariant;
  value?: T;
  reject?: boolean;
  dismiss?: boolean;
  autofocus?: boolean;
  attributes?: Record<string, string>;
  onClick?: (context: EModalContext<T>) => T | void | Promise<T | void>;
}

export interface EModalOptions<T = unknown> {
  title?: string;
  subtitle?: string;
  message?: string | Node;
  bodyClassName?: string;
  className?: string;
  size?: EModalSize;
  fullscreen?: boolean;
  buttons?: Array<EModalButton<T>> | false;
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  closeButton?: boolean;
}

export interface AjaxOptions extends Omit<EModalOptions<string>, 'message'> {
  url: string;
  request?: RequestInit;
  loadingHtml?: string;
  errorTitle?: string;
}

export interface PromptOptions extends Omit<EModalOptions<string>, 'message' | 'buttons'> {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

export interface EModalContext<T = unknown> {
  element: HTMLElement;
  modal: BootstrapModal;
  close: () => void;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

export type EModalPromise<T = unknown> = Promise<T> & {
  element: HTMLElement;
  modal: BootstrapModal;
  close: () => void;
};

type EModalInternalPromise<T = unknown> = EModalPromise<T> & {
  settle: (value: T) => void;
  fail: (reason?: unknown) => void;
};

export interface EModalDefaults {
  title: string;
  closeButton: boolean;
  centered: boolean;
  scrollable: boolean;
  focus: boolean;
  keyboard: boolean;
  backdrop: boolean | 'static';
  loadingHtml: string;
}

const defaults: EModalDefaults = {
  title: 'Attention',
  closeButton: true,
  centered: true,
  scrollable: true,
  focus: true,
  keyboard: true,
  backdrop: true,
  loadingHtml: '<div class="d-flex align-items-center gap-3"><div class="spinner-border text-primary" role="status" aria-hidden="true"></div><strong>Loading...</strong></div>'
};

let activeDialog: EModalPromise<unknown> | undefined;

function assertBrowser(): void {
  if (typeof document === 'undefined') {
    throw new Error('eModal can only open dialogs in a browser environment.');
  }
}

function normalizeOptions<T>(messageOrOptions: string | Node | EModalOptions<T>, title?: string): EModalOptions<T> {
  if (typeof messageOrOptions === 'string' || messageOrOptions instanceof Node) {
    return { message: messageOrOptions, title };
  }

  return { ...messageOrOptions, title: messageOrOptions.title ?? title };
}

function appendContent(target: HTMLElement, content: string | Node | undefined): void {
  if (typeof content === 'string') {
    target.innerHTML = content;
    return;
  }

  if (content) {
    target.append(content);
  }
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function isPromiseLike<T>(value: T | Promise<T> | void): value is Promise<T> {
  return Boolean(value && typeof (value as Promise<T>).then === 'function');
}

function buildDialogShell<T>(options: EModalOptions<T>): {
  element: HTMLElement;
  body: HTMLElement;
  footer: HTMLElement;
} {
  const element = createElement('div', `modal fade ${options.className ?? ''}`.trim());
  element.tabIndex = -1;
  element.setAttribute('aria-hidden', 'true');

  const dialogClasses = ['modal-dialog'];
  if (options.size) dialogClasses.push(`modal-${options.size}`);
  if (options.fullscreen) dialogClasses.push('modal-fullscreen');
  if (options.centered ?? defaults.centered) dialogClasses.push('modal-dialog-centered');
  if (options.scrollable ?? defaults.scrollable) dialogClasses.push('modal-dialog-scrollable');

  const dialog = createElement('div', dialogClasses.join(' '));
  const content = createElement('div', 'modal-content');
  const header = createElement('div', 'modal-header');
  const titleWrap = createElement('div');
  const titleElement = createElement('h5', 'modal-title', options.title ?? defaults.title);
  titleWrap.append(titleElement);

  if (options.subtitle) {
    titleWrap.append(createElement('div', 'modal-subtitle text-body-secondary small', options.subtitle));
  }

  header.append(titleWrap);

  if (options.closeButton ?? defaults.closeButton) {
    const close = createElement('button', 'btn-close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.setAttribute('data-bs-dismiss', 'modal');
    header.append(close);
  }

  const body = createElement('div', `modal-body ${options.bodyClassName ?? ''}`.trim());
  appendContent(body, options.message);

  const footer = createElement('div', 'modal-footer');

  content.append(header, body, footer);
  dialog.append(content);
  element.append(dialog);
  document.body.append(element);

  return { element, body, footer };
}

function createDialog<T = unknown>(
  options: EModalOptions<T>,
  fallbackButtons: Array<EModalButton<T>> = [{ text: 'Close', variant: 'primary', dismiss: true }]
): EModalPromise<T> {
  assertBrowser();

  const resolvedOptions = {
    ...defaults,
    ...options
  };

  const shell = buildDialogShell(resolvedOptions);
  const modal = BootstrapModal.getOrCreateInstance(shell.element, {
    backdrop: resolvedOptions.backdrop,
    focus: resolvedOptions.focus,
    keyboard: resolvedOptions.keyboard
  });

  let settled = false;
  let resolveValue!: (value: T | PromiseLike<T>) => void;
  let rejectValue!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolve, reject) => {
    resolveValue = resolve;
    rejectValue = reject;
  }) as EModalPromise<T>;

  const close = (): void => modal.hide();
  const resolve = (value: T): void => {
    if (!settled) {
      settled = true;
      resolveValue(value);
    }
  };
  const reject = (reason?: unknown): void => {
    if (!settled) {
      settled = true;
      rejectValue(reason);
    }
  };

  const context: EModalContext<T> = {
    element: shell.element,
    modal,
    close,
    resolve,
    reject
  };

  const buttons = resolvedOptions.buttons === false ? [] : resolvedOptions.buttons ?? fallbackButtons;
  if (buttons.length === 0) {
    shell.footer.remove();
  } else {
    for (const buttonOptions of buttons) {
      const button = createElement('button', `btn btn-${buttonOptions.variant ?? 'primary'}`, buttonOptions.text);
      button.type = 'button';
      if (buttonOptions.dismiss !== false) button.setAttribute('data-bs-dismiss', 'modal');
      if (buttonOptions.autofocus) button.autofocus = true;

      for (const [key, value] of Object.entries(buttonOptions.attributes ?? {})) {
        button.setAttribute(key, value);
      }

      button.addEventListener('click', () => {
        try {
          const nextValue = buttonOptions.onClick?.(context);
          const settle = (result: T | void): void => {
            const value = (result ?? buttonOptions.value) as T;
            if (buttonOptions.reject) {
              reject(value);
            } else {
              resolve(value);
            }
          };

          if (isPromiseLike(nextValue)) {
            nextValue.then(settle).catch(reject);
            return;
          }

          settle(nextValue);
        } catch (error) {
          reject(error);
        }
      });

      shell.footer.append(button);
    }
  }

  shell.element.addEventListener('hidden.bs.modal', () => {
    if (!settled) {
      resolve(undefined as T);
    }
    modal.dispose();
    shell.element.remove();
    if (activeDialog === promise) activeDialog = undefined;
  });

  Object.assign(promise, {
    element: shell.element,
    modal,
    close,
    settle: resolve,
    fail: reject
  });

  activeDialog = promise;
  modal.show();
  return promise;
}

export function modal<T = unknown>(options: EModalOptions<T>): EModalPromise<T> {
  return createDialog(options);
}

export function alert(messageOrOptions: string | Node | EModalOptions<void>, title?: string): EModalPromise<void> {
  return createDialog<void>(normalizeOptions(messageOrOptions, title), [
    { text: 'OK', variant: 'primary', value: undefined, autofocus: true }
  ]);
}

export function confirm(messageOrOptions: string | Node | EModalOptions<boolean>, title?: string): EModalPromise<boolean> {
  return createDialog<boolean>(normalizeOptions(messageOrOptions, title), [
    { text: 'Cancel', variant: 'secondary', value: false, reject: true },
    { text: 'Confirm', variant: 'primary', value: true, autofocus: true }
  ]);
}

export function prompt(messageOrOptions: string | PromptOptions, title?: string): EModalPromise<string> {
  assertBrowser();

  const options = typeof messageOrOptions === 'string'
    ? { label: messageOrOptions, title }
    : { ...messageOrOptions, title: messageOrOptions.title ?? title };

  const form = createElement('form');
  const id = `emodal-input-${Math.random().toString(36).slice(2)}`;
  const label = createElement('label', 'form-label', options.label ?? 'Value');
  label.setAttribute('for', id);
  const input = createElement('input', 'form-control');
  input.id = id;
  input.name = 'value';
  input.value = options.defaultValue ?? '';
  input.placeholder = options.placeholder ?? '';
  input.required = options.required ?? false;
  form.append(label, input);

  const dialog = createDialog<string>(
    {
      ...options,
      message: form,
      buttons: [
        { text: 'Cancel', variant: 'secondary', value: '', reject: true },
        {
          text: 'Submit',
          variant: 'primary',
          autofocus: true,
          onClick: () => {
            if (!form.reportValidity()) return;
            return input.value;
          }
        }
      ]
    },
    []
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.reportValidity()) {
      dialog.element.querySelector<HTMLButtonElement>('.modal-footer .btn-primary')?.click();
      dialog.close();
    }
  });

  queueMicrotask(() => input.focus());
  return dialog;
}

export function iframe(urlOrOptions: string | EModalOptions<void> & { url: string }, title?: string): EModalPromise<void> {
  const options = typeof urlOrOptions === 'string' ? { url: urlOrOptions, title } : urlOrOptions;
  const frame = createElement('iframe', 'emodal-frame');
  frame.src = options.url;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.setAttribute('title', options.title ?? 'Embedded content');
  Object.assign(frame.style, {
    border: '0',
    minHeight: '65vh',
    width: '100%'
  });

  return createDialog<void>({
    ...options,
    message: frame,
    size: options.size ?? 'xl',
    bodyClassName: `p-0 ${options.bodyClassName ?? ''}`.trim()
  });
}

export function ajax(urlOrOptions: string | AjaxOptions, title?: string): EModalPromise<string> {
  const options = typeof urlOrOptions === 'string' ? { url: urlOrOptions, title } : urlOrOptions;
  const dialog = createDialog<string>({
    ...options,
    message: options.loadingHtml ?? defaults.loadingHtml,
    buttons: false
  }) as EModalInternalPromise<string>;

  fetch(options.url, options.request)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      const html = await response.text();
      const body = dialog.element.querySelector<HTMLElement>('.modal-body');
      if (body) body.innerHTML = html;
      dialog.settle(html);
      return html;
    })
    .then((html) => {
      const footer = dialog.element.querySelector<HTMLElement>('.modal-footer');
      if (footer) {
        const button = createElement('button', 'btn btn-primary', 'Close');
        button.type = 'button';
        button.setAttribute('data-bs-dismiss', 'modal');
        footer.append(button);
      }
      return html;
    })
    .catch((error: Error) => {
      const body = dialog.element.querySelector<HTMLElement>('.modal-body');
      if (body) {
        body.innerHTML = `<div class="alert alert-danger mb-0"><strong>${options.errorTitle ?? 'Load failed'}:</strong> ${error.message}</div>`;
      }
      dialog.fail(error);
    });

  return dialog;
}

export function close(): HTMLElement | undefined {
  const element = activeDialog?.element;
  activeDialog?.close();
  return element;
}

export function setEModalOptions(options: Partial<EModalDefaults>): void {
  Object.assign(defaults, options);
}

export const setModalOptions = setEModalOptions;

export function addLabel(): void {
  throw new Error('eModal v2 removed label presets. Use explicit button text instead.');
}

export const size = {
  sm: 'sm',
  lg: 'lg',
  xl: 'xl',
  fullscreen: 'fullscreen'
} as const;

export const version = '2.0.0';

export const eModal = {
  addLabel,
  ajax,
  alert,
  close,
  confirm,
  iframe,
  modal,
  prompt,
  setEModalOptions,
  setModalOptions,
  size,
  version
};

export default eModal;
