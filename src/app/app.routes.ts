import { Routes } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';
// import auth service
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.routes),
    canActivate: [async () => await inject(AuthService).authGuard()]

  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/login/signup/signup.page').then( m => m.SignupPage)
  }
];