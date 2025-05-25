import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuToggle,
  IonButtons,
  IonIcon,
  IonMenuButton,
  IonButton,
  IonLabel,
  IonItem,
  IonCardContent,
  IonCardHeader,
  IonCard,
  IonCardTitle,
  IonText,
  IonNote,
  IonInput,
} from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  // imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonLabel,
    IonItem,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonHeader,
    IonTitle,
    IonCardTitle,
    IonText,
    IonNote,
    IonInput
  ],

})
export class ProfilePage implements OnInit {
  user: any = {
    userName: '',
    email: '',
    phone: '',
    isAdmin: false,
    isActive: true,
    profilePicture: '',
  };

  passwords = {
    current: '',
    new: '',
    confirm: '',
  };
  isEditing: boolean = false; // Tracks whether the edit mode is active

  constructor(private storageService: StorageService, private router: Router, private userService: UserService) { }

  ngOnInit() {
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

  // Helper method to check if an image exists
  checkImageExists(url: string, callback: (exists: boolean) => void) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = url;
  }

  onProfileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
      console.log('Selected Profile Picture:', file.name);
      this.uploadProfilePicture(file, this.user);
      this.loadUserProfile();
    }
  }


  uploadProfilePicture(file: File, user: any) {
    this.userService
      .uploadProfilePicture(file, user.userId, user.email, user.userName)
      .subscribe((response: any) => {
        if (response.status) {
          console.log("response : ", response);
          console.log("response.profilePicture : ", response.profilePicture);

          user = { ...user, profilePicture: response.profilePicture };

          this.storageService.setItem('loginUser', user);
          // user.profilePicture = response.profilePicture;
          // this.storageService.setItem('loginUser', this.Admin);
          return true;
        }
        else {
          console.log("We can`t upload profile picture");
          return false;
        }
      });


  }

  updateProfile(user: any) {
    console.log('Updated Profile:', user);
    // Save updated profile to storage or backend
    this.userService.updateUser(user).subscribe((res: any) => {
      if (res.status) {
        console.log("User updated successfully");
        this.storageService.setItem('loginUser', user);
        this.isEditing = false; // Exit edit mode after saving
      }
      else {
        console.log("We can`t update user");
      }
    });
    // this.storageService.setItem('loginUser', this.user);
  }

  changePassword(form: any) {
    if (form.valid) {
      if (this.passwords.new === this.passwords.confirm) {
        this.user.pass = this.passwords.new;
        this.userService.updateUser(this.user).subscribe((res: any) => {
          if (res.status) {
            console.log('Password changed successfully');
            this.isEditing = false; // Exit edit mode after saving
          }
          else {
            console.log('Password can`t changed');
          }
        });
        // Call backend API to update password
      } else {
        console.error('Passwords do not match');
      }
      form.resetForm();
    }
  }

  logout() {
    this.storageService.removeItem('loginUser');
    this.storageService.removeItem('lastVideo');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing; // Toggle the edit mode
  }

  saveChanges() {
    console.log('Updated User Information:', this.user);
    this.isEditing = false; // Exit edit mode after saving
    // Add logic to save changes to the backend or local storage
  }
}
