import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'videoPlayer',
    loadComponent: () => import('./pages/videoPlayer/videoPlayer.page').then( m => m.VideoPlayerPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },  {
    path: 'tabsttt',
    loadComponent: () => import('./tabsttt/tabsttt.page').then( m => m.TabstttPage)
  },

];
