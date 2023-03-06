import Context from '../context';
import { BaseCommand, CommandOptions } from '../types';

export default class AddNodeCmd extends BaseCommand {
  constructor(context: Context, options: CommandOptions) {
    super(context, options);
  }

  public execute(): void {
    console.log('执行', this.options);
  }

  public undo(): void {
    console.log('撤销', this.options);
  }
}
