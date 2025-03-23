import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.page.html',
  styleUrls: ['./videoPlayer.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, VideoPlayerComponent]
})
export class VideoPlayerPage implements OnInit {

  constructor(private route: ActivatedRoute,private dataService: DataService) {}

  // videoLink: string = `${environment.serverBaseUrl}:${environment.videoServerPort}/uploads/videos/94574e13-fda6-42a6-b278-c4d50b4f7253/index.m3u8`

  videoPath: string = "";
  getVideo:boolean = false;



  videoOptions: any = {};
  //   fluid: true,
  //   controls: true,
  //   responsive: true,
  //   autoplay: true,
  //   muted: false,
  //   sources: [
  //     {
  //       src: this.videoPath,
  //       type: "application/x-mpegURL"
  //     }
  //   ]
  // };

  ngOnInit() {

    const video = this.dataService.getData();
    if (!video) {
      console.error('No video data found!');
    } else {
      console.log('Video:', video);
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
  }

}
