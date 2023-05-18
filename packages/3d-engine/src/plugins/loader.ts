import { getFileExtension, IllegalFileError, readeFile } from '@tmp/utils';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import Context from '../context';
import { PluginInterface } from '../types';

export interface FileHandler {
  (context: Context, file: File): void;
}

export interface FileHandlerFactory {
  obj: FileHandler;
}

const fileHandler: FileHandlerFactory = {
  async obj(context: Context, file: File) {
    const loader = new OBJLoader();
    const content = await readeFile<string>((fileReader) => {
      fileReader.readAsDataURL(file);
    });
    loader.load(content, (group) => {
      context.addObject(group);
    });
  },
};

export class LoaderPlugin implements PluginInterface {
  private context?: Context;

  constructor(context: Context) {
    this.context = context;
  }

  public get name(): string {
    return 'LoaderPlugin';
  }

  public init(): void {
    throw new Error('Method not implemented.');
  }

  public enable(): void {
    throw new Error('Method not implemented.');
  }

  public disable(): void {
    throw new Error('Method not implemented.');
  }

  public destroy(): void {
    throw new Error('Method not implemented.');
  }

  public async loadFile(file: File): Promise<void> {
    if (!this.context) {
      return;
    }
    const extendsion: string = getFileExtension(file).toLowerCase();
    if (!Object.keys(fileHandler).includes(extendsion)) {
      throw new IllegalFileError(Object.keys(fileHandler));
    }
    fileHandler[extendsion as keyof FileHandlerFactory]?.(this.context, file);
  }
}

export default LoaderPlugin;
