import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Route, Router } from '@angular/router';
import { GlobalService } from './global.service';

interface User {
  userName: string;
  isActive: boolean;
  gender?: 'male' | 'female' | string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private storageService: StorageService,
    private router: Router,
    private global: GlobalService
  ) {
    this.checkAuthStatus();
  }

  // Check if user is logged in on app start
  private async checkAuthStatus(): Promise<void> {
    try {
      const user = await this.storageService.getItem('loginUser');
      if (user) {
        this.isAuthenticated.next(true);
        this.currentUser.next(user);
      }
    } catch (error) {
      await this.global.errorToast('Failed to check auth status');
    }
  }

  // Get authentication status as observable
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  // Get current user as observable
  get currentUser$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  // Login method
  async login(userData: User): Promise<boolean> {
    try {
      await this.global.showLoader('Logging in...');
      await this.storageService.setItem('loginUser', userData);
      this.isAuthenticated.next(true);
      this.currentUser.next(userData);
      await this.global.hideLoader();
      await this.global.successToast('Login successful');
      return true;
    } catch (error) {
      await this.global.hideLoader();
      await this.global.errorToast('Login failed');
      return false;
    }
  }

  async authGuard(route: Route): Promise<boolean> {
    try {
      const user = await this.storageService.getItem('loginUser');
      if (user) {
        if (!user?.isActive) {
          await this.logout();
          return false;
        }
        return true; // User is logged in and active
      } else {
        await this.navigate('/login');
        return false;
      }
    } catch (error: any) {
      await this.showAlert(error);
      return false;
    }
  }

  async navigate(url: string): Promise<boolean> {
    try {
      await this.router.navigateByUrl(url, { replaceUrl: true });
      return true;
    } catch (error) {
      await this.global.errorToast('Navigation failed');
      return false;
    }
  }

  async showAlert(msg?: string): Promise<void> {
    await this.global.showAlert(
      msg || 'Please check your internet connectivity and try again!',
      'Retry',
      [
        {
          text: 'Logout',
          handler: async () => {
            await this.logout();
            return false;
          }
        },
        {
          text: 'Retry'
        }
      ]
    );
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      await this.global.showLoader('Logging out...');
      await this.storageService.removeItem('loginUser');
      this.isAuthenticated.next(false);
      this.currentUser.next(null);
      await this.global.hideLoader();
      await this.router.navigate(['/login']);
    } catch (error) {
      await this.global.hideLoader();
      await this.global.errorToast('Logout failed');
    }
  }

  // Verify if user is authenticated
  async verifyAuth(): Promise<boolean> {
    try {
      const user = await this.storageService.getItem('loginUser');
      return !!user;
    } catch (error) {
      await this.global.errorToast('Authentication verification failed');
      return false;
    }
  }
}