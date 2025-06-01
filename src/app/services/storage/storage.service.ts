import { Injectable } from '@angular/core';
// import { Storage } from '@capacitor/storage';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})

export class StorageService {
  constructor() {}

  async setItem(key: string, value: any) {
    console.log("Saving value in local storage : ", value);
    await Preferences.set({
      key,
      value: JSON.stringify(value), // Store as string
    });
  }

  async getItem(key: string) {
    console.log("Retreving value from local storage");
    const { value } = await Preferences.get({ key });
    if(value)
    {
      console.log(value);
      return JSON.parse(value); // Parse back to object
    }
    else
    {
      return ''
    }
  }

  async removeItem(key: string) {
    await Preferences.remove({ key });
  }

  async clear() {
    await Preferences.clear();
  }
}
