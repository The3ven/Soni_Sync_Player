import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
import Player from "video.js/dist/types/player";
import 'video.js/dist/video-js.css';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';
import { FullscreenService } from 'src/app/services/fullscreen.service';
// import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
// import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  providers: [ScreenOrientation],
  styleUrls: ['./video-player.component.scss', '../../../../node_modules/video.js/dist/video-js.css'],
})




export class VideoPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('target', { static: true }) target!: ElementRef;
  player!: Player;
  @Input() options?: {
  };


  constructor(private elementRef: ElementRef, private fullscreenService: FullscreenService) { }


  ngOnDestroy() {
    if (this.player && !this.player.isDisposed()) {
      this.player.dispose();
    }

  }


  ngOnInit() {
    const defaultOptions = {
      fluid: true,
      autoplay: true,
      sources: [],
      controls: true,
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
      }
    };

    const mergedOptions = {
      ...defaultOptions,
      ...this.options,
      id: 'videPlayer', // Add id: 'my_video'
      controls: true,
      fluid: true,
      responsive: true,
      preload: 'auto',
    };


    const Button: any = videojs.getComponent('Button');


    console.log('options', mergedOptions);

    this.player = videojs(this.target?.nativeElement, mergedOptions);

    this.player.ready(() => {
      this.player.tech().el().setAttribute('playsinline', 'true');
    });

    this.player.on('play', async () => {
      await this.fullscreenService.hideStatusBar();
    });
    
    this.player.on('pause', async () => {
      await this.fullscreenService.showStatusBar();
    });
    
    this.player.on('ended', async () => {
      await this.fullscreenService.showStatusBar();
    });

  }
}
