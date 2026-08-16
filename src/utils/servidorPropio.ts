// Datos de conexion con el servidor propio (Node/Fastify, multi-app) que hay tras api.jmortiz.es.
// Estaban dentro de push.ts; se sacan aqui porque ahora los usan dos modulos: los avisos (push) y
// las observaciones medidas de AEMET.
//
// La clave llega por la variable de entorno EXPO_PUBLIC_APP_KEY: se incrusta en el bundle al
// publicar (eas update/build con --environment production) pero NO se sube al repositorio, que es
// publico. Sin ella, el servidor responde 401 y todo lo que dependa de el se queda sin datos.

const SERVER_URL = 'https://api.jmortiz.es';
const APP_ID = 'easyweather';
const APP_KEY = process.env.EXPO_PUBLIC_APP_KEY ?? '';

/** URL completa de una ruta de esta app en el servidor. */
export function endpoint(ruta: string): string {
  return `${SERVER_URL}/apps/${APP_ID}/${ruta}`;
}

/** Cabeceras con la clave de la app. Para GET sobra el content-type, pero no molesta. */
export function cabeceras(): Record<string, string> {
  return { 'content-type': 'application/json', 'x-app-key': APP_KEY };
}
