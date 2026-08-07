# EasyWeather — notas del proyecto

Las reglas generales de iOS/RN están en el CLAUDE.md de la carpeta padre. Aquí solo lo
específico de esta app.

## Notificaciones push: servidor propio (`api.jmortiz.es`)

Los avisos (temperatura y resumen) que deben llegar **con la app cerrada** no se programan en el
móvil ni en Cloudflare: los envía un **servidor propio multi-app**.

- **Servidor**: repo `servidor-notificaciones` (github.com/jmortizsilva/servidor-notificaciones),
  Node + Fastify + SQLite + Docker, tras Caddy en `https://api.jmortiz.es`. EasyWeather cuelga de
  `/apps/easyweather/…`.
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

- Antes esto era un **Worker de Cloudflare** (carpeta `server/`). Se migró a servidor propio. El
  Worker queda **vacío y con el cron apagado**; falta retirarlo del todo (limpieza sin prisa).
- **Avisos duplicados**: para apagar el cron de un Worker de Cloudflare hay que desplegar
  `crons = []` **explícito**; comentar el bloque `[triggers]` NO borra los crons existentes.
  Verificarlo mirando los datos (`ultimo_envio`), no la salida del deploy.
- En una migración de servidor, **un solo cron activo a la vez** o llegan avisos por duplicado. La
  app resincroniza su estado al volver a primer plano (`AppState` → `active`), así que **cambiar la
  URL basta para migrar los dispositivos**: se re-registran solos al abrir la app.
