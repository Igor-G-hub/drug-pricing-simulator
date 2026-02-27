import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useResults } from '../context/ResultsContext';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatValues';
import ResultsTableSkeleton from './ResultsTableSkeleton';

const ResultsTable: React.FC = () => {
  const { results, isLoading } = useResults();
  const safeResults = results ?? [];

  // Calculate total net revenue
  const totalNetRevenue = safeResults.reduce((sum, row) => sum + row.netRevenue, 0);
  const transition = { duration: 0.3, ease: 'easeInOut' } as const;

  return (
    <div className="h-full p-6 bg-card rounded-lg border border-border flex flex-col">
      <h2 className="text-2xl font-semibold text-[#27baa0] mb-6">Simulation Results</h2>

      <div className="relative flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="absolute inset-0"
            >
              <ResultsTableSkeleton />
            </motion.div>
          )}

          {!isLoading && results !== null && results.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="flex items-center justify-center py-12 h-full"
            >
              <p className="text-muted-foreground">No results yet. Adjust the form parameters to see calculations.</p>
            </motion.div>
          )}

          {!isLoading && safeResults.length > 0 && (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="absolute inset-0 overflow-x-auto"
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Net Revenue</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Avg Net Price/Admin</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Discount %</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Absolute Discount (EUR)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Administrations</th>
                  </tr>
                </thead>
                <tbody>
                  {safeResults.map((row) => (
                    <tr key={row.month} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{row.month}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">{formatCurrency(row.netRevenue)}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">{formatCurrency(row.avgNetPricePerAdmin)}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">{formatPercentage(row.percentDiscount)}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">{formatCurrency(row.absoluteDiscount)}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-right">{formatNumber(row.adminCount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/30">
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">Total</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground text-right">{formatCurrency(totalNetRevenue)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-right">-</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-right">-</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-right">-</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-right">-</td>
                  </tr>
                </tfoot>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsTable;
