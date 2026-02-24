import React from 'react';
import { useResults } from '../context/ResultsContext';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatValues';

const ResultsTable: React.FC = () => {
  const { results, isLoading } = useResults();

  // Calculate total net revenue
  const totalNetRevenue = results.reduce((sum, row) => sum + row.netRevenue, 0);

  return (
    <div className="h-full p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-semibold text-card-foreground mb-6">Results</h2>
      
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No results yet. Adjust the form parameters to see calculations.</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="overflow-x-auto">
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
              {results.map((row) => (
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
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
