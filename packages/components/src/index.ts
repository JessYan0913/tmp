import { App } from 'vue';

import TInput from './input/index.vue';
import TPage from './page/index.vue';

import '../assets/index.scss';

export default {
  install: (app: App) => {
    app.component('TPage', TPage);
    app.component('TInput', TInput);
  },
};
