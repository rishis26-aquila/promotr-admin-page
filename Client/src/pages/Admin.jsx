import React, { useState } from 'react'
import Tabs from '../components/Tabs'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('team')

  const tabs = [
    { id: 'team', label: 'Internal Team' },
    { id: 'cms', label: 'CMS & Broadcast' },
    { id: 'system', label: 'System Settings' },
  ]

  const renderTeam = () => {
    const adminTeam = [
      {
        name: 'Rishi Shah',
        email: 'rishi.shah@aquilaevents.in',
        role: 'Super Admin',
        status: 'Online',
      },
      {
        name: 'Aman Gupta',
        email: 'aman@example.com',
        role: 'Operations Head',
        status: 'Offline',
      },
      { name: 'Sara Khan', email: 'sara@example.com', role: 'Finance Admin', status: 'Online' },
    ]

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Internal Team</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md">
              + Invite Member
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {adminTeam.map((member, i) => (
              <div key={i} className="px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></div>
                  <div>
                    <p className="font-bold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      {member.role} • {member.email}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderCMS = () => (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-6">Global Broadcast Portal</h3>
        <div className="space-y-4">
          <textarea
            placeholder="Compose an announcement to all active workers..."
            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-gray-50"
          ></textarea>
          <div className="flex items-center gap-4">
            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold outline-none">
              <option>All Workers</option>
              <option>Verified Only</option>
              <option>By Region</option>
            </select>
            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg">
              Broadcast Message
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystem = () => {
    const settingsGroups = [
      {
        title: 'Operations',
        items: [
          {
            name: 'Worker Signups',
            desc: 'Allow new workers to register and undergo KYC',
            value: 'Active',
          },
          {
            name: 'Business Onboarding',
            desc: 'Enable companies to post new job requests',
            value: 'Active',
          },
          {
            name: 'Auto-Verification',
            desc: 'AI-assisted KYC processing for standard IDs',
            value: 'Paused',
          },
        ],
      },
      {
        title: 'Financial Constants',
        items: [
          {
            name: 'Platform Commission',
            desc: 'Flat fee percentage on every job transaction',
            value: '10.0%',
          },
          { name: 'Worker TDS Rate', desc: 'Mandatory tax deduction at source', value: '1.0%' },
          {
            name: 'Minimum Payout',
            desc: 'Threshold amount for worker withdrawals',
            value: '₹500',
          },
        ],
      },
    ]

    return (
      <div className="space-y-6">
        {settingsGroups.map((group, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{group.title}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {group.items.map((item, i) => (
                <div key={i} className="px-8 py-6 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-gray-100 px-4 py-1.5 rounded-lg font-bold text-gray-900">
                      {item.value}
                    </span>
                    <button className="text-primary font-bold text-sm underline ml-4">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
        <p className="text-gray-500 mt-1">Configure system-wide parameters and internal team</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'team' && renderTeam()}
      {activeTab === 'cms' && renderCMS()}
      {activeTab === 'system' && renderSystem()}
    </div>
  )
}

export default Admin
