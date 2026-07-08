# EasyWeather

App de previsión meteorológica (React Native + Expo) accesible con VoiceOver, usando
[Open-Meteo](https://open-meteo.com/) (sin API key) para la previsión y la
geocodificación de lugares.

## Pestañas nativas: ya no vale Expo Go

Las pestañas de abajo usan [`react-native-bottom-tabs`](https://github.com/callstack/react-native-bottom-tabs)
para que sean el `UITabBarController` real de iOS (así VoiceOver las reconoce como
pestañas de verdad). Al llevar código nativo, **Expo Go ya no sirve para probar la
app** — hace falta compilar una vez un *development build* con EAS e instalarlo en el
iPhone. A partir de ahí, el día a día es igual de rápido que con Expo Go (recarga en
caliente al guardar cambios), solo cambia la app con la que abres el QR.

No hace falta Mac: [EAS Build](https://docs.expo.dev/build/introduction/) compila y
firma la app iOS en la nube usando tu cuenta de Apple Developer.

1. `npm install -g eas-cli`
2. `eas login` (con tu cuenta de Expo; créala gratis si no tienes).
3. `eas build:configure` — vincula este proyecto a tu cuenta de EAS (solo la primera vez).
4. Registra tu iPhone si no lo has hecho antes: `eas device:create` (te da un enlace,
   lo abres desde el iPhone y añade el UDID automáticamente).
5. `eas build --profile development --platform ios` — compila el *development client*.
   EAS gestiona el certificado y el perfil de aprovisionamiento con tu cuenta de Apple
   Developer (te pedirá iniciar sesión con Apple ID y 2FA). Al terminar, te da un
   enlace para instalarlo directamente en el iPhone registrado.
6. Con el development client ya instalado, para el día a día:
   ```
   npm install
   npx expo start
   ```
   y escanea el QR **abriendo con la app que acabas de instalar** (tiene el icono y
   nombre de "EasyWeather", no es Expo Go). Cada cambio en el código se recarga solo.

## Tener la app instalada de forma permanente / TestFlight

1. `eas build --platform ios --profile preview` — build interna (ad-hoc) para instalar
   el `.ipa` directamente sin pasar por App Store.
2. Cuando quieras subirla a **TestFlight** o al App Store: `eas submit --platform ios`
   (usa el perfil `production`, con `eas build --platform ios --profile production`
   primero).

El identificador de paquete configurado en `app.json` es `com.jmortizsilva.tiempo`;
cámbialo si ya tienes otro App ID reservado en tu cuenta de Apple Developer.
