import { ref } from 'vue';
import { BaseError } from '@tmp/utils';
import Crypto from 'crypto-js';

export interface FileChunk {
  fileName: string;
  fileType: string;
  fileChunk: Blob;
  chunkIndex: number;
  chunkSize: number;
  chunks: number;
}

export interface FileReadResult {
  fileChunks: FileChunk[];
  md5: string;
  uid: string;
}

export class UploadError extends BaseError {
  constructor(fileName: string, cause?: any) {
    super(`${fileName}上传失败`, cause);
  }
}

export interface UploadConfig {
  uploadFile: Function;
  uploadConfirm: Function;
}

const chunkSize = 1024 * 1024 * 5;
async function readFile(file: File | Blob, fileName: string, fileType: string): Promise<FileReadResult> {
  const fileChunks: FileChunk[] = [];
  const chunks = Math.ceil(file.size / chunkSize);
  const MD5 = Crypto.algo.MD5.create();
  for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const fileChunk = file.slice(start, end);
    const fileContent = await fileChunk.arrayBuffer();
    const i8Array = new Uint8Array(fileContent);
    const wordArray = Crypto.lib.WordArray.create(Array.from(i8Array), i8Array.length);
    MD5.update(wordArray);
    fileChunks.push({
      fileName,
      fileType,
      chunkIndex,
      chunkSize,
      chunks,
      fileChunk,
    });
  }
  return {
    fileChunks,
    md5: MD5.finalize().toString(),
    uid: URL.createObjectURL(new Blob()).slice(-36),
  };
}

export const useUpload = ({ uploadFile, uploadConfirm }: UploadConfig) => {
  const loading = ref<boolean>(false);

  const error = ref<UploadError>();

  const progress = ref<number>(0);

  const execute = async (
    content: File | Blob | string,
    fileName: string,
    fileType: string,
    charset?: string,
    referenceIds?: string
  ): Promise<string> => {
    if (typeof content === 'string') {
      content = new Blob([content], { type: `${fileType};charset=${charset}` });
    }
    loading.value = true;
    const { fileChunks, md5, uid } = await readFile(content, fileName, fileType);
    try {
      await Promise.all(
        fileChunks.map(async ({ chunkIndex, chunks, fileChunk, fileName, fileType }) => {
          const uploadResult = await uploadFile({
            file: fileChunk,
            fileName,
            fileType,
            chunkIndex,
            chunkSize: chunks,
            uid,
          });
          progress.value = uploadResult.progress;
        })
      );
      const confirmResult = await uploadConfirm({
        finished: true,
        fileName,
        fileType,
        uid,
        md5,
        referenceIds,
      });
      progress.value = confirmResult.progress;
      return confirmResult.contentId;
    } catch (e) {
      error.value = new UploadError(fileName, e);
      uploadConfirm({
        finished: false,
        fileName,
        fileType,
        uid,
        md5,
        referenceIds,
      });
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    execute,
    loading,
    progress,
    error,
  };
};

export default useUpload;
