import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BrowserTab = {
  id: string;
  url: string;
  title?: string;
  createdAt: number;
};

type BrowserState = {
  tabs: BrowserTab[];
  activeTabId?: string;
  addTab: (url: string) => string;
  closeTab: (id: string) => void;
  setActive: (id: string) => void;
  updateTab: (id: string, patch: Partial<Pick<BrowserTab, 'url' | 'title'>>) => void;
  getActive: () => BrowserTab | undefined;
};

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      tabs: [{ id: 't1', url: 'https://example.org', createdAt: Date.now() }],
      activeTabId: 't1',
      addTab: (url: string) => {
        const id = Math.random().toString(36).slice(2, 10);
        const tab: BrowserTab = { id, url, createdAt: Date.now() };
        set((st) => ({ tabs: [tab, ...st.tabs], activeTabId: id }));
        return id;
      },
      closeTab: (id: string) =>
        set((st) => {
          const tabs = st.tabs.filter((t) => t.id !== id);
          let activeTabId = st.activeTabId;
          if (st.activeTabId === id) {
            activeTabId = tabs[0]?.id;
          }
          return { tabs, activeTabId };
        }),
      setActive: (id: string) => set({ activeTabId: id }),
      updateTab: (id, patch) =>
        set((st) => ({ tabs: st.tabs.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      getActive: () => {
        const { tabs, activeTabId } = get();
        return tabs.find((t) => t.id === activeTabId);
      },
    }),
    {
      name: 'k19-browser',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (st) => ({ tabs: st.tabs, activeTabId: st.activeTabId }),
    }
  )
);
