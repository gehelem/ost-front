import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ost-front',
  webDir: 'www',
  android :{
    allowMixedContent:true
  },
  server: {
    //hostname: '127.0.0.1',
    cleartext: true,
    allowNavigation: ['*'],
    androidScheme: 'http',
  }
};

export default config;
