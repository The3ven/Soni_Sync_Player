import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Soni_Sync_player',
  webDir: 'www',
  server: {
    cleartext: true,       // ✅ allow HTTP
    androidScheme: 'http', // ✅ for Android
    iosScheme: 'http'      // ✅ for iOS (if needed)
  }
};

export default config;
