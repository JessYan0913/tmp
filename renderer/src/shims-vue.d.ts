import { App } from '@tmp/h5-core';

declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    app: App;
  }
}
