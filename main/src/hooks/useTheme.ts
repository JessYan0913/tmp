import { ref, watchEffect } from 'vue';

const theme = ref<string>();

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value ?? 'light');
});

export const useTheme = () => {
  return {
    theme,
  };
};

export default useTheme;
