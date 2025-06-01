import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonCard, IonInput, IonText, IonApp } from '@ionic/angular/standalone';
import { NavigationEnd, Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { keyOutline, mailOutline, eyeOutline, eyeOffOutline, lockClosed, lockOpen } from 'ionicons/icons'
import { addIcons } from 'ionicons';
import { filter } from 'rxjs/internal/operators/filter';
import { ApiService } from '../../services/api/api.service'

import { firstValueFrom } from 'rxjs';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  // imports: [IonIcon,  IonText, IonButton, CommonModule, FormsModule, ReactiveFormsModule ]// IonicModule,]
  imports: [
    CommonModule,
    IonIcon,
    IonButton,
    IonText,
    IonInput,
    IonItem,
    IonCard,
    IonContent,
    ReactiveFormsModule,
  ],
})

export class LoginPage implements OnInit {

  // email: string = '';
  // password: string = '';
  form!: FormGroup;
  showPwd: boolean = false;
  loginForm!: HTMLElement;
  opacity!: CSSStyleDeclaration;
  loginSucess: boolean = false;
  userloginData: any = null;
  private activeAlert: HTMLIonAlertElement | null = null;
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private router: Router, private alertController: AlertController, private loadingController: LoadingController, private storageService: StorageService, private api: ApiService) {

    this.initForm();
    addIcons({
      keyOutline,
      mailOutline, eyeOutline, eyeOffOutline, lockClosed, lockOpen
    })
    this.loginForm = document.getElementById('login') as HTMLElement;
    if (this.loginForm) {
      this.loginForm.style.opacity = "1";
    }

  }

  async showLoader(message: string = "Loading...") {
    this.loading = await this.loadingController.create({
      message: message,
      duration: 5000, // Optional: Auto dismiss after 5s
      spinner: 'circles', // Hide default spinner so we can use custom HTML
      cssClass: 'custom-loader' // Optional: Add custom styles
    });

    await this.loading.present();
  }

  async hideLoader() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  private checkLoginStatus() {
    // Replace this with your actual login check logic
    this.loginSucess = !!localStorage.getItem('loginUser');

    if (!this.loginSucess) {
      this.router.navigate(['/login']);
    }
  }


  // Function to manually dismiss the alert
  dismissAlert = async () => {
    if (this.activeAlert) {
      await this.activeAlert.dismiss();
      this.activeAlert = null; // Reset the reference after dismissing
    }
  };


  alertGenerator = async (header: string = "Alert",
    subHeader: string = "",
    message: string = "",
    buttons: string[] = ["OK"]) => {
    this.hideLoader();
    if (this.activeAlert) {
      await this.activeAlert.dismiss();
    }
    this.activeAlert = await this.alertController.create({
      header: header,
      subHeader: subHeader || undefined, // Avoid empty subHeader
      message: message,
      buttons: buttons // Buttons can be customized (e.g., 'Cancel', 'Confirm', or custom buttons)
    });

    await this.activeAlert.present();
  }

  initForm() {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    if (this.loginForm) {
      this.loginForm.style.opacity = "1";
    }
  }

  togglePwd() {
    this.showPwd = !this.showPwd;
  }

  resetForm() {
    this.showPwd = false;
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onSubmit = async () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);

    const endpoint = `${environment.apiServerBaseUrl}/checkUserLogin`;

    const loginData = {
      email: this.form.value.email,
      pass: this.form.value.password
    };
    console.log("loginData: ", loginData);
    console.log("endpoint: ", endpoint);


    // this.alertGenerator("", "", "Please wait", []);
    await this.showLoader("please wait...");

    this.api.postData(endpoint, loginData).subscribe({
      next: (data) => {
        this.hideLoader();
        this.handleLoginResponse(data)
      },
      error: (e) => {
        this.resetForm();
        if (e.status === 0) {
          console.error("Server is offline or unreachable!");
          this.alertGenerator("Error", "", "Server is offline. Please try again later.", ['OK']);
        } else {
          console.error("API Error:", e);
          this.handleError(e)
        }
      },
      // error: (e) => this.handleError(e),
      complete: () => {
        console.info("Request completed")
      },
    });
  };

  private handleLoginResponse(data: any): void {
    console.log('API Response:', data);

    const { status, allowed, userName, userId, isAdmin, message, gender } = data;

    console.log("status : ", status);
    console.log("userName : ", userName);
    console.log("userId : ", userId);
    console.log("isAdmin : ", isAdmin);
    console.log("message : ", message);

    if (allowed) {
      this.userloginData = data;
      this.loginSuccess();
    } else {
      this.resetForm();
      this.alertGenerator("Error", "login is not allwed!", "Please contect Admin!", ['OK']);
    }
  }

  private loginSuccess(): void {
    console.log("loginForm:", this.loginForm);
    this.loginSucess = true;

    this.storageService.setItem("loginUser", this.userloginData);

    if (this.loginForm) {
      this.fadeOutLoginForm(() => {
        setTimeout(() => {
          if (this.userloginData.gender === "male") {
            console.log(`Welcome Mr. ${this.userloginData.userName}`);
          }
          else if (this.userloginData.gender === "female") {
            console.log(`Welcome miss ${this.userloginData.userName}`);
          }
          else {
            console.log(`Welcome ${this.userloginData.userName}`);
          }
          // this.router.navigate(['/home']);
          // Navigate to home and reload the application
          this.router.navigate(['/tabs']).then(() => {
            window.location.reload();
          });
        }, 20)
      });
    }
  }

  private fadeOutLoginForm(callback: () => void): void {

    if (!this.loginForm) return;

    const computedStyle = window.getComputedStyle(this.loginForm);
    let opacity = parseFloat(computedStyle.opacity);

    console.log('Current Opacity:', opacity);

    if (opacity === 0) {
      callback();
      return;
    }

    const decreaseOpacity = () => {
      if (opacity > 0) {
        opacity = Math.max(0, opacity - 0.5); // Decrease opacity but not below 0
        this.loginForm.style.opacity = opacity.toString();
        requestAnimationFrame(decreaseOpacity); // Smooth animation
      } else {
        this.loginForm.style.display = "none";
        callback(); // Call the provided callback (navigate to home)
      }
    };

    decreaseOpacity(); // Start the fade-out
  }

  private handleError(error: any): void {
    if (!error || error === undefined) {
      console.log("Im here!");
      this.alertGenerator("Error", "Can`t connect to Server", "", ['OK']);
    }

    console.error("Error:", error.error.message);
    let msg = error.error.message;
    let subHeader = "";
    if (error.error.message === "No matching document found") {
      msg = "Unregistered user"
      subHeader = "Please contact Admin"
    }
    this.alertGenerator(msg, "", subHeader, ['OK']);
    return;
  }


  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.initForm();
        if (!this.loginForm) {
          this.loginForm = document.getElementById('login') as HTMLElement;
        }
        this.loginSucess = false;
        this.loginForm.style.opacity = "1";
      });
  }

  ngOnDestroy() {
    this.loginSucess = false;
    this.loginForm.style.opacity = "1";
  }

}
