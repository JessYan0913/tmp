import Context from './context';

export interface CommandOptions {
  [key: string]: any;
}

export interface Command {
  id: number;
  name: string;
  options: CommandOptions;
  executed: boolean;
  executeTime: number;
}

export abstract class BaseCommand implements Command {
  public context: Context;
  public name: string;
  public id: number = 0;
  public executed: boolean = false;
  public options: CommandOptions;
  public executeTime: number = new Date().getTime();

  constructor(context: Context, options: CommandOptions) {
    this.context = context;
    this.name = this.constructor.name;
    this.options = options;
  }

  public abstract execute(): void;

  public abstract undo(): void;

  public toJSON(): Command {
    return {
      id: this.id,
      name: this.name,
      options: this.options,
      executed: this.executed,
      executeTime: this.executeTime,
    };
  }

  public fromJSON(json: Command): void {
    this.id = json.id;
    this.name = json.name;
    this.options = json.options;
    this.executed = json.executed;
    this.executeTime = json.executeTime;
  }
}

export type CommandClass<T extends BaseCommand = BaseCommand> = new (context: Context, options: CommandOptions) => T;

export interface History {
  undoStack: Command[];
  redoStack: Command[];
}
