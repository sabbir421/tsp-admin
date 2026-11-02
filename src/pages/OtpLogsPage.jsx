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
        <div className="font-bold text-[#1c2847] flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-[#f2961d]" />
          <span>{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Recipient Email',
      key: 'email',
      render: (row) => <span className="text-xs text-[#667089] font-medium">{row.email || 'N/A'}</span>,
    },
    {
      header: 'OTP Code',
      key: 'otpCode',
      render: (row) => (
        <span className="font-mono font-extrabold text-sm text-[#f2961d] bg-[#fff4e5] px-2.5 py-1 rounded border border-[#fed7aa] tracking-wider">
          {row.otpCode}
        </span>
      ),
    },
    {
      header: 'Purpose',
      key: 'type',
      render: (row) => (
        <span className="text-xs font-bold text-[#1d2333] capitalize">
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
              ? 'bg-[#e3f6ec] text-[#1f9d63] border-[#a7f3d0]'
              : 'bg-[#fff4e5] text-[#f2961d] border-[#fed7aa]'
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
        <span className="text-xs text-[#667089] font-medium">
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            OTP Audit Logs
          </h1>
          <p className="text-xs text-[#667089] mt-1">
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
