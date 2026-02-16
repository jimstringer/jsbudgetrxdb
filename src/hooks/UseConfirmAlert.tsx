// components/alert/AlertProvider.tsx
// 👇 options for showAlert function

import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';

// 👇 define the useConfirmAlert hook
export const useConfirmAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('Please Use AlertProvider in parent component.');
  }
  return context;
};
