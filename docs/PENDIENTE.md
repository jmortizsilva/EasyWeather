# Lo que EasyWeather todavía no hace

Este fichero es para lo que **no** existe. [FUENTES-DE-DATOS.md](FUENTES-DE-DATOS.md) documenta lo
que ya funciona; aquí se apunta lo decidido pero no hecho, con la razón por la que se quiere y las
preguntas que hay que contestar antes de escribir una línea.

Que esté aquí no significa que se vaya a hacer, ni en este orden. Significa que no se pierde.

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

## Y una deuda de higiene

Quedan desplegados el **Worker de Cloudflare** y su base D1 vacía, de antes de la migración al
servidor propio. **No envían nada** —comprobado el 2026-08-16 mirando los avisos que llegan al
móvil, que es la única prueba que vale—, así que borrarlos es limpieza y no riesgo.
