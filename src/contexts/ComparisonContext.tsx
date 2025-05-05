import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DocumentFile, ComparisonResult, VisualComparisonType } from '../types';

interface ComparisonContextType {
  originalDocument: DocumentFile | null;
  newDocument: DocumentFile | null;
  setOriginalDocument: (file: DocumentFile | null) => void;
  setNewDocument: (file: DocumentFile | null) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  textComparisonResult: ComparisonResult | null;
  setTextComparisonResult: (result: ComparisonResult | null) => void;
  visualComparisonType: VisualComparisonType;
  setVisualComparisonType: (type: VisualComparisonType) => void;
  resetComparison: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
  shouldShowResults: boolean;
  setShouldShowResults: (show: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [originalDocument, setOriginalDocument] = useState<DocumentFile | null>(null);
  const [newDocument, setNewDocument] = useState<DocumentFile | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [textComparisonResult, setTextComparisonResult] = useState<ComparisonResult | null>(null);
  const [visualComparisonType, setVisualComparisonType] = useState<VisualComparisonType>('magenta-overlay');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [shouldShowResults, setShouldShowResults] = useState<boolean>(false);

  const resetComparison = () => {
    setOriginalDocument(null);
    setNewDocument(null);
    setTextComparisonResult(null);
    setIsProcessing(false);
    setCurrentPage(1);
    setTotalPages(0);
    setError(null);
    setShouldShowResults(false);
  };

  return (
    <ComparisonContext.Provider
      value={{
        originalDocument,
        newDocument,
        setOriginalDocument,
        setNewDocument,
        isProcessing,
        setIsProcessing,
        textComparisonResult,
        setTextComparisonResult,
        visualComparisonType,
        setVisualComparisonType,
        resetComparison,
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        error,
        setError,
        shouldShowResults,
        setShouldShowResults,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};