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
// Ultima vez que se vacio: build de produccion con runtimeVersion 1.4.0.
export const NOVEDADES: string[] = [];
