// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')

// API Client
class ApiClient {
  private baseURL: string
  private csrfToken: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async initCSRF() {
    if (this.csrfToken) return
    try {
      const response = await fetch(`${this.baseURL}/auth/csrf`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        this.csrfToken = data.csrfToken
      }
    } catch (e) {
      console.error('Failed to initialize CSRF token:', e)
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    // Inject CSRF token for state-changing requests
    const method = options.method?.toUpperCase() || 'GET'
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      await this.initCSRF()
      if (this.csrfToken) {
        options.headers = {
          ...options.headers,
          'X-CSRF-Token': this.csrfToken,
        }
      }
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    // Return the parsed body for both success and error responses.
    // The caller checks data.success to determine outcome.
    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Request failed (${response.status})`,
        ...data,
      }
    }

    return data
  }

  // Health Check
  async health() {
    return this.request('/health')
  }

  // Auth
  async sendOtp(email: string) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async verifyOtp(email: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
  }

  async signup(data: any) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Users
  async getUsers(filters?: { role?: string; status?: string; kycStatus?: string }) {
    const params = new URLSearchParams(filters as any)
    return this.request(`/users?${params}`)
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`)
  }

  async updateUser(userId: string, data: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateKycStatus(userId: string, status: 'verified' | 'rejected') {
    return this.request(`/users/${userId}/kyc`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  async banUser(userId: string) {
    return this.request(`/users/${userId}/ban`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
  }

  // Dashboard
  async getDashboard() {
    return this.request('/dashboard')
  }

  // Analytics
  async getAnalytics() {
    return this.request('/analytics')
  }

  // KYC
  async getPendingKYC() {
    return this.request('/kyc/pending')
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL)
export default api
