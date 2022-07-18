import { describe, test, expect } from '@jest/globals'
import { login } from '../account'

describe('login test', () => {
  test('login success', async () => {
    const data = await login({ usercode: '1', password: '1' })
    expect(data).toHaveProperty(['token'])
    expect(data).toHaveProperty(['permission'])
  })
})
