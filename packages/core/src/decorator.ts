export function debugOnly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (process.env.NODE_ENV !== 'debug') {
      throw new Error(`Method ${propertyKey} can only be used in debug mode.`);
    }

    // 在调试环境下执行原始方法
    return originalMethod.apply(this, args);
  };

  return descriptor;
}
