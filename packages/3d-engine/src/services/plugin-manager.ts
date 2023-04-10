import { BaseService } from '@tmp/utils';

import { Context } from '../context';
import { Event, PluginInterface } from '../types';

export class PluginManger extends BaseService<Event.PluginMangerArgs> {
  private context: Context;
  private plugins: PluginInterface[];

  constructor(context: Context) {
    super();
    this.context = context;
    this.plugins = [];
  }

  public getPlugins(): PluginInterface[] {
    return this.plugins;
  }

  public use(plugin: PluginInterface): void {
    plugin.install(this.context);
    this.plugins.push(plugin);
    this.emit('plugin:install', {
      plugin,
    });
  }

  public uninstall(plugin: PluginInterface): void {
    plugin.uninstall();
    this.plugins = this.plugins.filter((p) => p !== plugin);
    this.emit('plugin:uninstall', {
      plugin,
    });
  }

  public destroy(): void {
    this.plugins.forEach(this.uninstall);
    this.removeAllListeners();
  }
}

export default PluginManger;
