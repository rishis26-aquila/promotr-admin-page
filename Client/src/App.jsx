import { useState } from 'react';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    phone: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login functionality - to be implemented');
  };

  const handleGetOTP = () => {
    if (formData.phone) {
      setOtpSent(true);
      alert(`OTP sent to ${formData.phone}`);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login - to be implemented`);
  };

  return (
    <div className="min-h-screen flex animate-fade-in-up">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F06C28] p-12 flex-col justify-between relative overflow-hidden animate-fade-in-left">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNHYyYzAgMi0yIDQtMiA0cy0yLTItMi00di0yem0wLTMwYzAtMiAyLTQgMi00czIgMiAyIDR2MmMwIDItMiA0LTIgNHMtMi0yLTItNFY0eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
        </div>
        
        <div className="relative z-10">
          <a href="/" className="inline-block">
            <img 
              src="/logo.svg" 
              alt="Promotr" 
              className="h-16 w-auto bg-white px-4 py-2 rounded-lg"
            />
          </a>
          <p className="text-white/90 text-lg font-semibold mt-4">Promote. Engage. Grow.</p>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome Back
          </h1>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Promotr. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 animate-fade-in-right">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                loginMethod === 'email' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                loginMethod === 'phone' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Phone
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-primary rounded" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="/forgot-password" className="text-sm text-primary hover:text-primary-dark font-semibold">
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleGetOTP}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap"
                    >
                      Get OTP
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-fade-in-up bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-green-700 font-semibold">
                        OTP sent to {formData.phone}
                      </p>
                    </div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="000000"
                      value={formData.otp}
                      onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                      className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-center text-3xl tracking-[0.5em] font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleGetOTP}
                      className="w-full mt-3 text-sm text-primary hover:text-primary-dark font-semibold"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
              </>
            )}
            
            <button
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Sign In
            </button>
          </form>
          
          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary font-bold hover:text-primary-dark">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
