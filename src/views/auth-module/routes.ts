import { guest } from '@/router/middlware';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw = {
  path: '',
  component: () => import('./Layout.vue'),
  redirect: { name: 'login' },
  children: [
    {
      path: 'login',
      name: 'login',
      meta: {
        middleware: [guest]
      },
      component: () => import('./views/Login.vue')
    }
    // {
    //   path: 'forgot-password',
    //   name: 'forgot-password',
    //   meta: {
    //     middleware: [guest]
    //   },
    //   component: () => import('./views/ForgotPassword.vue')
    // }
  ]
};

export default routes;
