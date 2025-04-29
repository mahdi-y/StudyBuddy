import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; // Adjust the path if needed

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();

  if (user && user.role === 'ADMIN') {
    return true;
  }

  // Redirect to /unauthorized or another fallback route
  return router.createUrlTree(['/unauthorized']);
};
