import { BaseError } from '@tmp/utils';

import { BaseCommand } from '../types';

export class CmdNotRegisterError extends BaseError {
  constructor(command: BaseCommand | string) {
    super(`${command instanceof BaseCommand ? command.name : command} not registered`);
  }
}

export class CmdNotOptionsError extends BaseError {
  constructor(command: BaseCommand | string) {
    super(`The options of the ${command instanceof BaseCommand ? command.name : command} command cannot be undefine`);
  }
}
