import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenuToggle, IonButtons, IonIcon, IonMenuButton } from '@ionic/angular/standalone';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  // imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
  imports: [IonContent, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton],

})
export class ProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
