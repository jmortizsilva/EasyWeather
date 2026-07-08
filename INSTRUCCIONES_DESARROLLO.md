# Cómo probar los cambios de la app Tiempo sin gastar builds

Hasta ahora, cada cambio en la app nos obligaba a crear una build nueva en la web de
Expo, y el plan gratuito tiene un límite mensual que se agotaba enseguida.

Eso ya no es necesario. La app ahora usa lo que Expo llama un **development build**
(build de desarrollo): una versión especial de la app "Tiempo" que se instala una sola
vez en el iPhone y que, a partir de ahí, carga el código directamente desde el
ordenador de quien esté desarrollando. Los cambios de código normal (pantallas, textos,
lógica) se ven al momento y **no consumen builds de Expo, sin límite**.

## Qué se instala en el iPhone (una sola vez)

1. Jose María os pasará un enlace de instalación de la build de desarrollo.
   Abridlo desde Safari en el iPhone y pulsad instalar. Aparecerá un icono nuevo
   llamado **Tiempo** en la pantalla de inicio.
2. La primera vez que abráis la app, si iOS dice que no confía en el desarrollador:
   Ajustes → General → VPN y gestión de dispositivos → confiar en el perfil.

**Esta app "Tiempo" sustituye a Expo Go.** Expo Go ya no sirve para este proyecto,
porque la app lleva componentes nativos (las pestañas nativas de iOS) que Expo Go no
incluye.

## Día a día: probar cambios

1. En el ordenador, dentro de la carpeta del proyecto:
   ```
   npm install
   npx expo start --tunnel
   ```
   (`--tunnel` hace que funcione aunque el iPhone y el ordenador no estén en la misma
   red wifi; si estáis en la misma wifi, basta con `npx expo start`).
2. En el iPhone, abrid la app **Tiempo** (no Expo Go). Se abre una pantalla de
   desarrollo con la opción de escanear un código QR.
3. Escanead el QR que muestra la terminal del ordenador. La app carga el código actual.
4. A partir de ahí, cada vez que se guarda un archivo en el ordenador, la app se
   recarga sola en el iPhone. Sin builds, sin límites, sin esperas.

## Cuándo SÍ hace falta una build nueva en Expo

Solo cuando se toca algo **nativo**, que es poco frecuente:

- Instalar un paquete nuevo que incluya código nativo (no todo paquete lo lleva; los
  de solo JavaScript no lo necesitan).
- Cambiar icono, nombre de la app, permisos o configuración de `app.json`.
- Actualizar la versión del SDK de Expo.

En esos casos, una persona (normalmente Jose María) ejecuta
`eas build --profile development --platform ios` una vez, y todos instalan la build
nueva con el enlace. Después se vuelve al día a día sin builds.

## Resumen

- **Antes:** cambio → build en la web de Expo → esperar → instalar → probar (y límite
  mensual de builds).
- **Ahora:** cambio → guardar archivo → la app se recarga sola en el iPhone. Las
  builds solo se usan cuando cambia algo nativo, cada bastante tiempo.
