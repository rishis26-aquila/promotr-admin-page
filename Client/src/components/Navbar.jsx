import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'People', path: '/people' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Finance', path: '/finance' },
    { name: 'Admin', path: '/admin' },
  ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/dashboard" className="flex items-center group">
              <div className="bg-primary p-2 rounded-xl">
                <img src="/logo.svg" alt="Promotr" className="h-6 w-auto brightness-0 invert" />
              </div>
            </Link>
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900">Rishi Shah</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                rishi.shah@aquilaevents.in
              </span>
            </div>
            <Link
              to="/"
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 shadow-sm"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
