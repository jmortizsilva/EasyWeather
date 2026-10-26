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
// Ultima vez que se vacio: build de produccion de la 1.2.0, el 2026-10-26 (la del widget). Lo que
// habia (elegir estacion, «Guardar este sitio», arreglos de VoiceOver) lo cuentan ya las novedades
// de la Store de la 1.2.0.
//
// EXCEPCION del 2026-09-28, con la build de BETA (canal `beta`): esta vez NO se vacia. Esa regla se
// escribio cuando habia un solo canal, y ahora hay dos: los probadores reciben la beta con esto ya
// dentro, pero los usuarios de la Store siguen con la build 19, y cuando se les publique este
// JavaScript por aire tienen que enterarse de lo que trae. Vaciarlo ahora les dejaria sin las notas
// a ellos para ahorrarle a un probador leer algo que ya tiene. El coste, aceptado: en el primer
// update sobre la beta, los probadores oiran novedades que ya estaban en su binario.
// Esto es texto que se LEE EN VOZ ALTA: el Alert de novedades lo recita VoiceOver. Por eso va con
// tildes y eñes, al contrario que los comentarios y los identificadores del proyecto. Sin ellas,
// VoiceOver dice "pestanas" y "Espana", que no son palabras.
// Recortada el 2026-09-27 a la lista de ESTE update, y no es la regla general: las seis entradas
// anteriores (pestañas, medición pegada al sitio anterior, horas de luz, municipios del INE, nombres
// oficiales y la fecha atrasada en América) se anunciaron en el update de las 20:25 de ese mismo día,
// y ocho cosas de golpe en un solo Alert se hacen largas de oír. El coste, aceptado a sabiendas:
// quien no llegase a aplicar aquel update no se enterará de esas seis.
// Las dos primeras ya se publicaron el 2026-09-27; se quedan porque este fichero solo se vacía al
// lanzar una build, y quien no llegara a aplicar aquel update tiene que enterarse igual.
export const NOVEDADES: string[] = [];
