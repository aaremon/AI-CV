import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { AnalysisData } from '../types';
import { Award, Target, CheckCircle2, AlertCircle } from 'lucide-react';

interface ResumeChartsProps {
  data: AnalysisData;
}

export default function ResumeCharts({ data }: ResumeChartsProps) {
  const score = data.resume_score;
  
  // 1. Double Gauge Score / Target Pie Chart
  const scorePieData = [
    { name: 'Your Score', value: score },
    { name: 'Remaining', value: Math.max(0, 100 - score) }
  ];

  // 2. Compute Segment Benchmarks based on the actual score factors
  const factors = data.score_factors;
  
  const techScore = (factors.has_skills ? 50 : 0) + (factors.has_projects ? 50 : 0);
  const professionalScore = (factors.has_experience ? 55 : 0) + (factors.has_education ? 45 : 0);
  const achievementsScore = (factors.has_achievements ? 50 : 0) + (factors.has_certifications ? 50 : 0);
  const profileScore = (factors.has_objective ? 50 : 0) + ((factors.has_hobbies || factors.has_interests) ? 50 : 0);

  const benchmarkData = [
    {
      name: 'Tech Stack & Projects',
      'Your Score': techScore,
      'Industry Target': 90,
    },
    {
      name: 'Experience & Degrees',
      'Your Score': professionalScore,
      'Industry Target': 85,
    },
    {
      name: 'Portfolio / Certs',
      'Your Score': achievementsScore,
      'Industry Target': 80,
    },
    {
      name: 'Summary / Profile',
      'Your Score': profileScore,
      'Industry Target': 85,
    }
  ];

  // 3. Radar map data for overall keywords/sector alignment mapping
  const radarData = [
    { subject: 'Skills Matrix', A: factors.has_skills ? 100 : 30, B: 90, fullMark: 100 },
    { subject: 'Projects Depth', A: factors.has_projects ? 100 : 20, B: 85, fullMark: 100 },
    { subject: 'Employment Hist', A: factors.has_experience ? 100 : 40, B: 95, fullMark: 100 },
    { subject: 'Credential Audit', A: factors.has_education ? 100 : 50, B: 85, fullMark: 100 },
    { subject: 'Growth Elements', A: factors.has_certifications ? 100 : 10, B: 80, fullMark: 100 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="resume-charts-view">
      {/* Circle Radial Score Widget */}
      <div className="lg:col-span-4 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center min-h-[320px] transition-colors">
        <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
          ATS Evaluation Score
        </span>
        <div className="w-44 h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scorePieData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={74}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                <Cell fill={score >= 80 ? "#10B981" : score >= 60 ? "#4F46E5" : "#F59E0B"} />
                <Cell fill="#EEF2F6" className="dark:fill-slate-800" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <span className="text-5xl font-black font-display text-slate-800 dark:text-slate-100 block">
              {score}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 dark:text-slate-500 mt-1">
              out of 100
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-350">
            {score >= 80 ? 'Highly Optimised Profile' : score >= 60 ? 'Moderate Alignment' : 'Needs Optimization'}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Target benchmark: 85+ rating.
          </p>
        </div>
      </div>

      {/* Bar Chart ATS Benchmark Competency */}
      <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[320px] transition-colors">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight">
              Resume Component Scoring vs. Industry Benchmarks
            </h4>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-250 dark:ring-slate-700 px-2 py-0.5 rounded-lg text-slate-500 dark:text-slate-400 font-bold font-mono">
              COMPETENCY SCORES
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-normal">
            A granular side-by-side audit of your calculated sub-scores mapped alongside typical market baseline benchmarks.
          </p>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={benchmarkData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  border: 'none',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
              <Bar dataKey="Your Score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Industry Target" fill="#94A3B8" opacity={0.3} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Extra Interactive Section: Structural Compliance Gauge / Gaps Map */}
      <div className="lg:col-span-12 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/80 dark:border-indigo-900/40 rounded-3xl p-6 transition-colors">
        <h5 className="font-bold text-xs text-indigo-950 dark:text-indigo-200 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-650 dark:text-indigo-400" />
          <span>Interactive Structural Compliance Check Gaps</span>
        </h5>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Work Record', status: factors.has_experience },
            { label: 'Key Skills', status: factors.has_skills },
            { label: 'Academic Details', status: factors.has_education },
            { label: 'Side Projects', status: factors.has_projects },
            { label: 'Certifications', status: factors.has_certifications },
          ].map((itm, iX) => (
            <div
              key={iX}
              className={`p-3 rounded-2xl border transition-all ${
                itm.status
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/45 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/45 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold">{itm.label}</span>
                {itm.status ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-450 shrink-0" />
                )}
              </div>
              <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 block">
                {itm.status ? 'Compliance verified' : 'Recommended addition'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
