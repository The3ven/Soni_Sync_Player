import { Component, OnInit } from '@angular/core';
import { IonIcon, IonToolbar, IonTitle, IonContent, IonButton, IonMenu, IonMenuButton, IonButtons, IonAvatar, IonText } from '@ionic/angular/standalone';
// import { MenuController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NgIf, NgFor } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { DataService } from '../services/data.service';

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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonMenuButton,
    IonToolbar,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    NgIf,
    NgFor,
],
})


export class HomePage {

  isLogin: boolean = true;
  videoList:{ _id: string; title: string; path: string; size: number; img: string }[] = [];
  getList: boolean = false;

  currentUrl:string = "";

  constructor(private api: ApiService, private navCtrl: NavController,  private dataService: DataService) {
    this.addAllIcons();
    this.isLogin = true;
    this.videoList = [];
    this.getList = false;
    this.currentUrl = "";
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

  navigateToPlayer(video: any)
  {
    console.log("video.path : ", video.path);
    this.dataService.setData(video);
    this.navCtrl.navigateForward('/videoPlayer');
  }


  ngOnInit() {
    if (this.isLogin) {
      console.log("User is login we can show him home page");
      console.log("videolist : ", this.videoList);
      const endpoint = `getVideoslist`;

      this.api.getData(endpoint).subscribe({
        next: (data) => {
          console.log("data : ", data);
          console.log("len : ", data.length);
          if (data)
          {
            this.getList = true;
            // this.videoList = data.data;
            data.data.forEach((element: any, idx: number) => {
              // console.log(element);

              this.videoList[idx] = element;
              this.videoList[idx].img = `${environment.serverBaseUrl}:${environment.videoServerPort}` + element.img;

              // console.log(element._id)
              // console.log(element.title
              // console.log(element.path )
              // console.log(element.size)
              // console.log(element.img)
              // console.log(idx)
              // console.log(JSON.stringify(data.data));
            });
          }
          else
          {
            this.getList = false;
          }
        },
        error: (e) => {
          console.log("error : ", e);
          
        },
        complete: () => {
          console.info("Request completed")
        },
      });
    }
    else
    {
      console.log("Redirect user to login page");
    }
  }
}
