import { Component, OnInit } from '@angular/core';
import { IonToolbar, IonContent, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
// import { MenuController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { 
  IonCard,
   IonCardHeader,
    IonCardTitle,
      IonTitle,IonText,
    IonSearchbar,
    IonSpinner,
    IonButton,
  IonIcon, } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data.service';

import { addIcons } from 'ionicons';
import {
  heart,
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
  searchOutline,
  heartOutline,
  trash,

} from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonIcon,
    IonMenuButton,
    IonToolbar,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    NgIf,
    NgFor,
    IonTitle,
    IonText,
    IonSearchbar,
    FormsModule, // Add FormsModule here
    CommonModule,
    IonSpinner,
    IonButtons,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  showFavorites: boolean = false; // Track whether to show only favorites
  videoList: any[] = []; // Full list of videos
  filteredVideos: any[] = []; // Videos displayed based on filters
  
  isSearchAreaVisible: boolean = false; // Track search bar visibility
  searchQuery: string = ''; // For search functionality
  getList = false;
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
      searchOutline,
      heartOutline,
      heart,
      trash,
    });
  }

  navigateToPlayer(video: any) {
    console.log("video.path : ", video.path);
    this.dataService.setData(video);
    this.navCtrl.navigateForward('/videoPlayer');
  }


  ngOnInit() {
    const endpoint = `${this.apiServerEndpointUrl}` + "/getVideoslist";
    try {
      this.api.getData(endpoint).subscribe((resp) => {
        if (resp.status) {
          resp.data.forEach((element: any, idx: number) => {
            setTimeout(() => {
              this.videoList[idx] = {
                ...element,
                img: `${this.videoServerEndpointUrl}${element.img}`,
                isLoading: true, // Initialize isLoading to true
              };

              // Extract dominant color
              this.extractThemeColor(this.videoList[idx].img).then((color) => {
                this.videoList[idx].themeColor = color;
              });

              // Update filteredVideos after each video is added
              this.filteredVideos = [...this.videoList];
            }, idx * 200); // Delay each video by 0.5 seconds
          });
          this.getList = true;
        } else {
          this.getList = false;
        }
      });
    } catch (e) {
      console.log("error : ", e);
      this.getList = false;
    }
  }

  onImageLoad(video: any) {
    video.isLoading = false; // Set isLoading to false when the image is loaded
  }

  toggleSearchArea() {
    this.isSearchAreaVisible = !this.isSearchAreaVisible;
  }

  filterVideos() {
    const query = this.searchQuery.toLowerCase();
    this.filteredVideos = this.videoList.filter(video =>
      video.title.toLowerCase().includes(query)
    );
  }

  toggleFavorite(video: any, event: Event) {
    event.stopPropagation(); // Prevent triggering card click
    video.isFavorite = !video.isFavorite; // Toggle favorite status
  }

  filterFavorites() {
    this.showFavorites = !this.showFavorites; // Toggle favorites filter
    if (this.showFavorites) {
      this.filteredVideos = this.videoList.filter(video => video.isFavorite);
    } else {
      this.filteredVideos = [...this.videoList];
    }
  }

  formatDuration(duration: number): string {
    if (!duration) return '00:00';

    const roundedDuration = Math.round(duration); // Round the duration to the nearest whole number
    const hours = Math.floor(roundedDuration / 3600);
    const minutes = Math.floor((roundedDuration % 3600) / 60);
    const seconds = roundedDuration % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  extractThemeColor(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Handle CORS for external images
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          reject('Canvas context is not available');
          return;
        }

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        context.drawImage(img, 0, 0, img.width, img.height);

        // Get pixel data from the canvas
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        // Calculate the average color
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];     // Red
          g += data[i + 1]; // Green
          b += data[i + 2]; // Blue
          count++;
        }

        // Average the RGB values
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        resolve(`rgb(${r}, ${g}, ${b})`);
      };

      img.onerror = (err) => {
        console.error('Error loading image:', err);
        reject(err);
      };
    });
  }
}
