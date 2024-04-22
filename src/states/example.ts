import { create } from 'zustand';

type exampleStore = {
  data: ExampleData | null;
  doExampleThing: (data: ExampleData) => void;
};

export const useExampleStore = create<exampleStore>((set) => ({
  data: null,
  doExampleThing: (data: ExampleData) => set({ data })
}));
