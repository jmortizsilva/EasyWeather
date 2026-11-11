# Propuesta: el radar en la ficha del lugar

Propuesta del 2026-11-11, **aprobada por Jose el mismo día** tal como está: el radar más cercano de
los que cubren el punto y tienen imagen de menos de 20 minutos, 12 dBZ, 50 km, los textos del
apartado 3 y la línea debajo de la medición de la estación.

Es el primer paso del aviso de lluvia ([PENDIENTE.md](PENDIENTE.md), «Lo que se propone empezar»):
enseñar en la pantalla, sin notificaciones, lo que dice el radar de AEMET alrededor de cada lugar.
Así se ve durante unas semanas qué pinta tiene el dato antes de decidir cuándo debe sonar un aviso.

Lo que ya hay en el servidor: la recogida de los quince radares cada pocos minutos, el centro de
cada uno situado en la imagen, la proyección de un punto a su píxel y la máscara de lo que está
siempre encendido.

---

## 1. Qué radar manda

Los discos de los radares se solapan, y un radar puede caerse: **Almería no da imágenes desde el
30 de octubre de 2026** (AEMET contesta «Error al obtener los datos»). Propuesta:

- **El más cercano que cubra el punto y tenga una imagen reciente.** El más cercano ve más bajo y
  con más detalle. «Cubrir» es estar a menos de 230 km del radar y dentro de la parte de la imagen
  que se lee. «Reciente» es de hace menos de 20 minutos: dos barridos.
- **Si el más cercano está caído o atrasado, el siguiente** que cubra el punto. Con el de Almería
  caído, a Almería ciudad le tocaría Murcia (a 195 km; Málaga está a 197), a El Ejido Málaga (a 166
  km) y a Huércal-Overa Murcia (a 118 km). Son radares lejanos, que ven alto y con menos detalle:
  por eso la línea dice entonces de qué radar es el dato.
- **Si ninguno cubre el punto**, fuera de España o en un hueco, **no sale la línea**, igual que la
  medición de AEMET fuera de España.
- **Si los que lo cubren no tienen imagen reciente**, se dice: «Radar de AEMET sin imagen desde las
  9:50». Callarse haría pensar que no llueve.

Descartado: **juntar los radares que se solapan**. Daría más alcance en los bordes, pero dos
radares no ven lo mismo a la misma altura, y mezclar sus píxeles es otro trabajo. Si hace falta,
más adelante.

## 2. Qué se calcula

Sobre la última imagen del radar elegido, con la máscara aplicada:

- **La lluvia más cercana** dentro de un radio: a cuántos kilómetros y en qué dirección, con las
  ocho de la rosa (norte, noreste…), y su intensidad.
- **Si llueve encima**: hay eco a menos de 2 km del punto.
- **El radio que se mira: 50 km.** Más allá, la lluvia no le dice nada a quien está mirando su
  pueblo. Rain Alarm mira 35 km por defecto; 50 dan algo más de margen para verla venir.

**Desde qué intensidad cuenta como lluvia: 12 dBZ**, la banda más baja que pinta AEMET, unos 0,2
mm/h. Es el nivel 1 de Rain Alarm. La alternativa son 18 dBZ (unos 0,6 mm/h), que se salta la
llovizna y algo de ruido suelto. Recomiendo 12, porque esto es la pantalla y no un aviso: si AEMET
lo pinta como lluvia, se dice.

**La intensidad, con las palabras de AEMET**, pasando los dBZ a mm/h:

| mm/h | Se dice |
| --- | --- |
| menos de 2 | débil |
| de 2 a 15 | moderada |
| de 15 a 30 | fuerte |
| 30 o más | muy fuerte |

## 3. Dónde y cómo se ve

Una línea más en la ficha del lugar, debajo de la medición de la estación, con la misma forma que
todo lo demás: el dato, su hora y su procedencia.

| Caso | En pantalla | VoiceOver |
| --- | --- | --- |
| Lluvia cerca | Radar 11:20: lluvia moderada a 9 km al oeste | Radar de AEMET de las 11:20: lluvia moderada a 9 kilómetros al oeste |
| Llueve encima | Radar 11:20: llueve aquí, débil | Radar de AEMET de las 11:20: llueve aquí, débil |
| Sin lluvia | Radar 11:20: sin lluvia a menos de 50 km | Radar de AEMET de las 11:20: sin lluvia a menos de 50 kilómetros |
| Radar de reserva | … · radar de Murcia | … Radar de Murcia. |
| Sin imagen reciente | Radar de AEMET sin imagen desde las 9:50 | Radar de AEMET sin imagen desde las 9:50 |
| Fuera de cobertura | (no sale) | (no sale) |

El nombre del radar solo se dice cuando no es el que toca, para no alargar el caso normal.

Tocar la línea no hace nada en esta fase. Más adelante podría abrir el detalle (los dos o tres
núcleos de lluvia más cercanos), si se ve que hace falta.

## 4. De dónde lo saca la app

**Una ruta nueva del servidor, `/apps/easyweather/radar?lat=…&lon=…`**, con la clave de la app como
las demás. El servidor ya tiene las imágenes, y la app no puede: AEMET solo da la última, y la clave
de AEMET no viaja en la app. Devuelve los textos ya escritos, para la pantalla y para VoiceOver, como
la ruta del widget, y los datos sueltos (distancia, dirección, intensidad, hora, radar) por si más
adelante el aviso los necesita.

- **Coste**: leer y decodificar un GIF de unos 15 KB por radar y barrido. Se guarda el último
  decodificado de cada radar, así que muchas consultas al mismo radar cuestan una sola lectura.
- **Privacidad**: las coordenadas viajan como en la medición o los avisos, no se guardan y, desde
  el 25 de octubre, tampoco quedan en el registro. La política no cambia.
- **Cuándo lo pide la app**: con la previsión, como la medición. El dato se renueva cada 10 minutos,
  así que no se pide más a menudo que eso.

## 5. Cómo se entrega

Es servidor más JavaScript de la app: **entra por aire** sobre la 1.2.0, sin build.

1. El servidor: la ruta y el cálculo, con pruebas sobre imágenes reales guardadas (la lluvia de
   Barcelona del 2 de octubre ya está entre las de prueba).
2. La app: la línea en la ficha, con sus textos y su prueba.
3. Una semana a la vista de los probadores, y luego a la Store por aire.

## Lo que hay que decidir

1. **Qué radar manda**: el más cercano con imagen reciente, y si no, el siguiente (apartado 1).
2. **El umbral**: 12 dBZ, que recomiendo, o 18 (apartado 2).
3. **El radio**: 50 km.
4. **Los textos y el orden de lectura** del apartado 3.
5. **Dónde va la línea**: debajo de la medición de la estación.
