import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.page.html',
  styleUrls: ['./videoPlayer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, VideoPlayerComponent]
})
export class VideoPlayerPage implements OnInit {

  constructor(private route: ActivatedRoute, private dataService: DataService, private storageService: StorageService) { }

  // videoLink: string = `${environment.serverBaseUrl}:${environment.videoServerPort}/uploads/videos/94574e13-fda6-42a6-b278-c4d50b4f7253/index.m3u8`

  videoPath: string = "";
  getVideo: boolean = false;
  videoOptions: any = {};
  videoTitle: string = "";



  saveCurrentSongIndex = async (video: String) => {
    await this.storageService.setItem('lastVideo', video);
  };

  setPlayer = async (videoPath: string) => {

    console.log('Video : ', videoPath);
    this.getVideo = false;
    this.videoPath = String(`${environment.videoServerBaseUrl}${videoPath}`);
    console.log('this.videoPath :', this.videoPath);
    this.getVideo = true;

    this.videoOptions = {
      // fluid: true,
      // controls: true,
      // responsive: true,
      // autoplay: true,
      // muted: false,
      // skipButtons: {forward:10, backward: 10},
      // preload: "auto",
      // enableSmoothSeeking: true,
      // playsinline: true,
      // children: [
      // //   // 'bigPlayButton',
      //   'controlBar'
      // ],
      // liveui: true,
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'auto',
      controlBar: {
        volumePanel: {
          inline: false,
        },
        children: [
          'playToggle',
          'currentTimeDisplay',
          'progressControl',
          'durationDisplay',
          'remainingTimeDisplay',
          'fullscreenToggle',
        ]
      },
      sources: [
        {
          src: this.videoPath,
          type: "application/x-mpegURL"
        }
      ]
    };
  }

  sanitizeVideoTitle = (title: string): string => {
    // Normalize weird Unicode characters
    title = title.replace(/ï½\\u009c/g, '|');
  
    // Remove bracketed content like [ID], (Official Video), etc.
    title = title.replace(/[\[\(].*?[\]\)]/g, '').trim();
  
    // Split by common separators
    const parts = title.split(/[\|｜\-–]+/).map(p => p.trim()).filter(Boolean);
  
    // Remove filler keywords from each part
    const cleanedParts = parts.map(part =>
      part
        .replace(/full song audio/gi, '')
        .replace(/official( video| audio)?/gi, '')
        .replace(/lyrics?/gi, '')
        .replace(/feat\.?.*/i, '') // remove featuring artists
        .trim()
    ).filter(p => p.length > 0);
  
    // If artist - song title format, take second part
    if (cleanedParts.length >= 2) {
      return cleanedParts[1];
    }
  
    // Fallback to first clean part
    return cleanedParts[0] || title;
  };
  
  
  
  

  async ngOnInit() {

    let video = this.dataService.getData();

    if (video == null) {
      console.error('No video data from last page');
      video = await this.storageService.getItem('lastVideo');
      console.log('Video : ', video);
    }
    else {
      await this.saveCurrentSongIndex(video);
      this.setPlayer(video.path);

    }
    this.videoTitle = this.sanitizeVideoTitle(video.title);
    console.log('videoTitle : ', this.videoTitle);
    this.setPlayer(video.path);

  }

}
