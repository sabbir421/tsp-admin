import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmins, createNewAdmin, removeAdmin, clearAdminErrors } from '../store/slices/adminsSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { list, loading, submitting, submitError } = useSelector((state) => state.admins);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    dispatch(clearAdminErrors());
    setForm({ fullName: '', email: '', password: '' });
    setSuccessMsg('');
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAdminErrors());
    setSuccessMsg('');

    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      return;
    }

    const res = await dispatch(createNewAdmin(form));
    if (createNewAdmin.fulfilled.match(res)) {
      setSuccessMsg(`Admin account created for ${form.email}`);
      setForm({ fullName: '', email: '', password: '' });
      setTimeout(() => {
        setCreateModalOpen(false);
        setSuccessMsg('');
      }, 1500);
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (admin.id === 999999 || admin.role === 'super_admin') {
      alert('Primary root super admin account cannot be deleted.');
      return;
    }

    if (window.confirm(`Are you sure you want to revoke admin access for ${admin.fullName} (${admin.email})?`)) {
      await dispatch(removeAdmin(admin.id));
    }
  };

  const columns = [
    {
      header: 'Admin Name',
      key: 'fullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1c2847] flex items-center justify-center font-bold text-white text-xs shadow-sm">
            {(row.fullName || 'A').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-[#1c2847]">{row.fullName}</div>
            <div className="text-[11px] text-[#667089] font-medium">ID: #{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Email Address',
      key: 'email',
      render: (row) => (
        <div className="flex items-center gap-2 text-xs text-[#1d2333] font-medium">
          <Mail className="w-3.5 h-3.5 text-[#667089]" />
          <span>{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Role Level',
      key: 'role',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
            row.role === 'super_admin'
              ? 'bg-[#eef1f8] text-[#1c2847] border-[#cdd5e7]'
              : 'bg-[#fff4e5] text-[#f2961d] border-[#fed7aa]'
          }`}
        >
          {row.role === 'super_admin' ? 'Super Administrator' : 'Admin User'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'isActive',
      render: () => (
        <span className="flex items-center gap-1 text-xs font-bold text-[#1f9d63] bg-[#e3f6ec] px-2 py-0.5 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active Access
        </span>
      ),
    },
    {
      header: 'Created Date',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-[#667089] font-medium">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div>
          {row.id !== 999999 && row.role !== 'super_admin' ? (
            <button
              onClick={() => handleDeleteAdmin(row)}
              className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
              title="Revoke Admin Access"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-bold text-[#667089] uppercase tracking-wider">Root Protected</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            Admin Team Management
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Create new admin accounts and manage administrative access permissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2961d] hover:bg-[#d97f0a] text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New Admin</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        searchPlaceholder="Search admin users by name, email..."
      />

      {/* Create New Admin Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Admin Account"
        subtitle="Add a new administrator to access the TrueSpace Admin Portal"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#667089] uppercase tracking-wider text-[10px] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] text-xs focus:outline-none focus:border-[#f2961d]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#667089] uppercase tracking-wider text-[10px] mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="newadmin@truespaceproperty.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] text-xs focus:outline-none focus:border-[#f2961d]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#667089] uppercase tracking-wider text-[10px] mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] text-xs focus:outline-none focus:border-[#f2961d]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e7ef]">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#e3e7ef] hover:bg-[#eef1f8] text-[#667089] font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#f2961d] hover:bg-[#d97f0a] text-white font-bold shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
