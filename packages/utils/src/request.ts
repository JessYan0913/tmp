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

export class RequestCancel<T extends InternalAxiosRequestConfig> {
  pendingRequestMap: Map<string, AbortController>;

  constructor() {
    this.pendingRequestMap = new Map();
  }

  async pendingRequest(config: T): Promise<void> {
    const requestId = await this.getRequestId(config);
    if (this.pendingRequestMap.has(requestId)) {
      config.signal = this.pendingRequestMap.get(requestId)?.signal;
    } else {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      this.pendingRequestMap.set(requestId, abortController);
    }
  }

  async confirmRequest(config: T): Promise<void> {
    if (this.pendingRequestMap.size === 0) {
      return;
    }
    const requestId = await this.getRequestId(config);
    if (!this.pendingRequestMap.has(requestId)) {
      return;
    }
    this.pendingRequestMap.delete(requestId);
  }

  async cancelRequest(config: T): Promise<void> {
    if (this.pendingRequestMap.size === 0) {
      return;
    }
    const requestId = await this.getRequestId(config);
    if (!this.pendingRequestMap.has(requestId)) {
      return;
    }
    this.pendingRequestMap.get(requestId)?.abort();
    this.pendingRequestMap.delete(requestId);
  }

  async cancelAllRequest(): Promise<void> {
    for (const abortController of this.pendingRequestMap.values()) {
      abortController.abort();
    }
    this.pendingRequestMap.clear();
  }

  private async getRequestId(config: T): Promise<string> {
    let { url, method, params, data } = config;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    if (typeof params === 'string') {
      params = JSON.parse(params);
    }
    return await objectHash({ url, method, params, data });

    async function objectHash(obj: Record<string, any>): Promise<string> {
      const result = await crypto.subtle.digest('SHA-256', string2ArrayBuffer(JSON.stringify(obj)));
      return arrayBuffer2String(result);
    }

    function string2ArrayBuffer(str: string): ArrayBuffer {
      const result = new ArrayBuffer(str.length * 2);
      const bufferView = new Uint16Array(result);
      for (let index = 0; index < str.length; index++) {
        bufferView[index] = str.charCodeAt(index);
      }
      return result;
    }

    function arrayBuffer2String(arrayBuffer: ArrayBuffer): string {
      return String.fromCharCode.apply(null, Array.from(new Uint16Array(arrayBuffer)));
    }
  }
}
