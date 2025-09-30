import axios from 'axios';
import Swal from 'sweetalert2';

import { useAuthStore } from '../stores/auth.store';

const apiUrl = import.meta.env.VITE_API_URL;

const authApi = axios.create({
  baseURL: apiUrl
});

authApi.interceptors.request.use((request) => {
  const { accessToken } = useAuthStore();

  const controller = new AbortController();

  if (!navigator.onLine) {
    Swal.fire({
      icon: 'warning',
      title: 'Message',
      text: 'You are offline'
    });
    controller.abort();
  }

  request.headers.Authorization = 'Bearer ' + accessToken;
  request.withCredentials = true;

  return {
    ...request,
    signal: controller.signal
  };
});

authApi.interceptors.response.use(null, async (error) => {
  const authStore = useAuthStore();
  const { resetAuth, refresh } = authStore;

  const response = error.response;

  if ([500].includes(response.status)) {
    Swal.fire({
      icon: 'error',
      title: 'Message',
      text: 'An error occured'
    });
  }

  if ([401].includes(response.status)) {
    error.config.url !== 'refresh-token' && (await refresh());

    const accessToken = authStore.accessToken;

    if (accessToken && !error.config._retry) {
      error.config.headers.Authorization = 'Bearer ' + accessToken;
      error.config.withCredentials = true;
      error.config._retry = true;

      return authApi.request(error.config);
    }

    Swal.fire({
      icon: 'error',
      title: response.statusText,
      text: response.data.msg ?? response.message
    });

    resetAuth();
    window.location.href = import.meta.env.VITE_HOST_URL + '/authentication/sign-in';
  }

  return Promise.reject(error);
});

export default authApi;
