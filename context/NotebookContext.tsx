"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Note } from '@/lib/notebook';

interface NotebookContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'note_id'> & { note_id?: string }) => void;
  removeNote: (note_id: string) => void;
  isInNotebook: (note_id: string) => boolean;
  clearNotebook: () => void;
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined);

export function NotebookProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('college_compass_notebook');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('college_compass_notebook', JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((noteData: Omit<Note, 'note_id'> & { note_id?: string }) => {
    setNotes(prev => {
      const newNote: Note = {
        ...noteData,
        note_id: noteData.note_id || Math.random().toString(36).substr(2, 9)
      };
      
      if (prev.find(n => n.note_id === newNote.note_id)) return prev;
      
      return [...prev, newNote];
    });
  }, []);

  const removeNote = useCallback((note_id: string) => {
    setNotes(prev => prev.filter(n => n.note_id !== note_id));
  }, []);

  const isInNotebook = useCallback((note_id: string) => {
    return notes.some(n => n.note_id === note_id);
  }, [notes]);

  const clearNotebook = useCallback(() => {
    setNotes([]);
  }, []);

  return (
    <NotebookContext.Provider value={{ notes, addNote, removeNote, isInNotebook, clearNotebook }}>
      {children}
    </NotebookContext.Provider>
  );
}

export function useNotebook() {
  const context = useContext(NotebookContext);
  if (context === undefined) {
    throw new Error('useNotebook must be used within a NotebookProvider');
  }
  return context;
}
