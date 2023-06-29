import { App } from 'vue';
import { createVuetify } from 'vuetify';

import 'vuetify/styles';

import Button from './button/index.vue';
import Card from './card/index.vue';
import Form from './form/index.vue';
import Input from './input/index.vue';
import Overlay from './overlay/index.vue';
import Page from './page/index.vue';
import Select from './select/index.vue';
import Text from './text/index.vue';
import Upload from './upload/index.vue';

import 'vuetify/dist/vuetify.css';
import '@mdi/font/css/materialdesignicons.css';

export default {
  install: (app: App) => {
    const vuetify = createVuetify();
    app.use(vuetify);
    app.component('TmpUiPage', Page);
    app.component('TmpUiForm', Form);
    app.component('TmpUiInput', Input);
    app.component('TmpUiUpload', Upload);
    app.component('TmpUiSelect', Select);
    app.component('TmpUiButton', Button);
    app.component('TmpUiText', Text);
    app.component('TmpUiOverlay', Overlay);
    app.component('TmpUiCard', Card);
  },
};
