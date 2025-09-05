import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Doc = {
  id: string;
  subjectId: string;
  name: string;
  uri: string; // local file uri
  mimeType?: string;
  createdAt: number;
  summary?: string; // AI summary placeholder
};

type DocsState = {
  docs: Doc[];
  addDoc: (d: Omit<Doc, 'id' | 'createdAt'>) => string;
  removeDoc: (id: string) => void;
  getBySubject: (subjectId: string) => Doc[];
  getRecent: (limit?: number) => Doc[];
};

export const useDocsStore = create<DocsState>()(
  persist(
    (set, get) => ({
      docs: [],
      addDoc: (d) => {
        const id = Math.random().toString(36).slice(2, 10);
        const doc: Doc = { ...d, id, createdAt: Date.now() };
        set((st) => ({ docs: [doc, ...st.docs] }));
        return id;
      },
      removeDoc: (id) => set((st) => ({ docs: st.docs.filter((x) => x.id !== id) })),
      getBySubject: (subjectId) => get().docs.filter((x) => x.subjectId === subjectId),
      getRecent: (limit = 10) => [...get().docs].sort((a,b)=>b.createdAt-a.createdAt).slice(0, limit),
    }),
    {
      name: 'k19-docs',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (st) => ({ docs: st.docs }),
    }
  )
);
