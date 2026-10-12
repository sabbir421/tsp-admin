import React from 'react';

export default function KpiCard({ title, value, subtext, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: 'from-brand-500/20 to-orange-500/10 text-brand-500 border-brand-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    blue: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    purple: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 shadow-xl group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br border ${colorMap[color] || colorMap.brand} group-hover:scale-105 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-slate-400 font-medium leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
}
