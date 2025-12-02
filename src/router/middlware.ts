import { storeToRefs } from 'pinia';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { useAuthStore, useAuthConfigStore } from '@/views/auth-module/stores/auth.store';

export interface Context {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
}

export const middlewarePipeline = (
  context: Context,
  middleware: Array<(c: Context) => NavigationGuardNext>,
  index: number = 0
) => {
  const nextMiddleware = middleware[index];

  if (!nextMiddleware) {
    return context.next;
  }

  return ((location?: NavigationGuardNext) => {
    if (location || location === false) {
      context.next(location);
    } else {
      nextMiddleware({
        ...context,
        next: middlewarePipeline(context, middleware, index + 1)
      });
    }
  }) as NavigationGuardNext;
};

export const guest = async (context: Context) => {
  const { accessToken, verify } = useAuthStore();
  const { isAuth } = storeToRefs(useAuthConfigStore());

  if (accessToken && isAuth.value) {
    return context.next({ name: 'dashboard' });
  } else {
    if (accessToken && (await verify())) {
      isAuth.value = true;

      return context.next({ name: 'dashboard' });
    }

    return context.next();
  }
};

export const auth = async (context: Context) => {
  const authStore = useAuthStore();
  const { verify } = authStore;
  const { accessToken, refreshToken } = storeToRefs(authStore);
  const { isAuth } = storeToRefs(useAuthConfigStore());

  console.log('[AUTH MIDDLEWARE] Starting auth check', {
    hasAccessToken: !!accessToken.value,
    isAuth: isAuth.value,
    queryTokens: {
      accessToken: !!context.to.query.accessToken,
      refreshToken: !!context.to.query.refreshToken
    }
  });

  // Récupérer les tokens depuis l'URL si présents
  if (context.to.query.accessToken || context.to.query.refreshToken) {
    console.log('[AUTH MIDDLEWARE] Setting tokens from URL');
    accessToken.value = context.to.query.accessToken as string;
    refreshToken.value = context.to.query.refreshToken as string;
    
    // Sauvegarder dans localStorage pour persistance
    const authData = {
      token: accessToken.value,
      refreshToken: refreshToken.value,
      user: null
    };
    localStorage.setItem('auth', JSON.stringify(authData));
    console.log('[AUTH MIDDLEWARE] Tokens saved to localStorage');
    
    // Nettoyer l'URL en supprimant les query params
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }

  if (accessToken.value && isAuth.value) {
    console.log('[AUTH MIDDLEWARE] Already authenticated, proceeding');
    return context.next();
  } else if (accessToken.value) {
    console.log('[AUTH MIDDLEWARE] Verifying token...');
    const verifyResult = await verify();
    console.log('[AUTH MIDDLEWARE] Verify result:', verifyResult);
    
    if (verifyResult) {
      isAuth.value = true;
      console.log('[AUTH MIDDLEWARE] Verification successful, proceeding');
      return context.next();
    }
  }

  console.log('[AUTH MIDDLEWARE] Authentication failed, redirecting to sign-in');
  window.location.href = import.meta.env.VITE_HOST_URL + '/admin/authentication/sign-in';

  return context.next(false);
};

export const access = (roleAllowed: string) => {
  return function (context: Context, role = roleAllowed) {
    const { is, redirectRoute } = useAuthStore();

    const redirect_route = redirectRoute() as NavigationGuardNext;

    if (
      (!context.to.meta.affectedRoutes ||
        (context.to.meta.affectedRoutes as string[]).includes(context.to.name as string)) &&
      (!context.to.meta.excludedRoutes ||
        !(context.to.meta.excludedRoutes as string[]).includes(context.to.name as string))
    ) {
      switch (role) {
        case 'admin':
          return is('admin') ? context.next() : context.next(redirect_route);

        case 'company':
          return is('company') ? context.next() : context.next(redirect_route);

        case 'referral':
          return is('referral') ? context.next() : context.next(redirect_route);

        case 'hr-first-club':
          return is('hr-first-club') ? context.next() : context.next(redirect_route);

        case 'talent':
          return is('talent') ? context.next() : context.next(redirect_route);

        case 'admin | company':
          return is('admin') || is('company') ? context.next() : context.next(redirect_route);

        case 'talent | referral':
          return is('talent') || is('referral') ? context.next() : context.next(redirect_route);

        case 'admin | talent':
          return is('admin') || is('talent') ? context.next() : context.next(redirect_route);

        case 'admin | referral':
          return is('admin') || is('referral') ? context.next() : context.next(redirect_route);

        case 'admin | hr-first-club':
          return is('admin') || is('hr-first-club') ? context.next() : context.next(redirect_route);

        case 'company | talent | referral':
          return is('talent') || is('referral') || is('company')
            ? context.next()
            : context.next(redirect_route);

        case 'company | talent | referral | hr-first-club':
          return is('talent') || is('referral') || is('company') || is('hr-first-club')
            ? context.next()
            : context.next(redirect_route);

        case 'company | talent | referral | hr-first-club | consultant':
          return is('talent') || is('referral') || is('company') || is('hr-first-club') || is('consultant')
            ? context.next()
            : context.next(redirect_route);

        case 'consultant':
          return is('consultant') ? context.next() : context.next(redirect_route);

        default:
          context.next(redirect_route);
      }
    }

    return context.next();
  };
};
