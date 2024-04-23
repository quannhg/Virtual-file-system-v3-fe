import { readPwdLocalStorage, updatePwdLocalStorage } from '@utils';
import { create } from 'zustand';

// Define interface for PWD state
interface PwdState {
  pwd: string;
  updatePwdLocalStorage: (newPwd: string) => void;
  readPwdLocalStorage: () => string;
}

const initialPwd = readPwdLocalStorage();

export const usePwdStore = create<PwdState>((set) => ({
  pwd: initialPwd,
  updatePwdLocalStorage: (newPwd) => {
    updatePwdLocalStorage(newPwd);
    set({ pwd: newPwd });
  },
  readPwdLocalStorage: () => {
    return readPwdLocalStorage();
  }
}));
