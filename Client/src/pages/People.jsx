import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Tabs from '../components/Tabs'

const People = () => {
  const [activeTab, setActiveTab] = useState('directory')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers()
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

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

  const renderDirectory = () => (
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
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
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
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      user.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button className="text-primary font-bold text-sm hover:underline">Edit</button>
                  <button className="text-red-500 font-bold text-sm hover:underline">Ban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm">
                      Verify
                    </button>
                    <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm border border-red-100">
                      Reject
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
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                  Flagged User Watchlist
                </h4>
              </div>
              <div className="divide-y divide-gray-50">
                {flaggedUsers.map((user) => (
                  <div
                    key={user.userId}
                    className="px-6 py-4 flex justify-between items-center bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-gray-900">{user.userName}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold border border-red-100 uppercase">
                        {user.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      Last IP: {user.ipAddress}
                    </div>
                  </div>
                ))}
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
        {activeTab === 'directory' && (
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
            Add New User
          </button>
        )}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'directory' && renderDirectory()}
      {activeTab === 'kyc' && renderKYC()}
      {activeTab === 'fraud' && renderFraud()}
    </div>
  )
}

export default People
