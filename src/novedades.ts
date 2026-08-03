// Novedades que se muestran al usuario tras aplicar una actualizacion por aire.
//
// IMPORTANTE: actualizar esta lista en CADA `eas update`. El `--message` de
// `eas update` NO llega al dispositivo; lo unico que ve el usuario como "que hay de
// nuevo" es este texto, que viaja dentro del propio bundle. Si no se actualiza, la
// pantalla de novedades miente sobre lo que se acaba de instalar.
// Ver comun/docs/GUIA-ENTORNO-IOS.md ("Avisar al usuario y actualizar en caliente").
export const NOVEDADES: string[] = [
  'Los avisos ahora te siguen: el resumen y el aviso de temperatura te llegan del tiempo del sitio donde estás, aunque no tengas la app abierta.',
  'El resumen llega a la hora que elijas, de tu ubicación actual o de una ciudad concreta.',
  'Nuevo botón "Cancelar" en la búsqueda, con tecla "Buscar" en el teclado.',
];
