import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from './services/storage.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  console.log('Auth guard activated');
  const storageService = inject(StorageService);
  const router = inject(Router);

  try {

    // Get user data from storage
    const data = await storageService.getItem('loginUser');
    console.log("loginUser : ", data);

    const isLoggedIn = data && data.status && data.allowed;

    // Handle home route
    if (state.url === '/home') {
      if (isLoggedIn) {
        console.log("User is logged in, allowing access to home.");
        return true;
      } else {
        console.log("User not logged in, redirecting to login.");
        await router.navigate(['/login']);
        return false;
      }
    }

    // Handle login route
    if (state.url === '/login') {
      if (isLoggedIn) {
        console.log("User is already logged in, redirecting to home.");
        await router.navigate(['/home']);
        return false;
      } else {
        console.log("Allowing access to login page.");
        return true;
      }
    }

    // Block access to other routes by default
    console.log("Blocking access to other routes.");
    return false;

  } catch (error) {
    console.error('Error in auth guard:', error);
    await router.navigate(['/login']);
    return false;
  }
};
