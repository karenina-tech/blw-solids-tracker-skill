import React from 'react';
import type { ChecklistItem } from '../../@types/feeding';
import { CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

interface ProgressStatsProps {
  data: ChecklistItem[];
  babyName: string;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ data, babyName }) => {
  const totalDays = data.length;
  const offeredCount = data.filter(item => item.isOffered).length;
  const allergyCount = data.filter(item => item.hasAllergyReaction).length;
  const completionPercentage = Math.round((offeredCount / totalDays) * 100) || 0;

  return (
    <div className="no-print bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-700/50 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Solid Food Plan</span>
          <h2 className="text-2xl font-bold tracking-tight">{babyName}'s Journey</h2>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="w-full bg-slate-700 rounded-full h-2.5 w-40">
            <div className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <span className="text-sm font-medium text-slate-300">{completionPercentage}% Done</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase">Total Timeline</p>
            <p className="text-lg font-bold">{totalDays} Scheduled Days</p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase">Foods Introduced</p>
            <p className="text-lg font-bold">{offeredCount} / {totalDays} Offered</p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/30 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase">Tracked Reactions</p>
            <p className="text-lg font-bold text-rose-300">{allergyCount} Alerted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;