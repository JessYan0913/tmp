import { reactive, readonly } from 'vue';

export interface Account {
  name: string;
}

export interface AuthStore {
  account: Account | null;
  isAuthed: boolean;
}

const auth = reactive<AuthStore>({
  isAuthed: false,
  account: null,
});

export const useAuthStore = () => {
  return {
    state: readonly(auth),
    actions: {
      login(account: Account) {
        auth.isAuthed = true;
        auth.account = account;
      },
      logout() {
        auth.isAuthed = false;
        auth.account = null;
      },
    },
  };
};

export default useAuthStore;
