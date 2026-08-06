# Guía: mover las notificaciones a un servidor propio (multi-app)

Documento para preparar un servidor propio que sustituya al Cloudflare Worker actual y que,
además, pueda dar servicio a **varias apps** en el futuro (EasyWeather primero).

Está pensado para pasárselo a quien administre el servidor. Al final hay una lista de **qué
confirmar** antes de empezar.

---

## 1. Qué hace hoy el sistema (lo que hay que reproducir)

El servidor actual es un Cloudflare Worker con tres piezas:

1. **API HTTP**: la app le sube su estado de avisos y su ubicación.
2. **Cron cada 20 minutos**: comprueba los umbrales de temperatura y envía los resúmenes cuya
   hora local haya llegado.
3. **Base de datos** (Cloudflare D1, que **por dentro es SQLite**): 3 tablas.

El **envío del push** es un simple POST a la API de Expo (`https://exp.host/--/api/v2/push/send`)
y **no cambia**: funciona igual desde cualquier servidor.

### El contrato HTTP (lo que el servidor nuevo debe aceptar)

Hoy las rutas no llevan identificador de app. Para multi-app se propone un **prefijo por app**
y una **clave por app** en una cabecera (ver §5).

| Ruta actual | Body | Efecto |
|---|---|---|
| `GET /` | — | Salud: `{"ok":true}` |
| `POST /sincronizar` | `{ token, zonaHoraria, ubicacion:{lat,lon,nombre}\|null, umbral:{maxThreshold,minThreshold}\|null, resumenes:[…] }` | Reemplaza **todo** el estado de ese token |
| `POST /ubicacion` | `{ token, lat, lon, nombre?, zonaHoraria? }` | Actualiza solo la ubicación viva |
| `POST /test` | `{ token }` | Envía un push de prueba inmediato |
| `POST /register`, `/unregister` | (compat de builds 1.0.0) | Baja prioridad |

Cada `resumen` es: `{ id, hora, minuto, campos:[string], seguirUbicacion:bool, lat, lon, nombre }`.

Todas responden `{"ok":true}`.

### El cron (cada 20 min)

1. **Umbrales**: por cada dispositivo con aviso de temperatura, pide la temperatura actual a
   Open-Meteo; si cruza el máximo o el mínimo (disparo por **flanco**, guardando `last_above` /
   `last_below` para no repetir), envía push.
2. **Resúmenes**: por cada resumen cuya hora local haya llegado (ventana de 30 min, sin duplicar
   en el día mediante `ultimo_envio`), arma el texto y envía push. La hora es **local del
   dispositivo** (se guarda su zona horaria).

---

## 2. Stack recomendado: Node.js + SQLite

**Node.js 20 LTS + SQLite + un cron.** Razón de peso:

- Todo el código que **decide** (consulta a Open-Meteo, cálculo de la luna) y que **arma el
  texto** de las notificaciones es **TypeScript puro**, sin dependencias de React Native. En
  Node se reutiliza tal cual, así que las notificaciones dicen **exactamente lo mismo** que la
  app. Con otro lenguaje habría que reescribirlo y vigilar que no se desvíe versión a versión.
- Cloudflare D1 **ya es SQLite**, así que el esquema actual vale casi sin cambios y los datos se
  exportan/importan directos.

Con PHP/Python/Go también se puede, pero se pierde esa reutilización. Si el servidor no puede
correr Node directamente, **Docker** es una salida limpia (imagen `node:20-slim`).

---

## 3. Qué hay que preparar en el servidor

1. **Un dominio con HTTPS y certificado válido** (Let's Encrypt). iOS **exige** HTTPS con una
   autoridad pública: un certificado autofirmado **no** funciona. Lo más cómodo es un proxy con
   HTTPS automático (**Caddy**) o nginx + certbot.
2. **Node.js 20 LTS** y un **gestor de procesos** que lo mantenga vivo y lo arranque al reiniciar
   (**systemd** o **pm2**).
3. **Un cron cada 20 minutos**. Dos opciones:
   - `node-cron` dentro del propio proceso (más simple), o
   - un cron del sistema (`systemd timer`) que dispare la comprobación.
   **Importante**: solo puede haber **una** instancia del cron, o llegan avisos duplicados.
4. **Disco persistente** para el fichero SQLite, con **copia de seguridad** periódica.
5. **Cortafuegos**: entrante 443 (HTTPS); saliente 443 hacia `api.open-meteo.com` y `exp.host`.
6. No hacen falta claves secretas de terceros: Open-Meteo es abierto y el envío por Expo no
   requiere token.

---

## 4. Base de datos multi-app

El esquema actual (SQLite) con una columna `app` añadida a la clave primaria. Así conviven
varias apps en las mismas tablas sin mezclarse.

```sql
CREATE TABLE IF NOT EXISTS dispositivos (
  app TEXT NOT NULL,              -- identificador de la app: "easyweather", etc.
  token TEXT NOT NULL,            -- token de push de Expo (identidad del dispositivo)
  lat REAL,
  lon REAL,
  nombre TEXT,                    -- nombre del sitio actual (lo resuelve el movil)
  zona_horaria TEXT,
  updated_at INTEGER,
  PRIMARY KEY (app, token)
);

CREATE TABLE IF NOT EXISTS umbrales (
  app TEXT NOT NULL,
  token TEXT NOT NULL,
  max_threshold REAL NOT NULL,
  min_threshold REAL NOT NULL,
  last_above INTEGER,             -- NULL = aun no comprobado (no se avisa la 1a vez)
  last_below INTEGER,
  PRIMARY KEY (app, token)
);

CREATE TABLE IF NOT EXISTS resumenes (
  app TEXT NOT NULL,
  token TEXT NOT NULL,
  id TEXT NOT NULL,
  hora INTEGER NOT NULL,
  minuto INTEGER NOT NULL,
  campos TEXT NOT NULL,           -- JSON: array de nombres de campo
  seguir_ubicacion INTEGER NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  nombre TEXT NOT NULL,
  ultimo_envio TEXT,              -- fecha local YYYY-MM-DD del ultimo envio (dedupe por dia)
  PRIMARY KEY (app, token, id)
);
```

Migrar los datos actuales (opcional, ver §7):

```bash
# Exporta lo que hay en Cloudflare D1 (sale SQL de SQLite)
npx wrangler d1 export easyweather-alerts --remote --output=easyweather-dump.sql
# Al importarlo, anadir app = 'easyweather' a cada fila (el dump viejo no la trae).
```

---

## 5. Estructura del código (núcleo genérico + módulo por app)

La idea: un **núcleo** que no sabe de meteorología, y un **módulo por app** que aporta lo propio.

**Núcleo (común a todas las apps):**
- Servidor HTTP con las rutas del contrato, bajo un prefijo por app: `POST /apps/:app/sincronizar`,
  `/apps/:app/ubicacion`, `/apps/:app/test`.
- Autenticación: cabecera `X-App-Key` comparada con la clave de esa app.
- Almacenamiento en SQLite (las 3 tablas, siempre filtrando por `app`).
- El **cron**: recorre dispositivos por app, calcula la hora local, deduplica por día, y **delega
  en el módulo de la app** cómo se arma cada notificación.
- Envío por Expo (batches de 100) y cálculo de hora local por zona horaria.

**Módulo por app** (para EasyWeather se reutiliza el código TS actual):
- `getForecast(lat, lon)` y `getTemperaturaActual(lat, lon)` — de dónde saca los datos.
- `construirCuerpoResumen(dia, campos)` — el texto del resumen.
- `construirAvisoUmbral(temp, umbral, nombre)` — `{ title, body }` del aviso de temperatura.

Añadir una app nueva en el futuro = registrar su clave y su módulo. El núcleo no se toca.

> Para EasyWeather, esos tres módulos ya existen como TS puro en el repo de la app
> (`src/services/openMeteo.ts`, `src/utils/dayDetails.ts`, `src/utils/weatherCodes.ts`,
> `src/utils/moon.ts`) y en la lógica del Worker actual (`server/src/index.js`). El núcleo Node
> puede importarlos directamente.

---

## 6. Cambios en la app

Mínimos, y todos **JavaScript** → se entregan por **OTA** (`eas update`), sin recompilar:

1. **URL base + prefijo de app** en `src/utils/push.ts`. Hoy:
   `const SERVER_URL = 'https://easyweather-alerts.easyweather-app.workers.dev'`.
   Pasa a `https://api.jmortiz.es` y las llamadas a `…/apps/easyweather/sincronizar`.
2. **Cabecera `X-App-Key`** con la clave de la app en cada `fetch` (§5).
3. **Dominio propio**: al apuntar a `api.TUDOMINIO.com` (no a la IP), cualquier mudanza futura del
   servidor es solo un cambio de DNS, **sin tocar la app**.

> La clave embebida en la app **no es un secreto fuerte** (se puede extraer del binario); sirve
> para subir el listón junto al rate limiting, no para autenticar de verdad.

---

## 7. Corte sin cortes ni duplicados

La app **resincroniza su estado completo cada vez que se abre** y cuando cambia de lugar/ubicación.
Así que basta cambiar la URL para que cada móvil se re-registre solo en el servidor nuevo.

Orden recomendado:

1. Levantar el servidor nuevo (rutas + cron + BD) y probarlo con un token de prueba vía `/test`.
2. *(Opcional pero limpio)* Exportar los datos de D1 (§4) e importarlos, para no depender de que
   cada móvil se abra.
3. **Apagar el cron del Worker** de Cloudflare (redeploy sin `crons`). **Solo un cron activo**, o
   llegan avisos por duplicado.
4. Publicar la **OTA** con la nueva URL. A partir de ahí los móviles hablan con el servidor nuevo.
5. Dejar las **rutas** del Worker vivas unos días como red de seguridad (por si alguna build vieja
   no recibe la OTA), pero con su cron apagado. Luego, retirarlo.

---

## 8. Seguridad

Las rutas actuales están **abiertas**. En un servidor compartido entre apps, añadir:

- **TLS** (ya, por el dominio).
- **Clave por app** en cabecera `X-App-Key` (§5).
- **Rate limiting** por IP y por token (p. ej. `express-rate-limit`), para que nadie spamee `/test`.

---

## 9. Qué confirmar con quien administre el servidor

Antes de escribir nada, estas respuestas cierran el diseño:

1. **¿Puede correr Node.js 20 directamente, o mejor en Docker?**
2. **¿Sistema operativo / distribución?** (para systemd vs. otra cosa).
3. **¿Ya hay un proxy inverso** (nginx, Caddy, Traefik) o lo montamos? ¿HTTPS automático?
4. **¿Quién es el dueño del dominio** y puede crear un subdominio (`api.…`) y apuntar el DNS?
5. **¿Disco persistente + copias de seguridad** para el fichero SQLite?
6. **Cortafuegos**: ¿entrante 443 abierto y salida a `open-meteo.com` y `exp.host`?
7. **¿Una sola máquina** (para no duplicar el cron), o hay balanceo? Si hay varias, el cron debe
   correr en una sola.

Con eso, el siguiente paso es escribir el servidor Node (núcleo + módulo de EasyWeather
reutilizando el código actual) y el cambio de la app.

---

## 10. Concreción para el VPS del amigo (respuestas del administrador)

Montaje confirmado: **Debian 13**, **Docker** actualizado (+ nvm por si acaso), **Caddy en
contenedor** (HTTPS automático), disco de sobra con copias a otra máquina, **ufw** con 443 abierto,
**un único VPS** (una sola máquina → un solo cron, sin riesgo de duplicados).

**Dominio**: el host de la API es **`api.jmortiz.es`** (dominio de Jose). Jose ya creó en su zona
DNS un registro `A` que apunta a la IP del VPS del amigo, así que `api.jmortiz.es` resuelve a esa
máquina y Caddy puede sacar el certificado. Ventaja: futuras mudanzas del servidor las controla
Jose desde su propio DNS. Con esto el diseño queda así:

- **Empaquetado**: el servicio como **contenedor Docker** (imagen `node:20-slim`), gestionado por
  `docker compose` con `restart: unless-stopped` (mantiene el proceso vivo; no hace falta systemd
  aparte, aunque puede envolverse en una unidad systemd si se prefiere el arranque unificado).
- **HTTPS**: se añade una ruta en el **Caddy** existente que haga de proxy inverso del subdominio
  al contenedor. Caddy saca el certificado de Let's Encrypt solo. Subdominio:
  **`api.jmortiz.es`** (dominio de Jose; sirve para varias apps, EasyWeather cuelga de
  `/apps/easyweather/…`).
- **Base de datos**: fichero **SQLite** en un volumen Docker persistente (entra en las copias que
  ya se descargan a otro equipo).
- **Cron**: `node-cron` **dentro del proceso** (VPS único → una sola instancia, seguro).
- **Framework**: **Fastify** (ligero, validación de esquemas, rate limiting) + **better-sqlite3**
  (SQLite síncrono, rápido y simple).

Ejemplo de la ruta en el `Caddyfile` (se integra en el Caddy que ya corre):

```
api.jmortiz.es {
    reverse_proxy notificaciones:8080
}
```

(el nombre `notificaciones` sería el del servicio en `docker-compose`, en la misma red de Docker
que Caddy.)

**Repositorio propio y reutilización de código**: el servidor vivirá en **su propio repositorio**
(da servicio a varias apps; no debe colgar de EasyWeather). Como consecuencia, el módulo de
EasyWeather dentro del servidor **copiará** las funciones puras del repo de la app (Open-Meteo,
armado de texto, luna) y llevará un **test de paridad** con ejemplos fijos que salte si divergen.
Si en el futuro molesta la copia, se promueven esas funciones a un paquete compartido.

## 11. Recursos estimados

Servicio muy ligero (un proceso Node + una tarea cada 20 min):

| Recurso | En reposo | Con carga |
|---|---|---|
| RAM | ~60–100 MB | Presupuestar ~150 MB; 256 MB va sobrado |
| CPU | ~0 % | Picos cada 20 min de I/O (espera a Open-Meteo/Expo), sub-segundo para decenas/cientos de dispositivos |
| Disco | cientos de bytes por dispositivo | 1.000 dispositivos ≈ pocos MB |

**Límite de Open-Meteo**: su API gratuita pide < ~10.000 peticiones/día. El cron corre 72
veces/día; hoy hace **una consulta por dispositivo** por vuelta. Con pocos usuarios es irrelevante,
pero para escalar se **agrupan las consultas por coordenadas** (redondeando lat/lon: muchos móviles
en la misma ciudad comparten una sola consulta). Previsto en el diseño del núcleo.
