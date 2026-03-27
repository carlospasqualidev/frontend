import axios, { type AxiosRequestConfig } from 'axios';

import { thenHandler, catchHandler } from './errorHandlers';

//#PRIVATE API
const axiosApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

axiosApi.interceptors.response.use(
  (response) => {
    thenHandler(response);
    return response;
  },
  (error) => {
    catchHandler(error);
    return Promise.reject(error);
  }
);

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   const customConfig = config;

//   if (token) customConfig.headers.Authorization = `Bearer ${token}`;

//   return customConfig;
// });

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.get<T>(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosApi.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await axiosApi.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosApi.delete<T>(url, config);
    return response.data;
  },
};

//#endregion
