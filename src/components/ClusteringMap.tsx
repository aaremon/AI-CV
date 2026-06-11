import React from 'react';
import { Layers } from 'lucide-react';
import { AnalysisData } from '../types';

interface ClusteringMapProps {
  analysisResult: AnalysisData;
}

export default function ClusteringMap({ analysisResult }: ClusteringMapProps) {
  const skillsList = (analysisResult.current_skills || []).map(s => s.toLowerCase());

  const sectors = [
    {
      name: "Web Engineering",
      keywords: ["react", "vue", "angular", "html", "css", "javascript", "typescript", "node", "express", "tailwind", "bootstrap", "web", "nextjs", "django", "laravel", "php"],
      color: "bg-amber-500",
      textCol: "text-amber-800 dark:text-amber-350",
      bgCol: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      name: "Data Science, Analytics & AI",
      keywords: ["python", "r", "pandas", "numpy", "scikit", "ml", "machine learning", "deep learning", "tensorflow", "pytorch", "sql", "data", "analytics", "tableau", "bi"],
      color: "bg-emerald-500",
      textCol: "text-emerald-800 dark:text-emerald-350",
      bgCol: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      name: "Cloud & Systems DevOps",
      keywords: ["docker", "kubernetes", "aws", "gcp", "azure", "jenkins", "ci/cd", "linux", "git", "terraform", "cloud", "security", "yaml", "ansible"],
      color: "bg-blue-500",
      textCol: "text-blue-800 dark:text-blue-350",
      bgCol: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      name: "Mobile App Innovation",
      keywords: ["kotlin", "swift", "ios", "android", "flutter", "react native", "java", "mobile", "xcode", "mobile development"],
      color: "bg-indigo-500",
      textCol: "text-indigo-800 dark:text-indigo-350",
      bgCol: "bg-indigo-50 dark:bg-indigo-950/20"
    },
    {
      name: "Product Design & Strategy",
      keywords: ["figma", "sketch", "adobe", "ui", "ux", "wireframe", "prototype", "design", "user experience", "product", "agile", "scrum", "pmp"],
      color: "bg-rose-500",
      textCol: "text-rose-800 dark:text-rose-350",
      bgCol: "bg-rose-50 dark:bg-rose-950/20"
    }
  ];

  const matches = sectors.map(sec => {
    const matchedKeywords = skillsList.filter(sk =>
      sec.keywords.some(kw => sk.includes(kw) || kw.includes(sk))
    );
    // Calculate match percentage
    const percent = skillsList.length > 0
      ? Math.round((matchedKeywords.length / skillsList.length) * 100)
      : 0;
    return {
      ...sec,
      matchedKeywords,
      percent: percent > 0 ? percent : (matchedKeywords.length > 0 ? 10 : 0) // minimum score if matched
    };
  });

  // Sort matches by percentage
  const sortedMatches = [...matches].sort((a,b) => b.percent - a.percent);
  const supremeSector = sortedMatches[0]?.percent > 0 ? sortedMatches[0].name : "General Sector Category";

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h4 className="font-extrabold text-slate-850 dark:text-slate-100 text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span>Keyword & Sector Clustering Map</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We crawl parsed keyword markers and cluster them dynamically onto physical sectors based on semantic affinities.
          </p>
        </div>
        <span className="text-[10px] w-fit font-mono font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg">
          NLP CATEGORY ENGINE
        </span>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col md:flex-row gap-3 md:items-center justify-between transition-colors">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 tracking-wider">
              Primary Affinity Predictor
            </span>
            <h5 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              Resume primary clustering points to: <span className="text-indigo-600 dark:text-indigo-400">{supremeSector}</span>
            </h5>
          </div>
          <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold rounded-xl shadow-xs shrink-0 self-start md:self-auto">
            {analysisResult.predicted_field} Match Track
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-widest block">
              Sector Proximities
            </h5>
            <div className="space-y-3">
              {matches.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${Math.max(item.percent, 2)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-widest block">
              Keywords Extracted within Sectors
            </h5>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {matches.filter(m => m.matchedKeywords.length > 0).length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                  No direct matching sector keywords identified. Try adding more tech labels.
                </p>
              ) : (
                matches
                  .filter(m => m.matchedKeywords.length > 0)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border border-slate-100 dark:border-slate-800 ${item.bgCol} space-y-1.5 transition-colors`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wide ${item.textCol}`}>
                          {item.name}
                        </span>
                        <span className="text-[9px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-mono text-slate-400 dark:text-slate-500 font-bold border border-slate-200/50 dark:border-slate-700">
                          {item.matchedKeywords.length} item(s)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.matchedKeywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-[10px] text-slate-650 dark:text-slate-300 rounded-lg shadow-xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
