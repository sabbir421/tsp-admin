import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { updatePropStatus } from '../store/slices/propertiesSlice';
import KpiCard from '../components/common/KpiCard';
import {
  Users,
  Building2,
  ClipboardList,
  GitCompare,
  CheckCircle2,
  Clock,
  UserCheck,
  CalendarCheck,
  ArrowUpRight,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { metrics, recentActivities, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleQuickApprove = async (id) => {
    await dispatch(updatePropStatus({ id, status: 'verified' }));
    dispatch(fetchDashboardStats());
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Executive Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics, property verification queue, user directory overview, and system metrics.
          </p>
        </div>

        <button
          onClick={() => dispatch(fetchDashboardStats())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Registered Users"
          value={metrics.totalUsers}
          subtext={`${metrics.totalSellers} Sellers/Agents · ${metrics.totalBuyers} Buyers/Tenants`}
          icon={Users}
          color="brand"
          trend="+12% this month"
        />
        <KpiCard
          title="Total Properties Listed"
          value={metrics.totalProperties}
          subtext={`${metrics.verifiedProperties} Verified · ${metrics.pendingProperties} Pending`}
          icon={Building2}
          color="emerald"
          trend={`${metrics.pendingProperties} Action Required`}
        />
        <KpiCard
          title="Active Requirements"
          value={metrics.totalRequirements}
          subtext="Submitted by active buyers & tenants"
          icon={ClipboardList}
          color="blue"
          trend="Live Feed"
        />
        <KpiCard
          title="Matches & Site Visits"
          value={metrics.totalMatches}
          subtext={`${metrics.acceptedMatches} Matches Accepted · ${metrics.completedVisits} Visits Completed`}
          icon={GitCompare}
          color="purple"
          trend="High Conversion"
        />
      </div>

      {/* Actionable Queue: Pending Verifications */}
      {metrics.pendingProperties > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">
                {metrics.pendingProperties} Property Listings Awaiting Admin Verification
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40">
              High Priority
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Review and approve pending properties to make them publicly visible in the browse feed and available for matching.
          </p>
        </div>
      )}

      {/* Two Column Layout: Recent Activities & Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed: Recent Properties */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-500" />
              <span>Recent Property Submissions</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Last 5 Listings</span>
          </div>

          <div className="space-y-3">
            {recentActivities.properties.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent properties listed</p>
            ) : (
              recentActivities.properties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white truncate">{prop.title}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          prop.status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {prop.propertyFor === 'rent' ? 'For Rent' : 'For Sale'} · {prop.sector || prop.area}, {prop.city} · ৳{Number(prop.price).toLocaleString()}
                    </p>
                  </div>

                  {prop.status === 'pending' && (
                    <button
                      onClick={() => handleQuickApprove(prop.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1 shrink-0 transition-all"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Health & Requirement Stream */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-400" />
              <span>Latest Buyer Requirements</span>
            </h3>
          </div>

          <div className="space-y-3">
            {recentActivities.requirements.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No recent buyer requirements</p>
            ) : (
              recentActivities.requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{req.title || 'Property Requirement'}</span>
                    <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                      {req.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Budget: {req.maxBudget ? `৳${Number(req.maxBudget).toLocaleString()}` : 'Flexible'} · {req.area || req.city}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
