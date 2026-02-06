import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold text-primary leading-none">404</h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <code>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          </code>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Oops !
            <br />
            The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-bold text-lg hover:border-primary hover:text-primary transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
