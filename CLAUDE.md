# EasyWeather — notas del proyecto

Las reglas generales de iOS/RN están en el CLAUDE.md de la carpeta padre. Aquí solo lo
específico de esta app.

## Notificaciones push: servidor propio (`api.jmortiz.es`)

Los avisos (temperatura y resumen) que deben llegar **con la app cerrada** no se programan en el
móvil ni en Cloudflare: los envía un **servidor propio multi-app**.

- **Servidor**: repo `servidor-notificaciones` (github.com/jmortizsilva/servidor-notificaciones),
  Node + Fastify + SQLite en contenedor, tras Caddy en `https://api.jmortiz.es`. EasyWeather cuelga
  de `/apps/easyweather/…`. **El VPS va con Podman sin root, no con Docker**, y el compose vive en
  una carpeta aparte del clon de git: el README de ese repo lo explica (sección «El despliegue
  real»).
- **Cliente**: `src/utils/push.ts`. POST a `/apps/easyweather/{sincronizar,ubicacion,test}` con la
  cabecera `X-App-Key`. El push sale por Expo (funciona desde cualquier servidor).
- **La clave `X-App-Key` NO está en el código** (el repo es público): va por la variable de EAS
  `EXPO_PUBLIC_APP_KEY` (`eas env:create --environment production`), que se incrusta en el bundle al
  publicar pero no se sube al repo. Confirmar la incrustación con `expo export` + grep antes de
  fiarse.
- **El texto de las notificaciones lo arma el servidor con el código de esta app** (`openMeteo`,
  `dayDetails`, `weatherCodes`, `moon`). Debe seguir siendo **TS puro sin dependencias de RN** para
  poder copiarse al servidor. El servidor lleva un **test de paridad**; si cambias el texto aquí,
  refléjalo allí en el mismo commit.
- **Consultar los avisos programados**: `GET /admin/estado` con la cabecera `X-Admin-Key` (clave
  aparte de la de la app).

### Historia y trampas (migración de 2026-08)

- Antes esto era un **Worker de Cloudflare** (carpeta `server/`, borrada en agosto de 2026 junto
  con su `.easignore`). Si hace falta consultarlo, está en el historial: `git show 97a7257`.
  **El Worker ya no envía nada**: confirmado el 2026-08-16 observando los avisos que llegan al
  móvil, que es la única prueba que vale. Lo que pueda quedar desplegado o la D1 vacía son
  restos que no molestan; borrarlos (`npx wrangler delete` + borrar la D1) es limpieza, no riesgo.
- **Avisos duplicados**: para apagar el cron de un Worker de Cloudflare hay que desplegar
  `crons = []` **explícito**; comentar el bloque `[triggers]` NO borra los crons existentes.
  Verificarlo mirando los datos (`ultimo_envio`), no la salida del deploy.
- En una migración de servidor, **un solo cron activo a la vez** o llegan avisos por duplicado. La
  app resincroniza su estado al volver a primer plano (`AppState` → `active`), así que **cambiar la
  URL basta para migrar los dispositivos**: se re-registran solos al abrir la app.

## Geovallas sin el modo de fondo `location` (rechazo 2.5.4 de Apple)

La app sigue la ubicación con **geovallas** (`src/utils/ubicacionFondo.ts`): una zona de 3 km y solo
al salir. No hace seguimiento continuo.

Apple **rechazó la build 17** el 2026-08-29 por la directriz 2.5.4, y no por el permiso: por
declarar `UIBackgroundModes = ["location"]` en el `Info.plist` sin tener ninguna función que
necesite ubicación persistente. En su propia respuesta proponen *region monitoring*, que es lo que
la app ya hacía. Tenían razón, y contestar explicándolo no habría servido de nada.

**La trampa**: iOS no necesita ese modo para despertar a la app al salir de una zona vigilada, pero
**expo-location sí lo exige** (`ios/LocationModule.swift`, el `guard` de `startGeofencingAsync`),
porque su consumidor de geovallas enciende `allowsBackgroundLocationUpdates`, que sin el modo lanza.
Las geovallas no lo necesitan para nada. Comprobado también en la 57.0.14, la última publicada: no
se arregla actualizando.

Por eso hay un plugin propio, `plugins/geovallas-sin-modo-de-fondo.js`, que le quita esa exigencia
al compilar. **Si actualizas expo-location, la prueba de `plugins/__tests__/` falla** antes de que
lo haga EAS: es a propósito. Si falla, mira si el `guard` sigue ahí antes de tocar nada.

Queda declarado `UIBackgroundModes = ["fetch"]`, que lo mete `expo-task-manager` por su cuenta.
Apple no lo ha mencionado.
