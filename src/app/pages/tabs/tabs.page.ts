import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TabsPage {
  // Add any tab-related logic here
  profile = {
    profilePicture: 'assets/default-avatar.png'
  };

  constructor(private storageService: StorageService) {
    // Initialize any properties or services if needed

    this.storageService.getItem('loginUser').then((user) => {
      console.log("User data: ", user);

      if (user) {
        this.profile = { ...user };

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

        console.log("Profile data: ", this.profile);
      }
      else {
        // this.router.navigate(['/login']);
      }
    }).catch((err) => {
      console.log("Error while getting user data", err);
    });
  }
}
