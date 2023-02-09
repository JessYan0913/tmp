import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { BaseError } from './error';

export interface HttpInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig & RequestConfig) => AxiosRequestConfig | RequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: <T = AxiosResponse>(response: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

export interface RequestConfig extends AxiosRequestConfig, InternalAxiosRequestConfig {
  headers: AxiosHeaders;
  interceptors?: HttpInterceptors;
  retry?: number;
  retryDelay?: number;
  readonly retryCounted?: number;
}

export interface RequestError extends AxiosError<any, any>, BaseError {
  config: RequestConfig;
}

export class Request {
  instance: AxiosInstance;
  interceptors?: HttpInterceptors;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
  }
}
