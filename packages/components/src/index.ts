import { App } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';

import 'vuetify/styles';

import Button from './button/index.vue';
import Form from './form/index.vue';
import Input from './input/index.vue';
import Page from './page/index.vue';
import Select from './select/index.vue';
import Text from './text/index.vue';
import Upload from './upload/index.vue';

export default {
  install: (app: App) => {
    const vuetify = createVuetify({ components });
    app.use(vuetify);
    app.component('TmpUiPage', Page);
    app.component('TmpUiForm', Form);
    app.component('TmpUiInput', Input);
    app.component('TmpUiUpload', Upload);
    app.component('TmpUiSelect', Select);
    app.component('TmpUiButton', Button);
    app.component('TmpUiText', Text);
  },
};
