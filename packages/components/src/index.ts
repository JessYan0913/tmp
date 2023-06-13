import { App } from 'vue';

import Button from './button/index.vue';
import Form from './form/index.vue';
import Input from './input/index.vue';
import Page from './page/index.vue';
import Select from './select/index.vue';
import Text from './text/index.vue';
import Upload from './upload/index.vue';

import '../assets/index.scss';

export default {
  install: (app: App) => {
    app.component('TmpUiPage', Page);
    app.component('TmpUiForm', Form);
    app.component('TmpUiInput', Input);
    app.component('TmpUiUpload', Upload);
    app.component('TmpUiSelect', Select);
    app.component('TmpUiButton', Button);
    app.component('TmpUiText', Text);
  },
};
