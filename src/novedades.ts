// Novedades que se muestran al usuario tras aplicar una actualizacion por aire.
//
// IMPORTANTE: actualizar esta lista en CADA `eas update`. El `--message` de
// `eas update` NO llega al dispositivo; lo unico que ve el usuario como "que hay de
// nuevo" es este texto, que viaja dentro del propio bundle. Si no se actualiza, la
// pantalla de novedades miente sobre lo que se acaba de instalar.
// Ver comun/docs/GUIA-ENTORNO-IOS.md ("Avisar al usuario y actualizar en caliente").
export const NOVEDADES: string[] = [
  'En Mis lugares ahora se lee la temperatura actual de cada lugar.',
  'En Hoy hay un ajustable tras el título: desliza arriba y abajo para recorrer tus lugares y toca dos veces para ver la previsión del que elijas.',
];
