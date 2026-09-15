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
  'La barra de pestanas se ha rehecho por dentro, con los iconos de siempre. Era la unica forma de arreglar que VoiceOver dejase varias pestanas dichas como "seleccionada" en iOS 27. Comprueba que solo lo dice la pestana en la que estas, que los iconos se ven bien y que al elegir un lugar en Mis lugares se salta a Hoy.',
];
