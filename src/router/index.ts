import { createRouter, createWebHistory, type NavigationGuardNext } from 'vue-router';

import { middlewarePipeline, type Context, auth } from './middlware';

import dashboardRoutes from '@/views/dashboard-module/routes';
import authRoutes from '@/views/auth-module/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: {
        middleware: [auth]
      },
      children: [dashboardRoutes]
    },
    {
      path: '/',
      children: [authRoutes]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  /**
   * Navigate to next if middleware is not applied
   * */
  if (!to.meta.middleware) {
    return next();
  }

  // Get all parents middleware
  const middleware = to.matched.reduce((acc, parent) => {
    parent.meta.middleware &&
      acc.push(...(parent.meta.middleware as Array<(c: Context) => NavigationGuardNext>));
    return acc;
  }, [] as Array<(c: Context) => NavigationGuardNext>);

  const context: Context = {
    to,
    from,
    next
  };

  const currentMiddlware = middleware[0];

  return currentMiddlware({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  });
});

export default router;
