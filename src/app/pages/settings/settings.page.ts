import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonMenuToggle, IonButtons, IonIcon, IonMenuButton } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';


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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SettingsPage implements OnInit {

  isEditing = false;
  editingUserId = null;
  users: any[] = [];
  newUser = { loginName: '', loginEmail: '', gender: '', isAdmin: false, loginPass: '', loginId: '', userName: '', isActive: false };

  selectedFile: File | null = null;

  constructor(private apiService: ApiService) {
    this.addAllIcons();
  }

  ngOnInit() {
    this.loadUsers();
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

  loadUsers() {
    const endpoint = environment.apiServerBaseUrl + '/getUserlist';
    console.log('Loading users from:', endpoint);
    this.apiService.getData(endpoint).subscribe((data: any) => {
      console.log('Users loaded:', data);
      if (data.status) {
        data.data.forEach((e: any) => {
          this.users.push({
            userId: e.userId,
            userName: e.userName,
            name: e.name,
            email: e.email,
            isActive: e.isActive,
            isAdmin: e.isAdmin,
          });
        });
      }
    });
  }


  addUser(form: any) {
    if (form.valid) {
    const endpoint = environment.apiServerBaseUrl + '/addUser';
    console.log('Loading users from:', endpoint);
    this.newUser.loginId = this.generateShortUserId();
    this.apiService.postData(endpoint, this.newUser).subscribe((data: any) => {
      console.log('Users loaded:', data);
      if (data.status) {
        this.users.push({
          userId: this.newUser.loginId,
          userName: this.newUser.userName,
          name: this.newUser.userName,
          email: this.newUser.loginEmail,
          isActive: this.newUser.isActive,
          isAdmin: this.newUser.isAdmin,
        });
      }
      this.newUser = { loginName: '', loginEmail: '', gender: '', isAdmin: false, loginPass: '', loginId: '', userName: '', isActive: false };
      form.resetForm();  // Clear the form after successful submission
    });
  }
  else
  {
    console.log("Form is invalid");
  }
  }

  editUser(user: any) {
    this.isEditing = !this.isEditing;
    if (this.isEditing)
    {
      this.newUser = { ...user };
      this.editingUserId = user.userId;
    }
    else
    {
      this.newUser = { loginName: '', loginEmail: '', gender: '', isAdmin: false, loginPass: '', loginId: '', userName: '', isActive: false };
      this.editingUserId = null;
    }
  }

  generateShortUserId(length: number = 8): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
      .map(value => charset[value % charset.length])
      .join('');
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadVideo() {
    if (this.selectedFile) {
      console.log("Upload this video : ", this.selectedFile);
      const endpoint = environment.videoServerBaseUrl + '/uploadVideo';
      const formData = new FormData();
      formData.append('video', this.selectedFile, this.selectedFile.name);
      this.apiService.postData(endpoint, formData).subscribe((data) =>{
        console.log("Response data from upload server : ", data);
        if (data.status)
        {
          console.log("File Uploaded SUccesfully");
        }
      })
    }
  }

  updateUser(form: any) {
    if (form.valid) {
      const index = this.users.findIndex(u => u.userId === this.editingUserId);
      if (index !== -1) {
        this.users[index] = { ...this.newUser };
        form.resetForm();
        this.newUser.isAdmin = false;  // Reset isAdmin to 'false'
        this.isEditing = false;
        this.editingUserId = null;
        console.log("User updated:", this.users);
      }
    }
  }

  removeUser(userId: string) {
    this.users = this.users.filter(user => user.userId !== userId);
  }


}
