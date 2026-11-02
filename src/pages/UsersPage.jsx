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
          <div className="w-8 h-8 rounded-lg bg-[#1c2847] flex items-center justify-center font-bold text-white text-xs">
            {(row.fullName || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-[#1c2847]">{row.fullName}</div>
            <div className="text-[11px] text-[#667089] font-medium">ID: #{row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      key: 'contact',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 text-[#1d2333]">
            <Mail className="w-3.5 h-3.5 text-[#667089]" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#667089]">
            <Phone className="w-3.5 h-3.5 text-[#667089]" />
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
          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
            row.userRole === 'seller_agent'
              ? 'bg-[#fff4e5] text-[#f2961d] border-[#fed7aa]'
              : 'bg-[#eef1f8] text-[#1c2847] border-[#cdd5e7]'
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
            <span className="flex items-center gap-1 text-xs font-semibold text-[#1f9d63] bg-[#e3f6ec] px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#667089] bg-[#f6f7fb] px-2 py-0.5 rounded-full">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
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
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
            row.isActive !== false
              ? 'bg-[#e3f6ec] text-[#1f9d63] border-[#a7f3d0] hover:bg-emerald-100'
              : 'bg-[#fde8e8] text-[#d64545] border-[#fecaca] hover:bg-rose-100'
          }`}
        >
          {row.isActive !== false ? 'Active' : 'Suspended'}
        </button>
      ),
    },
    {
      header: 'Joined Date',
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedUser(row)}
            className="p-1.5 rounded-lg border border-[#e3e7ef] bg-white text-slate-700 hover:text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteModalUser(row)}
            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1c2847] tracking-tight">
            User Directory
          </h1>
          <p className="text-xs text-[#667089] mt-1">
            Manage registered sellers, property owners, real estate agents, buyers, and tenants.
          </p>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#e3e7ef] shadow-sm text-xs flex-wrap">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'seller_agent', label: 'Sellers / Agents' },
            { id: 'buyer_tenant', label: 'Buyers / Tenants' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                roleFilter === tab.id
                  ? 'bg-[#1c2847] text-white shadow-sm'
                  : 'text-[#667089] hover:text-[#1c2847] hover:bg-[#eef1f8]'
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
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#fafbfd] border border-[#e3e7ef]">
              <div>
                <span className="text-[#667089] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Full Name
                </span>
                <span className="font-semibold text-[#1c2847] text-sm">{selectedUser.fullName}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Account Role
                </span>
                <span className="font-semibold text-[#f2961d]">{selectedUser.roleLabel}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Email Address
                </span>
                <span className="font-semibold text-[#1d2333]">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Phone Number
                </span>
                <span className="font-semibold text-[#1d2333]">
                  {selectedUser.countryCode || '+880'} {selectedUser.phone}
                </span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Phone Verification
                </span>
                <span className={selectedUser.isPhoneVerified ? 'text-[#1f9d63] font-bold' : 'text-[#667089] font-bold'}>
                  {selectedUser.isPhoneVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div>
                <span className="text-[#667089] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                  Registration Date
                </span>
                <span className="font-semibold text-[#1d2333]">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#e3e7ef] hover:bg-[#eef1f8] text-[#1c2847] font-bold text-xs"
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
            <p className="text-[#1d2333]">
              Are you sure you want to permanently delete <strong className="text-[#1c2847]">{deleteModalUser.fullName}</strong> ({deleteModalUser.email})?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalUser(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#e3e7ef] text-[#667089] font-bold hover:bg-[#eef1f8]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
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
