import { createApp } from 'vue';
import H5Element from '@tmp/components';

import App from './App.vue';

import './style.css';

const app = createApp(App);
app.use(H5Element);
app.mount('#app');
