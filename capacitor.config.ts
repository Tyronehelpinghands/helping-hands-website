import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'nl.helpinghandsagency.app',
  appName: 'Helping Hands',
  webDir: 'capacitor/www',
  server: {
    url: 'https://www.helpinghandsagency.nl',
    cleartext: false,
    allowNavigation: [
      'helpinghandsagency.nl',
      '*.helpinghandsagency.nl',
      'www.helpinghandsagency.nl',
      '*.supabase.co',
      '*.supabase.in',
    ],
  },
};

export default config;
