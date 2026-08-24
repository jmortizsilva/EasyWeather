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
export const NOVEDADES: string[] = [
  'Las pantallas de Avisos llevan ahora el botón "Atrás" arriba a la izquierda, el primero de todos, en vez del "Listo" de la derecha. También funciona el gesto de rascar con dos dedos.',
  'El selector de lugares de la pantalla Hoy se llama "Selector de ubicación", y la página de la ubicación actual se anuncia como "Mi ubicación" antes del nombre del sitio.',
  'En Avisos ya se dice "Activado" y "Desactivado", las mismas palabras que usan los interruptores, en vez de "encendido" y "apagado".',
  'Al elegir nivel de aviso o lugar, VoiceOver ya no repite "seleccionado" dos veces.',
];
