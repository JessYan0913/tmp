export * from './files';

export const toLine = (name: string = '') => name.replace(/\B([A-Z])/g, '-$1').toLowerCase();
