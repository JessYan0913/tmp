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

export type FileExtension = keyof FileHandlerFactory;

const fileHandler: FileHandlerFactory = {
  async obj(context: Context, file: File) {
    const loader = new OBJLoader();
    const content = await readeFile<string>((fileReader) => {
      fileReader.readAsDataURL(file);
    });
    const group = await loader.loadAsync(content);
    context.addObject(group);
  },
};

export interface LoaderPluginOptions {
  context: Context;
  isEnabled?: boolean;
}

export class LoaderPlugin implements PluginInterface {
  private context: Context;
  public isEnabled: boolean = true;
  public isLoading: boolean = false;

  constructor(options: LoaderPluginOptions) {
    this.context = options.context;
    options.isEnabled && (this.isEnabled = options.isEnabled);
  }

  public get name(): string {
    return 'LoaderPlugin';
  }

  public init(): void {
    this.enable();
    this.isLoading = false;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public destroy(): void {
    this.disable();
  }

  public async loadFile(file: File): Promise<void> {
    if (!this.enable) {
      return;
    }
    this.isLoading = true;
    const extension: string = getFileExtension(file).toLowerCase();
    if (!Object.keys(fileHandler).includes(extension)) {
      throw new IllegalFileError(Object.keys(fileHandler));
    }
    if (!fileHandler[extension as FileExtension]) {
      return;
    }
    await fileHandler[extension as keyof FileHandlerFactory](this.context, file);
    this.isLoading = false;
  }
}

export default LoaderPlugin;
