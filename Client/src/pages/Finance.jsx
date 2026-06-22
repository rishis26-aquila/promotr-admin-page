import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Tabs from '../components/Tabs'

const Finance = () => {
  const [activeTab, setActiveTab] = useState('payouts')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dashRes, usersRes] = await Promise.all([api.getDashboard(), api.getUsers()])
        if (dashRes.success) setStats(dashRes.data)
        if (usersRes.success) setUsers(usersRes.data)
      } catch (error) {
        console.error('Error fetching financial stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const tabs = [
    { id: 'payouts', label: 'Payout Management' },
    { id: 'commission', label: 'Commission Tracking' },
    { id: 'reports', label: 'Financial Reports' },
  ]

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-primary font-bold">
        Loading financial data...
      </div>
    )
  if (!stats)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-bold">
        Error loading financial data.
      </div>
    )

  const { overview, jobsByStatus = {}, paymentsByStatus = {} } = stats

  // Build recent disbursements from real user data (paid jobs)
  const paidUsers = users
    .filter((u) => u.paymentStatus === 'paid' && u.jobAmount)
    .sort((a, b) => (b.jobCompletedDate || '').localeCompare(a.jobCompletedDate || ''))
    .slice(0, 8)

  const renderPayouts = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
            Total Platform Revenue
          </h3>
          <p className="text-4xl font-black text-gray-900">
            ₹{overview.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
            Payouts Processed
          </h3>
          <p className="text-4xl font-black text-green-600">
            ₹{(overview.totalRevenue - overview.totalCommission).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
            Jobs by Status
          </h3>
          <div className="space-y-1 mt-2">
            {Object.entries(jobsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className="capitalize text-gray-600">{status.replace('_', ' ')}</span>
                <span className="font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Disbursements</h3>
          <span className="text-xs font-bold text-gray-400">{paidUsers.length} transactions</span>
        </div>
        <div className="divide-y divide-gray-50">
          {paidUsers.length > 0 ? (
            paidUsers.map((u) => (
              <div key={u.userId} className="px-8 py-4 flex justify-between items-center bg-white">
                <div>
                  <p className="font-bold text-gray-900">{u.jobTitle || `Job #${u.jobId}`}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-bold">
                    Worker: {u.workerId || u.userName} • {u.jobCompletedDate || '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{parseFloat(u.jobAmount).toLocaleString()}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase">{u.paymentStatus}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 italic">
              No disbursement history available.
            </div>
          )}
        </div>
      </div>

      {/* Payment Status Summary */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4">Payment Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(paymentsByStatus).map(([status, count]) => (
            <div key={status} className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-black text-gray-900">{count}</p>
              <p className="text-xs font-bold text-gray-400 uppercase mt-1 capitalize">
                {status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCommission = () => {
    // Top earners by commission
    const topEarners = users
      .filter((u) => u.commission && parseFloat(u.commission) > 0)
      .sort((a, b) => parseFloat(b.commission) - parseFloat(a.commission))
      .slice(0, 5)

    return (
      <div className="space-y-6">
        <div className="bg-primary p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest mb-2">
              Total Commission Earned
            </h3>
            <p className="text-5xl font-black mb-8">₹{overview.totalCommission.toLocaleString()}</p>
            <div className="flex gap-4">
              <button className="bg-white text-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-lg">
                Withdraw Funds
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-2xl font-bold text-sm">
                View Invoices
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Margin Analysis</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-gray-900">
                {overview.totalRevenue > 0
                  ? ((overview.totalCommission / overview.totalRevenue) * 100).toFixed(1)
                  : '0.0'}%
              </span>
              <span className="text-green-600 font-bold text-sm pb-1">Net Platform Margin</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-wider">
              Commission / Total Revenue
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Payout Cycle</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-gray-900">T+2 Days</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-wider">
              Average settlement time
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Top Commission Jobs</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {topEarners.map((u, i) => (
              <div key={u.userId} className="px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">{u.jobTitle || `Job #${u.jobId}`}</p>
                    <p className="text-xs text-gray-400">{u.city}, {u.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{parseFloat(u.commission).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">of ₹{parseFloat(u.jobAmount).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-gray-900">₹{overview.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Commission</p>
          <p className="text-2xl font-black text-primary">₹{overview.totalCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Paid Jobs</p>
          <p className="text-2xl font-black text-green-600">{paymentsByStatus['paid'] || 0}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6">Download Reports</h3>
        <div className="flex flex-col gap-4">
          <button className="bg-gray-50 text-gray-700 p-4 rounded-xl text-left font-bold border border-gray-100 hover:bg-gray-100">
            Monthly P&amp;L Statement (PDF)
          </button>
          <button className="bg-gray-50 text-gray-700 p-4 rounded-xl text-left font-bold border border-gray-100 hover:bg-gray-100">
            Tax Compliance Report (CSV)
          </button>
          <button className="bg-gray-50 text-gray-700 p-4 rounded-xl text-left font-bold border border-gray-100 hover:bg-gray-100">
            Commission Ledger (CSV)
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance Center</h1>
        <p className="text-gray-500 mt-1">Track revenue, payouts, and platform commissions</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'payouts' && renderPayouts()}
      {activeTab === 'commission' && renderCommission()}
      {activeTab === 'reports' && renderReports()}
    </div>
  )
}

export default Finance
