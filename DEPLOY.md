# Deploy sugli Store

## Setup (una volta)

```bash
npm install -g eas-cli
eas login                    # usa l'account Expo condiviso
eas build:configure          # conferma tutto
```

## Android (Google Play)

1. Dalla Google Play Console → Setup → API access → crea una **Service Account Key** (JSON)
2. Salva il file come `google-services.json` nella root del progetto
3. Lancia:
```bash
eas build --platform android --profile production
eas submit --platform android
```

## iOS (App Store)

1. Compila in `eas.json` → `submit.production.ios`:
   - `appleId` → email Apple Developer
   - `ascAppId` → ID numerico da App Store Connect
   - `appleTeamId` → Team ID da developer.apple.com
2. Lancia:
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

## Note

- La versione si incrementa automaticamente ad ogni build
- Il build avviene nel cloud (non serve Mac per iOS)
- Dopo il submit, attendere review: Android 1-3 giorni, iOS 2-7 giorni
