import { create } from "zustand";
import { persist } from "zustand/middleware";

let appStore = (set) => ({
  Open: true,
  updateOpen: (Open) => set((state) => ({ Open: Open })),
});

appStore = persist(appStore, { name: "appStore" });
export const useAppStore = create(appStore);
