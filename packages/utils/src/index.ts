export * from 'axios';

export * from './event';

export * from './base-service';

export * from './error';

export * from './files';

export * from './request';

export * from './date';

export * from './async-queue';

export const toLine = (name: string = '') => name.replace(/\B([A-Z])/g, '-$1').toLowerCase();

export function replacePropertyWithValue(obj: Record<string | number | symbol, any>, value: any, newValue: any) {
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      replacePropertyWithValue(obj[key], value, newValue);
    } else if (obj[key] === value) {
      obj[key] = newValue;
    }
  }
}

export const isSubclass = (childClass: any, parentClass: any): boolean => {
  let currentClass = childClass;
  while (currentClass) {
    if (currentClass === parentClass) {
      return true;
    }
    currentClass = Object.getPrototypeOf(currentClass);
  }
  return false;
};
