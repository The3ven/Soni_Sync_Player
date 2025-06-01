import { Component, OnInit } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    CommonModule,
    IonRouterOutlet],
})

export class AppComponent implements OnInit {
  ngOnInit(): void {
    
  }
}
