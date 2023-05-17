type Method = (...args: any[]) => any;

export interface Middleware {
  (args: any[], next: Method): any;
}

export interface Plugin {
  before: Middleware[];
  after: Middleware[];
}

const excludedMethods = ['usePlugin', 'useMiddleware'];

type ExcludedMethod = (typeof excludedMethods)[number];

async function applyMiddleware(this: BaseService, middlewareList: Middleware[], args: any[], next: Method) {
  let index = -1;
  const dispatch = async (i: number): Promise<any> => {
    if (i <= index) {
      throw new Error('next() called multiple times');
    }
    index = i;

    const middleware = middlewareList[i];
    if (!middleware) {
      return next(...args);
    }

    return middleware(args, dispatch.bind(this, i + 1));
  };

  return dispatch(0);
}

async function applyPlugins(this: BaseService, method: Method, plugin: Plugin, args: any[], result: any) {
  let beforeArgs = args;

  for (const middleware of plugin.before) {
    beforeArgs = await applyMiddleware.call(this, [middleware], beforeArgs, () => beforeArgs);
    if (beforeArgs instanceof Error) {
      throw beforeArgs;
    }
    if (!Array.isArray(beforeArgs)) {
      beforeArgs = [beforeArgs];
    }
  }

  result = await method.call(this, ...beforeArgs);

  for (const middleware of plugin.after) {
    result = await applyMiddleware.call(this, [middleware], [result, ...beforeArgs], () => result);
    if (result instanceof Error) {
      throw result;
    }
  }

  return result;
}

export class BaseService {
  private pluginMap: Map<keyof Exclude<this, ExcludedMethod>, Plugin> = new Map();
  private middlewareMap: Map<keyof Exclude<this, ExcludedMethod>, Middleware[]> = new Map();

  constructor() {
    return new Proxy(this, {
      get: (target: BaseService, prop: string) => {
        const originMethod = Reflect.get(target, prop);
        if (typeof originMethod !== 'function' || excludedMethods.includes(prop)) {
          return originMethod;
        }
        const _prop = prop as keyof Exclude<this, ExcludedMethod>;
        const middlewareList = this.middlewareMap.get(_prop) ?? [];
        const plugin = this.pluginMap.get(_prop);

        return (...args: any[]) => {
          return applyMiddleware.call(this, middlewareList, args, async () => {
            let result: any;

            if (plugin) {
              result = await applyPlugins.call(this, originMethod, plugin, args, result);
            } else {
              result = await originMethod.call(this, ...args);
            }

            return result;
          });
        };
      },
    });
  }

  public usePlugin(method: keyof Exclude<this, ExcludedMethod>, plugin: Plugin) {
    if (!this.pluginMap.has(method)) {
      this.pluginMap.set(method, { before: [], after: [] });
    }
    const existingPlugin = this.pluginMap.get(method)!;
    existingPlugin.before.push(...plugin.before);
    existingPlugin.after.push(...plugin.after);
  }

  public useMiddleware(method: keyof Exclude<this, ExcludedMethod>, middleware: Middleware) {
    if (!this.middlewareMap.has(method)) {
      this.middlewareMap.set(method, []);
    }
    this.middlewareMap.get(method)!.push(middleware);
  }
}

export default BaseService;
