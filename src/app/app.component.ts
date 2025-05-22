import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonMenuToggle,
  IonContent, IonIcon
} from '@ionic/angular/standalone';
import { NavigationEnd, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  add,
  arrowBackOutline,
  bagHandle,
  bagHandleOutline,
  bagHandleSharp,
  documentLockOutline,
  documentLockSharp,
  homeOutline,
  homeSharp,
  informationCircleOutline,
  informationCircleSharp,
  keyOutline,
  keySharp,
  locationOutline,
  locationSharp,
  logOutOutline,
  logOutSharp,
  personOutline,
  personSharp,
  remove,
  star,
  ticketOutline,
  trashOutline,
  settingsOutline,
  settingsSharp,
} from 'ionicons/icons';

import { StorageService } from './services/storage.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonMenuToggle,
    IonContent, IonIcon, NgClass],
})

export class AppComponent {

  profile = {
    name: '',
    email: '',
    picture: '',
  };

  pages = [
    {
      title: 'Home', url: '/home', icon: 'home', active: true,
      route: true,
    },
    { title: 'Profile', url: '/profile', icon: 'person', active: false, route: true, },
    { title: 'Settings', url: '/settings', icon: 'settings', active: false, route: true, },
    { title: 'Sign Out', icon: 'log-out', route: false, active: false, },
  ];

  constructor(private router: Router, private storageService: StorageService) {
    this.addAllIcons();


    this.storageService.getItem('loginUser').then((user) => {
      if (user) {
        this.profile.name = user.userName;
        this.profile.email = user.email;

        if (user.profilePicture) {
          this.profile.picture = environment.videoServerBaseUrl + "\\" + user.profilePicture;
          console.log("User picture: ", this.profile.picture);
        }
        else {
          this.profile.picture = 'assets/icon/profile.png';
        }

        // console.log("User data: ", this.profile);
      }
    }
    ).catch((err) => {
      console.log("Error while getting user data", err);
    });
    // this.initializeApp();
  }

  async initializeApp() {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false }); // Prevents content underlap
      await StatusBar.setStyle({ style: Style.Dark }); // Optional: set style
    } catch (error) {
      console.error('StatusBar plugin not available or error:', error);
    }
  }

  addAllIcons() {
    addIcons({
      star,
      bagHandleOutline,
      bagHandle,
      bagHandleSharp,
      trashOutline,
      add,
      remove,
      arrowBackOutline,
      ticketOutline,
      locationOutline,
      homeOutline,
      homeSharp,
      informationCircleOutline,
      informationCircleSharp,
      documentLockOutline,
      documentLockSharp,
      logOutOutline,
      logOutSharp,
      personOutline,
      personSharp,
      locationSharp,
      keyOutline,
      keySharp,
      settingsOutline,
      settingsSharp,
    });
  }

  onItemTap(page: any) {
    if (!page?.active) {
      const index = this.pages.findIndex(x => x.active);
      this.pages[index].active = false;
      page.active = true;
    }

    if (page?.route) {
      console.log("url : ", page.url);
      this.router.navigate([page.url]);
    } else {
      this.logout();
    }
  }

  logout() {
    this.storageService.removeItem('loginUser').then(() => {
      this.storageService.removeItem('lastVideo');
      console.log("User logged out");
      this.router.navigate(['/login']);
    }).catch((err) => {
      console.log("Error while logging out", err);
    });
  }
}
