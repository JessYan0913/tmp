import { Camera, Object3D, Scene, Vector2, WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import History from './services/history';
import Context from './context';

export interface PluginInterface {
  install(context: Context): void;
  uninstall(): void;
}

export interface SceneControlsEnabled {
  enablePan?: boolean;
  enableRotate?: boolean;
  enableZoom?: boolean;
  enableDamping?: boolean;
}

export namespace Cmd {
  export interface Options {
    [key: string]: any;
  }
}

export interface Command<T extends Cmd.Options = Cmd.Options> {
  id: number;
  name: string;
  options: T;
  executed: boolean;
  executeTime: number;
}

export abstract class BaseCmd<T extends Cmd.Options = Cmd.Options> implements Command<T> {
  public context: Context;
  public name: string;
  public id: number = 0;
  public executed: boolean = false;
  public options: T;
  public executeTime: number = new Date().getTime();

  constructor(context: Context, options: T) {
    this.context = context;
    this.name = this.constructor.name;
    this.options = options;
  }

  public abstract execute(): void;

  public abstract undo(): void;

  public toJSON(): Command<T> {
    return {
      id: this.id,
      name: this.name,
      options: this.options,
      executed: this.executed,
      executeTime: this.executeTime,
    };
  }

  public fromJSON(json: Command<T>): void {
    this.id = json.id;
    this.name = json.name;
    this.options = json.options;
    this.executed = json.executed;
    this.executeTime = json.executeTime;
  }
}

export type CommandClass<T extends BaseCmd = BaseCmd, O extends Cmd.Options = Cmd.Options> = new (
  context: Context,
  options: O
) => T;

export interface CmdStack {
  undoStack: Command[];
  redoStack: Command[];
}

export namespace Event {
  export interface ContextArgs extends MouseArgs {
    'webgl:renderer:created': {
      renderer: WebGLRenderer;
    };
    'css2:renderer:created': {
      renderer: CSS2DRenderer;
    };
    'container:resize': undefined;
    'object:selected': {
      selected: Object3D;
    };
    'object:focused': {
      focused: Object3D;
    };
    'object:added': {
      object: Object3D;
    };
    'object:removed': {
      object: Object3D;
    };
    'scene:changed': {
      scene: Scene;
    };
    'viewport:camera:changed': {
      viewportCamera: Camera;
    };
    'camera:reset': {
      camera: Camera;
    };
    'engine:destroy': {
      context: Context;
    };
  }

  export interface MouseArgs {
    'mouse:down': {
      point: Vector2;
    };
    'mouse:up': {
      point: Vector2;
    };
    'mouse:click': {
      point: Vector2;
    };
    'mouse:dbclick': {
      point: Vector2;
    };
  }

  export interface HistoryArgs {
    'stack:changed': CmdStack;
    'history:destroy': {
      history: History;
    };
    'history:undo': {
      command: Command | undefined;
      step: number;
    };
    'history:redo': {
      command: Command | undefined;
      step: number;
    };
  }

  export interface RendererArgs {
    'scene:rendered': {
      time: number;
    };
    'camera:changed': {
      camera: Camera;
    };
  }
}
