# Lo que EasyWeather todavía no hace

Este fichero es para lo que **no** existe. [FUENTES-DE-DATOS.md](FUENTES-DE-DATOS.md) documenta lo
que ya funciona; aquí se apunta lo decidido pero no hecho, con la razón por la que se quiere y las
preguntas que hay que contestar antes de escribir una línea.

Que esté aquí no significa que se vaya a hacer, ni en este orden. Significa que no se pierde.

---


## Los sitios que no son municipios, y guardar donde estás

**Estado: causa localizada y comprobada el 2026-09-28. Sin arreglar.** Son dos peticiones del mismo
usuario, y la segunda resuelve la primera por otro camino.

**El síntoma.** Alguien de **Els Reguers** (Tortosa, Baix Ebre) cuenta que buscando su pueblo no
sale nada para poder añadirlo, pero que la app **sí lo llama «Els Reguers»** cuando es su ubicación.

**Por qué sale como ubicación**: ese nombre no viene de la búsqueda, viene de la **geocodificación
inversa de Apple** (`nombreUbicacion`, en `src/utils/geocode.ts`), que conoce entidades por debajo
del municipio. Son dos fuentes distintas para dos cosas distintas, y por eso una sabe el nombre y la
otra no.

**Por qué no sale al buscar**, que son dos agujeros a la vez:

1. **En la lista del INE no está, y está bien que no esté**: son los 8.132 **municipios**, y Els
   Reguers es una **EMD** (entidad municipal descentralizada) de Tortosa, no un municipio.
2. **En Open-Meteo sí está, pero con otro nombre.** Es el registro de GeoNames **3112090**, llamado
   **«Regués»**, clase P/PPL, admin4 `43155` —que es justo el código INE de Tortosa que tenemos en
   nuestra lista—, en 40.83866, 0.44892, **sin un solo nombre alternativo** y sin tocar desde 2011.
   Comprobado el 2026-09-28 contra la API: «Regues» lo devuelve; «Els Reguers» y «Reguers», nada.

O sea, el mismo mal que «Begas» por Begues, pero peor: allí el exónimo viejo al menos se parecía al
nombre real, y aquí no hay forma humana de acertar.

**Lo que NO lo arregla**: ampliar nuestra lista del INE. Habría que bajar al **nomenclátor de
entidades singulares**, que son del orden de 60.000 entradas frente a 8.132, y eso es otro tamaño de
fichero, otro tiempo de búsqueda y otra decisión.

**Lo que sí se puede hacer aguas arriba, y es barato**: en GeoNames los nombres alternativos los
puede añadir cualquiera con cuenta. Añadir «Els Reguers» como alternativo de 3112090 lo arreglaría
para Open-Meteo y para todo el que use esos datos. Es una acción distinta del informe de los 405
municipios: aquello es un filtro de Open-Meteo, esto es un dato de GeoNames.

### Guardar en Mis lugares el sitio donde estás

Es la otra mitad de lo que pide el usuario y, de paso, **la salida para cualquier sitio que ninguna
fuente sepa nombrar**: si estás allí, el teléfono ya sabe dónde estás y cómo se llama. Hoy «Mi
ubicación» te sigue, así que en cuanto te vas, ese sitio se pierde.

- `addPlace` ya acepta cualquier `Place`, así que el trabajo es de pantalla, no de estado.
- **El id**: puede seguir el patrón que Open-Meteo ya usa cuando no tiene el suyo (`lat,lon`), algo
  como `punto:40.8387,0.4489`. No puede ser `CURRENT_LOCATION_ID`, que es el que se mueve.
- **El nombre** lo pone Apple, que es justo el que el usuario reconoce.
- A decidir: si se deja renombrar, qué hacer si guardas dos veces el mismo sitio con 200 m de
  diferencia, y cómo se dice que ese punto **se queda quieto** y no te sigue.
- Es JavaScript puro: **entra por aire**.

---

## Widget de pantalla de inicio

**Estado: pendiente, sin empezar.**

Ver la temperatura y el aviso oficial sin abrir la app. Es lo que más se usa de una app del tiempo,
y hoy obliga a entrar.

**Va en su propia rama y necesita una build nueva**, de perfil `preview`. Esto no es un detalle de
proceso: un widget de iOS es una **extensión nativa** (WidgetKit, un target aparte en Xcode), así
que **no puede entregarse por aire**. Todo lo que hemos publicado hasta hoy con `eas update` iba
dentro del bundle de JavaScript; esto no. Cada prueba cuesta una compilación en la nube.

Lo que hay que decidir **antes** de empezar, porque cambia la configuración nativa:

- **Cómo se declara la extensión.** En un proyecto de Expo hace falta un config plugin, y eso es una
  dependencia nueva: se propone, se aprueba y entonces se instala.
- **Cómo llega el dato al widget.** Un widget no ejecuta la app: lee lo que la app le haya dejado
  escrito, en un **App Group** compartido. Hay que decidir qué se guarda ahí y cuándo, y aceptar que
  el widget puede enseñar un dato de hace un rato. Con la regla de la casa —un dato viejo nunca se
  presenta como actual— eso obliga a que el widget **diga la hora del dato**, no solo el número.
- **Cada cuánto se refresca.** No lo decide la app: iOS reparte un presupuesto de refrescos al día y
  puede recortarlo. Prometer "siempre al minuto" sería mentira.
- **Qué cabe.** Hay varios tamaños y en el pequeño no entra todo. Si hay un aviso naranja o rojo,
  **manda el aviso**, igual que en la pantalla del lugar.
- **Accesibilidad.** VoiceOver lee los widgets en la pantalla de inicio. Un widget que sea una
  imagen bonita sin texto es un widget que aquí no vale.

---

## Avisar de que empieza a llover, o de una tormenta cerca

**Estado: por investigar. No hay decisión tomada ni fuente elegida.**

La idea: que el teléfono avise **"empieza a llover en 15 minutos"** o **"hay una tormenta acercándose
por el oeste"**, como hacen Tiempo Radar y las apps de ese estilo. Es el aviso más útil que existe,
porque llega a tiempo de hacer algo: recoger la ropa, no salir todavía, buscar techo.

**Y es distinto de todo lo que la app tiene hoy**, que es justo por lo que merece su propia
investigación:

- No es la **previsión** de Open-Meteo: esa va por horas y dice "esta tarde lloverá", no "en un
  cuarto de hora".
- No es la **observación** de AEMET: esa cuenta lo que ya ha pasado en una estación, con retraso.
- No es un **aviso oficial**: AEMET avisa de riesgo por zonas y con horas de antelación, no de que
  te vaya a caer encima una célula concreta.

Esto es **nowcasting**: extrapolar los ecos del radar en los próximos minutos. Otra naturaleza de
dato, y por tanto una fila nueva en la tabla de FUENTES-DE-DATOS.

### Lo medido: de dónde puede salir el dato

**1. La precipitación en tramos de 15 minutos de Open-Meteo: DESCARTADA para esto** (2026-09-28).

No trae ninguna información por debajo de la hora. Medido contra la API en A Coruña, Madrid y
Valencia, mirando todas las horas con lluvia de los tres días siguientes: **49 de 49** encajan con
«la precipitación horaria dividida entre cuatro, desplazada una hora». Los cuatro cuartos de una
hora son el mismo número, y ese número es el de la hora de al lado.

Dicho de otra forma: `minutely_15` en España es la horaria repartida, no un modelo de 15 minutos.
Sirve para lo que ya la usamos, pero **no puede decir «empieza a llover en un cuarto de hora»**, y
construir un aviso sobre ella sería prometer una precisión que el dato no tiene.

(Reproducible: pedir `minutely_15=precipitation` y `hourly=precipitation` del mismo punto y comparar
los cuartos con `hourly[i+1]/4`.)

**2. El radar de AEMET: medido el 2026-10-02, y sirve.**

La prueba que faltaba se pudo hacer porque la clave de AEMET también está en el `.env` local del
servidor, no solo en el VPS.

Lo que contesta la API:

- `/api/red/radar/regional/{radar}` → **GIF de 480×530, unos 10-20 KB, cada 10 minutos**.
- `/api/red/radar/nacional` → **404 en todos los intentos**. La composición nacional, que sería una
  sola imagen para toda España y lo más cómodo con diferencia, no estaba disponible ese día. Hay que
  contar con apañarse solo con los regionales.

**Los quince códigos, de la propia especificación de AEMET.** Adivinarlos a ojo salió mal: ocho
aciertos y seis 404 que no eran radares caídos, sino códigos inventados. La lista buena está en el
OpenAPI que sirve la documentación (`https://opendata.aemet.es/AEMET_OpenData_specification.json`),
dentro del parámetro `radar`:

| | | | | |
| --- | --- | --- | --- | --- |
| `am` Almería | `sa` Asturias | `pm` Illes Balears | `ba` Barcelona | `cc` Cáceres |
| `co` A Coruña | `ma` Madrid | `ml` Málaga | `mu` Murcia | `vd` Palencia |
| `ca` Las Palmas | `se` Sevilla | `va` Valencia | `ss` Vizcaya | `za` Zaragoza |

Ojo con los que se parecen a otra cosa: `ma` es **Madrid** y no Málaga (que es `ml`), `va` es
**Valencia** y no Valladolid, y Canarias entera va con **un solo radar**, `ca`, sin nada en Tenerife.

**Los quince contestan y los quince traen la misma imagen.** Descargados todos el 2026-10-02:

- Mismo lienzo (480×530), mismo centro del disco (240,0 , 238,9 ± 0,2 px) y **la misma leyenda de
  once colores en el mismo orden**. Dentro del disco y en las filas útiles, **todos** los píxeles son
  negro o uno de esos once, en los quince. O sea: **un solo decodificador para toda España**, sin
  casos especiales.
- La única excepción es **Vizcaya**, cuyo disco mide 239,6 px en vez de 249,5. Si la escala sigue
  siendo 1 km/px, es que ese radar se dibuja hasta 240 km y no hasta 250. Encaja con que Vizcaya sea
  también el único que no emite en los 5,62 GHz del resto de la red, así que seguramente es otro
  aparato; pero hay que comprobarlo antes de fiarse.
- Dos de los quince (`ca` y `ss`) necesitaron **reintento**: la primera petición devolvió un 503. Los
  reintentos no son una mejora opcional, son parte de usar esta API.

Y esto es lo que se saca de la imagen. Todo medido sobre el PPI de Barcelona de las 11:00 UTC:

- **La geometría es exacta.** El disco de cobertura ajusta a una circunferencia con un residuo medio
  de **0,41 px** (máximo 2,76): centro en el píxel (240,00 , 238,90) y radio 249,55 px.
- **Un píxel es un kilómetro**, y esto está comprobado contra geografía, no supuesto. Situando el
  radar en Corbera (41,40 N / 1,88 E) y midiendo dónde cae la costa que la propia imagen dibuja:

  | punto | predicho a 1 km/px | medido en la imagen |
  | --- | --- | --- |
  | Mallorca, punta oeste | x 279 | x 277 |
  | Mallorca, cabo de ses Salines | y 477 | y 478 |
  | Menorca, costa norte | y 385 | y 386 |
  | Menorca, punta este | x 447 | x 449 |

  Con la otra hipótesis —radio de 240 km, 0,962 km/px— el cabo de ses Salines se iría a y 486, fuera
  del disco. Así que el dibujo llega a 250 km aunque AEMET hable de 240 km de cobertura útil.

- **Cada píxel es un valor, no una mezcla.** Dentro del disco, **todos** los píxeles son negro o
  uno de los once colores de la leyenda: cero degradados, cero antialiasing. (La primera cuenta dijo
  «el 100 %» y estaba hecha sobre un muestreo de uno de cada tres píxeles; mirándolos todos aparecen
  **19 píxeles blancos**, siempre los mismos y en los quince radares, que son el rótulo de «© Agencia
  Estatal de Meteorología» pisando el borde de arriba del círculo. De ahí sale declarar una banda
  útil de la fila 15 a la 479, que además deja fuera lo que está a más de 240 km del radar.) La
  escala viene en la
  propia imagen (barra de once tramos de 24 px, de 12 a 72 dBZ de seis en seis), así que no hay que
  fiarse de ninguna tabla de fuera. Por Marshall-Palmer, el suelo de 12 dBZ son **0,2 mm/h**: por
  debajo de eso AEMET no pinta nada, que es más o menos donde una persona empieza a notar que llueve.
- **La hora está dentro de la imagen**, en una tipografía de mapa de bits de 7×9 sobre rejilla de
  paso 9: `2 OCT  26275  110000` → día 275 de 2026, **11:00:00 UTC**. Leerla es una tabla de diez
  glifos, no OCR. Eso resuelve el «cuándo» que exige la regla de la casa.
- **Y no hace falta ninguna dependencia nueva.** Esta era la pega que bloqueaba la decisión: sacar un
  número de un PNG obliga a instalar algo en Node. Pero **AEMET sirve GIF**, y un GIF de un fotograma
  con paleta global se decodifica con unas sesenta líneas de LZW, ya escritas y probadas contra esta
  imagen. Nada de terceros que aprobar ni que mantener.

**Lo que falta para poder usarlo: dónde está cada radar.** La imagen da la geometría, pero no dice
en qué punto del mapa cae su centro. Para Barcelona se supuso Corbera (41,40 N / 1,88 E) y encajó
con la costa dibujada a dos o tres píxeles sobre distancias de 150-250 km — pero ese margen incluye
el error de la propia suposición, así que no es una medida de la proyección, es un techo. A los
20-30 km que importan para el aviso, el error queda muy por debajo del kilómetro con cualquier
aproximación razonable. Las coordenadas de los quince emplazamientos no aparecen en la API ni en la
imagen, y hay que sacarlas de algún sitio o deducirlas de la costa que cada imagen dibuja. Lo
segundo es lo que funcionó, y está medido más abajo.

De buscarlo salieron siete nombres de emplazamiento —Níjar (Almería), Aguión (Asturias), Llucmajor
(Illes Balears), Corbera (Barcelona), Sierra de Fuentes (Cáceres), Cerceda (A Coruña) y Autilla del
Pino (Palencia)—, pero **de segunda mano**: la página que los lista devuelve 403 y no se pudo leer
directamente. El único verificado es Corbera, y porque encajó con la costa dibujada. Los otros seis
radares ni eso. AEMET no publica los emplazamientos, y España no participa en OPERA, que es donde
estarían si participara.

**Y resulta que no hay que encontrar la lista: el anclaje se busca a ciegas contra la costa que la
propia imagen dibuja.** Medido sobre Barcelona el 2026-10-05:

1. Se marca qué píxel es mar inundando desde un punto que es mar seguro (200 km al sureste del
   centro) y parándose en la línea de costa dibujada. Para Barcelona sale el 60,3 % del disco, que es
   lo que tiene que ser.
2. Se proyectan los 8.132 municipios del INE que ya viajan en la app (distancia y rumbo desde el
   centro candidato, 1 px = 1 km) y se exige lo único que es cierto sin excepción: **un pueblo cae en
   tierra**.
3. Se prueban 1.681 centros candidatos en una cuadrícula de 80 × 80 km y gana el que menos pueblos
   ahoga.

El ganador sale **41,42 N / 1,88 E, a 2,2 km de Corbera**, con **un municipio en el mar de 1.356**
(0,07 %). O sea que el emplazamiento no hay que buscarlo en ningún sitio: lo dice la imagen, y por eso
el camino de correlacionar discos vecinos ya no hace falta.

**Y la comprobación tiene dientes, que es lo que la hace valer.** Desplazando el anclaje a mano, los
pueblos que caen en el agua pasan de 0,7 % —y los nueve son de los que están literalmente a pie de
agua: Deià, Estellencs, L'Escala— a 3,0 % con 5 km, 6,4 % con 10, 14,9 % con 20 y 29,0 % con 40.
**Hacia el este es mucho menos sensible** (5 km da 1,0 %), porque la costa catalana corre en esa misma
diagonal y moverse a lo largo de ella no mete a nadie en el agua: cada radar necesita su sensibilidad
en las dos direcciones, no una cifra sola.

Un detalle del método, por si se retoma: la inundación se escapa por el borde del disco cuando el
borde pasa por tierra (en Barcelona, por el norte), así que algún pueblo de interior cuenta como
«mar» —Guils de Cerdanya— sin que el anclaje tenga nada que ver. Eso hace la prueba algo más laxa,
no más permisiva en la dirección peligrosa, y se arregla cerrando el borde o exigiendo además
distancia mínima a la costa dibujada.

**Lo que el anclaje no arregla**, y conviene tenerlo escrito antes de prometer el aviso:

- **La posición de la propia persona.** La app la actualiza al salir de una geovalla de 3 km, así que
  su coordenada guardada puede estar vieja unos kilómetros. Con un radio de 35 km es ruido; con uno de
  5 km, no.
- **El haz sube con la distancia.** A 200 km va a kilómetros de altura y puede ver lluvia que se
  evapora antes de llegar al suelo. A cada persona hay que leerle el radar **más cercano**, no
  cualquiera que la cubra.
- **Quien está en el borde del disco** tiene parte de su círculo fuera de cobertura, y eso tiene que
  contestar «no lo sé», nunca «no llueve». El código ya distingue `FUERA_DE_COBERTURA` de `SIN_ECO`.
- **Canarias va con un solo radar**, en Las Palmas. Hay que comprobar isla por isla quién queda
  dentro; las occidentales probablemente no.

**APARCADO el 2026-10-05.** Queda por hacer los catorce radares restantes, cada uno con su búsqueda a
ciegas y su tabla de sensibilidad, y dejarlo commiteado como prueba automática —una por radar, para
que un anclaje equivocado no pueda colarse en silencio—. El script de la comprobación de Barcelona no
se guardó: son unas setenta líneas y se reescriben con lo que hay aquí.

**Las dos trampas que ya se ven, antes de escribir nada:**

- **El amarillo está pillado.** El color de 48-54 dBZ es el mismo (255,255,0) con el que se dibujan
  las costas y las fronteras, así que leer un píxel a ciegas puede dar «granizo» en toda la costa. Se
  arregla con una máscara estática por radar: las líneas salen idénticas en todas las imágenes y el
  eco no. Se calcula una vez y se guarda.
- **AEMET se cae.** En media hora de pruebas: un 503 en la descarga de la imagen y 404 constante en
  la composición nacional. Para un aviso cuyo valor entero depende de llegar a tiempo, esto es parte
  del diseño, no una anécdota.

**3. RainViewer** (`api.rainviewer.com/public/weather-maps.json`, sin clave): **13 fotogramas de
pasado con cadencia de 10 minutos**, o sea dos horas de historia, en **teselas PNG en proyección web
estándar** —georreferenciarlas es aritmética de teselas—. Comprobado que hay eco real sobre España:
la tesela de Madrid pesaba 20 KB y la del Sáhara, sin cobertura, 334 bytes. **Su campo `nowcast`
venía vacío**, así que la extrapolación tendríamos que hacerla igual. Su licencia libre es para uso
personal, educativo y de poco volumen, exige mostrar «Weather data by RainViewer» con enlace, y
cualquier uso comercial o con garantía de servicio se negocia aparte. Y sigue necesitando decodificar
PNG, que es justo lo que AEMET nos ahorra.

### Lo que hacen las apps que viven de esto

- **Rain Alarm** es la referencia, porque hace exactamente lo que se pide: **no predice**. Su propia
  API comercial devuelve tres campos —`coverage`, `intensity` (0 a 12) y `updated`, que es la hora
  del radar— y los documenta como derivados del radar, sin extrapolación; la distancia hasta la
  precipitación es un campo opcional por acuerdo. Su nivel 1 es «>0,2 mm/h», que es **exactamente el
  umbral donde AEMET empieza a pintar**: dos casas distintas han puesto el suelo en el mismo sitio.
  Y para España, Rain Alarm usa **AEMET** (con Meteocat, Euskalmet y MeteoGaliza). O sea que la
  fuente que acabamos de decodificar es la misma de la que vive el líder de este nicho. Su API cuesta
  1.000 €/mes de mínimo, así que lo que nos sirve es el diseño, no el servicio.
- **Foreca** hace lo contrario: su endpoint `minutely` da una hora en pasos de un minuto y en Europa
  es **extrapolación de radar de verdad**, con datos de menos de quince minutos. Es la opción
  ambiciosa bien hecha, por una casa con meteorólogos dentro. Fuera de Europa y Estados Unidos
  degrada a interpolar la horaria, que es el mismo truco que ya le medimos a Open-Meteo.

### El cálculo que decide si esto sirve de algo

El retraso se midió sondeando el radar de Barcelona y leyendo la hora grabada en cada imagen, con
peticiones cada minuto y medio a lo largo de tres barridos seguidos:

| barrido | cuándo se pidió | resultado |
| --- | --- | --- |
| 11:00 | 11:15 | ahí estaba, y el de las 11:10 todavía no |
| 11:10 | 11:23 | ahí estaba |
| 11:20 | 11:25:23 → no; 11:26:13 → sí | **publicado a los 6 minutos** |

O sea que **la imagen tarda unos seis minutos en publicarse**, no quince. Con un cron de 5 minutos,
lo que llega al teléfono tiene como mucho unos once. Con el cron de 20 que hay hoy, hasta veintiséis,
que ya se come media ventaja.

- Lluvia a 25 km moviéndose a 30 km/h → tarda 50 minutos → quedan **unos 39 minutos de aviso real**.
  Eso es útil de verdad: da tiempo a recoger la ropa o a no salir todavía.
- Lluvia a 10 km → tarda 20 minutos → quedan **nueve**. Justo, pero sirve.

De ahí salen dos consecuencias de diseño, no de gusto: el radio de vigilancia tiene que ser generoso
(20-30 km, no 5), y el texto tiene que decir **la hora del radar**, no «ahora».

### La trampa que ya se comió una prueba

Con los tres barridos descargados (11:00, 11:10 y 11:20 de Barcelona, con lluvia de verdad sobre
Cataluña) se probó a calcular «a qué velocidad se acerca», que es el número del que depende todo el
aviso. Salió mal de dos maneras distintas, y las dos hay que contarlas antes de escribir una línea:

**1. Restar distancias entre dos fotogramas NO es una velocidad.** Buscando el eco más cercano a cada
punto y restando, el mejor candidato daba una lluvia acercándose a **279 km/h**. No existe tal cosa.
Lo que había pasado es que al este, por Menorca, el eco pasó de **0 px a las 11:00 y 11:10 a 7 px a
las 11:20**: no es lluvia que se mueve, es una célula que nace. El método confunde movimiento con
nacimiento, y habría mandado un aviso falso el primer día.

Y de paso enseña el segundo filtro: 7 píxeles son 7 km², a más de 200 km del radar, donde el haz va
alto y ancho. Hace falta un tamaño mínimo y un alcance máximo, además de un tope de velocidad
físicamente posible.

**2. Un solo vector para todo el disco describe mal un campo grande.** Correlacionando los dos
fotogramas enteros, el mejor desplazamiento fue de 5 km en 20 minutos (15 km/h hacia el norte), pero
el solape solo subía del **79 % al 81 %**: la masa de lluvia era enorme y casi parada, así que el
máximo apenas destaca. Si se mide el desplazamiento, hay que hacerlo **en una ventana alrededor del
usuario**, no sobre toda la provincia.

Lo que sí salió redondo es lo puramente medido. Sobre Barcelona ciudad (píxel 264, 240): **24 dBZ a
las 11:00 y 36 dBZ a las 11:20**, o sea de ~1 mm/h a ~6 mm/h. Eso es un dato con su hora, su sitio y
su procedencia, y no hace falta extrapolar nada para decirlo.

### El umbral manda más que la extrapolación

Esto se descubrió escribiendo los textos de ejemplo, y cambió la idea de cuál era la decisión difícil.

Con los tres barridos de Barcelona se buscó un caso de lluvia acercándose de verdad. El primer
intento solo devolvió artefactos (los de Mallorca, 90 → 75 → 21 km, que son 420 km/h). Filtrando por
pasos físicamente posibles y constantes salió un grupo limpio: **siete pueblos vecinos del Maresme,
todos con el mismo 6 y 5 km por barrido**. Que coincidan entre sí es lo que distingue el movimiento
real de un eco que nace, y vale como filtro.

El caso elegido fue **Calella** (a 70 km del radar). Y mirado por intensidades, la historia se da la
vuelta:

| umbral | 11:00 | 11:10 | 11:20 | |
| --- | --- | --- | --- | --- |
| 12 dBZ (~0,2 mm/h) | 15,7 km | 10,8 km | **9,5 km** | se acerca |
| 24 dBZ (~1,2 mm/h) | 27,2 km | 30,4 km | **28,5 km** | no se acerca |
| 30 dBZ (~2,7 mm/h) | 40,8 km | 42,2 km | **40,1 km** | quieta |

Lo que se acercaba a Calella era **solo el borde deshilachado del sistema**. La lluvia de mojarse
estaba a 28 km y no venía. Un aviso construido sobre «hay eco» habría prometido lluvia en veinte
minutos por una llovizna de 0,2 mm/h.

**Conclusión: el umbral decide si el aviso es verdad o es ruido, y lo decide antes que la elección
entre medir y extrapolar.** En este caso cambia la respuesta de «te llega en veinte minutos» a «no te
llega». Es la primera cifra que hay que fijar, no la última.

(Y algo que no se pudo comprobar: si llovió en Calella a las 11:45. AEMET solo sirve la última
imagen, así que no hay forma de volver atrás a mirar si el aviso habría acertado. Para evaluar esto
en serio hay que ir **guardando** los barridos antes de poder juzgar nada.)

### Lo que se propone empezar: la pantalla, no el aviso

No hace falta decidir el texto del push para empezar, y decidirlo a ciegas es lo que más fácil sale
mal. Lo que se propone es **enseñar el radar en la pantalla primero**:

> «Radar de las 11:20: lluvia a 9 km al oeste.»

Una línea más en la ficha del lugar, al lado de la medición de la estación, con la misma forma que
todo lo demás: un dato, con su hora y su procedencia. Sin notificaciones.

Por qué así:

- **No gasta confianza.** Si el dato resulta ser malo, molesta a nadie; nadie aprende a ignorar las
  notificaciones de esta app.
- **Se puede probar de verdad**, en TestFlight y en la mano, que es la única forma de saber si «a 9 km
  al oeste» le dice algo útil a una persona.
- **Obliga a resolver justo lo que está sin resolver** —el ancla de cada radar, el umbral, la máscara
  del amarillo, los reintentos— sin tener encima la decisión del texto.
- **El aviso viene después y ya informado**: cuando se haya visto durante unas semanas qué pinta
  tiene el dato, el umbral y el «cuándo callarse» se deciden con experiencia en vez de a ojo.

Lo que esto no es: no es la versión descafeinada del aviso. Es el paso que hace falta para que el
aviso, cuando llegue, se pueda decidir sobre algo visto.

### DECIDIDO (2026-10-02): se hace lo mismo que Rain Alarm

Es lo que pide la gente, así que se deja de dar vueltas a si se promete movimiento o no. Y resulta
que el mecanismo de Rain Alarm es más simple de lo que parecía, y **no extrapola nada**:

> Un círculo de radio R alrededor de ti. Suena cuando aparece precipitación de al menos intensidad N
> dentro del círculo. Ya está.

R lo elige el usuario (por defecto 22 millas, unos **35 km**) y N también, por lugar. Y ahí está lo
elegante, que es lo que resuelve la tensión de «avísame de cuándo va a empezar, pero sin predecir»:
**el tiempo de antelación lo elige el usuario a través del radio**. La app no adivina cuándo llega;
dice que hay lluvia a menos de R km, que es una observación. Quien quiera más margen, agranda el
círculo.

**Lo que ya encaja sin tener que inventar nada:**

- **La escala de intensidad de Rain Alarm es la misma escalera que la de AEMET.** Sus doce niveles en
  mm/h (0,2 · 0,3 · 0,6 · 1,3 · 3 · 6 · 12 · 24 · 50 · 100 · 205 · 420) pasados a dBZ por
  Marshall-Palmer caen sobre las bandas de color: el nivel 1 en 11,8 dBZ (banda de 12), el 4 en 24,8
  (banda de 24), el 5 en 30,6 (banda de 30), el 11 clava el 60. Misma física, otra etiqueta. El
  ajuste de sensibilidad se reproduce tal cual desde el GIF.
- **Un píxel es un kilómetro**, así que «¿hay eco dentro de R km?» es comparar distancias al cuadrado.
  No hace falta geometría de ninguna clase.
- Cadencia de 10 minutos y seis de retraso, que es la ventana con la que se trabaja.

**Lo que no es.** Rain Alarm es accesible —AppleVis dice que VoiceOver lee todo y los botones están
etiquetados— y cuesta 0,99 €. O sea que quien lo pide ya tiene una opción que funciona: esto no tapa
un agujero de accesibilidad, así que tiene que aportar otra cosa (estar en la app que ya usan, en
español, con AEMET de fuente y la misma disciplina de decir de dónde sale cada número).

### Cuánto sonaría: medido, y la sorpresa no está donde parecía

Sobre el barrido de las 11:20 de Barcelona, con los 646 municipios del INE que caen dentro del disco:

| radio | ≥12 dBZ | ≥18 | ≥24 | ≥30 | ≥36 dBZ |
| --- | --- | --- | --- | --- | --- |
| 10 km | 72 % | 64 % | 46 % | 33 % | 18 % |
| 20 km | 80 % | 78 % | 61 % | 51 % | 37 % |
| 35 km | 86 % | 84 % | 75 % | 70 % | 57 % |

Ese día llovía en casi toda Cataluña (AEMET tenía avisos rojos), así que **ese 86 % no son falsos
avisos: es que llovía**. Y justo por eso el número es útil, porque enseña dónde está el problema de
verdad.

Con el radio por defecto de Rain Alarm, un día de lluvia **tres de cada cuatro usuarios entran en la
condición de aviso**. Eso no se arregla subiendo el umbral ni encogiendo el radio: se arregla con la
regla de repetición. Con un cron de cinco minutos y sin esa regla, la misma persona recibiría doce
avisos a la hora durante toda la tarde.

**O sea que la perilla que decide si esto se puede vivir no es el umbral ni el radio: es cuándo NO
suena.** Mínimo: una vez por episodio y no una por barrido; nada si ya está lloviendo encima; nada
si el radar no contestó; y algo para la noche.

### Lo que esto convierte en bloqueante

- **La máscara deja de ser un detalle y pasa a ser crítica.** La condición es «hay un píxel de al
  menos N dentro del círculo», y la costa está pintada del amarillo de 48-54 dBZ. Un solo píxel de
  costa dentro del radio de alguien es **un aviso permanente, todos los días, para todos los pueblos
  de la costa**. Lo mismo con los ecos fijos de suelo cerca del radar, que AEMET avisa de que los hay.
- **La máscara hay que aprenderla, no deducirla.** No basta con quitar el amarillo: hay que marcar
  los píxeles que tienen eco en una fracción alta de las imágenes a lo largo de semanas. Eso exige
  **empezar a guardar barridos ya**, y es además lo único que permitirá después juzgar si un aviso
  habría acertado (AEMET solo sirve la última imagen: lo que no se guarde, se pierde).
- **El ancla de cada radar.** Ya no es un problema sin solución —se busca a ciegas contra la costa
  dibujada, ver arriba—, pero de los quince solo está medido Barcelona.
- **El cron**, de 20 minutos a 5.

### Lo fiable que es la fuente

En media hora de sondeo cada minuto y medio: **un 503 de nueve descargas**, y la composición nacional
en 404 permanente. La API de estado contestó 200 siempre; lo que falla es la descarga de la imagen.
Para un aviso que vale por llegar a tiempo, hay que decidir qué se hace cuando el radar no contesta:
callarse es la respuesta correcta, pero hay que escribirlo.

### Lo que sigue sin decidir

**Qué radar manda.** Sin composición nacional hay que elegir el regional que toca para cada usuario,
y contestar qué pasa fuera de cobertura o en los huecos entre discos. Es la misma forma de problema
que el selector de estación, y seguramente la misma respuesta: decirlo, en vez de callarse.

**Cuándo callarse**, que sigue siendo el riesgo de verdad: un aviso de lluvia que no acierta, o que
suena tres veces en una tarde de chubascos, enseña a la gente a ignorar las notificaciones de esta
app, incluidas las rojas de AEMET.

**Cada cuánto corre el cron.** Hoy son 20 minutos. Un dato que se renueva cada 10 pide 5, y eso toca
el servidor entero, no solo esta función.

---

## Otras fases habladas, sin empezar

Se apuntan para que no se pierdan; no hay diseño de ninguna.

- **Polen**, con datos de CAMS / Copernicus.
- **Calidad del aire.**
- **Motor de alertas**: unificar las reglas del usuario (umbral, resumen) y los avisos oficiales bajo
  una sola forma de decidir cuándo suena el teléfono, en vez de tres caminos separados.

---

## Avisar a Open-Meteo del agujero de España

**Estado: el informe está escrito, falta decidir si se publica.**

La medición del 2026-09-26: al geocodificador de Open-Meteo le faltan **405 municipios españoles**
(el 4,98 %, 669.686 habitantes), Badia del Vallès entre ellos. La causa está identificada: GeoNames
los tiene solo como registros `ADM3` (clase A) y el índice de Open-Meteo excluye los `ADM*`. No es
que falten los datos; es que el filtro los tapa. Comprobado en vivo sobre los 15 más grandes: 14
ausentes.

La app ya no lo sufre —busca en la lista del INE—, así que esto no arregla nada nuestro: es
devolverle el hallazgo a quien nos da los datos gratis. No hay ninguna incidencia igual abierta en
`open-meteo/geocoding-api`.

Queda por decidir si se publica tal cual o adjuntando la lista completa de los 405 en un gist.

---

## El puente de desarrollo, a medio instalar

Instalado el 2026-10-06 (ver [REVISAR-ACCESIBILIDAD.md](REVISAR-ACCESIBILIDAD.md)): servicios,
navegación por pestañas, acciones en las dos pantallas con capas y `docs/pantallas.txt`. Funciona ya
con la build que haya puesta.

**Falta una build de desarrollo para que haya capturas**, que es lo que de verdad hace falta para
revisar la accesibilidad. En esa build entran tres cosas que ya están declaradas y no hacen nada
hasta entonces:

- `react-native-view-shot`, que es nativo. Hasta que entre, el servicio `pantalla` contesta
  `{"ok":false}` y todo lo demás sigue.
- `NSLocalNetworkUsageDescription` en `app.json`, para que el permiso de red local diga algo con
  sentido en vez del texto genérico de Expo.
- `expo-constants`, que el puente importaba sin estar declarado. Al declararlo con `npx expo install`
  subió de 57.0.13 a 57.0.21 (parche dentro del SDK 57). Es JS contra un nativo que ya está en el
  binario, pero conviene mirarlo la primera vez que se abra la app con esa build.

Conviene juntar esa build con el módulo nativo de cambios significativos de ubicación, que también
está esperando: una build cuesta y hay pocas.

**Y el rastro de accesibilidad sigue vacío.** El servicio existe, pero no hay nadie llamando a
`anotarSuceso`: esta app no tiene un `src/accesibilidad/` propio con las funciones de anuncio y foco
centralizadas (paso 5 del README del puente). Mientras no lo tenga, el rastro devuelve una lista
vacía, y eso no es un fallo del puente.

## Y una deuda de higiene

Quedan desplegados el **Worker de Cloudflare** y su base D1 vacía, de antes de la migración al
servidor propio. **No envían nada** —comprobado el 2026-08-16 mirando los avisos que llegan al
móvil, que es la única prueba que vale—, así que borrarlos es limpieza y no riesgo.
