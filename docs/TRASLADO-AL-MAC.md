# Trasladar el proyecto al Mac

Escrito el 2026-10-08, el día que dejó de ser verdad que aquí no se puede compilar.

Esto no es una guía de migración genérica: es lo que una sesión nueva en el Mac necesita saber
para seguir sin volver a descubrir nada. Lo general de iOS está en el `CLAUDE.md` de la carpeta
padre; lo de esta app, en el `CLAUDE.md` de al lado.

## 1. Lo que NO viaja con el repositorio

Es la parte que se olvida, porque todo lo demás lo trae `git clone` y parece que ya está.

- **La memoria de Claude.** Vive fuera del repositorio y su carpeta se llama según la ruta del
  proyecto, así que al cambiar de máquina **no se encuentra sola**. En Windows estaba en
  `~/.claude/projects/C--Users-jmort-OneDrive-Pruebas-VS-code-desarrollo-ios-rn-Tiempo-easyweather/memory/`:
  un `MEMORY.md` que hace de índice y diez ficheros. La forma segura de acertar con el destino es
  abrir una sesión en la carpeta del proyecto en el Mac, dejar que cree su carpeta y copiar dentro
  los once ficheros. Ahí está lo que no puede estar en un repositorio público.
- **Las reglas transversales.** El `CLAUDE.md` de la carpeta padre dice que viven en
  `~/.claude/CLAUDE.md`. **Comprobado el 2026-10-08: ese fichero no existe**, ni en `~/.claude/` ni
  en el directorio del usuario. No hay nada que copiar, y no se ha perdido nada: el recuadro de
  aviso de ese mismo documento ya enumera las reglas que no se pueden dar por perdidas, y es la
  fuente real.
- **El acceso al VPS.** `~/.ssh/config` tiene el alias `vps`, y la clave privada va aparte. Sin eso
  no hay despliegue. Se copian a mano, nunca por el repositorio.
- **La sesión de EAS** (`npx eas-cli login`), y la de `gh` si se usa.

## 2. Tres repositorios, y cuál es el de cada cosa

| Repositorio | Rama | Qué hay |
|---|---|---|
| `desarrollo-ios-rn` | `master` | `comun/` (guías, el puente) y, dentro, este proyecto |
| `Tiempo/easyweather` | **`desarrollo`** | la app; `main` es lo publicado |
| `servidor-notificaciones` | `main` | el servidor de avisos y la recogida de radar |

`comun/` es compartido entre proyectos: **se propone, se aprueba y entonces se commitea.**

## 3. Estado al 2026-10-08

- **App Store**: build 19. **TestFlight**: build **21** (commit `6680658`), subida en cola. Lleva
  el puente de desarrollo dentro, inerte, porque todo él está tras `__DEV__`.
- **Cuidado con las actualizaciones por aire.** `runtimeVersion` es la cadena fija `"1.5.0"` para
  las builds 19, 20 y 21, pero sus huellas nativas son distintas: la 21 trae
  `react-native-view-shot` y las otras no. Para EAS Update son el mismo tiempo de ejecución, así
  que un `eas update` las alcanza a todas. Lo único que impide que eso deje la app sin abrir es el
  `require` perezoso de `src/desarrollo/servicios.ts`. **No se publica a `production` desde la rama
  `desarrollo`.**
- **Servidor**: desplegado `484a0bc`. La recogida de barridos de radar arrancó el 2026-10-07 a las
  20:28 UTC y la primera vuelta dio `nuevos 5, repetidos 10, fallos 0, peticiones 30`. Se comprueba
  con `curl -s https://api.jmortiz.es/`, que dice de cuándo es el código que está corriendo. La
  poda a catorce días empieza a actuar el 21 de octubre.
- **Accesibilidad**: informe en `docs/REVISION-ACCESIBILIDAD-2026-10-06.md`. Tres defectos
  encontrados y arreglados, y ninguno lo veía el compilador, ni el linter, ni VoiceOver. Quedó
  ofrecido y sin aprobar lo de las filas horizontales que aprietan el texto a tamaños de
  accesibilidad y deberían apilarse en columna.
- **Lo demás pendiente** está en `docs/PENDIENTE.md`, incluidos los anclajes de los otros catorce
  radares, aparcados a propósito.

## 4. Lo que cambia por tener Mac

### Compilar: tres niveles

1. `npx expo run:ios --device` — la build de desarrollo, en minutos en vez de en una cola.
2. `eas build --platform ios --profile beta --local` — el mismo proceso que la nube, aquí. Luego
   `eas submit --platform ios --profile beta --path <ipa>`, que acepta un fichero local y conserva
   el `ascAppId` de `eas.json`.
3. Sin EAS: `expo prebuild` + `pod install` + `xcodebuild archive`. Posible, pero obliga a llevar a
   mano cuatro cosas que ahora lleva EAS. No se recomienda de entrada.

No hay carpeta `ios/` y está en `.gitignore`: los nativos se generan al compilar.

### Cuatro trampas de ESTE proyecto al compilar fuera de EAS

- **`EXPO_PUBLIC_APP_KEY`** vive en el entorno `production` de EAS. Si no se incrusta, la app
  compila, arranca y el push deja de funcionar sin un solo error. Se comprueba con un `grep` en el
  bundle contando coincidencias, **sin imprimir el valor**.
- **El canal de OTA** lo escribe EAS a partir del perfil. `expo run:ios` no lo pone, así que una
  build hecha así no recibe actualizaciones y no se queja.
- **El número de build**: con `appVersionSource: "remote"`, el 21 vive en los servidores de EAS. Un
  `xcodebuild` a pelo puede chocar con un número ya subido.
- **El certificado de distribución** está en EAS. Si además lo gestiona Xcode, acaban dos
  certificados, y Apple solo permite dos: se agota y hay que revocar.

### Lo que de verdad vale, y es por donde empezar

- **Las condiciones de accesibilidad se ponen desde la terminal**, no a mano en Ajustes:
  `xcrun simctl ui booted content-size accessibility-extra-extra-extra-large` y
  `xcrun simctl ui booted appearance dark`. El 2026-10-06 se anularon dos tandas porque un ajuste
  no había llegado todavía al teléfono y no había forma de saberlo. Esto lo vuelve determinista: se
  pone, se lee con el servicio `entorno` del puente, y si no coincide no se sigue. De los siete
  interruptores, el tamaño y el tema están claros; negrita, contraste y transparencia hay que
  averiguar si salen por `simctl` o por `defaults write`.
- **`performAccessibilityAudit()`** (iOS 17 o posterior) revisa en una prueba de interfaz, sin
  abrir Xcode y sin mirar la pantalla, exactamente la clase de fallos que costó dos días cazar a
  mano: texto cortado, contraste, soporte de tamaños dinámicos, zonas de toque y elementos sin
  descripción. **Los tres defectos del informe del 6 de octubre están todos en esa lista.** El
  coste es real: necesita un target de pruebas de interfaz, e `ios/` se regenera en cada
  `prebuild`, así que hay que elegir entre un *config plugin* que lo inyecte o dejar de ignorar
  `ios/`. Es decisión de arquitectura: se propone, no se hace.
- **`modules/adjustable-button` y `modules/ubicacion-significativa`** son Swift escrito sin tener
  compilador a mano. El segundo es el servicio de cambios significativos, el sustituto de las
  geovallas que provocaron el rechazo 2.5.4. Conviene recordar cómo acabó el último cambio en esa
  zona: un parche que no llegó a la build y la app sin abrir en todos los teléfonos.

### Y una deuda nueva

`comun/docs/GUIA-ENTORNO-IOS.md` se titula «Entorno iOS **sin Mac**» y su línea 16 dice «nunca se
compila iOS en local». Esa premisa ha caducado. Hay que reescribirla, y es repositorio compartido:
se propone antes de tocar.

## 5. Qué leer al abrir la primera sesión en el Mac, y en este orden

1. `desarrollo-ios-rn/CLAUDE.md` — las reglas, incluido el recuadro de las transversales.
2. `Tiempo/easyweather/CLAUDE.md` — el servidor propio, la búsqueda del INE, el rechazo 2.5.4.
3. Este documento.
4. `docs/REVISAR-ACCESIBILIDAD.md` para usar el puente, y `comun/herramientas/puente/README.md`
   para entenderlo.
5. `docs/PENDIENTE.md`, solo cuando toque decidir qué se hace después.

## 6. Antes de dar por bueno el traslado

```bash
npm ci --include=dev          # el comando exacto que ejecuta EAS
npm run verificar             # tipos, lint, pruebas y empaquetado
npx expo-doctor               # falla con once desajustes de version de parche ANTERIORES a
                              # todo esto; la app de la Store corre con esas versiones. No
                              # tocarlos en el mismo paso que una build.
```

Y la regla que no cambia al cambiar de máquina: **la verificación visual la hace el asistente por
el puente**. No se le pide a nadie que describa la pantalla.
