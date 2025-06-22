import { Component, ElementRef, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { StorageService } from '../../../services/storage/storage.service';
import { IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonCard, IonInput, IonText, IonApp } from '@ionic/angular/standalone';
import { sendOutline } from 'ionicons/icons'
import { ChatSocketService } from '../../../services/socket/socket.service'
import { HostListener } from '@angular/core';

import videojs from 'video.js';
import Player from "video.js/dist/types/player";
import 'video.js/dist/video-js.css';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';
import { addIcons } from 'ionicons';
import { arrowBack, close } from 'ionicons/icons';

import { Router } from '@angular/router';
import { Strings } from 'src/app/enum/strings';
import { Message } from 'src/app/models/messages.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.page.html',
  styleUrls: ['./videoPlayer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class VideoPlayerPage implements AfterViewChecked {
  @ViewChild('target', { static: false }) target!: ElementRef;
  // @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef;

  isFloating = false;
  player!: Player;
  videoPath: string = '';
  getVideo: boolean = false;
  videoOptions: any = {};
  videoTitle: string = '';
  currentUser = '';
  newMessage = '';
  messages: Message[] = [];
  floatingModeEnabled = false;
  newMessageCount = 0;

  private playerInitialized = false;
  private subs: Subscription[] = [];
  messageText = '';
  isAtBottom = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private storageService: StorageService,
    private navCtrl: NavController,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private chatSocket: ChatSocketService
  ) {
    addIcons({
      'arrow-back': arrowBack,
      'send': sendOutline,
      'close':close,
    });


    setTimeout(() => {
      this.subs.push(
        this.chatSocket.onUserJoin().subscribe(data => {
          console.log('User joined:', data);
        })
      );

      this.subs.push(
        this.chatSocket.onUserDisconnect().subscribe(data => {
          console.log('User left:', data);
        })
      );

      this.subs.push(
        this.chatSocket.onHistory().subscribe(data => {
          data.forEach((m: any) => {
            this.messages.push(m);
            console.log('History:', m);
          });
        })
      );

      this.subs.push(
        this.chatSocket.onMessage().subscribe(msg => {
          console.log('Message:', msg);
          this.messages.push(msg);
          this.newMessageCount++;
          console.log(msg);
        })
      );

      // 💬 Then join the room
      this.chatSocket.joinRoom("general");
    }, 700); // adjust based on socket timing


  }


  // @HostListener('window:scroll', [])
  // onScroll(event: any): void {
  //   const scrollTop = event.detail.scrollTop; // pixel threshold to trigger floating
  //   console.log('Scroll Top:', scrollTop); // ✅ DEBUG LOG
  //   this.isFloating = scrollTop > 200;
  // }


   onScroll(event: CustomEvent) {
    const scrollElement = event.target as HTMLElement;
    const scrollTop = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;

    // Check if user is at the bottom (with small threshold)
    this.isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

    console.log("scrollHeight : ", scrollHeight)
    console.log("scrollTop : ", scrollTop)
    console.log("clientHeight : ", clientHeight)
    console.log("scrollHeight - scrollTop - clientHeight : ", scrollHeight - scrollTop - clientHeight)
    this.isFloating = scrollTop > 200;
    if (this.isAtBottom) {
      this.newMessageCount = 0; // Reset count when at bottom
    }
  }

  closeFloatingPlayer() {
    this.isFloating = false;
    // Optionally pause or hide video
  }


  async ngOnInit() {
    let video = this.dataService.getData();

    if (!video) {
      console.error('No video data from last page');
      video = await this.storageService.getItem(Strings.LAST_PLAYED_VIDEO);
    } else {
      await this.storageService.setItem(Strings.LAST_PLAYED_VIDEO, video);
    }

    this.storageService.getItem(Strings.USER_STORAGE).then(user => {
      console.log('user :', user);
      this.currentUser = user.userName;
      this.chatSocket.login(this.currentUser, '1234');
    }).catch(err => {
      console.error('Error fetching user data:', err);
      this.currentUser = 'Guest';
    });


    this.videoTitle = this.sanitizeVideoTitle(video.title);
    this.setPlayer(video.path);

    setTimeout(() => {
      this.initPlayer();
    }, 100); // Delay to ensure video tag is rendered
  }

  scrollToLastMessage(): void {
    try {
      this.scrollAnchor.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.newMessageCount = 0;
    } catch (err) {
      console.error('Scroll error:', err);
    }
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

  sendMessage() {
    console.log('Sending message:', this.newMessage);
    console.log(this.currentUser);
    if (this.newMessage.trim()) {
      this.chatSocket.sendMessage({
        room: 'general',
        sender: this.currentUser,
        text: this.newMessage
      });
      this.newMessage = '';
    }
    this.scrollToLastMessage();
  }

  ngOnDestroy() {
    this.cleanupPlayer();
    this.subs.forEach(sub => sub.unsubscribe());
    this.chatSocket.disconnect(); // Disconnect when leaving
  }
}
