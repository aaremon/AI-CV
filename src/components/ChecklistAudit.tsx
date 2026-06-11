import React from 'react';
import { Layers, CheckCircle, XCircle } from 'lucide-react';
import { FeedbackDetail } from '../types';

interface ChecklistAuditProps {
  feedback: FeedbackDetail[];
}

export default function ChecklistAudit({ feedback }: ChecklistAuditProps) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-base flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <span>Parser Checklist Audit Score</span>
        </h4>
        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
          CRITICAL METRICS CHECK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedback.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-start gap-3.5 transition-colors"
          >
            {item.status === 'added' ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <CheckCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-450 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <XCircle className="w-4 h-4" />
              </div>
            )}
            <div className="space-y-1 overflow-hidden w-full">
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                  {item.factor} Section
                </h5>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg leading-none shrink-0 ${
                    item.status === 'added'
                      ? 'bg-emerald-100/70 text-emerald-850 dark:bg-emerald-900/35 dark:text-emerald-350'
                      : 'bg-rose-100/70 text-rose-850 dark:bg-rose-900/35 dark:text-rose-350'
                  }`}
                >
                  {item.status === 'added' ? 'Present' : 'Missing'}
                </span>
              </div>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed font-sans">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
