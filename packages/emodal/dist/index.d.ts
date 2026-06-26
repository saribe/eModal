import { default as BootstrapModal } from 'bootstrap/js/dist/modal';
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
export declare function modal<T = unknown>(options: EModalOptions<T>): EModalPromise<T>;
export declare function alert(messageOrOptions: string | Node | EModalOptions<void>, title?: string): EModalPromise<void>;
export declare function confirm(messageOrOptions: string | Node | EModalOptions<boolean>, title?: string): EModalPromise<boolean>;
export declare function prompt(messageOrOptions: string | PromptOptions, title?: string): EModalPromise<string>;
export declare function iframe(urlOrOptions: string | EModalOptions<void> & {
    url: string;
}, title?: string): EModalPromise<void>;
export declare function ajax(urlOrOptions: string | AjaxOptions, title?: string): EModalPromise<string>;
export declare function close(): HTMLElement | undefined;
export declare function setEModalOptions(options: Partial<EModalDefaults>): void;
export declare const setModalOptions: typeof setEModalOptions;
export declare function addLabel(): void;
export declare const size: {
    readonly sm: "sm";
    readonly lg: "lg";
    readonly xl: "xl";
    readonly fullscreen: "fullscreen";
};
export declare const version = "2.0.0";
export declare const eModal: {
    addLabel: typeof addLabel;
    ajax: typeof ajax;
    alert: typeof alert;
    close: typeof close;
    confirm: typeof confirm;
    iframe: typeof iframe;
    modal: typeof modal;
    prompt: typeof prompt;
    setEModalOptions: typeof setEModalOptions;
    setModalOptions: typeof setEModalOptions;
    size: {
        readonly sm: "sm";
        readonly lg: "lg";
        readonly xl: "xl";
        readonly fullscreen: "fullscreen";
    };
    version: string;
};
export default eModal;
//# sourceMappingURL=index.d.ts.map