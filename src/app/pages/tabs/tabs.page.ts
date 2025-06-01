import { Component,EnvironmentInjector, inject  } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, settingsOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.tabBarHidden = event.url.includes('/videoPlayer');
      }
    });
    addIcons({ homeOutline, personOutline, settingsOutline });
  }
}