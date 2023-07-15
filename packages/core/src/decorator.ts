export function debugOnly<T>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    // 在调试环境下执行原始方法
    return originalMethod.apply(this, args);
  };

  return descriptor;
}
