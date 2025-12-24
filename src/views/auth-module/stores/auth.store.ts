import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore, storeToRefs } from 'pinia';
import Swal from 'sweetalert2';

import { login, me, reloadToken, logout } from './services/auth.service';
import type { User } from '@/stores/models/user.model';
import type { LoginPayload } from './models/auth.interface';

import useGlobalStore from '@/stores/global.store';

export const useAuthStore = defineStore(
  'auth-admin',
  () => {
    const router = useRouter();

    // States

    const user = ref<User | undefined>(undefined);
    const accessToken = ref<string | undefined>(undefined);
    const refreshToken = ref<string | undefined>(undefined);

    if (!accessToken.value || !user.value) {
      let frontCredentials;

      try {
        frontCredentials = JSON.parse(localStorage.getItem('auth') as string);
      } catch (error) {
        frontCredentials = null;
      }

      if (frontCredentials) {
        user.value = frontCredentials.user;
        accessToken.value = frontCredentials.token;
        refreshToken.value = frontCredentials.refreshToken;
      }
    }

    const is = (role: 'admin' | 'company' | 'talent' | 'referral' | 'hr-first-club' | 'consultant') => {
      return user.value?.roles.filter((r) => r.name === role)?.length ? true : false;
    };

    const redirectRoute = () => {
      if (
        !is('admin') &&
        !is('company') &&
        !is('talent') &&
        !is('referral') &&
        !is('hr-first-club') &&
        !is('consultant')
      ) {
        window.location.href = '/authentication/sign-in';
        return;
      }

      return is('admin') ? { name: 'user' } : { name: 'profile' };
    };

    const setAuth = (
      newUser: User | undefined,
      newAccessToken: string | undefined,
      newRefreshToken: string | undefined
    ) => {
      const authConfigStore = useAuthConfigStore();
      const { isAuth } = storeToRefs(authConfigStore);

      user.value = newUser;
      accessToken.value = newAccessToken;
      refreshToken.value = newRefreshToken;

      isAuth.value = true;
    };

    const resetAuth = () => {
      const authConfigStore = useAuthConfigStore();
      const { isAuth } = storeToRefs(authConfigStore);

      user.value = undefined;
      accessToken.value = undefined;
      refreshToken.value = undefined;

      localStorage.removeItem('auth');

      isAuth.value = false;
    };

    // Actions

    const authentificate = async (payload: LoginPayload) => {
      const authConfigStore = useAuthConfigStore();
      const { isLoading } = storeToRefs(authConfigStore);

      isLoading.value = true;

      try {
        const { data, error } = await login(payload);

        if (data && data.user) {
          setAuth(data.user, data.accessToken, data.refreshToken);

          Swal.fire({
            icon: 'success',
            title: 'Message',
            text: 'Authentification successful',
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000 // Adjust the duration as needed
          });

          await router.replace('/');
        } else if (error) {
          resetAuth();

          Swal.fire({
            icon: 'error',
            title: error.response?.statusText || 'Erreur',
            text: error.response?.data?.msg || error.response?.message || 'Email ou mot de passe incorrect'
          });
        }
      } catch (err) {
        resetAuth();
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la connexion'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const getUser = async () => {
      const authConfigStore = useAuthConfigStore();
      const { isLoading } = storeToRefs(authConfigStore);

      isLoading.value = true;

      const { data } = await me();

      isLoading.value = false;

      if (data && data.user) {
        user.value = data.user;
      }
    };

    const verify = async () => {
      const authConfigStore = useAuthConfigStore();
      const { isLoading } = storeToRefs(authConfigStore);

      isLoading.value = true;

      const { data } = await me();

      isLoading.value = false;

      if (data && data.user) {
        user.value = data.user;

        return true;
      } else {
        return false;
      }
    };

    const refresh = async () => {
      if (refreshToken.value) {
        const authConfigStore = useAuthConfigStore();
        const { isLoading } = storeToRefs(authConfigStore);

        isLoading.value = true;

        const { data, error } = await reloadToken({ refreshToken: refreshToken.value as string });

        isLoading.value = false;

        if (data && data.user) {
          setAuth(data.user, data.accessToken, data.refreshToken);
        } else if (error && error.response) {
          resetAuth();
        }
      } else {
        resetAuth();
      }
    };

    const signout = async () => {
      const globalStore = useGlobalStore();

      const { isLoading } = storeToRefs(globalStore);

      isLoading.value = true;
      isLoading.value = true;

      const { data } = await logout();

      if (data && data.msg) {
        resetAuth();

        Swal.fire({
          icon: 'success',
          title: 'Message',
          text: data.msg,
          toast: true,
          position: 'bottom-right',
          showConfirmButton: false,
          timer: 3000 // Adjust the duration as needed
        });

        window.location.href = '/authentication/sign-in';
      } else {
        isLoading.value = false;
      }
    };

    return {
      user,
      accessToken,
      refreshToken,
      is,
      redirectRoute,
      setAuth,
      resetAuth,
      authentificate,
      getUser,
      verify,
      refresh,
      signout
    };
  },
  { persist: true }
);

export const useAuthConfigStore = defineStore('authConfif', () => {
  const isAuth = ref(false);
  const isLoading = ref(false);

  return {
    isAuth,
    isLoading
  };
});
