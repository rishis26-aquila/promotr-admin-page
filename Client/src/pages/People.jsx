import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import Tabs from '../components/Tabs'

const People = () => {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'directory')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [actionLoading, setActionLoading] = useState({})
  const [filters, setFilters] = useState({ role: '', status: '', kycStatus: '' })
  const [searchQuery, setSearchQuery] = useState('')

  const setUserActionLoading = (userId, val) =>
    setActionLoading((prev) => ({ ...prev, [userId]: val }))

  const handleEditClick = (user) => {
    setEditingUser(user)
    setFormData(user)
  }

  const handleCloseModal = () => {
    setEditingUser(null)
    setFormData({})
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        userName: formData.userName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      }
      const result = await api.updateUser(editingUser.userId, payload)
      if (!result.success) {
        alert(`Failed to update user: ${result.message}`)
        return
      }
      setUsers(users.map((u) => (u.userId === editingUser.userId ? result.data : u)))
      handleCloseModal()
    } catch (error) {
      console.error('Failed to update user', error)
      alert('Failed to update user')
    }
  }

  const handleBan = async (user) => {
    if (!confirm(`Ban ${user.userName}? This will set their status to banned.`)) return
    setUserActionLoading(user.userId, 'ban')
    try {
      const result = await api.banUser(user.userId)
      if (!result.success) {
        alert(`Failed to ban user: ${result.message}`)
        return
      }
      setUsers(users.map((u) => (u.userId === user.userId ? result.data : u)))
    } catch (err) {
      alert('Failed to ban user')
    } finally {
      setUserActionLoading(user.userId, null)
    }
  }

  const handleKyc = async (user, status) => {
    setUserActionLoading(user.userId, status)
    try {
      const result = await api.updateKycStatus(user.userId, status)
      if (!result.success) {
        alert(`Failed to update KYC: ${result.message}`)
        return
      }
      setUsers(users.map((u) => (u.userId === user.userId ? result.data : u)))
    } catch (err) {
      alert('Failed to update KYC status')
    } finally {
      setUserActionLoading(user.userId, null)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const params = {}
        if (filters.role) params.role = filters.role
        if (filters.status) params.status = filters.status
        if (filters.kycStatus) params.kycStatus = filters.kycStatus
        
        const response = await api.getUsers(params)
        if (response.success && response.data) {
          setUsers(response.data)
        } else {
          console.error('Failed to load users:', response.message)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [filters.role, filters.status, filters.kycStatus])

  const tabs = [
    { id: 'directory', label: 'User Directory' },
    { id: 'kyc', label: 'KYC Approval' },
    { id: 'fraud', label: 'Fraud Monitoring' },
  ]

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-primary font-bold">
        Loading users...
      </div>
    )

  const allRoles = [...new Set(users.map((u) => u.role).filter(Boolean))].sort()
  const allStatuses = [...new Set(users.map((u) => u.status).filter(Boolean))].sort()
  const allKycStatuses = [...new Set(users.map((u) => u.kycStatus).filter(Boolean))].sort()

  // Filter users by search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      user.userName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone?.toString().includes(query) ||
      user.userId?.toString().includes(query)
    )
  })

  const statusBadge = (status) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-100',
      suspended: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      banned: 'bg-red-50 text-red-700 border-red-100',
    }
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-100'}`}
      >
        {status}
      </span>
    )
  }

  const renderDirectory = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none text-gray-700"
        >
          <option value="">All Roles</option>
          {allRoles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none text-gray-700"
        >
          <option value="">All Statuses</option>
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filters.kycStatus}
          onChange={(e) => setFilters({ ...filters, kycStatus: e.target.value })}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none text-gray-700"
        >
          <option value="">All KYC Status</option>
          {allKycStatuses.map((k) => (
            <option key={k} value={k}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </option>
          ))}
        </select>
        {(filters.role || filters.status || filters.kycStatus) && (
          <button
            onClick={() => setFilters({ role: '', status: '', kycStatus: '' })}
            className="text-sm text-gray-400 font-bold hover:text-gray-600"
          >
            Clear filters
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400 font-bold">
          {filteredUsers.length} {filteredUsers.length === users.length ? 'users' : `of ${users.length} users`}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  KYC
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    {searchQuery ? `No users found matching "${searchQuery}"` : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.userName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600 capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">{statusBadge(user.status)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          user.kycStatus === 'verified'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : user.kycStatus === 'rejected'
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}
                      >
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-primary font-bold text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleBan(user)}
                        disabled={user.status === 'banned' || actionLoading[user.userId] === 'ban'}
                        className="text-red-500 font-bold text-sm hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {actionLoading[user.userId] === 'ban' ? 'Banning...' : 'Ban'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderKYC = () => {
    const pendingUsers = users.filter((u) => u.kycStatus === 'pending')

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">
              Pending Verifications ({pendingUsers.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((user) => (
                <div key={user.userId} className="px-8 py-6 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 font-bold text-lg">
                      {user.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.userName}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {user.joinDate} • {user.role.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleKyc(user, 'verified')}
                      disabled={!!actionLoading[user.userId]}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[user.userId] === 'verified' ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleKyc(user, 'rejected')}
                      disabled={!!actionLoading[user.userId]}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[user.userId] === 'rejected' ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-400 italic">
                No pending KYC requests at the moment.
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderFraud = () => {
    const flaggedUsers = users.filter((u) => u.status === 'suspended' || u.kycStatus === 'rejected')

    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Security Alerts</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold">System Alert: IP Spoofing Detected</p>
                <p className="text-sm opacity-90">
                  Multiple accounts accessed from the same proxy in Bangalore.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-8">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Flagged User Watchlist ({flaggedUsers.length})
                </h4>
              </div>
              <div className="divide-y divide-gray-50">
                {flaggedUsers.length > 0 ? (
                  flaggedUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="px-6 py-4 flex justify-between items-center bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-sm">
                          {user.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{user.userName}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold border border-red-100 uppercase">
                          {user.status}
                        </span>
                        {user.kycStatus === 'rejected' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-bold border border-orange-100 uppercase">
                            KYC Rejected
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        Last IP: {user.ipAddress}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 italic">
                    No flagged users at the moment.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">People Hub</h1>
          <p className="text-gray-500 mt-1">Manage users and ensure platform safety</p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'directory' && renderDirectory()}
      {activeTab === 'kyc' && renderKYC()}
      {activeTab === 'fraud' && renderFraud()}

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit User</h2>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="worker">Worker</option>
                    <option value="business">Business</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">KYC Status</label>
                  <select
                    name="kycStatus"
                    value={formData.kycStatus || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-primary/90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default People
