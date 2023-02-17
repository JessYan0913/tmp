import { App } from 'vue';

import TmpInput from './input/index.vue';

import '../assets/index.scss';

export default {
  install: (app: App) => {
    app.component('TmpInput', TmpInput);
  },
};
