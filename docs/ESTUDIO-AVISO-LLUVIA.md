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
