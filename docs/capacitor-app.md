# Capacitor-app (native shell)

De Helping Hands-app is **geen** aparte React Native-app en **geen** volledige static export van Next.js. Het is een native Android/iOS-shell (Capacitor) die de live website laadt: `https://www.helpinghandsagency.nl`.

Zo blijven App Router, API-routes, Supabase Auth en SSR gewoon werken. De site wordt niet herschreven naar een offline SPA.

## Wat dit wél is

- Native wrapper rond de productiewebsite
- `capacitor.config.ts` wijst `server.url` naar de live site
- Lokale `capacitor/www` is alleen een minimale fallback-shell (Capacitor vereist een `webDir`)

## Wat dit níet is

- Geen rewrite naar React Native / Flutter
- Geen `output: 'export'` voor de hele Next.js-site (dat breekt API-routes en auth)

## Vereisten

### Android

- [Android Studio](https://developer.android.com/studio) (recent)
- JDK 17+ (meestal meegeleverd met Android Studio)
- Google Play Console-account (voor publicatie)

### iOS

- macOS met Xcode
- Apple Developer-programma
- iOS-projectbestanden kunnen op Windows beperkt of niet bruikbaar zijn; **builds en archive/upload gebeuren op een Mac**

## Productie-URL

De app laadt altijd de live site. Zorg dat productie up-to-date is vóór je een store-build maakt:

1. Merge de website-PR en deploy naar `https://www.helpinghandsagency.nl`
2. Controleer dat login, API-routes en portalen werken in de browser
3. Pas daarna native sync / store-builds toe

App ID: `nl.helpinghandsagency.app`

## Lokale stappen (Android)

```bash
npm install
npx cap sync
npm run cap:android
```

In Android Studio:

1. Wacht tot Gradle klaar is
2. Kies een emulator of fysiek toestel, of bouw een release
3. Voor Play Store: **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**

Handige scripts:

- `npm run cap:sync` — sync web assets + native plugins
- `npm run cap:android` — open Android-project in Android Studio
- `npm run cap:ios` — open iOS-project in Xcode (macOS)

## iOS (macOS)

```bash
npm install
npx cap sync
npm run cap:ios
```

Daarna in Xcode: signing (Apple Developer Team), Archive, upload naar App Store Connect.

Op Windows kan `npx cap add ios` falen of alleen bestanden aanmaken die je niet kunt bouwen zonder Mac/Xcode. Het `@capacitor/ios`-pakket staat wél in de dependencies.

## Stores

| Store        | Account                         | Artefact        |
|--------------|---------------------------------|-----------------|
| Google Play  | Play Console                    | `.aab`          |
| Apple App Store | Apple Developer + App Store Connect | Xcode Archive |

## Configuratie (samenvatting)

Zie `capacitor.config.ts`:

- **appName:** Helping Hands  
- **appId:** `nl.helpinghandsagency.app`  
- **webDir:** `capacitor/www`  
- **server.url:** `https://www.helpinghandsagency.nl`  
- **allowNavigation:** helpinghandsagency.nl (+ subdomeinen) en Supabase-domeinen

## Plugins (optioneel / polish)

Geïnstalleerd: `@capacitor/app`, `@capacitor/status-bar`. Na wijzigingen altijd `npx cap sync` draaien.

## Troubleshooting

- Witte / lege WebView: productie-URL bereikbaar? SSL ok?
- Auth-redirect faalt: controleer Supabase redirect URLs en `server.allowNavigation`
- Android build faalt: sync opnieuw, Android Studio/SDK updaten, JDK 17
- iOS op Windows: gebruik een Mac of CI met macOS-runners
