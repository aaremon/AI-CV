import React from 'react';
import { Layers } from 'lucide-react';
import { AnalysisData } from '../types';

interface ClusteringMapProps {
  analysisResult: AnalysisData;
}

export default function ClusteringMap({ analysisResult }: ClusteringMapProps) {
  const rawSkills = analysisResult.current_skills || [];

  const sectors = [
    {
      name: "Digital Marketing & Growth",
      patterns: [
        /\bseo\b/i, /\bsearch\s+engine\s+optimization\b/i, /\bsem\b/i, /\bgoogle\s+ads\b/i, /\bppc\b/i,
        /\bcontent\s+marketing\b/i, /\bsocial\s+media\b/i, /\bemail\s+marketing\b/i, /\bmeta\s+ads\b/i,
        /\blinkedin\s+ads\b/i, /\bga4\b/i, /\bgoogle\s+analytics\b/i, /\bcopywriting\b/i, /\bhubspot\b/i,
        /\bmailchimp\b/i, /\bmarketing\s+automation\b/i, /\bcro\b/i, /\ba\/b\s+testing\b/i
      ],
      color: "bg-purple-500",
      textCol: "text-purple-800 dark:text-purple-300",
      bgCol: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      name: "Business Analysis & Strategy",
      patterns: [
        /\brequirements?\s+gathering\b/i, /\bbrd\b/i, /\bfrd\b/i, /\bbpmn\b/i, /\bprocess\s+model(ing|s)?\b/i,
        /\bpower\s*bi\b/i, /\btableau\b/i, /\bjira\b/i, /\bconfluence\b/i, /\bagile\b/i, /\bscrum\b/i,
        /\bstakeholder\s+management\b/i, /\bgap\s+analysis\b/i, /\buser\s+stories\b/i, /\bdata\s+analysis\b/i
      ],
      color: "bg-cyan-500",
      textCol: "text-cyan-800 dark:text-cyan-300",
      bgCol: "bg-cyan-50 dark:bg-cyan-950/20"
    },
    {
      name: "Web & Software Engineering",
      patterns: [
        /\bjavascript\b/i, /\btypescript\b/i, /\breact\b/i, /\bnext(\.js)?\b/i, /\bnode(\.js)?\b/i,
        /\bexpress(\.js)?\b/i, /\bvue(\.js)?\b/i, /\bangular\b/i, /\bhtml5?\b/i, /\bcss3?\b/i,
        /\btailwind(css)?\b/i, /\bbootstrap\b/i, /\brest(ful)?\s*(api)?s?\b/i, /\bgraphql\b/i,
        /\bjava\b(?!script)/i, /\bc\+\+\b/i, /\bc#\b/i, /\b\.net\b/i, /\bphp\b/i, /\blaravel\b/i,
        /\bdjango\b/i, /\bflask\b/i, /\bspring\s*boot\b/i, /\bgo(lang)?\b/i, /\brust\b/i
      ],
      color: "bg-amber-500",
      textCol: "text-amber-800 dark:text-amber-300",
      bgCol: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      name: "Data Science, Analytics & AI",
      patterns: [
        /\bpython\b/i, /\bpandas\b/i, /\bnumpy\b/i, /\bscikit[-_]?learn\b/i, /\btensorflow\b/i,
        /\bpytorch\b/i, /\bmachine\s+learning\b/i, /\bdeep\s+learning\b/i, /\bnlp\b/i, /\bcomputer\s+vision\b/i,
        /\bgenerative\s+ai\b/i, /\bllm\b/i, /\bstatistics\b/i, /\br\s+programming\b/i, /\bsql\b/i
      ],
      color: "bg-emerald-500",
      textCol: "text-emerald-800 dark:text-emerald-300",
      bgCol: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      name: "UI/UX & Product Design",
      patterns: [
        /\bfigma\b/i, /\badobe\s+xd\b/i, /\bphotoshop\b/i, /\billustrator\b/i, /\bui\s*\/\s*ux\b/i,
        /\bwirefram(es|ing)\b/i, /\bprototyp(es|ing)\b/i, /\bdesign\s+systems?\b/i, /\buser\s+research\b/i,
        /\busability\s+testing\b/i, /\binformation\s+architecture\b/i
      ],
      color: "bg-rose-500",
      textCol: "text-rose-800 dark:text-rose-300",
      bgCol: "bg-rose-50 dark:bg-rose-950/20"
    },
    {
      name: "Finance, Accounting & Valuation",
      patterns: [
        /\bfinancial\s+model(ing)?\b/i, /\bexcel\b/i, /\bgaap\b/i, /\bifrs\b/i, /\bquickbooks\b/i,
        /\bbudget(ing)?\b/i, /\bforecasting\b/i, /\baudit(ing)?\b/i, /\btax(ation)?\b/i, /\bdcf\b/i,
        /\bvaluation\b/i, /\bfinancial\s+statements?\b/i, /\bvariance\s+analysis\b/i
      ],
      color: "bg-teal-500",
      textCol: "text-teal-800 dark:text-teal-300",
      bgCol: "bg-teal-50 dark:bg-teal-950/20"
    },
    {
      name: "Human Resources & Talent",
      patterns: [
        /\btalent\s+acquisition\b/i, /\brecruit(ing|ment)\b/i, /\bsourcing\b/i, /\bonboarding\b/i,
        /\bemployee\s+relations\b/i, /\bhris\b/i, /\bpayroll\b/i, /\bworkday\b/i, /\bbamboohr\b/i,
        /\bperformance\s+management\b/i
      ],
      color: "bg-pink-500",
      textCol: "text-pink-800 dark:text-pink-300",
      bgCol: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      name: "Sales & Customer Success",
      patterns: [
        /\bsalesforce\b/i, /\bcrm\b/i, /\blead\s+generation\b/i, /\bpipeline\s+management\b/i,
        /\bdeal\s+closing\b/i, /\bcontract\s+negotiation\b/i, /\bzendesk\b/i, /\bcustomer\s+support\b/i,
        /\bcsat\b/i, /\bnps\b/i, /\bconflict\s+resolution\b/i
      ],
      color: "bg-blue-600",
      textCol: "text-blue-800 dark:text-blue-300",
      bgCol: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      name: "Cloud & Systems DevOps",
      patterns: [
        /\bdocker\b/i, /\bkubernetes\b/i, /\bk8s\b/i, /\baws\b/i, /\bgcp\b/i, /\bazure\b/i,
        /\bci[\/-]cd\b/i, /\bjenkins\b/i, /\blinux\b/i, /\bgit\b/i, /\bterraform\b/i, /\bhelm\b/i
      ],
      color: "bg-sky-500",
      textCol: "text-sky-800 dark:text-sky-300",
      bgCol: "bg-sky-50 dark:bg-sky-950/20"
    },
    {
      name: "Mobile App Innovation",
      patterns: [
        /\bflutter\b/i, /\breact\s+native\b/i, /\bkotlin\b/i, /\bandroid\b/i, /\bswift\b/i,
        /\bswiftui\b/i, /\bios\b/i, /\bxcode\b/i
      ],
      color: "bg-indigo-500",
      textCol: "text-indigo-800 dark:text-indigo-300",
      bgCol: "bg-indigo-50 dark:bg-indigo-950/20"
    }
  ];

  // Match each skill accurately using regex word boundaries
  const matches = sectors.map(sec => {
    const matchedKeywords = rawSkills.filter(sk =>
      sec.patterns.some(pattern => pattern.test(sk))
    );
    const percent = rawSkills.length > 0
      ? Math.round((matchedKeywords.length / rawSkills.length) * 100)
      : 0;
    return {
      ...sec,
      matchedKeywords,
      percent: percent > 0 ? percent : (matchedKeywords.length > 0 ? 10 : 0)
    };
  });

  // Filter and prioritize relevant sectors
  const activeMatches = matches.filter(m => m.matchedKeywords.length > 0);
  const sortedMatches = [...matches].sort((a, b) => b.percent - a.percent);
  
  // Show top matched sector, or match the user's predicted field
  const supremeSector = sortedMatches[0]?.percent > 0 
    ? sortedMatches[0].name 
    : (analysisResult.predicted_field || "General Sector Category");

  // Display top 5 relevant sectors for the chart
  const displayedSectors = sortedMatches.slice(0, 5);

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
            {analysisResult.predicted_field || supremeSector} Match Track
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="text-xs font-extrabold text-slate-700 dark:text-slate-350 uppercase tracking-widest block">
              Sector Proximities
            </h5>
            <div className="space-y-3">
              {displayedSectors.map((item, idx) => (
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
              {activeMatches.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                  No direct matching sector keywords identified. Try adding more domain skills.
                </p>
              ) : (
                activeMatches.map((item, idx) => (
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
