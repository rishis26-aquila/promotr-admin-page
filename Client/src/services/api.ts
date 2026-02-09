// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api')

// API Client
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Health Check
  async health() {
    return this.request('/health')
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

  // Jobs
  async getJobs(filters?: { status?: string; category?: string }) {
    const params = new URLSearchParams(filters as any)
    return this.request(`/jobs?${params}`)
  }

  async getJobById(id: string) {
    return this.request(`/jobs/${id}`)
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
