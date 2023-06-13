import { getCurrentInstance, inject, nextTick, onMounted, onUnmounted, onUpdated } from 'vue';
import { App } from '@tmp/h5-core';
import { TmpElementInstance, TmpInstanceMethod } from '@tmp/h5-schema';

export const useApp = (props: Record<string, any>) => {
  const app = inject<App | undefined>('app');
  const node = app?.curPage?.getComponent(props.config.id);

  const instance: TmpElementInstance = {
    methods: {},
  };

  onMounted(() => {
    const vm = getCurrentInstance()?.proxy;
    if (vm) {
      instance.el = vm.$el;
    }
    node?.emit('mounted', { instance });
  });

  onUpdated(() => {
    nextTick(() => {
      const vm = getCurrentInstance()?.proxy;
      node?.emit('updated', {
        beforeInstance: instance,
        instance: {
          ...instance,
          el: vm ? vm.$el : instance.el,
        },
      });
    });
  });

  onUnmounted(() => node?.emit('unmounted', {}));

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

  return { app, node, provideMethod };
};

export default useApp;
