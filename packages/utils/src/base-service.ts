import { EventArgs, EventBus } from './event';

export const isError = (error: any): boolean => {
  return Object.prototype.toString.call(error) === '[object Error]';
};

export type Action<T = any> = (args: any[], next?: Function) => Promise<T>;

function generateMethodName(prefix: string, name: string) {
  return `${prefix}${name[0].toUpperCase()}${name.substring(1)}`;
}

export class BaseService<T extends EventArgs = EventArgs> extends EventBus<T> {
  public methods: string[];
  public serialMethods: string[];

  private pluginOptionsMap: Map<string, Function[]>;
  private middlewareMap: Map<string, Function[]>;
  private taskList: (() => Promise<void>)[];
  private taskDoing: boolean;

  constructor(methods: string[] = [], serialMethods: string[] = []) {
    super();

    this.methods = methods;
    this.serialMethods = serialMethods;
    this.pluginOptionsMap = new Map();
    this.middlewareMap = new Map();
    this.taskList = [];
    this.taskDoing = false;
  }

  private init() {
    this.methods.forEach((methodName) => {
      const originMethod = Reflect.get(this, methodName);
      if (typeof originMethod !== 'function') {
        return;
      }

      this.middlewareMap.set(methodName, []);

      const beforeMethodName = generateMethodName('before', methodName);
      const afterMethodName = generateMethodName('after', methodName);

      this.pluginOptionsMap.set(beforeMethodName, []);
      this.pluginOptionsMap.set(afterMethodName, []);

      const action = this.composeMethod(methodName);

      Reflect.set(this, methodName, async (...args: any[]) => {
        if (!this.serialMethods.includes(methodName)) {
          return this.doAction(args, originMethod, beforeMethodName, afterMethodName, action);
        }

        const promise = new Promise<any>((resolve, reject) => {
          this.taskList.push(async () => {
            try {
              const value = await this.doAction(args, originMethod, beforeMethodName, afterMethodName, action);
              resolve(value);
            } catch (error) {
              reject(error);
            }
          });
        });
        if (!this.taskDoing) {
          this.doTask();
        }
        return promise;
      });
    });
  }

  public use(options: Record<string, Function>): void {
    Object.entries(options).forEach(([methodName, method]: [string, Function]) => {
      if (typeof method === 'function') {
        this.middlewareMap.get(methodName)?.push(method);
      }
    });
  }

  public usePlugin(options: Record<string, Function>): void {
    Object.entries(options).forEach(([methodName, method]: [string, Function]) => {
      if (typeof method === 'function') {
        this.pluginOptionsMap.get(methodName)?.push(method);
      }
    });
  }

  private composeMethod(methodName: string): Action<any> {
    const middleware = this.middlewareMap.get(methodName) ?? [];
    return async (args: any[], next?: Function): Promise<any> => {
      let index = -1;
      const dispatch = async (i: number): Promise<any> => {
        if (i < index) {
          throw new Error('next() 多次调用');
        }
        index = i;
        let fun = middleware[i];
        if (i === middleware.length && next) {
          fun = next;
        }
        if (!fun) {
          return;
        }
        return await fun(...args, dispatch.bind(this, i + 1));
      };
      return await dispatch(0);
    };
  }

  private async doAction(
    args: any[],
    sourceMethod: Function,
    beforeMethodName: string,
    afterMethodName: string,
    action: Action
  ): Promise<any> {
    let beforeArgs = args;
    for (const beforeMethod of this.pluginOptionsMap.get(beforeMethodName) ?? []) {
      beforeArgs = (await beforeMethod(...beforeArgs)) ?? [];
      if (isError(beforeArgs)) {
        throw beforeArgs;
      }
      if (!Array.isArray(beforeArgs)) {
        beforeArgs = [beforeArgs];
      }
    }

    let result = await action(beforeArgs, sourceMethod.bind(this));

    for (const afterMethod of this.pluginOptionsMap.get(afterMethodName) ?? []) {
      result = await afterMethod(result, ...beforeArgs);
      if (isError(result)) {
        throw result;
      }
    }
    return result;
  }

  private async doTask(): Promise<void> {
    this.taskDoing = true;
    let task = this.taskList.shift();
    while (task) {
      await task();
      task = this.taskList.shift();
    }
    this.taskDoing = false;
  }
}
