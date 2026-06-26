import { ajax, alert, close, confirm, iframe, modal, prompt, setEModalOptions, AjaxOptions, EModalOptions, PromptOptions } from './index';
export interface UseEModalOptions {
    defaults?: Parameters<typeof setEModalOptions>[0];
}
export declare function useEModal(options?: UseEModalOptions): {
    alert: typeof alert;
    confirm: typeof confirm;
    prompt: typeof prompt;
    ajax: typeof ajax;
    iframe: typeof iframe;
    modal: typeof modal;
    close: typeof close;
};
export type { AjaxOptions, EModalOptions, PromptOptions };
//# sourceMappingURL=react.d.ts.map