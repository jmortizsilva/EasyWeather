# Estudio: ¿acierta el aviso de lluvia?

Hecho el 2026-11-19, a petición de Jose, que llevaba una semana con el aviso y no le aportaba nada.
El guion es `herramientas/estudiar-aviso-lluvia.ts` del repositorio del servidor; se puede volver a
pasar con más semanas.

## Qué se midió

Con los barridos guardados del radar de AEMET (del 7 al 21 de octubre y del 5 al 19 de noviembre de
2026), se simuló el aviso en los **1.320 municipios de España con al menos 5.000 habitantes**, unos
35.000 días-sitio. Se compararon tres reglas, todas con un aviso por episodio, como el de verdad:

- **La de ahora**: avisa cuando entra lluvia a menos de 35 km. Usa la misma función que el servidor.
- **Extrapolación**: compara cada imagen con la anterior para saber hacia dónde y a qué velocidad se
  mueve la lluvia (por zonas de 40 km), prolonga ese movimiento y avisa si llegará al sitio en la
  próxima hora.
- **Extrapolación confirmada**: la misma, pero solo si la llegada ya se preveía con la imagen anterior.

Y se puntuó con lo que pasó después: **si llovió encima del sitio** (a menos de 2 km, según el
propio radar) en la hora siguiente al aviso, y cuántas lluvias empezaron sin aviso previo.

## Resultados

Con «cualquier lluvia» (12 dBZ):

| | La de ahora | Extrapolación | Confirmada |
| --- | --- | --- | --- |
| Avisos por sitio y semana | 14,5 | 11,4 | 6,8 |
| Llovió encima en la hora siguiente | **3 %** | 23 % | **46 %** |
| … en las dos horas siguientes | 6 % | 34 % | 57 % |
| Lluvias avisadas entre 10 y 60 min antes | 5 % | 31 % | 35 % |
| Minutos hasta la lluvia, mediana de los aciertos | 60 | 50 | 40 |

Con «desde moderada» (30 dBZ), tanto para avisar como para decidir si llovió:

| | La de ahora | Extrapolación | Confirmada |
| --- | --- | --- | --- |
| Avisos por sitio y semana | 16,4 | 5,6 | 3,0 |
| Llovió encima en la hora siguiente | **2 %** | 24 % | **48 %** |
| Lluvias avisadas entre 10 y 60 min antes | 11 % | 38 % | 40 % |
| Minutos hasta la lluvia, mediana de los aciertos | 60 | 50 | 30 |

**El aviso de ahora no sirve**: 97 de cada 100 avisos no van seguidos de lluvia en la hora
siguiente. Las 14,5 alertas por semana cuadran con lo que recibió Jose (19 en 8 días). Que haya
lluvia a 30 km no dice nada de si llegará: casi nunca llega.

**La extrapolación confirmada acierta la mitad de las veces**, con unos 40 minutos de margen, y
avisa de una de cada tres lluvias. Las demás no se pueden prever moviendo lo que ya hay: son
chubascos que nacen o crecen encima o cerca del sitio en esa misma hora.

## Con menos margen (20 de noviembre)

Jose vio excesiva la hora. Misma extrapolación confirmada, avisando solo si la lluvia llegará en 30 o
40 minutos (variable `MARGEN` del guion, en pasos de 10 minutos):

| Margen | Avisos por sitio y semana | Llovió dentro del margen | Llovió en la hora siguiente | Minutos hasta la lluvia (mediana) | Lluvias avisadas antes |
| --- | --- | --- | --- | --- | --- |
| 30 min | 5,2 | 53 % | 64 % | 20 | 31 % |
| 40 min | 5,9 | 50 % | 58 % | 30 | 33 % |
| 60 min | 6,8 | 46 % | 46 % | 40 | 35 % |

Con «desde moderada» las proporciones son casi iguales, con menos de la mitad de avisos (2,1, 2,5 y
3,0 por semana). Menos margen da menos avisos y más aciertos, a cambio de avisar más tarde.

## Un aviso «Empieza a llover»

Se midió también avisar cuando llueve encima tras una hora seca, como sustituto del segundo aviso:

- Saltaría **8,6 veces por sitio y semana** con cualquier lluvia, y 3,5 desde moderada.
- **La mitad no sigue**: solo en el 50 % de las veces sigue lloviendo diez minutos después (40 %
  desde moderada). El resto son ecos que aparecen y se van.
- Una de cada tres ya estaba avisada por la extrapolación.
- Y llegaría tarde: la imagen del radar tarda entre 5 y 11 minutos en publicarse, y la recogida va
  cada 5. Cuando sonase, llevaría lloviendo diez minutos o más. Esperar a una segunda imagen para
  quitar los ecos sueltos lo retrasaría otros diez.

No compensa.

## Lo que hay que tener en cuenta

- **La verdad es el propio radar**, no un pluviómetro. Un eco débil de 12 dBZ puede no llegar al
  suelo, y el radar ve mal lo que está muy lejos o detrás de una sierra. Por eso hay muchas «lluvias
  que empiezan» (más de una por sitio y día): parte son ecos débiles que aparecen y desaparecen.
- **Cuatro semanas, y todas de otoño.** En verano las tormentas nacen más que se desplazan, y la
  extrapolación acertará menos.
- **Se supone que todos los radares funcionan.** El de Almería estuvo caído parte de noviembre.
- **No se ha afinado nada**: tamaño de las zonas, velocidad máxima, margen de 3 km. Afinarlo con
  estas mismas semanas inflaría las cifras; habría que comprobarlo con semanas nuevas.

## ¿Merece la pena la IA?

Todavía no. La IA mejora a la extrapolación sobre todo a más de una hora vista y en prever cómo
crece o se deshace la lluvia, que es justo lo que aquí falla. Pero para eso haría falta entrenarla
con los radares de AEMET, que dan una imagen cada 10 minutos y con la intensidad en escalones, y
una máquina con tarjeta gráfica que no tenemos. La extrapolación confirmada pasa del 3 % al 46 % sin
nada de eso, y corre en el servidor que ya hay: el estudio entero, 35.000 días-sitio, tarda unos
cuatro minutos.

## Propuesta

1. Cambiar el aviso a la extrapolación confirmada, con un texto que diga cuándo: «Empezará a llover
   en unos 30 minutos, según el radar de AEMET de las 16:50.» La distancia deja de tener sentido
   como ajuste; la intensidad se queda.
2. Volver a pasar el estudio dentro de un mes, con semanas que no se hayan usado para decidir, y
   ver si las cifras se mantienen.
3. Solo si se quedan cortas, mirar la IA, y medirla con este mismo guion.
