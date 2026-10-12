# Revisión de texto grande del 2026-10-10

Segunda revisión visual, centrada en lo que pasa al subir el tamaño de letra. La pidió Jose porque
«se ocultan cosas y se descolocan», y tenía razón: la revisión del 6 de octubre solo había mirado
la primera pantalla de cada vista, y casi todo lo roto está más abajo.

**Con qué**: simulador iPhone 16 Pro con iOS 18.2 (402 × 874 puntos), build de desarrollo local
del commit `c53d27d` más los cambios del puente de este mismo día. El tamaño se puso con
`xcrun simctl ui booted content_size …` y se comprobó con el servicio `entorno` antes de cada
tanda. El iPhone de verdad tiene iOS 27: lo que dibuja el sistema (la barra de pestañas) puede
cambiar; la colocación del texto la decide la app y es la misma.

**Tamaños**: `large` (1, el de serie), `extra-extra-extra-large` (1,353, el mayor sin entrar en
accesibilidad), `accessibility-medium` (1,786), `accessibility-extra-large` (2,643) y
`accessibility-extra-extra-extra-large` (3,571, el máximo).

**Cómo se vio lo de abajo**: con dos servicios nuevos del puente, `paginaCompleta` (captura una
zona desplazable entera) y `desplazar` (la lleva a una altura). Ver
[REVISAR-ACCESIBILIDAD.md](REVISAR-ACCESIBILIDAD.md#lo-que-queda-por-debajo-de-la-pantalla).

---

## Lo que está roto

Ordenado por gravedad: primero lo que **esconde información**, luego lo que la hace ilegible, luego
lo que solo estorba.

### 1. Se pierden datos por la derecha

- **Próximos días** (`DayRowContent.tsx`): la fila pone en una línea el icono, «11,8° / 23,6°» y
  «💧 0%», sin poder partirse. Desde 2,643 **la probabilidad de lluvia desaparece**: solo se ve la
  gota. Al máximo se corta también la temperatura máxima: «11,8° / 23,6» y nada más.
- **Por horas, en la ficha del día** (`DayDetailModal.tsx`): la hora y la temperatura tienen un
  **ancho fijo de 64 puntos** y una sola línea. Con letra grande salen «3…» y «1…», y el viento se
  sale por la derecha («Viento 2,3 del nor»). Es exactamente el «ancho calculado a ojo» que la
  revisión del 7 de octubre buscaba con la negrita y no encontró, porque no miró la ficha del día.

Comprobados los dos con capturas normales del simulador, no solo con la de página entera.

### 2. Las filas de dato se leen letra a letra

En «Hoy» (`PrevisionLugar.tsx`, `detailRow`) y en el resumen de la ficha del día, cada fila pone
el nombre («Temperatura») y el valor («mínima 8,8°, máxima 24,2°») **uno al lado del otro**. El
nombre no encoge y el valor sí, así que el valor se queda con lo que sobra. A 1,353 aún se lee
bien; desde 1,786 el valor va en una columna estrecha y desde 2,643 **en una columna de una letra**:
«m / í / n / i / m / a / 8 / , / 8 / °», de arriba abajo, durante una pantalla entera. En algún
caso el valor ni aparece («Salida y puesta de la luna» sin nada al lado).

### 3. Cabeceras fijas que se comen la pantalla

- **La ficha del día**: el título («Domingo, 11 de octubre») y «Cerrar» están **fuera** del
  `ScrollView`. Con letra grande el título ocupa media hoja («Domin / go, 11 / de / octubr / e») y
  lo que se desplaza se queda con la otra media. Es el mismo fallo que se arregló el 6 de octubre
  en la cabecera de «Hoy», en otra pantalla.
- **Buscar**: el título y «Cerrar» comparten fila, y «Cerrar» se queda con el ancho: «Bu / sc / ar».

### 4. El campo de búsqueda encoge cuando la letra crece

El campo y «Listo» van en la misma fila. «Listo» crece con la letra y el campo encoge: al máximo,
el texto de dentro sale **más pequeño** que con la letra de serie, y cortado («Busca una ciudad o
pue…»). Es justo lo contrario de lo que pidió quien subió la letra.

### 5. Palabras partidas en los títulos

Desde 2,643: «Carabanch / el», «tempera / tura», «Aviso de temperatu / ra» (en la fila del
interruptor); al máximo, «lugare / s», «resum / en», «oficial / es», «Desactivado / s».

El 6 de octubre se dio por bueno porque «se lee». Ahora pasa ya a 2,643, no solo en el extremo, y
en todas las pantallas. Decidido con Jose el mismo día: ver más abajo.

---

## Lo arreglado el mismo día

Aprobado por Jose del 1 al 4. Todo cambia **solo con la letra grande** (desde ×1,5, entre el mayor
tamaño normal y el primero de accesibilidad: `src/theme/letraGrande.ts`, con su prueba); con la
letra de serie las pantallas quedan como estaban, comprobado con capturas. **El orden de VoiceOver
no cambia en ninguna**: lo que iba en fila pasa a columna en el mismo orden.

- **Próximos días**: la fila puede partirse; la lluvia baja a su línea.
- **Por horas**: sin anchos fijos ni recorte; hora, icono y temperatura arriba, lluvia y viento
  debajo. Comprobado con captura normal: «4:00», «13,4°», «Lluvia 0%», «Viento 1,8 km/h del norte».
- **Filas de dato** (en «Hoy» y en la ficha del día): nombre arriba, valor debajo, a la izquierda.
- **Ficha del día**: la cabecera entera entra en el desplazamiento, con «Cerrar» debajo del título.
  Se propuso dejar «Cerrar» fijo arriba y se descartó: VoiceOver lo habría encontrado antes que el
  título, y el orden de siempre es título, cielo, Cerrar.
- **Buscar**: título, «Cerrar», campo a todo el ancho, «Listo» y «Borrar», uno debajo de otro.

**Lo que NO quedó arreglado del punto 4**: el campo ya no encoge de ancho, pero **su texto sigue
saliendo pequeño** con la letra grande (unos 14 puntos al máximo, contra 61 del resto), y el campo
apenas crece en alto. React Native no lo encoge a propósito (no hay `adjustsFontSizeToFitWidth` en
su fuente, buscado); la causa está sin encontrar.

**Encontrada el 2026-10-12**, con los comentarios de la beta 22: lo pequeño es el **texto de
ejemplo**, no lo que se escribe. Con «Madrid» de valor inicial, el texto sale del tamaño del resto;
con el campo vacío, «Busca una ciudad o pueblo» sale justo del ancho del campo. React Native le da
la misma letra que al texto escrito (`_placeholderTextAttributes` en `RCTUITextField.mm`); lo encoge
iOS para que quepa en una línea. Lo de los 14 puntos de arriba era el texto de ejemplo. Arreglo: con
la letra grande, el texto de ejemplo es «Ciudad o pueblo», que cabe casi al tamaño del resto. Se
probó sacarlo encima del campo y se descartó: partido en tres líneas, empujaba el campo por debajo
del teclado. Lo tecleado de verdad no se ha probado: el simulador no recibe teclas desde la terminal.

**Y la ficha de un lugar sin guardar** (`VistaPreviaLugar`), que no se miró en esta tanda, tenía el
mismo fallo que «Buscar»: con el título de 28 puntos al lado de «Atrás», «Madrid» salía como
«Ma / dri / d» (beta 22). Mismo arreglo: columna con la letra grande y `TOPE_TITULO`. Se llega a
ella con la acción `abrirPrevision` del puente.

**Los títulos** (punto 5): tope de ×1,75 en los títulos de pantalla de 34 puntos («Hoy», «Mis
lugares», «Buscar», «Avisos» y las secciones de avisos), con la constante `TOPE_TITULO` de
`src/theme/letraGrande.ts`. «Hoy» ya tenía ×2, y con ×2 se partía «Carabanch / el». Se probaron
×2, ×1,75 y ×1,5: ×1,75 es el mayor con el que las palabras caben enteras, y deja el título en unos
60 puntos, a la par del texto normal al máximo (unos 61). Con ×1,5 cabría lo mismo, pero el título
quedaría más pequeño que lo que encabeza. Comprobado al máximo con capturas: «Carabanchel, /
Madrid», «Buscar», «Mis lugares», «Aviso de / temperatura».

Sin tope, a propósito: los títulos de 22 puntos de las fichas (el día, la estación, los avisos del
lugar), que ya se desplazan con el contenido, y las filas de texto normal que parten palabra
(«Desactivado / s»), porque el tope solo se pone donde el texto es un título. El título de la vista
previa de un lugar (28 puntos) se queda como estaba: no se miró en esta tanda.

## Lo que está bien

- **Al tamaño 1,353 no hay nada roto** en ninguna pantalla. Los fallos empiezan en los tamaños de
  accesibilidad.
- Los textos largos (las explicaciones de «Avisos», «Avisos oficiales», «Aviso de temperatura»)
  parten bien y se desplazan.
- «Mis lugares» se reorganiza bien; solo el título parte palabra.
- El número grande de «Hoy» («24, / 1°») sigue como se decidió el 7 de octubre: sin tope.

## Lo que esta revisión NO cubre

- **La ventana de estaciones**: en el simulador no se abre (no hay estación de AEMET para la
  posición fijada, o la acción no llega). Sin mirar.
- **Los avisos del lugar** (`AvisosModal`): solo aparece con avisos activos.
- **Modo oscuro, negrita y contraste**: esta tanda fue solo de tamaño.
- **Lo que dice VoiceOver**, que no cambia con nada de esto: todas las filas rotas llevan su
  `accessibilityLabel` completo, y por eso nadie con lector lo habría notado. Es la misma clase de
  fallo que la fila elegida del 6 de octubre.

## Un aviso sobre la captura de página entera

`paginaCompleta` usa `renderInContext`, porque el método normal falla con zonas altas. Ese método
**se deja cosas**: los botones azules salen sin texto, el campo de búsqueda vacío, la fila elegida
de «Mis lugares» en blanco y las tarjetas por horas vacías. Todo eso se comprobó con capturas
normales y está bien dibujado. **Lo que salga raro en una captura de página entera se confirma con
`desplazar` y una captura normal antes de darlo por fallo.**
