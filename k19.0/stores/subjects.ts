import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Subject = {
  id: string;
  title: string;
  createdAt: number;
};

type SubjectsState = {
  subjects: Subject[];
  addSubject: (s: { id?: string; title: string }) => string;
  updateSubject: (id: string, patch: Partial<Pick<Subject, 'title'>>) => void;
  removeSubject: (id: string) => void;
  getSubject: (id: string) => Subject | undefined;
};

export const useSubjectsStore = create<SubjectsState>()(
  persist(
    (set, get) => ({
      subjects: [],
      addSubject: ({ id, title }) => {
        const newId = id ?? Math.random().toString(36).slice(2, 10);
        const s: Subject = { id: newId, title, createdAt: Date.now() };
        set((st) => ({ subjects: [s, ...st.subjects] }));
        return newId;
      },
      updateSubject: (id, patch) =>
        set((st) => ({
          subjects: st.subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      removeSubject: (id) =>
        set((st) => ({ subjects: st.subjects.filter((s) => s.id !== id) })),
      getSubject: (id) => get().subjects.find((s) => s.id === id),
    }),
    {
      name: 'k19-subjects',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (st) => ({ subjects: st.subjects }),
    }
  )
);
