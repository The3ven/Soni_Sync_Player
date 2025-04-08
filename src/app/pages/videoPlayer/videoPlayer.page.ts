import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
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
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, VideoPlayerComponent]
})
export class VideoPlayerPage implements OnInit {

  constructor(private route: ActivatedRoute, private dataService: DataService, private storageService: StorageService) { }

  // videoLink: string = `${environment.serverBaseUrl}:${environment.videoServerPort}/uploads/videos/94574e13-fda6-42a6-b278-c4d50b4f7253/index.m3u8`

  videoPath: string = "";
  getVideo: boolean = false;
  videoOptions: any = {};



  saveCurrentSongIndex = async (video: String) => {
    await this.storageService.setItem('lastVideo', video);
  };

  setPlayer = async (video: string) => {

    console.log('Video : ', video);
    this.getVideo = false;
    this.videoPath = String(`${environment.serverBaseUrl}:${environment.videoServerPort}${video}`);
    console.log('this.videoPath :', this.videoPath);
    this.getVideo = true;

    this.videoOptions = {
      fluid: true,
      controls: true,
      responsive: true,
      autoplay: true,
      muted: false,
      sources: [
        {
          src: this.videoPath,
          type: "application/x-mpegURL"
        }
      ]
    };
  }

  async ngOnInit() {

    let video = this.dataService.getData();

    if (video == null) {
      console.error('No video data from last page');
      video = await this.storageService.getItem('lastVideo');
      console.log('Video : ', video);
      this.setPlayer(video);
    }
    else {
      await this.saveCurrentSongIndex(video);
      this.setPlayer(video);

    }

  }

}
