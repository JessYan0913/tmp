export type MethodName = string | symbol

class BaseService {
  public pluginOptionsMap: Map<MethodName, Function[]>
  public middlewareMap: Map<MethodName, Function[]>
  public taskList: (() => Promise<void>)[]
  public taskDoing: boolean = false

  constructor(methods: string[] = [], serialMethods: string[] = []) {
    this.pluginOptionsMap = new Map()
    this.middlewareMap = new Map()
    this.taskList = []

    methods.forEach((propertyName: string) => {
      const sourceMethod = Reflect.get(this, propertyName) as Function

      this.middlewareMap.set(propertyName, [])

      const beforeMethodName = generateMethodName('before', propertyName)
      const afterMethodName = generateMethodName('after', propertyName)
      this.pluginOptionsMap.set(beforeMethodName, [])
      this.pluginOptionsMap.set(afterMethodName, [])

      const fun = composeMethod(this.middlewareMap.get(propertyName) ?? [])
      Reflect.set(this, propertyName, async (...args: any[]) => {
        if (!serialMethods.includes(propertyName)) {
          return this.doAction(args, sourceMethod, beforeMethodName, afterMethodName, fun)
        }

        const promise = new Promise<any>((resolve, reject) => {
          this.taskList.push(async () => {
            try {
              const value = await this.doAction(args, sourceMethod, beforeMethodName, afterMethodName, fun)
              resolve(value)
            } catch (error) {
              reject(error)
            }
          })
        })
        if (!this.taskDoing) {
          this.doTask()
        }
        return promise
      })
    })
  }

  public use(options: Record<string, Function>) {
    Object.entries(options).forEach(([methodName, method]: [string, Function]) => {
      if (typeof method === 'function') {
        this.middlewareMap.get(methodName)?.push(method)
      }
    })
  }

  public usePlugin(options: Record<string, Function>) {
    Object.entries(options).forEach(([methodName, method]: [string, Function]) => {
      if (typeof method === 'function') {
        this.pluginOptionsMap.get(methodName)?.push(method)
      }
    })
  }

  private async doTask() {
    this.taskDoing = true
    let task = this.taskList.shift()
    while (task) {
      await task()
      task = this.taskList.shift()
    }
    this.taskDoing = false
  }

  private async doAction(
    args: any[],
    sourceMethod: Function,
    beforeMethodName: string,
    afterMethodName: string,
    action: (args: any[], next?: Function) => void | Promise<void>
  ) {
    let beforeArgs = args
    for (const beforeMethod of this.pluginOptionsMap.get(beforeMethodName) ?? []) {
      beforeArgs = (await beforeMethod(...beforeArgs)) || []
      if (isError(beforeArgs)) {
        throw beforeArgs
      }
      if (!Array.isArray(beforeArgs)) {
        beforeArgs = [beforeArgs]
      }
    }
    console.log('参数', beforeArgs)

    let result = await action(beforeArgs, sourceMethod.bind(this))

    for (const afterMethod of this.pluginOptionsMap.get(afterMethodName) ?? []) {
      result = await afterMethod(result, ...beforeArgs)
      if (isError(result)) {
        throw result
      }
    }
    return result
  }
}

function isError(error: any): boolean {
  return Object.prototype.toString.call(error) === '[object Error]'
}

function generateMethodName(prefix: string, name: string) {
  return `${prefix}${name[0].toUpperCase()}${name.substring(1)}`
}

function composeMethod(middleware: Function[]) {
  if (!Array.isArray(middleware)) {
    throw new TypeError('middleware 必须是一个数组')
  }
  for (const fun of middleware) {
    if (typeof fun !== 'function') {
      throw new TypeError('middleware 必须是一个函数数组')
    }
  }

  return function (args: any[], next?: Function) {
    let index = -1

    return dispatch(0)

    function dispatch(i: number): Promise<void> {
      console.log('===', i, middleware, next)
      if (i < index) {
        return Promise.reject(new Error('next() 调用多次'))
      }
      index = i
      let fn = middleware[i]
      if (i === middleware.length && next) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(...args, dispatch.bind(null, i + 1)))
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}

export default BaseService
