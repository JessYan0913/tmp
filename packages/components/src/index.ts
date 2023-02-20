import { App } from 'vue';

import Input from './input/index.vue';
import Page from './page/index.vue';
import Upload from './upload/index.vue';

import '../assets/index.scss';

export default {
  install: (app: App) => {
    app.component('TmpUiPage', Page);
    app.component('TmpUiInput', Input);
    app.component('TmpUiUpload', Upload);
  },
};
