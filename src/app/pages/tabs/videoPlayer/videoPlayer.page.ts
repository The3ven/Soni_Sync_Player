import { Component, ElementRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.page.html',
  styleUrls: ['./videoPlayer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class VideoPlayerPage {
  @ViewChild('target', { static: false }) target!: ElementRef;

  player!: Player;
  videoPath: string = '';
  getVideo: boolean = false;
  videoOptions: any = {};
  videoTitle: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private storageService: StorageService,
    private navCtrl: NavController
  ) {
    addIcons({
      'arrow-back': arrowBack
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
    await this.setPlayer(video.path);
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
    if (this.player) {
      this.player.pause();
      this.player.dispose();
    }
    this.navCtrl.back();
  }

  async setPlayer(videoPath: string) {
    this.getVideo = false;
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

    this.getVideo = true;

    // Delay initialization to allow video tag to render
    setTimeout(() => this.initPlayer(), 100);
  }

  initPlayer() {
    if (this.player && !this.player.isDisposed()) {
      this.player.dispose();
    }

    if (!this.target?.nativeElement) {
      console.error('Video target element not found');
      return;
    }

    this.player = videojs(this.target.nativeElement, this.videoOptions);

    this.player.ready(() => {
      this.player.tech().el().setAttribute('playsinline', 'true');
    });

    this.player.on('play', () => {
      // Optionally hide status bar or handle fullscreen
    });

    this.player.on('pause', () => {
      // Optionally restore UI
    });

    this.player.on('ended', () => {
      // Clean-up or reset
    });
  }

  ngOnDestroy() {
    if (this.player && !this.player.isDisposed()) {
      this.player.dispose();
    }
  }
}
