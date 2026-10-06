# Revisión de accesibilidad del 2026-10-06

Primera revisión visual de EasyWeather hecha con el puente. Cómo se repite, en
[REVISAR-ACCESIBILIDAD.md](REVISAR-ACCESIBILIDAD.md).

**Qué se miró**: las 9 pantallas y estados de `pantallas.txt`, en tres condiciones: normal claro,
texto máximo claro y texto máximo oscuro. El máximo es `AccessibilityExtraExtraExtraLarge`, que
multiplica por **3,571** (medido con el servicio `entorno`, no supuesto), sobre una ventana de
402 × 874 puntos.

**Con qué**: build de desarrollo `7f254415` (commit `cd8511c`) en un iPhone real.

---

## Lo que se encontró y se arregló

### 1. Subir el tamaño de letra con la app abierta la dejaba ilegible

**Lo peor de la revisión.** Con la app en primer plano, cambiar el tamaño del sistema rompía las tres
pestañas: el texto se dibujaba grande pero las cajas conservaban la medida vieja, y las letras
salían cortadas por la mitad. No era un fotograma a medio dibujar: tres capturas seguidas, con
cuatro segundos entre ellas, salían idénticas byte a byte. Relanzando la app, la misma pantalla
salía perfecta.

React Native 0.86.2 sí tiene el mecanismo (`RCTFabricSurface.mm:71` recoloca la superficie, la caché
de medidas lleva el multiplicador en la clave, `RCTDeviceInfo.mm:245` avisa a JavaScript). Quien no
escucha ese cambio es **react-native-screens 4.26.2**, que hospeda estas pantallas en un
`UITabBarController` nativo. Es el sospechoso; no está probado.

**Arreglado** en `6a46687`: el `fontScale` como `key` de `Navegacion` fuerza a montar de nuevo, y
montar de nuevo obliga a medir. Comprobado en vivo en los dos sentidos, sin relanzar.

### 2. La cabecera de «Hoy» se comía la pantalla entera

Con la letra al máximo no se veía nada del tiempo: solo el título y un hueco. La cabecera de «Hoy»
es **fija** (no se desliza con las páginas), así que crece sin tope y deja al paginador sin sitio.

Medido con el servicio `medidas`:

| | Antes | Después |
|---|---|---|
| Cabecera | 850,67 de 874 | 288 |
| Título | 724,67 | 162 |
| Control de páginas | 44 | 44 |

El control de páginas medía 44 clavados: era mi sospechoso y no tenía nada que ver. Los 724 del
título cuadran: 34 puntos × 3,571 = 121 por línea, y «Carabanchel, Madrid» ocupaba seis.

**Arreglado** en `5922959` con `maxFontSizeMultiplier` en el título, que es lo que hace Apple con sus
títulos grandes. **El precio, decidido a propósito**: a quien pida el tamaño máximo, ese texto
concreto le queda por debajo de lo que pidió. Se limita solo el título de «Hoy».

---

## Lo que se miró y se deja como está

- **Los títulos de «Mis lugares», «Avisos», «Buscar» y las hojas también ocupan media pantalla** con
  la letra al máximo, pero ahí **están dentro del `ScrollView`** (`PlacesScreen.tsx:107-111`,
  `AvisosIndexScreen.tsx:83-89`, `SearchScreen.tsx:97-111`): se deslizan y el contenido se alcanza.
  Cuesta un gesto, no deja a nadie fuera. Limitarlos sería quitarle tamaño a quien lo pidió sin
  arreglar nada roto.
- **Palabras partidas a la mitad** («Aviso de tempe / ratura», «temperatur / a»). A 121 puntos la
  palabra no cabe en una línea de 370; iOS hace lo mismo. Se lee.
- **El número grande se parte en dos** («17,» y «9º»): 54 puntos × 3,571 = 193. Se lee y se
  desplaza. Es la misma decisión que la del título y está sin tomar.
- **Modo oscuro: nada que señalar.** Ningún color fijo que no cambie, ningún texto oscuro sobre
  fondo oscuro, la barra de pestañas se adapta sola (es el material del sistema).

## Lo que esta revisión NO cubre

- **El final del desplazamiento.** La barra de pestañas flota sobre el contenido, que es lo normal en
  iOS 26 a media lista, pero no se ha podido fotografiar si la última fila despeja la barra:
  `pantallas.txt` no sabe decir «desplazado hasta abajo».
- **Las cinco condiciones restantes**: contraste aumentado, negrita, formas de botón, reducir
  transparencia y diferenciar sin color.
- **El contraste calculado.** Se ha mirado, no medido con la fórmula de WCAG.
- **Qué dice VoiceOver.** El servicio `rastro` sigue vacío: falta llamar a `anotarSuceso` desde las
  funciones que anuncian y mueven el foco. Eso es trabajo aparte.
- **Los diálogos del sistema** (permisos), que la captura puede no recoger.

## Un aviso sobre las capturas

Las tandas `texto-grande` (19:35) y `grande-oscuro` (20:14) **no valen como evidencia**: la primera
retrató el fallo de medida y la segunda es anterior al tope del título. La buena es **`ax5-oscuro`**
(22:20), con los dos arreglos puestos. Las capturas viven en
`comun/herramientas/puente/servidor/recibido`, que git ignora.
