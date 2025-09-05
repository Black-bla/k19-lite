import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Subject = {
  id: string;
  name: string;
  lecturer: string;
  phone: string;
  email: string;
  classLink: string;
  room: string;
  imageUrl?: string;
};

export type ClassSchedule = {
  id: number;
  subjectId: string;
  time: string;
  day: number;
  duration: number;
  attendance: number;
};

interface SubjectsContextType {
  subjects: Subject[];
  classes: ClassSchedule[];
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addClass: (classItem: ClassSchedule) => void;
  updateClass: (classItem: ClassSchedule) => void;
  deleteClass: (id: number) => void;
  getSubjectById: (id: string) => Subject | undefined;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export const useSubjects = () => {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error('useSubjects must be used within a SubjectsProvider');
  }
  return context;
};

interface SubjectsProviderProps {
  children: ReactNode;
}

export const SubjectsProvider: React.FC<SubjectsProviderProps> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);

  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const updateSubject = (subject: Subject) => {
    setSubjects(prev => prev.map(s => s.id === subject.id ? subject : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Also remove all classes for this subject
    setClasses(prev => prev.filter(c => c.subjectId !== id));
  };

  const addClass = (classItem: ClassSchedule) => {
    setClasses(prev => [...prev, classItem]);
  };

  const updateClass = (classItem: ClassSchedule) => {
    setClasses(prev => prev.map(c => c.id === classItem.id ? classItem : c));
  };

  const deleteClass = (id: number) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const getSubjectById = (id: string) => {
    return subjects.find(s => s.id === id);
  };

  const value: SubjectsContextType = {
    subjects,
    classes,
    addSubject,
    updateSubject,
    deleteSubject,
    addClass,
    updateClass,
    deleteClass,
    getSubjectById,
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
};
