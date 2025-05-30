import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    _router.navigate(['/login']);
    return false;
  }

  return true;
};
