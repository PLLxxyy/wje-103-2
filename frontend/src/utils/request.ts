import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { showToast } from 'vant';
import type { ApiResponse } from '@/types/api';
import { storage } from './storage';

type HttpClient = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 12000
});

client.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  ((response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data as ApiResponse<unknown>;
    if (body.code !== 0) {
      showToast(body.message || '请求失败');
      return Promise.reject(new Error(body.message || '请求失败'));
    }
    return body.data;
  }) as unknown as (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || '网络请求失败';
    if (status === 401) {
      storage.clearToken();
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    showToast(message);
    return Promise.reject(error);
  }
);

export const request = client as unknown as HttpClient;
