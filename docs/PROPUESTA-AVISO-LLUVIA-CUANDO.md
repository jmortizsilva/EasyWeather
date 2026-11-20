# Propuesta: que el aviso de lluvia diga cuándo llega

Aprobada el 2026-11-20. Sale del [estudio del 19 y 20 de noviembre](ESTUDIO-AVISO-LLUVIA.md): el
aviso de ahora («lluvia a 12 km al oeste») solo va seguido de lluvia 3 veces de cada 100; prever el
movimiento de la lluvia con 40 minutos de margen acierta la mitad de las veces, y en el 58 % llueve
dentro de la hora. Lo que queda abierto está al final.

Sustituye a la regla de la [primera propuesta](PROPUESTA-AVISO-LLUVIA.md); lo demás de aquella
(una vez por episodio, sin aviso si ya llueve, callado sin imagen, la franja de noche) se queda.

---

## 1. Cómo se comporta

| | |
| --- | --- |
| **Cuándo avisa** | Cuando, moviendo la lluvia que hay según va, **llegará al sitio en los próximos 40 minutos**, y eso ya se preveía con la imagen anterior: un eco suelto no basta. |
| **Cuántas veces** | Una por episodio, como ahora. El episodio se cierra tras una hora sin lluvia encima ni prevista. |
| **Ya llueve encima** | No avisa, como ahora. |
| **Sin imagen del radar** | Se calla, como ahora. Y sin la imagen anterior no hay movimiento: tampoco avisa. |
| **Intensidad** | Se queda: «cualquier lluvia», «desde moderada», «solo fuerte». |
| **Distancia** | **Desaparece.** Ya no se avisa por distancia, sino por tiempo. |
| **Noche** | Se queda igual. |
| **Segundo aviso** | **Desaparece.** Se midió un «Empieza a llover» y no compensa: la mitad de las veces la lluvia no sigue, y llegaría con diez minutos de retraso o más. |

## 2. Los textos

**La notificación**: primero qué y cuándo, luego la fuente y la hora de la imagen.

> Lluvia moderada en unos 30 minutos, según el radar de AEMET de las 16:50.

Los minutos se cuentan desde que sale el aviso, no desde la imagen, que llega con unos diez de
retraso, y se redondean de diez en diez: «en unos 10 minutos», «en unos 20 minutos», «en unos 30
minutos», «en unos 40 minutos». Por debajo de diez, «en pocos minutos».

**La pantalla**, de arriba abajo:

- Nota: «Te avisa cuando el radar de AEMET prevé que va a llover donde estás en menos de una hora.
  Solo funciona en España.»
- Interruptor: «Avisarme cuando vaya a llover»
- «Intensidad», el mismo ajustable de ahora.
- Interruptor: «Sin avisos de noche», con «Desde» y «Hasta», como ahora.

**En la lista de Avisos**: «Activado · cualquier lluvia».

## 3. Cómo se hace

**En el servidor**, en cada vuelta de recogida:

1. Para cada radar con imagen nueva y la de diez minutos antes, se calcula una vez hacia dónde se
   mueve la lluvia, por zonas de 40 km. Es lo del estudio, que tarda unos milisegundos por imagen.
2. Para cada teléfono con el aviso, se mira si la lluvia llegará a su ubicación en los próximos 40
   minutos, y en cuántos.
3. La decisión (avisar o no, el episodio, la noche) sigue siendo una función pura con el reloj
   inyectado. El cálculo del movimiento pasa del guion del estudio a `src/`, con sus pruebas: una
   mancha de lluvia que se mueve a velocidad conocida tiene que llegar cuando toca.

Lo que se recuerda de una vuelta a la siguiente para «confirmar» la llegada se guarda en memoria, no
en la base de datos: si el servidor se reinicia, el aviso tarda una imagen más en salir, nada más.

**En la app**: quitar la distancia y el segundo aviso de la pantalla y de lo que se manda, y los
textos nuevos. El
servidor seguirá aceptando la distancia que manden las versiones de antes, y no la usará.

**Todo va por aire**, como el primero. Política de privacidad: una línea menos (la distancia).

## 4. Lo que no hace

- Prever chubascos que nacen en esa misma hora. **Dos de cada tres lluvias llegan sin aviso**, según
  el estudio: son las que se forman encima o cerca. Eso es lo que podría mejorar un modelo de IA,
  más adelante.
- Decir cuánto va a durar ni cuánto va a llover.

## 5. Lo decidido y lo que queda

1. **El texto**, aprobado por Jose el 2026-11-20.
2. **El segundo aviso se quita**: medido, un «Empieza a llover» falla la mitad de las veces y llega
   tarde.
3. **El margen, 40 minutos**, elegido por Jose el 2026-11-20 tras ver la hora excesiva. Acierta la
   mitad de las veces y avisa con unos 30 minutos de antelación; con 30 acertaba algo más (53 %)
   pero avisaba con unos 20.
4. **Volver a medir en diciembre** con semanas nuevas, aprobado.
