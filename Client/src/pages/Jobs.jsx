import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Tabs from '../components/Tabs'

const Jobs = () => {
  const [activeTab, setActiveTab] = useState('live')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.getJobs()
        setJobs(response.data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const tabs = [
    { id: 'live', label: 'Live Jobs' },
    { id: 'categories', label: 'Category Management' },
    { id: 'tracking', label: 'Order Tracking' },
    { id: 'attendance', label: 'Attendance Logs' },
  ]

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-primary font-bold">
        Loading jobs...
      </div>
    )

  const renderLive = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Job Details
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Category
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
            {jobs.map((job) => (
              <tr key={job.jobId} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-gray-900">{job.jobTitle}</div>
                    <div className="text-sm text-gray-500">
                      {job.city}, {job.state}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {job.jobCategory}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      job.jobStatus === 'completed'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : job.jobStatus === 'in_progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}
                  >
                    {job.jobStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button className="text-primary font-bold text-sm hover:underline">
                    Reassign
                  </button>
                  <button className="text-red-500 font-bold text-sm hover:underline">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900">Configure Job Types</h3>
          <p className="text-sm text-gray-500">Add or edit categories and base pricing</p>
        </div>
        <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/20">
          + Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Marketing', 'Finance', 'Logistics', 'Security'].map((cat) => (
          <div
            key={cat}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"
          >
            <span className="font-bold text-gray-900">{cat}</span>
            <span className="text-sm text-primary font-bold">₹500 Base</span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTracking = () => {
    const liveJobs = jobs.filter((j) => j.jobStatus === 'in_progress').slice(0, 3)

    return (
      <div className="space-y-6">
        {liveJobs.length > 0 ? (
          liveJobs.map((job, idx) => (
            <div
              key={job.jobId}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">
                  Trace: {job.jobTitle} (#{job.jobId})
                </h3>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 uppercase">
                  Live
                </span>
              </div>
              <div className="relative border-l-2 border-primary/20 ml-4 space-y-8">
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white border-primary"></div>
                  <p className="text-xs text-gray-400 font-bold uppercase">{job.jobCreatedDate}</p>
                  <p className="text-gray-900 font-bold">Job Broadcast & Recruitment Started</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white border-primary"></div>
                  <p className="text-xs text-gray-400 font-bold uppercase">T + 2 Hours</p>
                  <p className="text-gray-900 font-bold">
                    Worker Assigned (ID: {job.workerId || 'W087'})
                  </p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white border-primary animate-pulse"></div>
                  <p className="text-xs text-primary font-bold uppercase">Real-time</p>
                  <p className="text-gray-900 font-bold font-italic">
                    En-route to {job.city}, {job.state}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center text-gray-400 italic">
            No live jobs currently being tracked.
          </div>
        )}
      </div>
    )
  }

  const renderAttendance = () => {
    const records = jobs.filter((j) => j.jobStatus === 'completed').slice(0, 5)

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Geofenced Check-ins</h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
              All Verified
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {records.map((record) => (
              <div
                key={record.jobId}
                className="px-8 py-4 flex justify-between items-center bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Worker ID: {record.workerId}</p>
                    <p className="text-xs text-gray-500">
                      Checked in at Mall, {record.city} • {record.jobCompletedDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">Location Match</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase">98% Accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">Job Management</h1>
          <p className="text-gray-500 mt-1">Strategic oversight of all platform activities</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
          Post New Job
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'live' && renderLive()}
      {activeTab === 'categories' && renderCategories()}
      {activeTab === 'tracking' && renderTracking()}
      {activeTab === 'attendance' && renderAttendance()}
    </div>
  )
}

export default Jobs
