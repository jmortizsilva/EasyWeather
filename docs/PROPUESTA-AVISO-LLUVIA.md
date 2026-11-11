# Propuesta: el aviso de lluvia

Aprobada el 2026-11-11, con todas las decisiones de Jose de ese día.

Lo que se quiere es lo que hace Rain Alarm: **que el teléfono avise cuando la lluvia se acerca**,
con la app cerrada. El primer paso, la línea del radar en la ficha ([PROPUESTA-RADAR.md](PROPUESTA-RADAR.md)),
ya está hecho, y el servidor sabe calcular a cuántos kilómetros está la lluvia y hacia dónde. Esto
lo convierte en un aviso.

---

## 1. Cómo se comporta (decidido)

| | |
| --- | --- |
| **Distancia** | Avisa cuando hay lluvia a menos de **35 km**. Se puede elegir 10, 20, 35 o 50. |
| **Intensidad** | **Cualquier lluvia** que pinte el radar. Se puede elegir «desde moderada» o «solo fuerte». |
| **Cuántas veces** | **Una por episodio**: avisa cuando la lluvia entra en el radio, y no vuelve a avisar hasta que pase **una hora** sin lluvia dentro. |
| **Ya llueve encima** | Si al empezar el episodio ya llueve donde estás, **no avisa**: ya lo sabes. |
| **Sin imagen del radar** | **Se calla.** Sin imagen reciente no se sabe si llueve, y no se puede decir que no. |
| **Lugar** | **Mi ubicación**: te sigue, como los demás avisos. |
| **Noche** | **Una franja sin avisos** que eliges tú, **desactivada de fábrica**. Si la lluvia llega durante la franja, no avisa al acabar: el episodio empezó de noche. |
| **Segundo aviso** | **Opcional**: otro aviso cuando la lluvia está ya a **menos de 5 km**. |

Las intensidades son las de la ficha: «moderada» empieza en 2 mm/h y «fuerte» en 15, que en las
bandas de AEMET son 30 y 42 dBZ.

## 2. Los textos

**La notificación**, primero lo que importa, luego la fuente y la hora:

> Lluvia moderada a 12 km al oeste, según el radar de AEMET de las 16:50.

**El segundo aviso**, si está activado:

> Lluvia ya a 3 km al oeste, según el radar de AEMET de las 17:10.

Y si llega a llover encima antes del segundo aviso:

> Empieza a llover aquí, según el radar de AEMET de las 17:10.

**La pantalla**, una entrada más en «Avisos», como las otras tres:

- Título: «Aviso de lluvia»
- Interruptor: «Avisarme cuando se acerque la lluvia»
- «Distancia»: 10, 20, 35 o 50 km, con 35 marcado de fábrica
- «Intensidad»: «Cualquier lluvia», «Desde moderada», «Solo fuerte»
- Interruptor: «Avisar otra vez cuando esté a menos de 5 km»
- Interruptor: «Sin avisos de noche», apagado de fábrica, con «Desde» y «Hasta», que proponen de 23:00 a 8:00
- Una línea al pie: «Usa el radar de AEMET: solo funciona en España.»

Los selectores serían ajustables, como el resto de la app.

## 3. Cómo se hace

**En el servidor**, después de cada vuelta de recogida de barridos, que ya es cada 5 minutos:

1. Para cada teléfono con el aviso activado, toma su última ubicación, la misma de los demás avisos.
2. Elige el radar y busca la lluvia más cercana, con lo mismo que usa la ficha, pero con el radio y
   la intensidad de esa persona.
3. Decide si toca avisar con las reglas del apartado 1, guardando el estado de su episodio.
4. Manda la notificación por el mismo camino que los demás avisos.

Las reglas del apartado 1 van en una función pura, con el reloj inyectado, para poder probarlas sin
esperar: un episodio entero se prueba en milisegundos.

**Dos tablas nuevas**, como las de los otros avisos: la configuración de cada persona, y el estado
de su episodio (desde cuándo, cuándo vio lluvia por última vez, si ya mandó el segundo aviso). Son
`CREATE TABLE IF NOT EXISTS`, así que no hay que migrar nada.

**En la app**, la pantalla de «Aviso de lluvia» y lo que manda al servidor al guardar, como los
demás avisos.

**Todo va por aire**: servidor y JavaScript, sin build. Primero a los probadores, por el canal `beta`
(por eso hace falta la build 27, ver más abajo), y después a la Store.

**La política de privacidad** cambia en una línea: un cuarto tipo de aviso en la lista. No se
guarda nada nuevo: la ubicación es la misma que ya usan los avisos.

## 4. Lo que no hace, de momento

- Avisar de un lugar guardado en vez de «Mi ubicación».
- Predecir cuándo llega la lluvia: dice dónde está, como Rain Alarm. El margen lo da el radio.
- Tormentas: el radar de AEMET no distingue rayos. Los avisos oficiales de tormenta ya existen.

## 5. Lo que se decidió al aprobarla

1. **Una hora sin lluvia dentro del radio cierra el episodio.** Más corta avisaría más en días de
   chubascos sueltos; más larga se callaría ante un frente nuevo.
2. **La franja de noche viene desactivada.** Quien la quiera, la enciende.
3. **Si la lluvia llega de noche y sigue al acabar la franja, no avisa.** El episodio empezó de noche
   y la línea de la ficha ya lo cuenta.
4. **Los textos**, los del apartado 2.
