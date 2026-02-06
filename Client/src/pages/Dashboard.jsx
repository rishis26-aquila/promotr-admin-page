import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Tabs from '../components/Tabs'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...')
        const [dashRes, analyticsRes] = await Promise.all([api.getDashboard(), api.getAnalytics()])

        console.log('Dashboard Data:', dashRes.data)
        console.log('Analytics Data:', analyticsRes.data)

        setStats(dashRes.data)
        setAnalytics(analyticsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard/analytics stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Business Analytics' },
    { id: 'reports', label: 'Operational Reports' },
  ]

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-primary font-bold">
        Loading dashboard...
      </div>
    )
  if (!stats)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 font-bold">
        Error loading dashboard data.
      </div>
    )

  const { overview } = stats

  const renderOverview = () => {
    const cardData = [
      { label: 'Total Users', value: overview.totalUsers, sub: 'Active community' },
      { label: 'Active Jobs', value: overview.activeJobs, sub: 'Current engagements' },
      { label: 'Pending KYC', value: overview.pendingKYC, sub: 'Needs review' },
      {
        label: 'Total Revenue',
        value: `₹${overview.totalRevenue.toLocaleString()}`,
        sub: 'Platform flow',
      },
    ]

    return (
      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-4">
          <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm">
            + Create Job
          </button>
          <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-bold text-sm">
            Approve KYC
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardData.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {item.label}
              </p>
              <div className="flex items-baseline gap-2 mt-4">
                <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>
              </div>
              <p className="text-xs text-gray-400 mt-2">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#F06C28] p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <h3 className="text-xl font-bold mb-2">Commission Earned</h3>
          <div className="text-5xl font-black mb-4 leading-none">
            ₹{overview.totalCommission.toLocaleString()}
          </div>
          <p className="text-white/80 text-sm italic">Growth: 12% vs last month (MoM)</p>
        </div>
      </div>
    )
  }

  const renderAnalytics = () => {
    const revenueData = analytics?.revenueByCategory || {}
    const categories = Object.keys(revenueData)
    const maxRevenue = Math.max(...Object.values(revenueData).map((v) => Number(v)), 1)

    const retentionData = [
      { week: 'Week 1', rate: '85%' },
      { week: 'Week 2', rate: '82%' },
      { week: 'Week 3', rate: '88%' },
      { week: 'Week 4', rate: '91%' },
    ]

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Revenue by Category</h3>
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-600 capitalize">{cat}</span>
                      <span className="font-bold text-primary">
                        ₹{Number(revenueData[cat]).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(Number(revenueData[cat]) / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic text-center py-8">No revenue data found</div>
              )}
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Top Performing Cities</h3>
            <div className="space-y-4">
              {(analytics?.topCities || []).map(([city, count], i) => (
                <div key={city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-700">{city}</span>
                  </div>
                  <span className="font-bold text-gray-900">{count} Jobs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Retention Cohorts</h3>
          <div className="grid grid-cols-4 gap-4">
            {retentionData.map((item) => (
              <div key={item.week} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{item.week}</p>
                <p className="text-2xl font-black text-gray-900">{item.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderReports = () => {
    const reportFiles = [
      { name: 'Weekly Performance Summary', date: 'Feb 05, 2026', size: '2.4 MB' },
      { name: 'Monthly Financial Audit', date: 'Jan 31, 2026', size: '12.8 MB' },
      { name: 'User Growth Analytics', date: 'Feb 01, 2026', size: '5.1 MB' },
      { name: 'Job Satisfaction Survey', date: 'Jan 28, 2026', size: '1.2 MB' },
    ]

    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">System Health & Latency</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
              <p className="text-xs font-bold text-green-700 uppercase mb-1">Uptime</p>
              <p className="text-2xl font-black text-green-900">99.98%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-blue-700 uppercase mb-1">Avg Latency</p>
              <p className="text-2xl font-black text-blue-900">124ms</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
              <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Active Errors</p>
              <p className="text-2xl font-black text-yellow-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Available Reports</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {reportFiles.map((report, i) => (
              <div key={i} className="px-8 py-4 flex justify-between items-center bg-white">
                <div>
                  <p className="font-bold text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase font-bold">
                    Generated: {report.date} • {report.size}
                  </p>
                </div>
                <button className="text-primary font-bold text-sm hover:underline">Download</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Strategic insights and operational data</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'reports' && renderReports()}
    </div>
  )
}

export default Dashboard
