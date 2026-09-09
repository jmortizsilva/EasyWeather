// Novedades que se muestran al usuario tras aplicar una actualizacion por aire.
//
// IMPORTANTE: actualizar esta lista en CADA `eas update`. El `--message` de
// `eas update` NO llega al dispositivo; lo unico que ve el usuario como "que hay de
// nuevo" es este texto, que viaja dentro del propio bundle. Si no se actualiza, la
// pantalla de novedades miente sobre lo que se acaba de instalar.
// Ver comun/docs/GUIA-ENTORNO-IOS.md ("Avisar al usuario y actualizar en caliente").
//
// Se VACIA al lanzar una build: lo que va dentro del binario ya lo cuentan las notas de
// TestFlight, y esta pantalla solo aparece tras un update por aire. Si no se vaciara, el
// primer update sobre la build repetiria cosas que el usuario ya tiene instaladas.
// Ultima vez que se vacio: build 19 de produccion del 2026-09-09 (la que lleva AEMET).
export const NOVEDADES: string[] = [
  'Arreglado: al llegar de un viaje, la temperatura medida podia seguir siendo la del sitio anterior durante unos minutos. Ahora se actualiza en cuanto cambias de zona.',
  'La linea del sol dice ahora cuantas horas de luz tiene el dia, ademas de a que hora amanece y anochece.',
];
