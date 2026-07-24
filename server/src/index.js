// Servidor de avisos de temperatura de EasyWeather (Cloudflare Worker).
//
// Dos partes:
//  - fetch: recibe de la app el identificador de push del teléfono + ubicación + umbrales
//    (/register) y los borra (/unregister). Los guarda en la base de datos D1.
//  - scheduled: cada 20 minutos (según el cron de wrangler.toml) mira la temperatura actual
//    de cada dispositivo y, si cruza el umbral, envía una notificación push a través de Expo.
//
// Solo avisa en el momento del cruce (la vez anterior estaba al otro lado), para no repetir el
// aviso mientras dura el episodio. La primera comprobación tras registrarse no avisa: solo
// aprende el estado actual, para no soltar un aviso de una condición que ya estaba ocurriendo.

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (request.method === 'GET' && url.pathname === '/') {
      return json({ ok: true, service: 'easyweather-alerts' });
    }

    if (request.method === 'POST' && url.pathname === '/register') {
      const body = await request.json().catch(() => null);
      if (
        !body ||
        typeof body.token !== 'string' ||
        typeof body.lat !== 'number' ||
        typeof body.lon !== 'number' ||
        typeof body.maxThreshold !== 'number' ||
        typeof body.minThreshold !== 'number'
      ) {
        return json({ error: 'datos incompletos' }, 400);
      }
      await env.DB.prepare(
        `INSERT INTO devices (token, lat, lon, place_name, max_threshold, min_threshold, last_above, last_below, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, NULL, NULL, ?7)
         ON CONFLICT(token) DO UPDATE SET
           lat = ?2, lon = ?3, place_name = ?4, max_threshold = ?5, min_threshold = ?6, updated_at = ?7`
      )
        .bind(body.token, body.lat, body.lon, body.placeName ?? null, body.maxThreshold, body.minThreshold, Date.now())
        .run();
      return json({ ok: true });
    }

    if (request.method === 'POST' && url.pathname === '/test') {
      const body = await request.json().catch(() => null);
      if (!body || typeof body.token !== 'string') {
        return json({ error: 'falta el token' }, 400);
      }
      await sendExpoPush([
        {
          to: body.token,
          title: 'Notificación de prueba',
          body: 'Esto es una prueba. Los avisos de temperatura de EasyWeather funcionan correctamente.',
          sound: 'default',
        },
      ]);
      return json({ ok: true });
    }

    if (request.method === 'POST' && url.pathname === '/unregister') {
      const body = await request.json().catch(() => null);
      if (body && typeof body.token === 'string') {
        await env.DB.prepare('DELETE FROM devices WHERE token = ?1').bind(body.token).run();
      }
      return json({ ok: true });
    }

    return json({ error: 'no encontrado' }, 404);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkAllDevices(env));
  },
};

async function checkAllDevices(env) {
  const { results } = await env.DB.prepare('SELECT * FROM devices').all();
  const messages = [];

  for (const device of results ?? []) {
    let temperature;
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${device.lat}&longitude=${device.lon}&current=temperature_2m`
      );
      const data = await response.json();
      temperature = data && data.current ? data.current.temperature_2m : undefined;
    } catch {
      continue; // si falla la previsión de un dispositivo, se sigue con los demás
    }
    if (typeof temperature !== 'number') {
      continue;
    }

    const place = device.place_name || 'tu ubicación';
    const above = temperature >= device.max_threshold ? 1 : 0;
    const below = temperature <= device.min_threshold ? 1 : 0;

    // Solo en el flanco de subida (antes estaba por debajo) y si conocíamos el estado anterior.
    if (above === 1 && device.last_above === 0) {
      messages.push({
        to: device.token,
        title: 'Aviso de temperatura',
        body: `Ahora en ${place} se alcanzan ${Math.round(temperature)} grados, por encima de tu aviso de ${Math.round(
          device.max_threshold
        )} grados.`,
        sound: 'default',
      });
    }
    if (below === 1 && device.last_below === 0) {
      messages.push({
        to: device.token,
        title: 'Aviso de temperatura',
        body: `Ahora en ${place} se baja a ${Math.round(temperature)} grados, por debajo de tu aviso de ${Math.round(
          device.min_threshold
        )} grados.`,
        sound: 'default',
      });
    }

    await env.DB.prepare('UPDATE devices SET last_above = ?1, last_below = ?2 WHERE token = ?3')
      .bind(above, below, device.token)
      .run();
  }

  await sendExpoPush(messages);
}

async function sendExpoPush(messages) {
  // Expo acepta hasta 100 mensajes por petición.
  for (let i = 0; i < messages.length; i += 100) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(messages.slice(i, i + 100)),
    });
  }
}
