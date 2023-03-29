import commands from './commands/index';
import History from './services/history';

class Context {
  public domElement: HTMLDivElement;
  public history: History;

  constructor() {
    this.domElement = document.createElement('div');
    this.domElement.setAttribute('style', 'width: 100%; height: 100%; position: relative');

    this.history = new History(this);
    this.history.registerCommands(commands);
  }
}

export default Context;
