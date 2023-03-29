import Context from './context';

export interface CommandOptions {
  [key: string]: any;
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

export interface History {
  undoStack: Command[];
  redoStack: Command[];
}

export namespace Event {
  export interface Command {
    'stack:changed': {
      undoStack: BaseCmd[];
      redoStack: BaseCmd[];
    };
    'stack:cleared': undefined;
    'command:destroy': undefined;
  }
}
