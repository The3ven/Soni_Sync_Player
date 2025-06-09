import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonMenuToggle, IonButtons, IonIcon, IonMenuButton } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../../../services/api/api.service';
import { NavigationEnd, Router } from '@angular/router';
import {UserService} from "src/app/services/user/user.service"

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
  cloudUploadOutline,
  cloudDoneOutline
} from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Strings } from 'src/app/enum/strings';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})


export class AdminDeshboardPage implements OnInit {
  isEditing = false;
  editingUserId: string | null = null;
  users: any[] = [];
  videoServer = environment.videoServerBaseUrl;
  apiServer = environment.apiServerBaseUrl;
  activityLogs: string[] = [];
  profileImage: string | ArrayBuffer | null = null;
  profileImageName: string | null = null;
  ProfileImageFile: File | null = null;



  newUser = { 
    userName: '',
    email: '',
    gender: '',
    isAdmin: false,
    pass: '',
    userId: '',
    isActive: true
  };

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  Admin =
    {
      userName: '',
      userId: '',
      email: '',
      isAdmin: true,
      profilePicture: '',
      isActive: false,
    };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService,
    private userService: UserService,
  ) {
    this.addAllIcons();
  }


  ngOnInit() {
    this.getLoginUser();

    console.log("Admin ? ", this.Admin);
    if (this.Admin.isAdmin) {
      this.loadUsers();
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
      cloudUploadOutline,
      cloudDoneOutline
    });
  }




  async getLoginUser()
  {
    this.storageService.getItem(Strings.USER_STORAGE).then((user) => {
      if (user) {
        this.Admin = { ...user };
        if (user.profilePicture) {
          if (!this.Admin.profilePicture.startsWith("http")) {
            this.Admin.profilePicture = environment.videoServerBaseUrl + "\\" + user.profilePicture;
          }
          else
          {
            this.Admin.profilePicture = user.profilePicture;
          }
          console.log("User picture: ", this.Admin.profilePicture);
        } else {
          this.Admin.profilePicture = 'assets/icon/profile.png';
        }
      }
      else {
        this.router.navigate(['/login']);
      }
    }).catch((err) => {
      console.error('Error loading user profile:', err);
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      if (data.status) {
        this.users = data.data;
      }
    });

  }


  addUser(form: any) {
    if (form.valid) {
      this.newUser.userId = this.generateShortUserId();
      this.userService.addUser(this.newUser).subscribe((data: any) => {
        if (data.status) {
          this.users.push({ ...this.newUser });
          this.logActivity(`Added user: ${this.newUser.userName}`);
          this.newUser = { userName: '', email: '', gender: '', isAdmin: false, pass: '', userId: '', isActive: false };
          form.resetForm();
        }
      });
    }

  }


  editUser(user: any) {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.newUser = { ...user };
      this.editingUserId = user.userId;

      console.log("newUser : ", this.newUser);

      this.logActivity(`Edit user: ${user.userName}`);

      console.log("type of isAdmin : ", typeof this.newUser.isAdmin);
      console.log("type of isActive : ", typeof this.newUser.isActive);


    }
    else {
      this.newUser = { userName: '', email: '', gender: '', isAdmin: false, pass: '', userId: '', isActive: false };
      this.editingUserId = null;
    }
  }


  async updateUser(form: any) {
    if (form.valid) {
      this.userService.updateUser(this.newUser).subscribe((res: any) => {
        if (res.status) {
          const index = this.users.findIndex((u) => u.userId === this.editingUserId);
          
          if (this.ProfileImageFile) {
            this.uploadProfilePicture(this.ProfileImageFile, this.newUser);
          }

          if (index !== -1) {
            this.users[index] = { ...this.newUser };
          }

          // Update Admin data if the updated user is the logged-in admin
        if (
          this.newUser.userId === this.Admin.userId ||
          this.newUser.email === this.Admin.email ||
          this.newUser.userName === this.Admin.userName
        ) {
          this.Admin = { ...this.Admin, ...this.newUser };
          this.storageService.setItem(Strings.USER_STORAGE, this.Admin); // Save updated admin data to local storage
        }

          this.logActivity(`Update user: ${this.newUser.userName}`);

          this.isEditing = false;
          this.editingUserId = null;
          this.profileImageName = null;
          form.resetForm();
        }
      });
    }



  }


  removeUser(user: any) {
    if (user.email === this.Admin.email || user.userName === this.Admin.userName || user.userId === this.Admin.userId) {
      console.log("You Can`t Delete your Account!");
      return;
    }

    if (confirm(`Are you sure you want to delete ${user.userName}?`)) {
      this.userService.removeUser(user).subscribe((res: any) => {
        if (res.status) {
          this.users = this.users.filter((u) => u.userId !== user.userId);
          this.logActivity(`Removed user: ${user.userName}`);
        }
      });
    }



  }

  logActivity(action: string): void {
    const timestamp = new Date().toLocaleString();
    console.log("timestamp : ", timestamp);
    this.activityLogs.unshift(`[${timestamp}] ${action}`);
    console.log("this.activityLogs : ", this.activityLogs);
  }

  onProfileSelected(event: any) {
    
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.ProfileImageFile = input.files[0];
      this.profileImageName = this.ProfileImageFile.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(this.ProfileImageFile);
      
      console.log('Selected Profile Image:', this.profileImageName);
    }

  }

  uploadProfilePicture(file: File, user:any) {
    this.userService
      .uploadProfilePicture(file, user.userId, user.email, user.userName)
      .subscribe((response: any) => {
        if (response.status) {
          console.log("response : ", response);
          console.log("response.profilePicture : ", response.profilePicture);
          if (user.userId === this.Admin.userId || user.email === this.Admin.email || user.userName === this.Admin.userName) {
            this.Admin.profilePicture = response.profilePicture;
            this.storageService.setItem(Strings.USER_STORAGE, this.Admin);
          }
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

  generateShortUserId(length: number = 8): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
      .map(value => charset[value % charset.length])
      .join('');
  }


  uploadVideo(): void {
    if (this.selectedFile) {
      console.log('Uploading video:', this.selectedFile.name);
      const formData = new FormData();
      formData.append('video', this.selectedFile, this.selectedFile.name);
      // Call your API service to upload the video
      this.apiService.postData(this.videoServer + "/uploadVideo", formData).subscribe(
        (response) => {
          console.log('Video upload response:', response);
          if (response.status) {
            console.log('Video uploaded successfully');
          } else {
            console.error('Video upload failed');
          }
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      console.log('Selected Video File:', this.selectedFileName);
    }
  }

}
