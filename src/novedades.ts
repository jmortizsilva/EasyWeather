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
  'La pestaña Avisos está ahora en dos niveles: una lista con las tres cosas y una pantalla para cada una, con su estado escrito en la propia fila.',
  'En los avisos oficiales puedes elegir de qué fenómenos quieres que te avisemos. Vienen todos encendidos y se apagan uno a uno.',
  'Apagar un fenómeno solo silencia la notificación: si AEMET avisa de él, lo sigues viendo en la pantalla del lugar.',
  'Los niveles de aviso ya se leen bien: antes VoiceOver decía "radio button" en inglés.',
];
