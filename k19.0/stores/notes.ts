import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Note = {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  createdAt: number;
  aiGenerated?: boolean;
};

type NotesState = {
  notes: Note[];
  addNote: (n: Omit<Note, 'id' | 'createdAt'>) => string;
  removeNote: (id: string) => void;
  getBySubject: (subjectId: string) => Note[];
  getRecent: (limit?: number) => Note[];
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (n) => {
        const id = Math.random().toString(36).slice(2, 10);
        const note: Note = { ...n, id, createdAt: Date.now() };
        set((st) => ({ notes: [note, ...st.notes] }));
        return id;
      },
      removeNote: (id) => set((st) => ({ notes: st.notes.filter((x) => x.id !== id) })),
      getBySubject: (subjectId) => get().notes.filter((x) => x.subjectId === subjectId),
      getRecent: (limit = 10) => [...get().notes].sort((a,b)=>b.createdAt-a.createdAt).slice(0, limit),
    }),
    {
      name: 'k19-notes',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (st) => ({ notes: st.notes }),
    }
  )
);
