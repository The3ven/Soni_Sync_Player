import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
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
    name: 'Soni',
    email: 'soni@gmail.com',
  };

  pages = [
    { title: 'Home', url: '/home', icon: 'home', active: true,
      route: true,
    },
    { title: 'Profile', url: '/profile', icon: 'person', active: false, route: true,},
    { title: 'Settings', url: '/settings', icon: 'settings', active: false, route: true,},
    { title: 'Sign Out', icon: 'log-out', route: false, active: false, },
  ];

  constructor(private router: Router) {
    this.addAllIcons();
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

  logout() { }
}
