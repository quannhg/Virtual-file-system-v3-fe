import { paths } from '@openapi-spec';
import axios, { AxiosError, AxiosResponse } from 'axios';
import createClient from 'openapi-fetch';

export const server = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

export async function invoke<R = unknown, D = unknown>(call: Promise<AxiosResponse<R, D>>) {
  try {
    const response = await call;
    return response.data;
  } catch (err) {
    const e = err as AxiosError;
    const errPayload = e.response?.data ? (e.response.data as ResponseError) : e;
    throw errPayload;
  }
}

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: 'include'
});
