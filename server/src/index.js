// Servidor de avisos de EasyWeather (Cloudflare Worker).
//
//  - fetch: la app sube su estado completo de avisos (/sincronizar), su ubicacion al moverse
//    (/ubicacion), o pide una prueba (/test). Se guarda en D1. /register y /unregister se
//    mantienen por compatibilidad con builds antiguas (solo umbral).
//  - scheduled: cada 20 min (cron de wrangler.toml) comprueba el umbral de temperatura de cada
//    dispositivo y envia los resumenes cuya hora local haya llegado, con la ubicacion actual.
//
// El texto del resumen se construye con el MISMO codigo que la app (getForecast + buildDayDetails),
// importado de src/, para que diga exactamente lo mismo.

import { getForecast } from '../../src/services/openMeteo';
import { buildDayDetails } from '../../src/utils/dayDetails';
import { describeWeatherCode } from '../../src/utils/weatherCodes';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

// Margen tras la hora del resumen dentro del que aun se envia (el cron corre cada 20 min).
const VENTANA_RESUMEN_MIN = 30;

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

    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      switch (url.pathname) {
        case '/sincronizar':
          return sincronizar(body, env);
        case '/ubicacion':
          return actualizarUbicacion(body, env);
        case '/test':
          return probar(body);
        case '/register':
          return registrarCompat(body, env);
        case '/unregister':
          return desregistrarCompat(body, env);
      }
    }

    return json({ error: 'no encontrado' }, 404);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all([comprobarUmbrales(env), enviarResumenes(env)]));
  },
};

// --- Endpoints ---

// Estado completo de avisos: reemplaza lo que el servidor tenga de este token.
async function sincronizar(body, env) {
  if (!body || typeof body.token !== 'string') {
    return json({ error: 'falta el token' }, 400);
  }
  const token = body.token;
  const umbral =
    body.umbral &&
    typeof body.umbral.maxThreshold === 'number' &&
    typeof body.umbral.minThreshold === 'number'
      ? body.umbral
      : null;
  const resumenes = Array.isArray(body.resumenes) ? body.resumenes : [];

  // Sin ningun aviso activo: baja total del dispositivo.
  if (!umbral && resumenes.length === 0) {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM resumenes WHERE token = ?1').bind(token),
      env.DB.prepare('DELETE FROM umbrales WHERE token = ?1').bind(token),
      env.DB.prepare('DELETE FROM dispositivos WHERE token = ?1').bind(token),
    ]);
    return json({ ok: true });
  }

  const lat = body.ubicacion && typeof body.ubicacion.lat === 'number' ? body.ubicacion.lat : null;
  const lon = body.ubicacion && typeof body.ubicacion.lon === 'number' ? body.ubicacion.lon : null;
  const nombre =
    body.ubicacion && typeof body.ubicacion.nombre === 'string' ? body.ubicacion.nombre : null;
  const tz = typeof body.zonaHoraria === 'string' ? body.zonaHoraria : null;

  const sentencias = [];
  // Upsert del dispositivo. No se pisa la ubicacion (ni su nombre) con null si esta vez no viene.
  sentencias.push(
    env.DB.prepare(
      `INSERT INTO dispositivos (token, lat, lon, nombre, zona_horaria, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(token) DO UPDATE SET
         lat = COALESCE(?2, dispositivos.lat),
         lon = COALESCE(?3, dispositivos.lon),
         nombre = COALESCE(?4, dispositivos.nombre),
         zona_horaria = COALESCE(?5, dispositivos.zona_horaria),
         updated_at = ?6`,
    ).bind(token, lat, lon, nombre, tz, Date.now()),
  );

  // Umbral (preserva last_above/last_below si ya existia, para no re-avisar).
  if (umbral) {
    sentencias.push(
      env.DB.prepare(
        `INSERT INTO umbrales (token, max_threshold, min_threshold) VALUES (?1, ?2, ?3)
         ON CONFLICT(token) DO UPDATE SET max_threshold = ?2, min_threshold = ?3`,
      ).bind(token, umbral.maxThreshold, umbral.minThreshold),
    );
  } else {
    sentencias.push(env.DB.prepare('DELETE FROM umbrales WHERE token = ?1').bind(token));
  }

  // Resumenes: borrar los que ya no estan y upsert de los actuales (preservando ultimo_envio).
  const ids = resumenes.map((r) => r.id);
  if (ids.length === 0) {
    sentencias.push(env.DB.prepare('DELETE FROM resumenes WHERE token = ?1').bind(token));
  } else {
    const placeholders = ids.map((_, i) => `?${i + 2}`).join(', ');
    sentencias.push(
      env.DB
        .prepare(`DELETE FROM resumenes WHERE token = ?1 AND id NOT IN (${placeholders})`)
        .bind(token, ...ids),
    );
  }
  for (const r of resumenes) {
    sentencias.push(
      env.DB
        .prepare(
          `INSERT INTO resumenes (token, id, hora, minuto, campos, seguir_ubicacion, lat, lon, nombre)
           VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
           ON CONFLICT(token, id) DO UPDATE SET
             hora = ?3, minuto = ?4, campos = ?5, seguir_ubicacion = ?6, lat = ?7, lon = ?8, nombre = ?9`,
        )
        .bind(
          token,
          r.id,
          r.hora,
          r.minuto,
          JSON.stringify(r.campos ?? []),
          r.seguirUbicacion ? 1 : 0,
          r.lat,
          r.lon,
          r.nombre,
        ),
    );
  }

  await env.DB.batch(sentencias);
  return json({ ok: true });
}

// Solo actualiza la ubicacion (la manda la geovalla al moverse). No crea el dispositivo si no
// existe: sin avisos activos no hay nada que seguir.
async function actualizarUbicacion(body, env) {
  if (
    !body ||
    typeof body.token !== 'string' ||
    typeof body.lat !== 'number' ||
    typeof body.lon !== 'number'
  ) {
    return json({ error: 'datos incompletos' }, 400);
  }
  const tz = typeof body.zonaHoraria === 'string' ? body.zonaHoraria : null;
  const nombre = typeof body.nombre === 'string' ? body.nombre : null;
  await env.DB.prepare(
    `UPDATE dispositivos
       SET lat = ?2, lon = ?3, nombre = COALESCE(?4, nombre),
           zona_horaria = COALESCE(?5, zona_horaria), updated_at = ?6
     WHERE token = ?1`,
  )
    .bind(body.token, body.lat, body.lon, nombre, tz, Date.now())
    .run();
  return json({ ok: true });
}

async function probar(body) {
  if (!body || typeof body.token !== 'string') {
    return json({ error: 'falta el token' }, 400);
  }
  await sendExpoPush([
    {
      to: body.token,
      title: 'Notificación de prueba',
      body: 'Esto es una prueba. Los avisos de EasyWeather funcionan correctamente.',
      sound: 'default',
    },
  ]);
  return json({ ok: true });
}

// Compatibilidad con builds antiguas (solo umbral de temperatura).
async function registrarCompat(body, env) {
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
  await env.DB.batch([
    env.DB
      .prepare(
        `INSERT INTO dispositivos (token, lat, lon, zona_horaria, updated_at) VALUES (?1, ?2, ?3, NULL, ?4)
         ON CONFLICT(token) DO UPDATE SET lat = ?2, lon = ?3, updated_at = ?4`,
      )
      .bind(body.token, body.lat, body.lon, Date.now()),
    env.DB
      .prepare(
        `INSERT INTO umbrales (token, max_threshold, min_threshold) VALUES (?1, ?2, ?3)
         ON CONFLICT(token) DO UPDATE SET max_threshold = ?2, min_threshold = ?3`,
      )
      .bind(body.token, body.maxThreshold, body.minThreshold),
  ]);
  return json({ ok: true });
}

async function desregistrarCompat(body, env) {
  if (body && typeof body.token === 'string') {
    await env.DB.prepare('DELETE FROM umbrales WHERE token = ?1').bind(body.token).run();
    const { results } = await env.DB.prepare('SELECT 1 FROM resumenes WHERE token = ?1 LIMIT 1')
      .bind(body.token)
      .all();
    if (!results || results.length === 0) {
      await env.DB.prepare('DELETE FROM dispositivos WHERE token = ?1').bind(body.token).run();
    }
  }
  return json({ ok: true });
}

// --- Cron ---

async function comprobarUmbrales(env) {
  const { results } = await env.DB.prepare(
    `SELECT u.token, u.max_threshold, u.min_threshold, u.last_above, u.last_below,
            d.lat, d.lon, d.nombre
     FROM umbrales u JOIN dispositivos d ON d.token = u.token`,
  ).all();
  const mensajes = [];

  for (const dev of results ?? []) {
    if (typeof dev.lat !== 'number' || typeof dev.lon !== 'number') {
      continue;
    }
    let temperatura;
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${dev.lat}&longitude=${dev.lon}&current=temperature_2m`,
      );
      const data = await response.json();
      temperatura = data && data.current ? data.current.temperature_2m : undefined;
    } catch {
      continue;
    }
    if (typeof temperatura !== 'number') {
      continue;
    }

    const above = temperatura >= dev.max_threshold ? 1 : 0;
    const below = temperatura <= dev.min_threshold ? 1 : 0;
    // Con nombre reportado se dice la ciudad; sin el, el generico "en tu ubicacion".
    const lugar = dev.nombre ? `en ${dev.nombre}` : 'en tu ubicación';

    if (above === 1 && dev.last_above === 0) {
      mensajes.push({
        to: dev.token,
        title: 'Aviso de temperatura',
        body: `Ahora ${lugar} se alcanzan ${Math.round(temperatura)} grados, por encima de tu aviso de ${Math.round(dev.max_threshold)} grados.`,
        sound: 'default',
      });
    }
    if (below === 1 && dev.last_below === 0) {
      mensajes.push({
        to: dev.token,
        title: 'Aviso de temperatura',
        body: `Ahora ${lugar} se baja a ${Math.round(temperatura)} grados, por debajo de tu aviso de ${Math.round(dev.min_threshold)} grados.`,
        sound: 'default',
      });
    }

    await env.DB.prepare('UPDATE umbrales SET last_above = ?1, last_below = ?2 WHERE token = ?3')
      .bind(above, below, dev.token)
      .run();
  }

  await sendExpoPush(mensajes);
}

async function enviarResumenes(env) {
  const { results } = await env.DB.prepare(
    `SELECT r.token, r.id, r.hora, r.minuto, r.campos, r.seguir_ubicacion,
            r.lat AS r_lat, r.lon AS r_lon, r.nombre, r.ultimo_envio,
            d.lat AS d_lat, d.lon AS d_lon, d.nombre AS d_nombre, d.zona_horaria
     FROM resumenes r JOIN dispositivos d ON d.token = r.token`,
  ).all();
  const mensajes = [];

  for (const r of results ?? []) {
    const { minutos, fecha } = horaLocal(r.zona_horaria);
    if (r.ultimo_envio === fecha) {
      continue; // ya enviado hoy
    }
    const due = r.hora * 60 + r.minuto;
    if (minutos < due || minutos - due >= VENTANA_RESUMEN_MIN) {
      continue; // aun no es la hora, o ya paso hace rato
    }

    const lat = r.seguir_ubicacion ? r.d_lat : r.r_lat;
    const lon = r.seguir_ubicacion ? r.d_lon : r.r_lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      continue; // sin ubicacion todavia
    }

    let forecast;
    try {
      forecast = await getForecast(lat, lon);
    } catch {
      continue;
    }
    const day = forecast && forecast.days ? forecast.days[0] : undefined;
    if (!day) {
      continue;
    }

    let campos = [];
    try {
      campos = JSON.parse(r.campos);
    } catch {
      campos = [];
    }

    mensajes.push({
      to: r.token,
      // Si el aviso sigue la ubicacion viva, se titula con el nombre del sitio que reporto el
      // telefono; mientras no haya nombre (dispositivo antiguo o primer arranque) cae en el generico.
      title: r.seguir_ubicacion
        ? r.d_nombre
          ? `El tiempo en ${r.d_nombre}`
          : 'El tiempo en tu ubicación'
        : `El tiempo en ${r.nombre}`,
      body: cuerpoResumen(day, campos),
      sound: 'default',
    });
    // Se marca ya como enviado hoy para no duplicar en el siguiente tick del cron.
    await env.DB.prepare('UPDATE resumenes SET ultimo_envio = ?1 WHERE token = ?2 AND id = ?3')
      .bind(fecha, r.token, r.id)
      .run();
  }

  await sendExpoPush(mensajes);
}

// --- Auxiliares ---

// Mismo texto que la app: cielo + los campos elegidos (usa buildDayDetails compartido).
function cuerpoResumen(day, campos) {
  const info = describeWeatherCode(day.weatherCode);
  const detalles = buildDayDetails(day)
    .filter((linea) => campos.includes(linea.title))
    .map((linea) => `${linea.title}: ${linea.spoken}`);
  return [info.label, ...detalles].join('. ');
}

// Hora local (minutos del dia) y fecha YYYY-MM-DD en la zona horaria dada. El worker corre en UTC,
// asi que se usa Intl con la zona del dispositivo. Zona invalida o ausente -> UTC.
function horaLocal(tz) {
  try {
    const partes = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz || 'UTC',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(new Date());
    const val = (t) => partes.find((p) => p.type === t)?.value;
    let hora = Number(val('hour'));
    if (hora === 24) {
      hora = 0; // algunos entornos dan 24 a medianoche
    }
    const minuto = Number(val('minute'));
    return { minutos: hora * 60 + minuto, fecha: `${val('year')}-${val('month')}-${val('day')}` };
  } catch {
    const ahora = new Date();
    return {
      minutos: ahora.getUTCHours() * 60 + ahora.getUTCMinutes(),
      fecha: ahora.toISOString().slice(0, 10),
    };
  }
}

async function sendExpoPush(messages) {
  // Expo acepta hasta 100 mensajes por peticion.
  for (let i = 0; i < messages.length; i += 100) {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(messages.slice(i, i + 100)),
    });
  }
}
