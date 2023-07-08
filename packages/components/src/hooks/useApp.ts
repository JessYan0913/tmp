import { getCurrentInstance, inject, nextTick, onMounted, onUnmounted, onUpdated } from 'vue';
import { App } from '@tmp/core';
import { TmpElementInstance, TmpInstanceMethod } from '@tmp/schema';

export const useApp = (props: Record<string, any>) => {
  const app = inject<App | undefined>('app');
  const component = app?.curPage?.getComponent(props.config.id);

  const instance: TmpElementInstance = {
    methods: {},
  };

  onMounted(() => {
    const vm = getCurrentInstance()?.proxy;
    const exposed = getCurrentInstance()?.exposed;
    Reflect.set(instance, 'el', vm?.$el);
    Reflect.set(instance, 'exposed', exposed);
    component?.emit('mounted', { instance });
  });

  onUpdated(() => {
    const currentInstance = getCurrentInstance();
    nextTick(() => {
      const vm = currentInstance?.proxy;
      const exposed = currentInstance?.exposed;
      const newInstance = { ...instance };
      Reflect.set(instance, 'el', vm?.$el);
      Reflect.set(instance, 'exposed', exposed);
      component?.emit('updated', {
        beforeInstance: instance,
        instance: newInstance,
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
