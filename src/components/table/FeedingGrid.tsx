import React from 'react';
import type { ChecklistItem } from '../../@types/feeding';
import  Toggle  from '../ui/Toggle';
import { Clock } from 'lucide-react';

interface FeedingGridProps {
  data: ChecklistItem[];
  onUpdateRow: (index: number, updatedItem: ChecklistItem) => void;
}

const FeedingGrid: React.FC<FeedingGridProps> = ({ data, onUpdateRow }) => {
  return (
    <div className="print-container bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Dynamic Digital Table Legend (Hidden on print) */}
      <div className="no-print bg-slate-50 border-b border-slate-200 px-6 py-3 flex gap-6 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" /> Morning / Midday Only
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="px-6 py-4 w-24">Date</th>
              <th className="px-6 py-4">Food Item</th>
              <th className="px-6 py-4 w-44">Category / Window</th>
              <th className="px-6 py-4 w-24 text-center">Offered</th>
              <th className="px-6 py-4 w-24 text-center">Allergy</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data.map((item, idx) => {
              const isAllergen = item.category.startsWith('Allergen');
              return (
                <tr 
                  key={idx} 
                  className={`transition-colors duration-150 ${
                    item.hasAllergyReaction ? 'bg-rose-50/40' : item.isOffered ? 'bg-emerald-50/20' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Date Column */}
                  <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Food Item Column */}
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {item.foodItem}
                  </td>

                  {/* Category / Timing badge */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        isAllergen 
                          ? 'bg-rose-50 text-rose-700 border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.category}
                      </span>
                      {isAllergen && (
                        <span className="no-print text-amber-500" title="Morning Exposure Required">
                          <Clock className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {/* Printable visual representation of the allergen schedule window */}
                      <span className="print-only hidden font-bold text-xs text-amber-700">
                        [⏰ Morning Monitor]
                      </span>
                    </div>
                  </td>

                  {/* Interactive Offered State */}
                  <td className="px-6 py-4 text-center">
                    <span className="print-only hidden text-lg">○</span>
                    <Toggle 
                      checked={item.isOffered} 
                      activeColorClass="bg-emerald-500"
                      onChange={(val) => onUpdateRow(idx, { ...item, isOffered: val })} 
                    />
                  </td>

                  {/* Interactive Allergy State */}
                  <td className="px-6 py-4 text-center">
                    <span className="print-only hidden text-lg">○</span>
                    <Toggle 
                      checked={item.hasAllergyReaction} 
                      activeColorClass="bg-rose-500"
                      onChange={(val) => onUpdateRow(idx, { ...item, hasAllergyReaction: val })} 
                    />
                  </td>

                  {/* Notes Layer */}
                  <td className="px-6 py-4">
                    <input 
                      type="text"
                      className="no-print w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-transparent focus:border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-600 transition-all outline-hidden"
                      placeholder="Write feedback..."
                      value={item.notes}
                      onChange={(e) => onUpdateRow(idx, { ...item, notes: e.target.value })}
                    />
                    {/* Prints out clean ledger space for parents with pens on the fridge */}
                    <span className="print-only hidden block border-b border-dotted border-slate-400 w-full h-4">
                      {item.notes || '______________________________________'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedingGrid;