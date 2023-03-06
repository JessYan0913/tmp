import { BaseService, isSubclass } from '@tmp/utils';

import Context from '../context';
import { CmdNotOptionsError, CmdNotRegisterError } from '../errors';
import { BaseCommand, CommandClass, CommandOptions, History } from '../types';

export class CommandService extends BaseService {
  public disabled?: boolean = false;

  private context: Context;
  private commands: Record<string, CommandClass> = {};
  private undoStack: BaseCommand[] = [];
  private redoStack: BaseCommand[] = [];
  private idCounter: number = 0;

  constructor(context: Context, disabled?: boolean) {
    super();
    this.context = context;
    this.disabled = disabled;
  }

  public registerCommands<T extends BaseCommand>(commandClasses: CommandClass<T> | Array<CommandClass<T>>): void {
    if (!Array.isArray(commandClasses)) {
      commandClasses = [commandClasses];
    }
    commandClasses.forEach((commandClass) => {
      if (isSubclass(commandClass, BaseCommand)) {
        this.commands[commandClass.name] = commandClass;
      }
    });
  }

  public getCommandClass(command: BaseCommand | string): CommandClass {
    let result: CommandClass;
    if (command instanceof BaseCommand) {
      result = this.commands[command.name];
    } else {
      result = this.commands[command];
    }
    if (!result) {
      throw new CmdNotRegisterError(command);
    }
    return result;
  }

  public execute(command: BaseCommand | string, options?: CommandOptions): void {
    let executeCommand: BaseCommand;
    const Command = this.getCommandClass(command);
    if (command instanceof BaseCommand) {
      executeCommand = command;
    } else {
      if (!options) {
        throw new CmdNotOptionsError(command);
      }
      executeCommand = new Command(this.context, options);
    }
    this.undoStack.push(executeCommand);
    executeCommand.id = ++this.idCounter;

    executeCommand.execute();
    executeCommand.executed = true;
    executeCommand.executeTime = new Date().getTime();
    this.redoStack = [];
    this.emit('changed', executeCommand);
  }

  public undo(step: number = 1): BaseCommand | undefined {
    if (this.disabled) {
      return;
    }

    let command: BaseCommand | undefined;
    while (step) {
      if (this.undoStack.length > 0) {
        command = this.undoStack.pop();

        if (command) {
          command.undo();
          this.redoStack.push(command);
          this.emit('changed', command);
        }
      }
      --step;
    }
    return command;
  }

  public redo(step: number = 1): BaseCommand | undefined {
    if (this.disabled) {
      return;
    }
    let command: BaseCommand | undefined;
    while (step) {
      if (this.redoStack.length > 0) {
        command = this.redoStack.pop();
        if (command) {
          command.execute();
          this.undoStack.push(command);
          this.emit('changed', command);
        }
      }
      --step;
    }
    return command;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public jump(id: number): void {
    if (this.disabled) {
      return;
    }

    let command: BaseCommand | undefined =
      this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1] : undefined;

    if (command === undefined || id > command.id) {
      command = this.redo();

      while (command !== undefined && id > command.id) {
        command = this.redo();
      }
    } else {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        command = this.undoStack[this.undoStack.length - 1];

        if (command === undefined || id === command.id) {
          break;
        }
        this.undo();
      }
    }

    this.emit('changed', command);
  }

  public destroy(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.emit('destroy');
    this.emit('changed');
  }

  public toJSON(): History {
    const history: History = {
      undoStack: [],
      redoStack: [],
    };

    for (const command of this.undoStack) {
      history.undoStack.push(command.toJSON());
    }
    for (const command of this.redoStack) {
      history.redoStack.push(command.toJSON());
    }

    return history;
  }

  public fromJSON(json: History): void {
    this.undoStack = [];
    this.redoStack = [];
    for (const commandJson of json.undoStack) {
      const Command = this.commands[commandJson.name];
      if (Command) {
        const command = new Command(this.context, commandJson.options);
        command.fromJSON(commandJson);
        this.undoStack.push(command);
        this.idCounter = Math.max(command.id, this.idCounter);
      }
    }

    for (const commandJson of json.redoStack) {
      const Command = this.commands[commandJson.name];
      if (Command) {
        const command = new Command(this.context, commandJson.options);
        command.fromJSON(commandJson);
        this.redoStack.push(command);
        this.idCounter = Math.max(command.id, this.idCounter);
      }
    }

    this.emit('changed', this.undoStack[this.undoStack.length - 1]);
  }
}

export default CommandService;
