import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import videojs from 'video.js';
import Player from "video.js/dist/types/player";

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss','../../../../node_modules/video.js/dist/video-js.css'],
})


export class VideoPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('target', { static: true }) target?: ElementRef;

  @Input() options?: {
    fluid: boolean,
    aspectRatio: string,
    autoplay: boolean,
    sources: {
      src: string,
      type: string,
    }[],
  };

  player!: Player;

  constructor(private elementRef: ElementRef) { }
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }


  ngOnInit() {
    this.player = videojs(this.target?.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });


  }
}
