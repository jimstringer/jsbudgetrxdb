import { createContext, ReactNode } from 'react';

export type AlertOptions = {
  title: ReactNode;
  confirmMessage: ReactNode;
  onConfirm(): Promise<void> | void;
};

// 👇 define the AlertContext
export const AlertContext = createContext<{
  showAlert(opts: AlertOptions): void;
} | null>(null);
