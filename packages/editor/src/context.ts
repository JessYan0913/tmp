import commands from './commands/index';
import CommandService from './services/command';

class Context {
  public domElement: HTMLDivElement;
  public commandService: CommandService;

  constructor() {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('style', 'width: 100%; height: 100%; position: relative');

    this.commandService = new CommandService(this);
    this.commandService.registerCommands(commands);
  }
}

export default Context;
