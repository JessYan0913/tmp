import { EnvironmentError, FileSelectCancelError, IllegalFileError } from './error';

/**
 * 获取文件后缀
 *
 * @param file 文件或文件名
 * @returns
 */
export const getFileExtension = (file: File | string): string => {
  let fileName: string;
  if (file instanceof File) {
    fileName = file.name;
  } else {
    fileName = file;
  }
  return fileName.match(/\.([0-9a-z]+)(?:[\\?#]|$)/i)![1] ?? '';
};

/**
 * 选择系统文件
 *
 * @param accepts 可选文件后缀
 * @param multiple 是否多选
 * @returns
 */
export const selectFile = (accepts: string[] = ['*'], multiple?: boolean): Promise<File[]> => {
  if (!globalThis.document || !(globalThis.document instanceof Document)) {
    throw new EnvironmentError();
  }
  const inputElement = globalThis.document.createElement('input');
  inputElement.setAttribute('type', 'file');
  inputElement.setAttribute('visibility', 'hidden');
  if (Array.isArray(accepts) && accepts.length > 0) {
    inputElement.setAttribute('accept', accepts.join(','));
  }
  if (multiple) {
    inputElement.setAttribute('multiple', 'true');
  }
  inputElement.click();

  return new Promise((resolve, reject) => {
    globalThis.addEventListener(
      'focus',
      () => {
        setTimeout(() => {
          if (!inputElement.files || inputElement.files?.length === 0) {
            reject(new FileSelectCancelError());
          }
        }, 0);
      },
      { once: true }
    );
    inputElement.addEventListener('change', () => {
      if (!inputElement.files || inputElement.files?.length === 0) {
        reject(new FileSelectCancelError());
      } else {
        const files = Array.from(inputElement.files);
        if (illegalFiles(files)) {
          reject(new IllegalFileError(accepts));
        }
        resolve(files);
      }
    });
  });

  function illegalFiles(files: File[]): boolean {
    return !accepts.includes('*') && files.some((file) => !accepts.includes(`.${getFileExtension(file)}`));
  }
};
