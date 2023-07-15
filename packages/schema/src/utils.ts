import {
  TmpApplication,
  TmpContainer,
  TmpElement,
  TmpElementInstance,
  TmpEvent,
  TmpFormElement,
  TmpFormItemElement,
  TmpInstanceMethod,
  TmpPage,
  TmpPropMapping,
  TmpRequestConfig,
} from './types';

export const isTmpRequestConfig = (obj: any): obj is TmpRequestConfig =>
  typeof obj === 'object' &&
  typeof obj.id === 'string' &&
  typeof obj.name === 'string' &&
  typeof obj.path === 'string' &&
  typeof obj.method === 'string' &&
  typeof obj.headers === 'object' &&
  typeof obj.data === 'object';

export const isTmpPropMapping = (obj: any): obj is TmpPropMapping =>
  typeof obj === 'object' &&
  typeof obj.name === 'string' &&
  typeof obj.ignore === 'boolean' &&
  (obj.defaultValue === undefined || typeof obj.defaultValue === 'string') &&
  (obj.source === undefined || typeof obj.source === 'string') &&
  (obj.sourceScope === undefined ||
    obj.sourceScope === 'event' ||
    obj.sourceScope === 'expression' ||
    obj.sourceScope === 'template') &&
  (obj.expression === undefined || typeof obj.expression === 'string') &&
  (obj.template === undefined || typeof obj.template === 'string');

export const isTmpEvent = (obj: any): obj is TmpEvent =>
  typeof obj === 'object' &&
  typeof obj.event === 'string' &&
  (obj.actionType === 'route-setting' || obj.actionType === 'component-control') &&
  (obj.target === undefined || typeof obj.target === 'string') &&
  (obj.method === undefined || typeof obj.method === 'string') &&
  (obj.page === undefined || typeof obj.page === 'string') &&
  (obj.propMappings === undefined || (Array.isArray(obj.propMappings) && obj.propMappings.every(isTmpPropMapping)));

export const isTmpElement = (obj: any): obj is TmpElement =>
  typeof obj === 'object' &&
  typeof obj.id === 'string' &&
  typeof obj.type === 'string' &&
  (obj.name === undefined || typeof obj.name === 'string') &&
  (obj.events === undefined || (Array.isArray(obj.events) && obj.events.every(isTmpEvent))) &&
  (obj.style === undefined || typeof obj.style === 'object');

export const isTmpContainer = (obj: any): obj is TmpContainer =>
  isTmpElement(obj) && Array.isArray(obj.children) && obj.children.every(isTmpElement);

export const isTmpFormItemElement = (obj: any): obj is TmpFormItemElement =>
  isTmpElement(obj) && typeof obj.label === 'string' && Array.isArray(obj.rules);

export const isTmpFormElement = (obj: any): obj is TmpFormElement =>
  isTmpContainer(obj) &&
  obj.type === 'form' &&
  (obj.action === undefined || typeof obj.action === 'string') &&
  (obj.method === undefined || typeof obj.method === 'string') &&
  Array.isArray(obj.children) &&
  obj.children.every(isTmpFormItemElement);

export const isTmpPage = (obj: any): obj is TmpPage => isTmpContainer(obj) && obj.type === 'page';

export const isTmpApplication = (obj: any): obj is TmpApplication =>
  isTmpContainer(obj) &&
  obj.type === 'app' &&
  (obj.curIndex === undefined || typeof obj.curIndex === 'string') &&
  Array.isArray(obj.children) &&
  obj.children.every(isTmpPage);

export const isTmpInstanceMethod = (obj: any): obj is TmpInstanceMethod =>
  typeof obj === 'function' &&
  Array.isArray(obj.dependVariables) &&
  obj.dependVariables.every((variable: any) => typeof variable === 'string');

export const isTmpElementInstance = (obj: any): obj is TmpElementInstance =>
  typeof obj === 'object' &&
  (obj.el === undefined || obj.el instanceof HTMLElement) &&
  (obj.methods === undefined ||
    (typeof obj.methods === 'object' && Object.values(obj.methods).every(isTmpInstanceMethod))) &&
  (obj.exposed === undefined || typeof obj.exposed === 'object');
