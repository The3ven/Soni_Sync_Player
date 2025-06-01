import { Component, OnInit } from '@angular/core';
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
  IonContent, IonIcon,
  IonTabButton,
  IonTabBar,
  IonTabs,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
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

import { StorageService } from './services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    CommonModule,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonItem,
    IonAvatar,
    IonLabel,
    IonText,
    IonMenuToggle,
    IonContent,
    IonIcon,
    NgClass,
    IonTabButton,
    IonTabBar,
    IonTabs],
})

export class AppComponent implements OnInit {

  profile = {
    userName: '',
    email: '',
    profilePicture: '',
    isAdmin: false,
  };

  pages = [
    {
      title: 'Home', url: '/home', icon: 'home', active: true,
      route: true,
    },
    // { title: 'Profile', url: '/profile', icon: 'person', active: false, route: true, },
    { title: 'Sign Out', icon: 'log-out', route: false, active: false, },
  ];

  isLoggedIn = false;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private menuController: MenuController
  ) {
    this.addAllIcons();

    this.storageService.getItem('loginUser').then((user) => {
      console.log("User data: ", user);

      if (user) {
        this.profile = { ...user };

        this.isLoggedIn = true;

        if (user.profilePicture) {
          if (!user.profilePicture.startsWith('http')) {
            this.profile.profilePicture = environment.videoServerBaseUrl + "\\" + user.profilePicture;
          }
          else {
            this.profile.profilePicture = user.profilePicture;
          }
          console.log("User picture: ", this.profile.profilePicture);
        } else {
          this.profile.profilePicture = 'assets/icon/profile.png';
        }

        // Add the settings page for admin users
        if (this.profile.isAdmin) {
          const logout = this.pages.pop();
          this.pages.push({ title: 'Settings', url: '/settings', icon: 'settings', active: false, route: true });
          if (logout) {
            this.pages.push(logout);
          }
        }

        console.log("Profile data: ", this.profile);
        console.log("Pages data: ", this.pages);
      }
      else {
        // this.router.navigate(['/login']);
      }
    }).catch((err) => {
      console.log("Error while getting user data", err);
    });
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

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  ngOnInit() {
    // Check login status
    
  }

  checkLoginStatus() {
    // Replace this with your actual login check logic
    this.storageService.getItem('loginUser').then((user) => {
      if (user.userName && user.email) {
        this.isLoggedIn = true;
        console.log("User is logged in: ", user);
      }
      else {
        this.isLoggedIn = false;
        console.log("User is not logged in");
      }
    });

    console.log("Is user logged in? ", this.isLoggedIn);

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
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
