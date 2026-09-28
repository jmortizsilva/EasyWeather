# Lo que EasyWeather todavía no hace

Este fichero es para lo que **no** existe. [FUENTES-DE-DATOS.md](FUENTES-DE-DATOS.md) documenta lo
que ya funciona; aquí se apunta lo decidido pero no hecho, con la razón por la que se quiere y las
preguntas que hay que contestar antes de escribir una línea.

Que esté aquí no significa que se vaya a hacer, ni en este orden. Significa que no se pierde.

---

## Elegir la estación de AEMET

**Estado: diseñado, sin escribir una línea.** Es lo más listo para empezar de todo este fichero.

Hoy el servidor elige la estación por cercanía y la app la enseña. La idea, sugerida por un usuario:
que se pueda **discutir esa elección**, viendo las estaciones cercanas con su distancia y su
altitud. El caso real es el de siempre en un país con montañas: la estación más cercana puede estar
en otro valle o en otra vertiente, y el usuario lo sabe mejor que la fórmula.

### Tres cosas del código que mandan sobre el diseño

1. **En el servidor no hay migraciones.** `src/esquema.ts` se aplica con
   `CREATE TABLE IF NOT EXISTS`, así que **una columna nueva en `dispositivos` o en `resumenes` no
   llegaría nunca** a la base de datos que ya existe. Todo dato nuevo va en tabla aparte, como ya se
   hizo con `umbrales_fuente`.
2. **La app tira la medición cuando un lugar se mueve bajo el mismo id**
   (`PlacesContext.cargarObservacion`, veredicto `olvidar-y-consultar`), para no decir que en tu
   calle mide lo que mide una estación a 350 km. Una estación fija para «Mi ubicación» pelearía
   contra esa máquina.
3. **El texto de los push nombra la estación** (`avisoUmbral` y `cuerpoResumen` del servidor). Si la
   elección no llega al servidor, el push dice una estación y la pantalla otra, del mismo sitio y el
   mismo día. Eso parte el trabajo en dos fases.

### Lo decidido

- **Por lugar, y solo en los lugares fijos.** Una estación es un punto del mapa; «mi estación» no
  significa nada con dos ciudades guardadas. Se guarda en `tiempo.estacionPorLugar.v1`.
- **Se entra por la propia línea de la medición**, que ya es un solo elemento accesible: pasa a ser
  botón y **no añade ninguna parada nueva a VoiceOver**. Abre un modal, como el de avisos.
- **Ruta nueva** `GET /apps/easyweather/estaciones?lat&lon&alt`: las 12 más cercanas en 60 km, con
  distancia, desnivel, hora del último parte y el motivo por el que la política automática
  descartaría cada una. **No le cuesta ni una petición más a AEMET** (sale del fichero horario que
  ya está cacheado en memoria) y **no toca la ruta diezminutal**, que es la que responde 429.
- **`estacion=IDEMA` opcional en `/observacion`**, con una asimetría deliberada: con estación
  elegida **no** se aplican los filtros de distancia ni desnivel —el usuario los ha anulado a
  propósito— pero **sí** el de frescura, porque un número de hace cinco horas no es «ahora» lo elija
  quien lo elija.
- **Al cambiar la elección hay que invalidar `ultimaObservacionRef`**, o el dato nuevo no llegaría
  hasta diez minutos después y parecería que el cambio no ha hecho nada.

### Lo propuesto que falta confirmar

Son decisiones de producto, no técnicas:

- **Cuando la estación elegida calla, no se cae en la automática en silencio**: la tarjeta dice «tu
  estación no publica desde las 09:00» y ofrece cambiarla. Caer en la automática pondría «Estación
  X» debajo de un número de Y, que es lo que la app se prohíbe.
- **«Mi ubicación» queda fuera**, por el punto 2 de arriba.
- **Si no hay ninguna medición no hay por dónde entrar**, que es justo cuando alguien querría una
  estación más lejana. No se añade una línea «Sin medición · Elegir estación» porque sería una
  parada nueva de VoiceOver **para todo el que esté fuera de España**. Queda para el final.

### Fases y orden de despliegue

1. Ruta nueva, parámetro nuevo, modal y guardar la elección. Se ve y funciona.
2. Que la elección viaje en `sincronizar` (tabla nueva `estacion_resumen`) para que el resumen de un
   lugar fijo mida donde dice la pantalla. **Parándose en la fase 1**, un resumen con «Temperatura»
   puede nombrar una estación distinta de la que enseña la tarjeta.
3. La entrada cuando no hay medición.

**El servidor se despliega primero**: si la app pregunta por `/estaciones` y todavía no existe, el
modal solo puede decir que no ha podido cargar la lista. La app **entra por aire**, sin build ni
revisión de Apple: es todo TypeScript y JSX dentro del runtime 1.5.0.

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

### Lo que hay que contestar antes de nada

1. **De dónde sale el dato.** Candidatas a mirar, ninguna comprobada todavía:
   - el **radar de AEMET** en OpenData, que hasta donde sé sirve **imágenes** compuestas, no una
     rejilla de valores: habría que extraer los ecos de un PNG, que es un problema muy distinto y
     bastante peor;
   - la precipitación en tramos de **15 minutos** de Open-Meteo, que ya usamos y no necesita clave,
     pero que es **modelo**, no radar: hay que ver si acierta a esa escala o promete de más;
   - servicios de teselas de radar de terceros, con su licencia y su coste por mirar.

   La pregunta que decide: **¿el dato es medido o previsto?** De la respuesta depende cómo se puede
   redactar el aviso sin mentir, que es la regla que sostiene toda la app.

2. **Quién lo calcula.** Casi seguro el servidor, como los avisos oficiales: es quien puede mirar
   cada pocos minutos con la app cerrada. Pero un nowcast útil se refresca cada 5 o 10 minutos, no
   cada 20 como el cron de ahora, y eso multiplica las consultas y el gasto del VPS.

3. **Cuándo callarse.** Es el riesgo de verdad. Un aviso de lluvia que no acierta, o que suena tres
   veces en una tarde de chubascos, enseña a la gente a ignorar las notificaciones de esta app —
   incluidas las rojas de AEMET, que son las que importan. Hará falta un margen de confianza, un
   tiempo mínimo entre avisos y, seguramente, que nazca **desactivado**.

4. **Cómo se dice.** Un radar es una imagen, y aquí el dato tiene que llegar como **frase**:
   distancia, dirección y minutos, no un mapa de colores. Es la parte que más valor tiene y la que
   ninguna app de radar resuelve bien.

5. **Atribución y licencia** de la fuente que se elija, antes de publicar nada.

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

## Y una deuda de higiene

Quedan desplegados el **Worker de Cloudflare** y su base D1 vacía, de antes de la migración al
servidor propio. **No envían nada** —comprobado el 2026-08-16 mirando los avisos que llegan al
móvil, que es la única prueba que vale—, así que borrarlos es limpieza y no riesgo.
