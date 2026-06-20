import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (data.success) {
        setOtpSent(true)
      } else {
        setError(data.message || data.error || 'Failed to send OTP')
      }
    } catch (err) {
      setError('Connection error. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()
      if (data.success) {
        navigate('/dashboard')
      } else {
        setError(data.message || 'Invalid OTP')
      }
    } catch (err) {
      setError('Verification failed. Try again.')
    } finally {
      setLoading(false)
    }
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
            Admin <br />
            <span className="text-white/80 font-medium text-4xl">Gatekeeper</span>
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            Secure, passwordless access for the Promotr orchestration team.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-sm font-medium">
          © 2026 Promotr. High-security protocol active.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
              {otpSent ? 'Check Email' : 'Secure Sign In'}
            </h2>
            <p className="text-gray-500 font-medium">
              {otpSent
                ? `6-digit code sent to ${email}`
                : 'Login with real-time Email verification'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-r-xl">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@aquilaevents.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-gray-900 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Sending Code...' : 'Send Verification OTP'}
              </button>

              <div className="pt-6 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Powered by Resend Secure Flow
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1 block text-center">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-5 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-center text-5xl font-black tracking-[0.4em] text-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Verifying...' : 'Access Dashboard'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  ← Use a different email
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 pt-10 border-t border-gray-100 text-center lg:text-left">
            <p className="text-gray-500 font-medium">
              Need assistance?{' '}
              <a href="#" className="text-primary font-black hover:underline ml-1">
                Contact Ops
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
