import { Injectable } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {

  constructor() { }

  async hideStatusBar(): Promise<void> {
    try {
      await StatusBar.hide();
    } catch (err: any) {
      console.warn('Failed to hide status bar:', err?.message || err);
    }
  }

  async showStatusBar(): Promise<void> {
    try {
      await StatusBar.show();
    } catch (err: any) {
      console.warn('Failed to show status bar:', err?.message || err);
    }
  }
}
