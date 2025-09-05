import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type SubjectItemType = 'pdf' | 'docx' | 'jpg' | 'png' | 'mp4' | 'note';

export type SubjectItem = {
  id: string;
  subjectId: string;
  name: string;
  type: SubjectItemType;
  date: string; // YYYY-MM-DD
  uri?: string; // for images/videos/documents
};

interface SubjectItemsContextType {
  items: SubjectItem[];
  getItemsBySubject: (subjectId: string) => SubjectItem[];
  addItem: (item: Omit<SubjectItem, 'id' | 'date'> & { id?: string; date?: string }) => void;
  removeItem: (id: string) => void;
  clearSubject: (subjectId: string) => void;
}

const SubjectItemsContext = createContext<SubjectItemsContextType | undefined>(undefined);

export const useSubjectItems = () => {
  const ctx = useContext(SubjectItemsContext);
  if (!ctx) throw new Error('useSubjectItems must be used within SubjectItemsProvider');
  return ctx;
};

export function SubjectItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SubjectItem[]>([]);

  const addItem: SubjectItemsContextType['addItem'] = (item) => {
    const now = new Date();
    setItems((prev) => [
      {
        id: item.id || String(Date.now()),
        date: item.date || now.toISOString().slice(0, 10),
        ...item,
      },
      ...prev,
    ]);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearSubject = (subjectId: string) => setItems((prev) => prev.filter((i) => i.subjectId !== subjectId));
  const getItemsBySubject = (subjectId: string) => items.filter((i) => i.subjectId === subjectId);

  const value = useMemo(
    () => ({ items, addItem, removeItem, clearSubject, getItemsBySubject }),
    [items]
  );

  return <SubjectItemsContext.Provider value={value}>{children}</SubjectItemsContext.Provider>;
}
