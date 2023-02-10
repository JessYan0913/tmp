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
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: <T = AxiosResponse>(response: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

export interface RequestConfig extends AxiosRequestConfig, InternalAxiosRequestConfig {
  headers: AxiosHeaders;
  interceptors?: HttpInterceptors;
  retry?: number;
  retryDelay?: number;
  retryCounted?: number;
}

export interface RequestError extends AxiosError<any, any>, BaseError {
  config: RequestConfig;
}

export class Request {
  instance: AxiosInstance;
  interceptors?: HttpInterceptors;

  constructor(config: RequestConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return new Promise((resolve, reject) => {
          if (res.status === 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        });
      },
      async (err: RequestError) => {
        const { code = '', config } = err;
        if (!config || !config.retry || !['ECONNABORTED'].includes(code)) {
          return Promise.reject(err);
        }
        config.retryCounted = config.retryCounted ?? 0;
        if (config.retryCounted >= config.retry) {
          return Promise.reject(err);
        }

        config.retryCounted++;
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(undefined);
          }, config.retryDelay);
        });
        return await this.request(config);
      }
    );
  }

  public request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        if (config.interceptors?.requestInterceptor) {
          config = config.interceptors?.requestInterceptor(config);
        }
        this.instance
          .request<any, T>(config)
          .then((res) => {
            if (config.interceptors?.responseInterceptor) {
              res = config.interceptors.responseInterceptor(res);
            }
            resolve(res);
          })
          .catch((err: any) => {
            if (config.interceptors?.responseInterceptorCatch) {
              err = config.interceptors?.responseInterceptorCatch(err);
            }
            reject(err);
          });
      } catch (error) {
        if (config.interceptors?.requestInterceptorCatch) {
          config.interceptors.requestInterceptorCatch(error);
        }
      }
    });
  }
}
