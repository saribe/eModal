import { useMemo } from 'react';
import {
  ajax,
  alert,
  close,
  confirm,
  iframe,
  modal,
  prompt,
  setEModalOptions,
  type AjaxOptions,
  type EModalOptions,
  type PromptOptions
} from './index';

export interface UseEModalOptions {
  defaults?: Parameters<typeof setEModalOptions>[0];
}

export function useEModal(options: UseEModalOptions = {}) {
  if (options.defaults) {
    setEModalOptions(options.defaults);
  }

  return useMemo(
    () => ({
      alert,
      confirm,
      prompt,
      ajax,
      iframe,
      modal,
      close
    }),
    []
  );
}

export type { AjaxOptions, EModalOptions, PromptOptions };
