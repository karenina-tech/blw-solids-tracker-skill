import { useState } from 'react';
import { mockChecklistData } from './mocks/mockChecklist';
import type { ChecklistItem } from './@types/feeding';
import  ProgressStats from './components/dashboard/ProgressStats';
import  FeedingGrid  from './components/table/FeedingGrid';
import { Printer, ShieldAlert } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<ChecklistItem[]>(mockChecklistData);

  const handleUpdateRow = (index: number, updatedItem: ChecklistItem) => {
    const updatedData = [...data];
    updatedData[index] = updatedItem;
    setData(updatedData);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        
        {/* Upper Action Bar */}
        <div className="no-print flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">BLW Workspace</h1>
           
          </div>
          <button 
            onClick={triggerPrint}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-4 py-2 rounded-xl text-xs shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print to Fridge
          </button>
        </div>

        {/* Dashboard Panels */}
        <ProgressStats data={data} babyName="Santi" />

        {/* Core Checklist Table Grid */}
        <FeedingGrid data={data} onUpdateRow={handleUpdateRow} />

        {/* Clinical Quick Reference Banner */}
        <footer className="mt-8 border border-rose-200/60 bg-rose-50/30 rounded-xl p-5">
          <div className="flex gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 mb-1">🚨 Allergy Reaction Quick Reference</h4>
              <p className="text-xs text-rose-700 leading-relaxed mb-3">
                Stop feeding and contact your pediatrician or emergency services immediately if any of the following appear within 2 hours of exposure: Hives, sudden swelling of lips/tongue, vomiting, wheezing, or loss of alertness.
              </p>
              <p className="text-[10px] text-slate-400 font-medium italic">
                Disclaimer: This checklist is an educational mapping utility and does not constitute primary clinical advice.
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}