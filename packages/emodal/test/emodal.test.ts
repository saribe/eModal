import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as eModal from '../src';

vi.mock('bootstrap/js/dist/modal', () => {
  class MockModal {
    element: Element;

    constructor(element: Element) {
      this.element = element;
    }

    show() {
      this.element.classList.add('show');
    }

    hide() {
      this.element.dispatchEvent(new Event('hidden.bs.modal'));
    }

    dispose() {}

    static getOrCreateInstance(element: Element) {
      return new MockModal(element);
    }
  }

  return { default: MockModal };
});

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('eModal v2', () => {
  it('creates alert dialogs with Bootstrap 5 markup', () => {
    const dialog = eModal.alert('You shall not pass!', 'Warning');

    expect(dialog.element.querySelector('.modal-title')?.textContent).toBe('Warning');
    expect(dialog.element.querySelector('.modal-body')?.textContent).toBe('You shall not pass!');
    expect(dialog.element.querySelector('[data-bs-dismiss="modal"]')).toBeTruthy();
  });

  it('resolves confirm when the primary action is clicked', async () => {
    const dialog = eModal.confirm('Ship it?');
    const buttons = dialog.element.querySelectorAll<HTMLButtonElement>('.modal-footer .btn');

    buttons[1].click();
    dialog.close();

    await expect(dialog).resolves.toBe(true);
  });

  it('rejects confirm when cancel is clicked', async () => {
    const dialog = eModal.confirm('Ship it?');
    const buttons = dialog.element.querySelectorAll<HTMLButtonElement>('.modal-footer .btn');

    buttons[0].click();
    dialog.close();

    await expect(dialog).rejects.toBe(false);
  });

  it('creates prompt inputs', () => {
    const dialog = eModal.prompt({ label: 'Codename', defaultValue: 'Doom' });

    expect(dialog.element.querySelector('label')?.textContent).toBe('Codename');
    expect(dialog.element.querySelector<HTMLInputElement>('input')?.value).toBe('Doom');
  });

  it('exposes the v2 API surface', () => {
    expect(eModal.version).toBe('2.0.0');
    expect(eModal.size.xl).toBe('xl');
    expect(eModal.eModal.alert).toBe(eModal.alert);
  });
});
