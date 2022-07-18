import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface BaseResult {
  code: number
  msg: string
}

export interface Result<T> extends BaseResult {
  data?: T
}

const URL: string = 'https://mock.apifox.cn/m1/1305094-0-default'

const config = {
  baseURL: URL as string,
  withCredentials: true,
  headers: {
    'content-type': 'application/json',
  },
}

class Request {
  service: AxiosInstance

  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)

    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('token') ?? ''
        return {
          ...config,
          headers: {
            token,
          },
        }
      },
      (error: AxiosError) => {
        Promise.reject(error)
      }
    )

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        if (data.code === 10001) {
          console.log('登录失败')
          return Promise.reject(data)
        }
        return data
      },
      (error: AxiosError) => {
        const { response } = error
        if (response?.status === 404) {
          console.log('请求地址不存在')
        }
      }
    )
  }

  get<T>(url: string, params?: object, config?: object): Promise<Result<T>> {
    return this.service.get(url, { params, ...config })
  }

  post<T>(url: string, params?: object): Promise<Result<T>> {
    return this.service.post(url, params)
  }
}

export default new Request(config)
