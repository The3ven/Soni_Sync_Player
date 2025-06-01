import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'videos',
        loadComponent: () => import('./video-gallery/video-gallery').then(m => m.videoGalleryPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: 'videoPlayer',
        loadComponent: () => import('./videoPlayer/videoPlayer.page').then(m => m.VideoPlayerPage)
      },
      {
        path: '',
        redirectTo: '/tabs/videos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/videos',
    pathMatch: 'full'
  }
];