import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOtpLogs } from '../store/slices/logsSlice';
import DataTable from '../components/common/DataTable';
import { KeyRound, CheckCircle, Clock } from 'lucide-react';

export default function OtpLogsPage() {
  const dispatch = useDispatch();
  const { otpLogs, loading } = useSelector((state) => state.logs);

  useEffect(() => {
    dispatch(fetchOtpLogs());
  }, [dispatch]);

  const columns = [
    {
      header: 'Recipient Phone',
      key: 'phone',
      render: (row) => (
        <div className="font-bold text-slate-100 flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-brand-500" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Recipient Email',
      key: 'email',
      render: (row) => <span className="text-xs text-slate-300 font-medium">{row.email || 'N/A'}</span>,
    },
    {
      header: 'OTP Code',
      key: 'otpCode',
      render: (row) => (
        <span className="font-mono font-extrabold text-sm text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded border border-brand-500/20 tracking-wider">
          {row.otpCode}
        </span>
      ),
    },
    {
      header: 'Purpose',
      key: 'type',
      render: (row) => (
        <span className="text-xs font-bold text-slate-200 capitalize">
          {row.type || 'Registration'}
        </span>
      ),
    },
    {
      header: 'Used Status',
      key: 'isUsed',
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
            row.isUsed
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          {row.isUsed ? 'Used' : 'Unused / Pending'}
        </span>
      ),
    },
    {
      header: 'Generated Date & Time',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            OTP Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System audit trail of all generated verification OTP codes and SMS delivery logs.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={otpLogs}
        loading={loading}
        searchPlaceholder="Search logs by phone, email, OTP code..."
      />
    </div>
  );
}
