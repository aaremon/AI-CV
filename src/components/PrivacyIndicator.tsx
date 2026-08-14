import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, Lock, EyeOff } from 'lucide-react';

interface PrivacyIndicatorProps {
  featureName?: string;
  onOpenPrivacySettings?: () => void;
  className?: string;
}

export default function PrivacyIndicator({
  featureName = "AI Processing",
  onOpenPrivacySettings,
  className = ""
}: PrivacyIndicatorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-3.5 text-xs text-emerald-900 dark:text-emerald-200 transition-all ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 font-medium">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-1.5">
              <span>Privacy Protected AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 font-mono">
                PII Redacted
              </span>
            </span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 leading-tight mt-0.5">
              Only required content for {featureName} is sent to Gemini. Contact details & metadata are stripped server-side.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg text-emerald-700 dark:text-emerald-300 transition-colors flex items-center gap-1 font-semibold text-[11px]"
            title="Toggle details"
          >
            <span>Details</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onOpenPrivacySettings && (
            <button
              onClick={onOpenPrivacySettings}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-colors shadow-xs"
            >
              Settings
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 text-[11px] space-y-2 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-800 dark:text-emerald-200">
            <div className="flex items-center gap-1.5 bg-emerald-100/50 dark:bg-emerald-900/30 p-2 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Contact info (email, phone, address) replaced with placeholders</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-100/50 dark:bg-emerald-900/30 p-2 rounded-xl">
              <EyeOff className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Government IDs, DOB, photos & personal metadata excluded</span>
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
            Server-side Policy: Only allowlisted fields pass through AI Privacy Guard checks. No raw PII stored in AI logs.
          </p>
        </div>
      )}
    </div>
  );
}
