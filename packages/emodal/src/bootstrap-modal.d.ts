declare module 'bootstrap/js/dist/modal' {
  export default class Modal {
    constructor(element: Element, options?: Modal.Options);
    show(): void;
    hide(): void;
    dispose(): void;
    static getOrCreateInstance(element: Element, options?: Modal.Options): Modal;
  }

  export namespace Modal {
    interface Options {
      backdrop?: boolean | 'static';
      focus?: boolean;
      keyboard?: boolean;
    }
  }
}
