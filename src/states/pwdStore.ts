import { changeDirectory } from '@services';
import { readPwdLocalStorage, updatePwdLocalStorage } from '@utils';
import { create } from 'zustand';

interface PwdState {
  currentDirectory: string;
  updatePwd: (newPwd: string) => Promise<void | string>;
}

const initialPwd = readPwdLocalStorage();

export const usePwdStore = create<PwdState>((set, get) => ({
  currentDirectory: initialPwd,
  updatePwd: async (newPwd) => {
    try {
      if (newPwd && !get().currentDirectory.includes(newPwd)) {
        await changeDirectory(newPwd);
      }

      updatePwdLocalStorage(newPwd);
      set({ currentDirectory: newPwd });
    } catch (err) {
      throw err;
    }
  }
}));
