import { getCurrentInstance, inject, nextTick, onMounted, onUnmounted, onUpdated } from 'vue';
import { App } from '@tmp/h5-core';
import { TmpElementInstance, TmpInstanceMethod } from '@tmp/h5-schema';

export const useApp = (props: Record<string, any>) => {
  const app = inject<App | undefined>('app');
  const component = app?.curPage?.getComponent(props.config.id);

  const instance: TmpElementInstance = {
    methods: {},
  };

  onMounted(() => {
    const vm = getCurrentInstance()?.proxy;
    if (vm) {
      instance.el = vm.$el;
    }
    component?.emit('mounted', { instance });
  });

  onUpdated(() => {
    nextTick(() => {
      const vm = getCurrentInstance()?.proxy;
      component?.emit('updated', {
        beforeInstance: instance,
        instance: {
          ...instance,
          el: vm ? vm.$el : instance.el,
        },
      });
    });
  });

  onUnmounted(() => component?.emit('unmounted', {}));

  const provideMethod = (name: string, method: TmpInstanceMethod, dependVariables?: string[]): TmpInstanceMethod => {
    if (!instance.methods) {
      instance.methods = {};
    }
    if (dependVariables) {
      method.dependVariables = [...dependVariables];
    }
    instance.methods[name] = method;
    return method;
  };

  const triggerEvent = (event: string, payload: Record<string, any> = {}) => {
    if (!component) {
      return;
    }
    app?.emit(`${component.data.id}::${event}`, payload);
  };

  return { app, component, provideMethod, triggerEvent };
};

export default useApp;
