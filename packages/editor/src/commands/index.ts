import { CommandClass } from '../types';

const modulesFiles = import.meta.glob(['./*Cmd.ts', '!./index.ts'], { import: 'default', eager: true });

export default Object.values(modulesFiles) as CommandClass[];
