// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonicModule, NavController } from '@ionic/angular';
// import { environment } from 'src/environments/environment';
// import { ActivatedRoute } from '@angular/router';
// import { DataService } from '../../../services/data/data.service';
// import { StorageService } from '../../../services/storage/storage.service';

// import videojs from 'video.js';
// import Player from "video.js/dist/types/player";
// import 'video.js/dist/video-js.css';
// import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
// import 'videojs-mobile-ui';
// import { addIcons } from 'ionicons';
// import { arrowBack } from 'ionicons/icons';

// @Component({
//   selector: 'app-videoPlayer',
//   templateUrl: './videoPlayer.page.html',
//   styleUrls: ['./videoPlayer.page.scss'],
//   standalone: true,
//   imports: [IonicModule, CommonModule, FormsModule],
// })
// export class VideoPlayerPage {
//   @ViewChild('target', { static: false }) target!: ElementRef;

//   player!: Player;
//   videoPath: string = '';
//   getVideo: boolean = false;
//   videoOptions: any = {};
//   videoTitle: string = '';

//   constructor(
//     private route: ActivatedRoute,
//     private dataService: DataService,
//     private storageService: StorageService,
//     private navCtrl: NavController
//   ) {
//     addIcons({
//       'arrow-back': arrowBack
//     });
//   }

//   async ngOnInit() {
//     let video = this.dataService.getData();

//     if (!video) {
//       console.error('No video data from last page');
//       video = await this.storageService.getItem('lastVideo');
//     } else {
//       await this.storageService.setItem('lastVideo', video);
//     }

//     this.videoTitle = this.sanitizeVideoTitle(video.title);
//     await this.setPlayer(video.path);
//   }

//   sanitizeVideoTitle = (title: string): string => {
//     title = title.replace(/ï½\\u009c/g, '|');
//     title = title.replace(/[\[\(].*?[\]\)]/g, '').trim();

//     const parts = title.split(/[\|｜\-–]+/).map(p => p.trim()).filter(Boolean);
//     const cleanedParts = parts.map(part =>
//       part
//         .replace(/full song audio/gi, '')
//         .replace(/official( video| audio)?/gi, '')
//         .replace(/lyrics?/gi, '')
//         .replace(/feat\.?.*/i, '')
//         .trim()
//     ).filter(p => p.length > 0);

//     return cleanedParts[1] || cleanedParts[0] || title;
//   };

//   handleBack() {
//     if (this.player) {
//       this.player.pause();
//       this.player.dispose();
//     }
//     this.navCtrl.back();
//   }

//   async setPlayer(videoPath: string) {
//     this.getVideo = false;
//     this.videoPath = `${environment.videoServerBaseUrl}${videoPath}`;

//     this.videoOptions = {
//       autoplay: true,
//       controls: true,
//       responsive: true,
//       fluid: true,
//       preload: 'auto',
//       controlBar: {
//         volumePanel: { inline: false },
//         children: [
//           'playToggle',
//           'currentTimeDisplay',
//           'progressControl',
//           'durationDisplay',
//           'remainingTimeDisplay',
//           'fullscreenToggle',
//         ]
//       },
//       plugins: {
//         mobileUi: {
//           fullscreen: {
//             enterOnRotate: true,
//             exitOnRotate: true,
//             lockOnRotate: true
//           },
//           touchControls: {
//             seekSeconds: 10,
//             tapTimeout: 300,
//             disableOnEnd: false
//           }
//         }
//       },
//       sources: [{
//         src: this.videoPath,
//         type: 'application/x-mpegURL'
//       }]
//     };

//     this.getVideo = true;

//     // Delay initialization to allow video tag to render
//     setTimeout(() => this.initPlayer(), 100);
//   }

//   initPlayer() {
//     if (this.player && !this.player.isDisposed()) {
//       this.player.dispose();
//     }

//     if (!this.target?.nativeElement) {
//       console.error('Video target element not found');
//       return;
//     }

//     this.player = videojs(this.target.nativeElement, this.videoOptions);

//     this.player.ready(() => {
//       this.player.tech().el().setAttribute('playsinline', 'true');
//     });

//     this.player.on('play', () => {
//       // Optionally hide status bar or handle fullscreen
//     });

//     this.player.on('pause', () => {
//       // Optionally restore UI
//     });

//     this.player.on('ended', () => {
//       // Clean-up or reset
//     });
//   }

//   ionViewWillLeave() {
//     this.cleanupPlayer();
//   }

//   cleanupPlayer() {
//     if (this.player && !this.player.isDisposed()) {
//       this.player.pause();
//       this.player.dispose();
//     }
//   }

//   ngOnDestroy() {
//     this.cleanupPlayer();
//   }


// }




import { Component, ElementRef, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { StorageService } from '../../../services/storage/storage.service';

import videojs from 'video.js';
import Player from "video.js/dist/types/player";
import 'video.js/dist/video-js.css';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

import { Router } from '@angular/router';

@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.page.html',
  styleUrls: ['./videoPlayer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class VideoPlayerPage implements AfterViewChecked {
  @ViewChild('target', { static: false }) target!: ElementRef;



  player!: Player;
  videoPath: string = '';
  getVideo: boolean = false;
  videoOptions: any = {};
  videoTitle: string = '';

  private playerInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private storageService: StorageService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    addIcons({
      'arrow-back': arrowBack
    });


    this.route.queryParams.subscribe(params => {
      const video = params['video'];

      console.log('Received video from query params:', video);
    });
  }

  async ngOnInit() {
    let video = this.dataService.getData();

    if (!video) {
      console.error('No video data from last page');
      video = await this.storageService.getItem('lastVideo');
    } else {
      await this.storageService.setItem('lastVideo', video);
    }

    this.videoTitle = this.sanitizeVideoTitle(video.title);
    this.setPlayer(video.path);

    setTimeout(() => {
      this.initPlayer();
    }, 100); // Delay to ensure video tag is rendered
  }

  ngAfterViewChecked() {
    if (this.getVideo && this.target && !this.playerInitialized) {
      this.playerInitialized = true;
      this.initPlayer();
    }
  }

  sanitizeVideoTitle = (title: string): string => {
    title = title.replace(/ï½\\u009c/g, '|');
    title = title.replace(/[\[\(].*?[\]\)]/g, '').trim();

    const parts = title.split(/[\|｜\-–]+/).map(p => p.trim()).filter(Boolean);
    const cleanedParts = parts.map(part =>
      part
        .replace(/full song audio/gi, '')
        .replace(/official( video| audio)?/gi, '')
        .replace(/lyrics?/gi, '')
        .replace(/feat\.?.*/i, '')
        .trim()
    ).filter(p => p.length > 0);

    return cleanedParts[1] || cleanedParts[0] || title;
  };

  handleBack() {
    this.cleanupPlayer();
    this.navCtrl.back();
  }

  async setPlayer(videoPath: string) {
    this.cleanupPlayer();

    this.getVideo = false; // hide video element for re-render
    this.playerInitialized = false;

    this.videoPath = `${environment.videoServerBaseUrl}${videoPath}`;

    this.videoOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      controlBar: {
        volumePanel: { inline: false },
        children: [
          'playToggle',
          'currentTimeDisplay',
          'progressControl',
          'durationDisplay',
          'remainingTimeDisplay',
          'fullscreenToggle',
        ]
      },
      plugins: {
        mobileUi: {
          fullscreen: {
            enterOnRotate: true,
            exitOnRotate: true,
            lockOnRotate: true
          },
          touchControls: {
            seekSeconds: 10,
            tapTimeout: 300,
            disableOnEnd: false
          }
        }
      },
      sources: [{
        src: this.videoPath,
        type: 'application/x-mpegURL'
      }]
    };

    this.getVideo = true; // show video element again
    this.cdr.detectChanges(); // force Angular to update view immediately
  }

  initPlayer() {
    if (!this.target?.nativeElement) {
      console.error('Video target element not found');
      return;
    }

    this.player = videojs(this.target.nativeElement, this.videoOptions);

    this.player.ready(() => {
      this.player.tech().el().setAttribute('playsinline', 'true');
    });

    this.player.on('play', () => {
      // Add any play event logic here
    });

    this.player.on('pause', () => {
      // Add any pause event logic here
    });

    this.player.on('ended', () => {
      // Add any ended event logic here
    });
  }

  ionViewWillLeave() {
    this.cleanupPlayer();
  }

  cleanupPlayer() {
    if (this.player && !this.player.isDisposed()) {
      this.player.pause();
      this.player.dispose();
    }
  }

  ngOnDestroy() {
    this.cleanupPlayer();
  }
}
