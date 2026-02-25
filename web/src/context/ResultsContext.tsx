import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface MonthResult {
  month: number;
  netRevenue: number;
  avgNetPricePerAdmin: number;
  percentDiscount: number;
  absoluteDiscount: number;
  adminCount: number;
}

interface ResultsContextType {
  results: MonthResult[] | null;
  setResults: (results: MonthResult[] | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<MonthResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ResultsContext.Provider value={{ results, setResults, isLoading, setIsLoading }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};
