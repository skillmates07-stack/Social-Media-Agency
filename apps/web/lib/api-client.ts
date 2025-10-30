import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    subdomain?: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Posts endpoints
  async getPosts(params?: any) {
    const response = await this.client.get('/posts', { params });
    return response.data;
  }

  async createPost(data: any) {
    const response = await this.client.post('/posts', data);
    return response.data;
  }

  async updatePost(id: string, data: any) {
    const response = await this.client.put(`/posts/${id}`, data);
    return response.data;
  }

  async deletePost(id: string) {
    const response = await this.client.delete(`/posts/${id}`);
    return response.data;
  }

  // Analytics endpoints
  async getAnalytics(params?: any) {
    const response = await this.client.get('/analytics', { params });
    return response.data;
  }

  // Social accounts endpoints
  async getSocialAccounts() {
    const response = await this.client.get('/social/accounts');
    return response.data;
  }

  async connectSocialAccount(provider: string, code: string) {
    const response = await this.client.post('/social/connect', { provider, code });
    return response.data;
  }

  async disconnectSocialAccount(accountId: string) {
    const response = await this.client.delete(`/social/accounts/${accountId}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
