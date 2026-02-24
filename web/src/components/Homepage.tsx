import React from 'react';
import DrugPricingForm from './DrugPricingForm';
import ResultsTable from './ResultsTable';
import { ResultsProvider } from '../context/ResultsContext';

const Homepage: React.FC = () => {
  return (
    <ResultsProvider>
      <div className="min-h-screen w-full p-8 bg-background">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground">Drug Pricing Simulator</h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 max-w-[1600px] mx-auto">
          <div className="min-h-[500px]">
            <DrugPricingForm />
          </div>
          <div className="min-h-[500px]">
            <ResultsTable />
          </div>
        </div>
      </div>
    </ResultsProvider>
  );
};

export default Homepage;
