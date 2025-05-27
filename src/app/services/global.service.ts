import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private isLoading: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  // Alert methods
  async showAlert(message: string, header?: string, buttons?: any[]) {
    const alert = await this.alertCtrl.create({
      header: header || 'Alert',
      message: message,
      buttons: buttons || ['OK']
    });
    await alert.present();
    return alert;
  }

  // Toast methods
  async showToast(message: string, color: string = 'primary', duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      color: color,
      position: 'bottom'
    });
    await toast.present();
    return toast;
  }

  async successToast(message: string) {
    return this.showToast(message, 'success');
  }

  async errorToast(message: string) {
    return this.showToast(message, 'danger');
  }

  // Loading methods
  async showLoader(message: string = 'Please wait...') {
    this.isLoading = true;
    const loader = await this.loadingCtrl.create({
      message: message,
      spinner: 'bubbles'
    });
    await loader.present();
    return loader;
  }

  async hideLoader() {
    this.isLoading = false;
    try {
      return await this.loadingCtrl.dismiss();
    } catch (error) {
      console.warn('No loader present');

      return false;
    }
  }

  // Modal methods
  async createModal(options: any) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  async dismissModal(data?: any) {
    await this.modalCtrl.dismiss(data);
  }

  // Helper methods
  async showErrorMessage(error: any) {
    const message = error?.error?.message || 'An unexpected error occurred';
    await this.errorToast(message);
  }

  // Connection error helper
  async showConnectionError() {
    await this.showAlert(
      'Please check your internet connection and try again',
      'Connection Error',
      ['OK']
    );
  }
}