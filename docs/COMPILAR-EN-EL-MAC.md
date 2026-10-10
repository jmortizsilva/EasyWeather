# Compilar esta app en el Mac

Medido el 2026-10-09, el primer día que se compiló iOS en local. **No es una guía teórica: todo lo
que hay aquí se ejecutó, y lo que no funcionó está marcado como tal.** Lo general de iOS está en el
`CLAUDE.md` de la carpeta padre; el traslado desde Windows, en [TRASLADO-AL-MAC.md](TRASLADO-AL-MAC.md).

## Estado en una línea

| Destino | Estado |
|---|---|
| **Simulador** | Compila, se instala y arranca. Es el camino bueno. |
| **iPhone de verdad** | Compila y se instala, pero **la app se aborta al arrancar** (`signal 5`). Sin resolver, ver §6. |

Para el ciclo corto: `herramientas/compilar-simulador.sh`, que hace de una vez todo lo de §3 y §4.

## 1. El Mac se usa por SSH, y eso decide casi todo

No hay sesión gráfica. Ni Xcode, ni ventanas, ni AppleScript. De ahí salen tres cosas que no se
adivinan:

- **El `login` de EAS por navegador no funciona entre máquinas.** Levanta un servidor en
  `localhost` del Mac y espera ahí la aprobación; si el navegador está en otro ordenador, va a
  buscar ese puerto en el ordenador equivocado. La salida es un **token**: se crea en
  `expo.dev/settings/access-tokens` y se deja en `~/.zshrc` como `EXPO_TOKEN`. Ya está puesto;
  `npx eas-cli whoami` contesta `jmortizsilva (authenticated using EXPO_TOKEN)`.
- **`npx expo run:ios` termina con un error de `osascript`** («tell app "System Events"…»): es Expo
  intentando traer al frente la ventana del Simulador. El error es decorativo —la app ya está
  compilada, instalada y abierta— pero **se lleva por delante el proceso, y con él Metro**. La
  forma que no toca AppleScript: `npx expo start --dev-client` en un terminal y
  `xcrun simctl openurl booted "<enlace>"` en otro.
- **`codesign` no puede usar el llavero.** Es todo el §2.

Y dos cosas de `zsh` que cuestan una hora si no se saben: **una variable no se parte en palabras**
(`xcodebuild $ARGS` le llega como un único argumento gigante y contesta con su manual de uso; hay
que escribir `${=ARGS}`), y **una variable vacía desaparece de la línea** en vez de pasar una cadena
vacía, así que `--device $VACIA $ID` hace que `--device` se coma el `$ID` y la queja que sale habla
del argumento que falta, no del que sobra.

## 2. Firmar sin pantalla: el llavero y el perfil

Dos problemas distintos que dan errores que no se parecen a su causa.

### Las credenciales no están en el llavero de login

```bash
security find-identity -v -p codesigning   # 2 identidades
security find-identity -v -p codesigning ~/Library/Keychains/login.keychain-db   # 0
```

Las dos viven en **`guardalo-firma.keychain-db`**, un llavero aparte creado para el otro proyecto de
este Mac, con su propia contraseña en `~/.appstoreconnect/llavero-firma.txt`. Mientras esté
bloqueado, `codesign` contesta:

```
EasyWeather.app/Frameworks/ExpoFileSystem.framework: errSecInternalComponent
```

Que no suena a permisos y es exactamente eso. Se arregla con dos órdenes, y **hay que repetir la
primera antes de cada compilación firmada porque el llavero se vuelve a bloquear solo**:

```bash
CLAVE=$(cat ~/.appstoreconnect/llavero-firma.txt)
LLAVERO=~/Library/Keychains/guardalo-firma.keychain-db
security unlock-keychain -p "$CLAVE" $LLAVERO
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$CLAVE" $LLAVERO
```

La segunda autoriza a las herramientas de línea de órdenes a usar la clave privada sin pedir
permiso por una ventana que no existe. Se queda puesta y no hace falta repetirla.

**Para probar si la firma funciona no hace falta compilar la app**, que son minutos. Esto tarda un
segundo y da el mismo error:

```bash
cp /bin/ls /tmp/prueba-firma
codesign -f -s <huella-de-la-identidad> /tmp/prueba-firma
```

### Xcode no tiene ninguna cuenta, y el perfil comodín no admite push

Con firma automática y sin cuenta, Xcode falla así:

```
❌ No Accounts: Add a new account in Accounts settings.
❌ Provisioning Profile "iOS Team Provisioning Profile: *" does not support the Push Notifications capability.
❌ Entitlements file defines the value "aps-environment" which is not registered for profile "iOS Team Provisioning Profile: *"
```

Los tres son el mismo: sin cuenta tira del **comodín** de equipo, y un comodín no puede llevar push.
El `aps-environment` lo mete `expo-notifications` al generar los nativos, así que no es opcional.

La salida **no** es añadir la cuenta a mano en Xcode: es `-allowProvisioningUpdates` con una clave de
la API de App Store Connect, que crea el identificador y el perfil con push él solo. Las claves
están en `~/.appstoreconnect/private_keys/`, y el identificador de clave, el Issuer ID y el Team ID
**no se escriben aquí porque este repositorio es público**: están en el documento del otro proyecto
de este mismo Mac, que explica además de dónde salió cada uno y cómo se importó el intermedio **G3**
de Apple (sin él, `find-identity` dice «0 valid identities found»):

```
~/Desarrollo/Guardar Enlaces/app-ios-nativa/docs/FIRMA-SIN-PANTALLA.md
```

Ese documento es lo mejor que hay en este Mac sobre el tema y **se recorrió entero antes de
encontrarlo**: mirarlo primero. Es candidato a `comun/`, que es repositorio de Agus, así que se
propone antes de tocar.

Lo que a esta app sí le funcionó: `-allowProvisioningUpdates` creó el perfil con push para
`com.jmortizsilva.tiempo.dev` sin intervención. El punto 5 de aquel documento («Authentication
failed» con una clave buena) **no nos afecta**: le pasa desde que tiene una extensión y un App
Group, y esta app no tiene ninguna de las dos cosas.

## 3. La trampa del identificador, que ya costó un disgusto en septiembre

`app.config.js` pone el identificador de pruebas (`…tiempo.dev`) **solo si existe `APP_VARIANT`**, y
esa variable la define `eas.json` en sus perfiles. Fuera de EAS no la pone nadie. En iOS, mismo
identificador = misma app: **instalar una build con el identificador de producción borra del iPhone
la de la App Store y la sustituye.** Pasó con las dos `preview` del 1 de septiembre.

Y hay una trampa dentro de la trampa, medida el 2026-10-09: **`prebuild` no rehace un `ios/` que ya
existe.** Se ejecutó `APP_VARIANT=development npx expo run:ios --device` con la variable bien
puesta, y la app salió con el identificador de **producción**, porque la carpeta nativa venía de una
prueba anterior hecha sin ella y `run:ios` se la encontró y tiró adelante. En su salida no aparecen
ni «Creating native directory» ni «Installing CocoaPods»: **esa ausencia es la señal**.

```bash
APP_VARIANT=development npx expo prebuild -p ios --clean
grep -m2 PRODUCT_BUNDLE_IDENTIFIER ios/*.xcodeproj/project.pbxproj
```

Y **antes de instalar en el iPhone, se comprueba en la app ya compilada**, no en la configuración:

```bash
plutil -p <ruta>/EasyWeatherDev.app/Info.plist | grep -i "ifier\|DisplayName"
```

Tiene que decir `com.jmortizsilva.tiempo.dev` y `EasyWeather Dev`. Si dice otra cosa, no se instala.

## 4. Con `APP_VARIANT`, el proyecto de Xcode cambia de nombre

`prebuild` bautiza el proyecto con el nombre de la app, y con la variante el nombre es «EasyWeather
Dev». Así que **no hay `EasyWeather.xcworkspace`**: hay `EasyWeatherDev.xcworkspace`, el *scheme* es
`EasyWeatherDev`, la app compilada es `EasyWeatherDev.app` y la carpeta de DerivedData es otra.
Costó un `xcodebuild: error: 'ios/EasyWeather.xcworkspace' does not exist`. No se escribe a mano:

```bash
W=$(ls -d ios/*.xcworkspace)
S=$(basename $W .xcworkspace)
```

Mejor aún, `-derivedDataPath .build-simulador`, que deja la app compilada en una ruta predecible
dentro del proyecto en vez de en un directorio con una cadena aleatoria.

## 5. El ciclo corto

```bash
herramientas/compilar-simulador.sh     # compila, comprueba el identificador e instala
npx expo start --dev-client            # en un terminal, y se deja
```

Y para abrir la app apuntando a ese Metro, desde otro terminal (sin pulsar `i`, que llama al
AppleScript del §1):

```bash
xcrun simctl openurl booted "exp+tiempo://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
```

En el simulador vale `localhost`: comparte la red del Mac.

**Y esto es lo que de verdad valía la pena del Mac**, porque es lo que anuló dos tandas de la
revisión del 6 de octubre: las condiciones de accesibilidad se ponen desde el terminal y se pueden
comprobar, en vez de pedirlas a mano y no saber si han llegado.

```bash
xcrun simctl ui booted content-size accessibility-extra-extra-extra-large
xcrun simctl ui booted appearance dark
```

Ver [REVISAR-ACCESIBILIDAD.md](REVISAR-ACCESIBILIDAD.md) para el resto del procedimiento con el
puente.

## 6. Lo que queda sin resolver

- **La app se aborta al arrancar en el iPhone.** Se instala bien
  (`xcrun devicectl device install app`), arranca y muere:

  ```
  Launched application with com.jmortizsilva.tiempo.dev bundle identifier.
  App terminated due to signal 5.
  ```

  `signal 5` es SIGTRAP: código nativo que se aborta a propósito. **En el simulador la misma
  compilación no se cae** y no hay informe de fallo en `~/Library/Logs/DiagnosticReports`, así que
  apunta al aparato y no al código. Lo primero que hay que descartar, y que no se llegó a
  comprobar, es el **Modo de desarrollador** del iPhone (Ajustes → Privacidad y seguridad), que iOS
  exige desde la versión 16 para las apps firmadas con certificado de desarrollo; encaja con que la
  build de EAS de agosto sí funcione, porque aquella es de distribución interna y no lo necesita:

  ```bash
  xcrun devicectl device info details --device <udid> | grep -i developer
  ```

  Y si no es eso: **los registros nativos de iOS no van a la salida estándar**, así que
  `devicectl … launch --console` sale en blanco y Metro ni se entera. Hay que leer el registro del
  sistema del teléfono o su informe de fallo, y sin interfaz gráfica eso es trabajo aparte.
- **Los runtimes de simulador instalados son de iOS 18.2** aunque Xcode sea 27.0. Sirven, pero para
  probar algo propio de iOS 27 hay que descargar ese runtime.

## Datos del Mac, para no volver a averiguarlos

| Qué | Valor |
|---|---|
| Xcode | 27.0 (27A266a), SDK `iphoneos27.0` |
| Proyecto | `~/Desarrollo/desarrollo-ios-rn/Tiempo/easyweather` |
| Sesión de EAS | `EXPO_TOKEN` en `~/.zshrc` |
| Llavero de firma | `guardalo-firma.keychain-db`, contraseña en `~/.appstoreconnect/llavero-firma.txt` |
| Claves de la API | `~/.appstoreconnect/private_keys/` |
| iPhone | aparece en `xcrun devicectl list devices`, emparejado y accesible por red |
| Acceso al VPS | alias `vps` en `~/.ssh/config`, clave `~/.ssh/vps` |
