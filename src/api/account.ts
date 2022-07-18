import request, { Result } from '@/utils/request'

namespace Login {
  export interface Params {
    usercode: string
    password: string
  }

  export interface Result {
    token: string
    permission: string
  }
}

export async function login(params: Login.Params): Promise<Login.Result> {
  try {
    const { data } = await request.post<Login.Result>('/login', params)
    return data ?? { token: '', permission: '' }
  } catch (error) {
    console.log(error)
    return {
      token: '',
      permission: '',
    }
  }
}

export async function logout(): Promise<Result<any>> {
  try {
    const result = await request.post('/logout')
    return result
  } catch (error) {
    return {
      code: NaN,
      msg: '',
    }
  }
}
