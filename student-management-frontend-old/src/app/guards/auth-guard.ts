import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Api } from '../services/api';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(Api);
  const router = inject(Router);

  return apiService.isAuthenticated().pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true; // User is logged in, allow access
      } else {
        router.navigate(['/login']); // User is not logged in, redirect
        return false;
      }
    })
  );
};