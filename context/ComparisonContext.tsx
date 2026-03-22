"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CollegeBase {
  college_id: number;
  college_name: string;
  logo_url: string;
  city: string;
  state: string;
}

interface ComparisonContextType {
  selectedColleges: (CollegeBase | null)[];
  addCollegeToCompare: (college: CollegeBase) => boolean;
  removeCollegeFromCompare: (index: number) => void;
  isCollegeInComparison: (collegeId: number) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedColleges, setSelectedColleges] = useState<(CollegeBase | null)[]>([null, null, null]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('college_compass_comparison');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Sync with the current slot system (ensure at least 3 slots)
          const normalized = [...parsed];
          while (normalized.length < 3) normalized.push(null);
          setSelectedColleges(normalized);
        }
      } catch (e) {
        console.error("Failed to parse saved comparison", e);
      }
    }
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('college_compass_comparison', JSON.stringify(selectedColleges.filter(c => c !== null)));
  }, [selectedColleges]);

  const addCollegeToCompare = useCallback((college: CollegeBase) => {
    let added = false;
    setSelectedColleges(prev => {
      // Check if already in comparison
      if (prev.some(c => c?.college_id === college.college_id)) {
        return prev;
      }

      const newSelected = [...prev];
      const firstEmptyIndex = newSelected.findIndex(c => c === null);

      if (firstEmptyIndex !== -1) {
        newSelected[firstEmptyIndex] = college;
        added = true;
        return newSelected;
      } else if (newSelected.length < 4) {
        // Add a new slot if we have less than 4
        added = true;
        return [...newSelected, college];
      }
      
      return prev; // No space left
    });
    return added;
  }, []);

  const removeCollegeFromCompare = useCallback((index: number) => {
    setSelectedColleges(prev => {
      const newSelected = [...prev];
      newSelected[index] = null;
      
      // Keep at least 3 slots for UI consistency if possible, 
      // but if we had 4 slots, maybe we want to keep it?
      // For now, let's keep the length but nullify the slot.
      return newSelected;
    });
  }, []);

  const isCollegeInComparison = useCallback((collegeId: number) => {
    return selectedColleges.some(c => c?.college_id === collegeId);
  }, [selectedColleges]);

  const clearComparison = useCallback(() => {
    setSelectedColleges([null, null, null]);
  }, []);

  return (
    <ComparisonContext.Provider value={{ 
      selectedColleges, 
      addCollegeToCompare, 
      removeCollegeFromCompare, 
      isCollegeInComparison,
      clearComparison 
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
