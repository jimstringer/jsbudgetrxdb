// components/alert/AlertProvider.tsx
// 👇 options for showAlert function

import { use } from 'react';
import { AlertContext } from '../contexts/AlertContext';

// 👇 define the useConfirmAlert hook
export const useConfirmAlert = () => {
  const context = use(AlertContext);
  if (!context) {
    throw new Error('Please Use AlertProvider in parent component.');
  }
  return context;
};
