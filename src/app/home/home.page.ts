import { Component, OnInit } from '@angular/core';
import { IonToolbar, IonContent, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
// import { MenuController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NgIf, NgFor } from '@angular/common';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
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
import { StorageService } from '../services/storage.service';


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
    IonCardHeader,
    IonCardTitle,
    NgIf,
    NgFor,
  ],
})


export class HomePage {

  videoList: { _id: string; title: string; path: string; size: number; img: string }[] = [];
  getList: boolean = false;

  currentUrl: string = "";
  videoServerEndpointUrl: string = `${environment.videoServerBaseUrl}`; //:${environment.videoServerPort}`;
  apiServerEndpointUrl: string = `${environment.apiServerBaseUrl}`; // :${environment.apiServerPort}`;

  constructor(private api: ApiService, private navCtrl: NavController, private dataService: DataService, private storageService: StorageService) {
    this.addAllIcons();
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

  navigateToPlayer(video: any) {
    console.log("video.path : ", video.path);
    this.dataService.setData(video);
    this.navCtrl.navigateForward('/videoPlayer');
  }


  ngOnInit() {
    console.log("User is login we can show him home page");

    const endpoint = `${this.apiServerEndpointUrl}` + "/getVideoslist";
    try {
      this.api.getData(endpoint).subscribe((resp) => {
        console.log("resp : ", resp);
        if (resp.status) {
          console.log("data : ", resp.data);
          resp.data.forEach((element: any, idx: number) => {
            // console.log(element);

            this.videoList[idx] = element;
            this.videoList[idx].img = `${this.videoServerEndpointUrl}` + element.img;
          });
          console.log("videoList : ", this.videoList);
          this.getList = true;
        }
        else {
          this.getList = false;
        }

      });
      
    }
    catch (e)
    {
      console.log("error : ", e);
      this.getList = false;
    }

  }
}
