// Novedades que se muestran al usuario tras aplicar una actualizacion por aire.
//
// IMPORTANTE: actualizar esta lista en CADA `eas update`. El `--message` de
// `eas update` NO llega al dispositivo; lo unico que ve el usuario como "que hay de
// nuevo" es este texto, que viaja dentro del propio bundle. Si no se actualiza, la
// pantalla de novedades miente sobre lo que se acaba de instalar.
// Ver comun/docs/GUIA-ENTORNO-IOS.md ("Avisar al usuario y actualizar en caliente").
export const NOVEDADES: string[] = [
  'La app respeta el modo claro u oscuro que tengas configurado en el iPhone, y cambia con él.',
  'En Hoy, cada lugar es ahora una página. Tras el título hay un control de páginas: desliza arriba o abajo para cambiar de lugar, o pasa página con tres dedos a izquierda y derecha. Ya no hay botones de más y menos.',
  'En Mis lugares, para quitar un lugar se desliza la fila a izquierda o derecha. Con VoiceOver sigue estando en el rotor de acciones, como hasta ahora.',
  'La pestaña Buscar desaparece: ahora se añaden lugares con el botón Añadir lugar de Mis lugares. Quedan tres pestañas.',
  'Al añadir un lugar, el botón Guardar ya se encuentra con VoiceOver haciendo flick, sin tener que usar el rotor de acciones.',
  'La app pide el permiso de ubicación al abrirla por primera vez, en vez de esperar a que busques algo o configures un aviso.',
  'Arreglado de verdad: al cambiar de lugar en Hoy con VoiceOver, el resto de la pantalla ya es el del lugar elegido y no el del primero de la lista.',
  'Al buscar un lugar, el campo tiene ahora un botón Listo que cierra el teclado. Con el teclado abierto, iOS se come el primer toque sobre los resultados; cerrándolo antes, todo responde a la primera. Al guardar, la pantalla se cierra sola.',
  'Cuando la búsqueda devuelve varios sitios con el mismo nombre, cada uno indica ahora el dato que lo diferencia (provincia, comarca o país) en vez de repetirse.',
  'Al consultar la previsión de un lugar buscado, ya no te lleva a Hoy sin salida: se abre encima de la búsqueda, con botón Atrás y con la opción de guardarlo.',
  'Arreglado: al tocar un resultado de la búsqueda, la previsión no llegaba a aparecer y la pantalla se quedaba sin responder hasta cerrar la app. Ahora se abre, y el botón Atrás devuelve a la búsqueda con sus resultados para poder consultar otro lugar.',
  'En la búsqueda ya no hace falta cerrar el teclado antes de elegir: los resultados responden al primer doble toque aunque el teclado siga abierto. El botón Listo sigue estando para quitarlo de en medio.',
  'Los resultados de la búsqueda salen ordenados: primero los de tu país, del más cercano al más lejano, y después el resto. Buscando Mérida desde España, la de Extremadura ya no queda detrás de las de México y Venezuela. Además cada resultado dice ahora el país al que pertenece.',
];
