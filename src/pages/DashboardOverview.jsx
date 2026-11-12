import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import {
  Users,
  Building2,
  Clock,
  ShieldCheck,
  GitCompare,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function DashboardOverview() {
  const dispatch = useDispatch();
  const { metrics, recentActivities, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const pendingProps = metrics?.pendingProperties || 0;
  const verifiedProps = metrics?.verifiedProperties || 0;
  const totalProps = metrics?.totalProperties || 0;
  const totalUsers = metrics?.totalUsers || 0;
  const totalReqs = metrics?.totalRequirements || 0;
  const totalMatches = metrics?.totalMatches || 0;
  const totalOtps = metrics?.totalOtps || 0;

  const activities = [];
  if (recentActivities?.properties && Array.isArray(recentActivities.properties)) {
    recentActivities.properties.forEach((p) => {
      activities.push({
        text: `Property: ${p.title || `Property #${p.id}`} (${p.propertyType || 'Apartment'}) listed`,
        time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent',
      });
    });
  }
  if (recentActivities?.requirements && Array.isArray(recentActivities.requirements)) {
    recentActivities.requirements.forEach((r) => {
      activities.push({
        text: `Requirement #${r.id} (${r.subType || r.category}) posted`,
        time: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent',
      });
    });
  }
  if (recentActivities?.matches && Array.isArray(recentActivities.matches)) {
    recentActivities.matches.forEach((m) => {
      activities.push({
        text: `Match/Suggestion created for property #${m.propertyId}`,
        time: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Recent',
      });
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e3e7ef] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c2847] tracking-tight">
            Executive Control Center
          </h1>
          <p className="text-sm text-[#667089] mt-1">
            Dhaka City overview · Live platform statistics and actionable review queues.
          </p>
        </div>

        <button
          onClick={() => dispatch(fetchDashboardStats())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f6f7fb] hover:bg-[#eef1f8] border border-[#e3e7ef] text-xs font-bold text-[#1c2847] transition-all self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 6 KPI TILES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#e3e7ef] shadow-sm">
          <b className="text-2xl font-extrabold text-[#1c2847] block">{totalUsers}</b>
          <span className="text-xs text-[#667089] font-medium">Registered users</span>
          <span className="block text-[10px] text-[#1f9d63] font-semibold mt-1">Live accounts</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e7ef] shadow-sm">
          <b className="text-2xl font-extrabold text-[#1c2847] block">{verifiedProps}</b>
          <span className="text-xs text-[#667089] font-medium">Live listings</span>
          <span className="block text-[10px] text-[#667089] font-semibold mt-1">Total: {totalProps}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e7ef] shadow-sm">
          <b className="text-2xl font-extrabold text-[#f2961d] block">{pendingProps}</b>
          <span className="text-xs text-[#667089] font-medium">Listings to approve</span>
          <Link to="/properties" className="block text-[10px] text-[#f2961d] font-semibold mt-1 hover:underline">
            Review queue →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e7ef] shadow-sm">
          <b className="text-2xl font-extrabold text-blue-600 block">{totalReqs}</b>
          <span className="text-xs text-[#667089] font-medium">Buyer requirements</span>
          <Link to="/requirements" className="block text-[10px] text-blue-600 font-semibold mt-1 hover:underline">
            View requirements →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e7ef] shadow-sm">
          <b className="text-2xl font-extrabold text-[#1c2847] block">{totalMatches}</b>
          <span className="text-xs text-[#667089] font-medium">Match suggestions</span>
          <Link to="/matches" className="block text-[10px] text-[#1f9d63] font-semibold mt-1 hover:underline">
            Review matches →
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e3e7ef] shadow-sm">
          <b className="text-2xl font-extrabold text-[#d64545] block">{totalOtps}</b>
          <span className="text-xs text-[#667089] font-medium">OTP verifications</span>
          <Link to="/otp-logs" className="block text-[10px] text-[#d64545] font-semibold mt-1 hover:underline">
            Audit logs →
          </Link>
        </div>
      </div>

      {/* ACTIONABLE QUEUES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NEEDS ATTENTION */}
        <div className="bg-white rounded-2xl border border-[#e3e7ef] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#e3e7ef] font-bold text-sm text-[#1c2847] flex justify-between items-center">
            <span>Needs Attention</span>
            {pendingProps > 0 && (
              <span className="text-xs text-[#f2961d] font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Action required
              </span>
            )}
          </div>

          <div className="divide-y divide-[#e3e7ef]">
            {pendingProps > 0 ? (
              <div className="p-4 flex items-center justify-between gap-4 hover:bg-[#f6f7fb] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f2961d]" />
                  <span className="text-xs font-semibold text-[#1d2333]">
                    {pendingProps} property listing{pendingProps > 1 ? 's' : ''} waiting for verification approval
                  </span>
                </div>
                <Link
                  to="/properties"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#f2961d] text-white hover:bg-[#d97f0a] shadow-sm transition-colors whitespace-nowrap"
                >
                  Review listings
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#667089]">
                <CheckCircle2 className="w-8 h-8 text-[#1f9d63] mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-[#1c2847]">Review queues are clean</p>
                <p className="mt-1">No property listings or moderation items pending admin action.</p>
              </div>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl border border-[#e3e7ef] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#e3e7ef] font-bold text-sm text-[#1c2847]">
            Recent Activity Stream
          </div>

          <div className="divide-y divide-[#e3e7ef]">
            {activities.length > 0 ? (
              activities.map((act, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-[#f6f7fb] transition-colors">
                  <span className="text-[#1d2333] font-medium">{act.text}</span>
                  <span className="text-[#667089] font-semibold whitespace-nowrap ml-2">{act.time}</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#667089]">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-[#1c2847]">No recent activity yet</p>
                <p className="mt-1">Real events like listings, requirements, and suggestions will stream here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
