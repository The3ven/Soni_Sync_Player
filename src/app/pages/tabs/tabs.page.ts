import { Component, EnvironmentInjector, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, settingsOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, CommonModule]
})
export class TabsPage {
  tabBarHidden = false;

  public environmentInjector = inject(EnvironmentInjector);

  user = new User("", "", false, "", "");

  constructor(private router: Router, private storageService: StorageService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.tabBarHidden = event.url.includes('/videoPlayer');
      }
    });
    addIcons({ homeOutline, personOutline, settingsOutline });
    this.loadUserProfile();
  }
  loadUserProfile() {
    this.storageService.getItem('loginUser').then((user) => {
      if (user) {
        this.user = { ...user };
        if (user.profilePicture) {
          if (!user.profilePicture.startsWith('http')) {
            this.user.profilePicture = environment.videoServerBaseUrl + "\\" + user.profilePicture;
          }
          else {
            this.user.profilePicture = user.profilePicture;
          } console.log("User picture: ", this.user.profilePicture);
        } else {
          this.user.profilePicture = 'assets/icon/profile.png';
        }
      }
    }).catch((err) => {
      console.error('Error loading user profile:', err);
    });
  }
}