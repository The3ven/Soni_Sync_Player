import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonButton, IonCard, IonInput, IonText, IonApp } from '@ionic/angular/standalone';
import { NavigationEnd, Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { keyOutline, mailOutline, eyeOutline, eyeOffOutline, lockClosed, lockOpen } from 'ionicons/icons'
import { addIcons } from 'ionicons';
import { filter } from 'rxjs/internal/operators/filter';
import { ApiService } from '../../services/api.service'

import { firstValueFrom } from 'rxjs';

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
  private activeAlert: HTMLIonAlertElement | null = null;
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private router: Router, private alertController: AlertController, private loadingController: LoadingController, /*, private storageService:StorageService, */ private api: ApiService) {
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

  // onSubmit = async () => {

  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   console.log(this.form.value);

  //   // ?userId=Ali&userPass=Ali12345

  //   const endpoint: string = `checkUserLogin?loginEmail=${this.form.value.email}&loginPass=${this.form.value.password}`


  //   try {
  //     const message = "";
  //     // const {userName, allowed, isAdmin, userId, status, message} = await firstValueFrom(this.api.getData(endpoint));

  //     this.api.getData(endpoint)
  //       .subscribe({
  //         next: (data) => console.log(data),
  //         error: (e) => console.log(e),
  //         complete: () => console.info("Complete")
  //       }
  //       );

  //     const allowed: boolean = false;

  //     // console.log("userName : ", userName);
  //     // console.log("allowed : ", allowed);
  //     // console.log("isAdmin : ", isAdmin);

  //     if (allowed) {
  //       console.log("loginForm : ", this.loginForm);
  //       this.loginSucess = true;
  //       if (this.loginForm) {
  //         const computedStyle = window.getComputedStyle(this.loginForm);
  //         let opacity = computedStyle.opacity; // Get the current opacity
  //         console.log('Current Opacity:', opacity); // Log the current opacity
  //         if (opacity) {
  //           let op = Number(opacity);
  //           const decreaseOpacity = () => {
  //             if (op > 0) {
  //               op = Math.max(0, op - 0.1); // Decrease opacity but not below 0
  //               this.loginForm.style.opacity = String(op);
  //               setTimeout(decreaseOpacity, 40); // Call the function again after 100ms
  //             }
  //             else {
  //               // Navigate to the home page after the fade-out is complete
  //               this.router.navigate(['/home']);
  //             }
  //           };
  //           decreaseOpacity(); // Start the opacity decrease
  //         }
  //       }
  //     }
  //     else {
  //       console.log("Error : ", message);
  //       await this.alertGenerator("Alert", message, ['OK']);
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //   }
  // }
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

    const endpoint = `checkUserLogin?loginEmail=${this.form.value.email}&loginPass=${this.form.value.password}`;

    // this.alertGenerator("", "", "Please wait", []);
    await this.showLoader("please wait...");

    this.api.getData(endpoint).subscribe({
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

    const { satatus, allowed, userName, userId, isAdmin, message } = data;

    console.log("satatus : ", satatus);
    console.log("userName : ", userName);
    console.log("userId : ", userId);
    console.log("isAdmin : ", isAdmin);
    console.log("message : ", message);

    if (allowed) {
      this.loginSuccess();
    } else {
      this.resetForm();
      this.alertGenerator("Error", "login is not allwed!", "Please contect Admin!", ['OK']);
    }
  }

  private loginSuccess(): void {
    console.log("loginForm:", this.loginForm);
    this.loginSucess = true;

    if (this.loginForm) {
      this.fadeOutLoginForm(() => {
        setTimeout(() =>{
          this.router.navigate(['/home']);
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
