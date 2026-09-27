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
// Esto es texto que se LEE EN VOZ ALTA: el Alert de novedades lo recita VoiceOver. Por eso va con
// tildes y eñes, al contrario que los comentarios y los identificadores del proyecto. Sin ellas,
// VoiceOver dice "pestanas" y "Espana", que no son palabras.
export const NOVEDADES: string[] = [
  'Arreglado: con iOS 27, VoiceOver daba por seleccionadas varias pestañas a la vez, no solo la abierta. La barra de pestañas se ha rehecho por dentro para arreglarlo; los iconos son los de siempre.',
  'Arreglado: al llegar de un viaje, la temperatura medida podía seguir siendo la del sitio anterior durante unos minutos. Ahora se actualiza en cuanto cambias de zona.',
  'La línea del sol dice ahora cuántas horas de luz tiene el día, además de a qué hora amanece y anochece.',
  'Arreglado: había pueblos de España que no salían al buscarlos, como Badia del Vallès. La app lleva ahora dentro los 8.132 municipios del INE, así que los encuentra todos, incluso sin cobertura.',
  'Los pueblos salen ahora con su nombre oficial: Begues y no «Begas», Sant Quirze del Vallès y no «San Quirico de Tarrasa», Errenteria y no «Rentería».',
  'Arreglado: en América, la fecha de cada día salía con un día de retraso, tanto en la lista de días como en el detalle con la vista hora a hora. Los datos siempre fueron los del día correcto; lo que estaba mal era la fecha escrita.',
  'Arreglado: con VoiceOver, al recorrer la previsión de un lugar buscado había una parada en blanco que no decía nada, entre el último día y el enlace a Open-Meteo.',
];
