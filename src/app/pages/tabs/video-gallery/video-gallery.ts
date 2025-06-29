import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IonToolbar, IonContent, IonMenuButton, IonButtons } from '@ionic/angular/standalone';
// import { MenuController } from '@ionic/angular';
import { ApiService } from '../../../services/api/api.service';
import { NgIf, NgFor, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonTitle, IonText,
  IonSearchbar,
  IonSpinner,
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,

} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { DataService } from '../../../services/data/data.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { addIcons } from 'ionicons';
import DOMPurify from 'dompurify';
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
  close,
  list,
  grid,

} from 'ionicons/icons';
import { environment } from 'src/environments/environment';
import { StorageService } from '../../../services/storage/storage.service';
import { Strings } from 'src/app/enum/strings';

import { Video } from 'src/app/models/video';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'video-gallery',
  templateUrl: './video-gallery.html',
  styleUrls: ['./video-gallery.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonIcon,
    IonMenuButton,
    IonToolbar,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCol,
    IonCardTitle,
    NgIf,
    NgFor,
    IonGrid,
    IonRow,
    NgOptimizedImage,
    IonTitle,
    IonText,
    IonSearchbar,
    FormsModule, // Add FormsModule here
    CommonModule,
    IonSpinner,
    IonButtons,
    IonButton,
    ScrollingModule,
  ],
})
export class videoGalleryPage implements OnInit {
  showFavorites: boolean = false; // Track whether to show only favorites
  videoList: any[] = []; // Full list of videos
  favVideo: string[] = []; // Initialize as an empty array // Full list of fevorite videos
  filteredVideos: any[] = []; // Videos displayed based on filters

  isSearchAreaVisible: boolean = false; // Track search bar visibility
  searchQuery: string = ''; // For search functionality
  getList = false;
  currentUrl: string = "";
  layout: string = 'grid';

  videoServerEndpointUrl: string = `${environment.videoServerBaseUrl}`; //:${environment.videoServerPort}`;
  apiServerEndpointUrl: string = `${environment.apiServerBaseUrl}`; // :${environment.apiServerPort}`;

  constructor(private router: Router, private api: ApiService, private navCtrl: NavController, private dataService: DataService, private storageService: StorageService, private cdr: ChangeDetectorRef, private global: GlobalService) {
    this.addAllIcons();
    this.videoList = [];
    this.getList = false;
    this.currentUrl = "";
    this.storageService.getItem(Strings.LIKE_VIDEOS).then((fevItems: any[]) => {
      this.favVideo = fevItems || []; // Initialize with stored favorites or empty array
      console.log("Stored favorite items:", this.favVideo);
    }).catch((error) => {
      console.error("Error retrieving favorite items:", error);
      this.favVideo = [];
    });
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
      close,
      list,
      grid,
    });
  }

  navigateToPlayer(video: Video) {
    console.log("video.path : ", video.path);
    this.dataService.setData(video);
    this.router.navigate(['/tabs/videoPlayer']);
    // this.router.navigate(['/tabs/videoPlayer'], { queryParams: { video: JSON.stringify(video) } });

  }


  ngOnInit() {
    const endpoint = `${this.apiServerEndpointUrl}/getVideoslist`;
    this.api.getData(endpoint).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.videoList = resp.data.map((element: any) => ({
            ...element,
            img: `${this.videoServerEndpointUrl}${element.img}`,
            isLoading: true,
            isFavorite: this.favVideo.includes(element._id),
          }));
          this.filteredVideos = this.showFavorites ? this.videoList.filter(video => video.isFavorite) : [...this.videoList];
          this.getList = true;
          this.extractColorsInBatches();
          this.cdr.detectChanges();
        } else {
          this.getList = false;
          this.global.errorToast('Failed to load videos');
        }
      },
      error: (e) => {
        console.error("Error fetching videos:", e);
        this.getList = false;
        this.global.errorToast('Failed to load videos');
      },
    });
  }

  toggleLayout() {
    this.layout = this.layout === 'grid' ? 'list' : 'grid';
  }


    // ngOnInit() {    
    // try {
    //   this.api.getData(endpoint).subscribe((resp) => {
    //     if (resp.status) {
    //       resp.data.forEach((element: any, idx: number) => {
    //         setTimeout(() => {
    //           this.videoList[idx] = {
    //             ...element,
    //             img: `${this.videoServerEndpointUrl}${element.img}`,
    //             isLoading: true, // Initialize isLoading to true
    //           };

    //           // check if this video is in favorites
    //           this.videoList[idx].isFavorite = this.favVideo.includes(this.videoList[idx]._id);

    //           // Extract dominant color
    //           this.extractThemeColor(this.videoList[idx].img).then((color) => {
    //             this.videoList[idx].themeColor = color;
    //           });

    //           // Update filteredVideos after each video is added
    //           this.filteredVideos = [...this.videoList];
    //         }, idx * 200); // Delay each video by 0.5 seconds
    //       });
    //       this.getList = true;
    //     } else {
    //       this.getList = false;
    //     }
    //   });
    // } catch (e) {
    //   console.log("error : ", e);
    //   this.getList = false;
    // }
    // }


    extractColorsInBatches(batchSize: number = 5) {
      const videos = [...this.videoList];
      let index = 0;
      const processBatch = () => {
        const batch = videos.slice(index, index + batchSize);
        if (batch.length === 0) {
          this.cdr.detectChanges();
          return;
        }
        Promise.all(batch.map(video => this.extractThemeColor(video.img).then(color => {
          video.themeColor = color;
        }))).then(() => {
          index += batchSize;
          setTimeout(processBatch, 100); // Process next batch after 100ms
        }).catch(() => {
          index += batchSize;
          setTimeout(processBatch, 100);
        });
      };
      processBatch();
    }

    onImageLoad(video: Video) {
      video.isLoading = false; // Set isLoading to false when the image is loaded
    }

    toggleSearchArea() {
      this.isSearchAreaVisible = !this.isSearchAreaVisible;
    }

    filterVideos() {
      const query = DOMPurify.sanitize(this.searchQuery.toLowerCase());
      this.filteredVideos = this.videoList.filter(video =>
        video.title.toLowerCase().includes(query)
      );
      this.cdr.detectChanges();
    }

    toggleFavorite(video: any, event: Event) {
      event.stopPropagation(); // Prevent triggering card click
      video.isFavorite = !video.isFavorite; // Toggle favorite status

      console.log("Toggling favorite for video:", video._id, "isFavorite:", video.isFavorite);

      const isAlreadyFavorite = this.favVideo.includes(video._id);

      if (!isAlreadyFavorite) {
        this.favVideo.push(video._id); // Add to favorites
      } else {
        this.favVideo = this.favVideo.filter(fav => fav !== video._id); // Remove
      }

      // Save to storage
      this.storageService.setItem(Strings.LIKE_VIDEOS, this.favVideo);
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

    extractThemeColor(imageUrl: string): Promise < string > {
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
