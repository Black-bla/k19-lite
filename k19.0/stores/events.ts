import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type EventItem = {
  id: string;
  subjectId: string;
  title: string;
  startsAt: number; // epoch ms
  endsAt?: number;
  location?: string; // could be online link
  createdAt: number;
};

type EventsState = {
  events: EventItem[];
  addEvent: (e: Omit<EventItem, 'id' | 'createdAt'>) => string;
  removeEvent: (id: string) => void;
  getBySubject: (subjectId: string) => EventItem[];
  getUpcoming: (from?: number) => EventItem[];
  getNext: (from?: number) => EventItem | undefined;
};

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (e) => {
        const id = Math.random().toString(36).slice(2, 10);
        const item: EventItem = { ...e, id, createdAt: Date.now() };
        set((st) => ({ events: [item, ...st.events] }));
        return id;
      },
      removeEvent: (id) => set((st) => ({ events: st.events.filter((x) => x.id !== id) })),
      getBySubject: (subjectId) => get().events.filter((x) => x.subjectId === subjectId),
      getUpcoming: (from = Date.now()) => get().events.filter((e) => e.startsAt >= from).sort((a,b)=>a.startsAt-b.startsAt),
      getNext: (from = Date.now()) => get().events.filter((e) => e.startsAt >= from).sort((a,b)=>a.startsAt-b.startsAt)[0],
    }),
    {
      name: 'k19-events',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (st) => ({ events: st.events }),
    }
  )
);
