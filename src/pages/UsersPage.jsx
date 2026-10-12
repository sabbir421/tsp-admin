import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, toggleUserStatus, deleteUserAccount } from '../store/slices/usersSlice';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.users);

  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ role: roleFilter }));
  }, [dispatch, roleFilter]);

  const handleToggleStatus = async (user) => {
    await dispatch(
      toggleUserStatus({
        role: user.userRole,
        id: user.id,
        data: { isActive: !user.isActive },
      })
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalUser) return;
    await dispatch(deleteUserAccount({ role: deleteModalUser.userRole, id: deleteModalUser.id }));
    setDeleteModalUser(null);
  };

  const columns = [
    {
      header: 'User Name',
      key: 'fullName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
            {(row.fullName || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-slate-100">{row.fullName}</div>
            <div className="text-[11px] text-slate-400 font-medium">ID: #{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      key: 'contact',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>{row.countryCode || '+880'} {row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Account Role',
      key: 'userRole',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            row.userRole === 'seller_agent'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}
        >
          {row.userRole === 'seller_agent' ? 'Seller / Agent' : 'Buyer / Tenant'}
        </span>
      ),
    },
    {
      header: 'Phone Verified',
      key: 'isPhoneVerified',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.isPhoneVerified ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <XCircle className="w-4 h-4 text-slate-600" />
              Unverified
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Account Status',
      key: 'isActive',
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            row.isActive !== false
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
          }`}
        >
          {row.isActive !== false ? 'Active' : 'Deactivated'}
        </button>
      ),
    },
    {
      header: 'Joined Date',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-slate-400 font-medium">
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedUser(row)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteModalUser(row)}
            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Delete Account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            User Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage registered sellers, property owners, real estate agents, buyers, and tenants.
          </p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'seller_agent', label: 'Sellers / Agents' },
            { id: 'buyer_tenant', label: 'Buyers / Tenants' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === tab.id
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={list}
        loading={loading}
        searchPlaceholder="Search users by name, email, phone..."
      />

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.fullName || 'User Profile'}
        subtitle={`Account ID #${selectedUser?.id} · ${selectedUser?.roleLabel}`}
      >
        {selectedUser && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Full Name
                </span>
                <span className="font-semibold text-white text-sm">{selectedUser.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Account Role
                </span>
                <span className="font-semibold text-brand-400">{selectedUser.roleLabel}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Email Address
                </span>
                <span className="font-semibold text-slate-200">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Phone Number
                </span>
                <span className="font-semibold text-slate-200">
                  {selectedUser.countryCode || '+880'} {selectedUser.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Phone Verification
                </span>
                <span className={selectedUser.isPhoneVerified ? 'text-emerald-400 font-bold' : 'text-slate-500 font-bold'}>
                  {selectedUser.isPhoneVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Registration Date
                </span>
                <span className="font-semibold text-slate-200">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalUser}
        onClose={() => setDeleteModalUser(null)}
        title="Delete User Account"
        subtitle="This action is permanent and cannot be undone."
      >
        {deleteModalUser && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Are you sure you want to permanently delete <strong className="text-white">{deleteModalUser.fullName}</strong> ({deleteModalUser.email})?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
