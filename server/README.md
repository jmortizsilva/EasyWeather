# Servidor de avisos de EasyWeather

Este servidor vigila la temperatura y envía las notificaciones push del aviso de temperatura.
Se ejecuta en Cloudflare (tecnología sin servidor, con plan gratuito). No hay que mantener ningún
ordenador encendido: Cloudflare lo ejecuta solo cada 20 minutos.

## Qué necesitas una sola vez

1. Una cuenta gratuita de Cloudflare. Créala en https://dash.cloudflare.com/sign-up
2. Node.js instalado (ya lo tienes).

## Pasos para desplegarlo

Abre una terminal dentro de esta carpeta (`server`). Ejecuta los comandos en orden.

1. Inicia sesión en Cloudflare. Se abrirá el navegador para que autorices:

   npx wrangler login

2. Crea la base de datos:

   npx wrangler d1 create easyweather-alerts

   Al terminar, escribe unas líneas parecidas a esto:

   [[d1_databases]]
   binding = "DB"
   database_name = "easyweather-alerts"
   database_id = "un-código-largo"

   Copia ese `database_id` y pégalo en el archivo `wrangler.toml`, sustituyendo el texto
   `PEGA_AQUI_EL_ID_DE_LA_BASE_DE_DATOS`.

3. Crea la tabla dentro de la base de datos:

   npx wrangler d1 execute easyweather-alerts --remote --file=schema.sql

4. Publica el servidor:

   npx wrangler deploy

   Al terminar, muestra una dirección parecida a:

   https://easyweather-alerts.TU-CUENTA.workers.dev

   Esa es la dirección del servidor. **Pásasela a Claude** para enganchar la app.

## Comprobar que funciona

- Abre esa dirección en el navegador: debe responder `{"ok":true,...}`.
- Para ver los registros en vivo mientras pruebas: `npx wrangler tail`

## Qué guarda

Por cada iPhone suscrito: el identificador de push, la última ubicación conocida (latitud y
longitud), el nombre del lugar y los umbrales de temperatura. Nada más. Se borra al desactivar el
aviso en la app.
