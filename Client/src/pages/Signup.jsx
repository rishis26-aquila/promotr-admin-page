import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Manager',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.signup(formData)

      if (data.success) {
        setSuccess(true)
        setTimeout(() => navigate('/'), 2500)
      } else {
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError('Connection error. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col space-y-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-sm">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-500 font-medium">
            Your account is ready. Redirecting to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex text-left">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F06C28] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNHYyYzAgMi0yIDQtMiA0cy0yLTItMi00di0yem0wLTMwYzAtMiAyLTQgMi00czIgMiAyIDR2MmMwIDItMiA0LTIgNHMtMi0yLTItNFY0eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <div className="bg-white p-3 rounded-xl shadow-lg inline-flex">
              <img src="/logo.svg" alt="Promotr" className="h-10 w-auto" />
            </div>
          </Link>
          <p className="text-white/95 text-xl font-bold mt-6 tracking-tight">
            Promote. Engage. Grow.
          </p>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black text-white mb-6 leading-tight">
            Join the <br />
            <span className="text-white/80 font-medium text-4xl">Admin Workforce</span>
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            Register your corporate profile for secure dashboard access.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-sm font-medium">
          © 2026 Promotr. Access restricted to authorized personnel.
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-500 font-medium">Register for passwordless Admin access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-gray-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-gray-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Corporate Email
              </label>
              <input
                type="email"
                required
                placeholder="rishi@aquilaevents.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-gray-900 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                Assigned Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-gray-900 font-medium appearance-none"
              >
                <option value="Manager">Manager</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Editor">Editor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center lg:text-left">
            <p className="text-gray-500 font-medium">
              Already have permission?{' '}
              <Link to="/" className="text-primary font-black hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
