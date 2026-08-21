# Fuentes de datos de EasyWeather

Qué dato viene de dónde, cuál está **medido** y cuál está **previsto**, y por qué unos se piden
desde el móvil y otros pasan por el servidor propio.

El principio que ordena todo esto: **cada dato tiene que poder contestar solo a cuánto vale, de
dónde viene, si es medido o previsto, a qué hora corresponde y para qué sitio.** Nunca se presenta
un modelo como una medición, ni una regla del usuario como un aviso oficial, ni un dato viejo como
uno actual.

## Quién da qué

| Dato | Fuente | Naturaleza | Cómo se pide |
|---|---|---|---|
| Previsión diaria y horaria | Open-Meteo | Previsión | Directo desde el móvil |
| Temperatura, cielo y **sensación térmica** "de ahora" | Open-Meteo | **Previsión** para la hora en curso | Directo desde el móvil |
| Altitud del terreno (`elevation`) | Open-Meteo | Dato fijo | Viene dentro de la previsión |
| Búsqueda de lugares | Open-Meteo (geocoding) | — | Directo desde el móvil |
| Nombre de "mi ubicación" | iOS (`expo-location`) | — | En el propio teléfono |
| Salida y puesta de la luna, fase | Cálculo local (`suncalc`) | Cálculo | En el propio teléfono |
| **Temperatura, humedad, viento y lluvia medidos** | **AEMET** | **Observación** | Por el servidor propio |

## Por qué Open-Meteo va directo y AEMET no

**Open-Meteo directo**: no necesita clave, y así la previsión **no depende de que el VPS esté
levantado**. Si el servidor propio se cae, la app sigue dando el tiempo; sólo desaparece la
medición, que es un extra.

**AEMET por el servidor** (`api.jmortiz.es`), por dos motivos:

1. Su clave no puede viajar en el bundle. Este repositorio es público, y una clave incrustada en un
   `.ipa` es extraíble.
2. AEMET **limita por minuto**. Una sola descarga en el servidor (unos 3 MB con las ~850 estaciones)
   sirve a todos los dispositivos; pedirla desde cada móvil sería insostenible.

Configuración de la clave: en el `.env` del repo `servidor-notificaciones`, variable
`AEMET_API_KEY`. Ver su `README.md`.

## La tarjeta de arriba, en detalle

```
PREVISTO PARA ESTA HORA          <- Open-Meteo. Es modelo, y el rótulo lo dice.
        28º
   Cielo despejado
 Sensación térmica 26,4º         <- También previsión: por eso va ARRIBA de la línea.
------------------------------
Medido: 28,5º a las 13:00        <- AEMET. Con hora, porque no es "ahora".
Estación Madrid-Retiro, a 2,3 km
```

Antes ese bloque se titulaba **"Ahora"**, y era falso: el número siempre ha sido una previsión de
Open-Meteo para la hora en curso, no algo que nadie hubiera medido.

**La sensación térmica está en el lado previsto a propósito.** AEMET no la publica, y calcularla a
partir de su medición para colocarla bajo el rótulo "Medido" sería presentar una cuenta nuestra como
si fuera una medición, que es justo lo que esta app no hace.

## Cómo se escriben y cómo se leen los números

Dos reglas, y las dos salieron de fallos reales que se vieron probando:

1. **Los decimales llevan coma** (`utils/text.ts`, `numeroEs`), en toda la app y en el servidor.
   Antes convivían las dos formas sin que se notara: la medición de AEMET escribía "28,5º" y la
   previsión de la línea de encima, "28.9º".
2. **Lo que se lee en voz alta no lleva símbolos ni abreviaturas.** Cada línea trae `value` (con º,
   %, km/h) y `spoken` (con "grados", "por ciento", "kilómetros por hora"). El símbolo º se lee como
   ordinal masculino y las abreviaturas se expanden de forma distinta según el contexto, así que dos
   filas de la misma pantalla acababan sonando diferente. Esto vale también para el **cuerpo de las
   notificaciones**, que se arma con `spoken`.

Los textos de `buildDayDetails` los **copia el servidor** (`dominio/dayDetails.ts`) para redactar los
avisos, y su test de paridad los fija. Cualquier cambio aquí se refleja allí **en el mismo commit**,
y no llega a los avisos hasta que el VPS se vuelve a desplegar.

**La medición falta a menudo, y es normal.** Fuera de España no hay red de AEMET; dentro, puede que
no haya estación lo bastante cerca o que la que hay esté a otra altura. Cuando falta, la tarjeta se
queda sólo con la previsión, sin mensajes de error: no ha fallado nada.

### Cuándo se acepta una estación

Se descarta si está a más de **25 km**, si su altitud difiere en más de **300 m** o si su parte
tiene más de **3 horas**.

El desnivel importa tanto como la distancia: el aire se enfría del orden de 6,5 °C por cada 1.000 m,
así que 300 m ya son unos 2 °C de error. Una estación a 10 km pero 1.000 m más arriba no representa
tu calle por muy cerca que esté en el mapa.

Los 25 km salen de medir la red real (849 estaciones emitiendo, agosto de 2026): todo sitio poblado
que se probó tiene estación a menos de 5 km, y el más apartado, Las Hurdes, a 13,5 km.

### El retraso de AEMET, y cómo se reduce

La medición se pide en **dos pasos**, y el motivo es el retraso:

1. **Qué estación representa el punto** sale del fichero horario `/observacion/convencional/todas`.
   Es el único que las trae todas (~850 estaciones, 3 MB), pero su dato llega con **49-85 minutos**
   de retraso.
2. **El dato fresco** sale de `/observacion/convencional/diezminutal/datos/estacion/{idema}`, ya
   sabiendo qué estación es. Ese llega con unos **13 minutos**, y eso ya se puede llamar "ahora".

Medido sobre las estaciones de doce capitales (2026-08-16), **diez de doce pasan de 53 a 13
minutos**. Las otras dos —Barcelona Drassanes y Sevilla Tablada— no mejoran, pero no por falta de
diezminutal: esas estaciones van atrasadas **en los dos ficheros** (Barcelona marcaba 113 minutos en
ambos). Cuando el diezminutal no es más reciente que el horario, se usa el horario.

**No existe una versión masiva utilizable del diezminutal.** `/diezminutal/todas` devuelve 429
siempre, incluso tras diez minutos de reposo y muy por debajo del límite documentado de 50
peticiones por minuto: ese recurso concreto tiene su propio límite. Por estación, en cambio,
responde sin problemas y pesa unos 135 KB.

Aun con 13 minutos, la hora de la medición se enseña **siempre**, y el número grande sigue siendo el
previsto: la medición es de un punto concreto y de hace un rato; la previsión es de tu hora y de tu
sitio. Son cosas distintas y las dos se dicen por su nombre.

## Atribución y licencias

- **AEMET**: autoriza el uso y la reproducción **citando a AEMET como autora** de la información.
- **Open-Meteo**: gratuito para uso no comercial, con atribución.

Dónde se cumple, que no es solo la ficha del App Store:

1. **Al pie de la previsión** (`PrevisionLugar`): un enlace a Open-Meteo siempre, y otro a AEMET
   **solo cuando hay medición**. Citar una fuente que no se ha usado engaña tanto como no citar la
   que sí. El "· AEMET" de la línea de la estación no cuenta como atribución: es parte del dato.
2. **Dentro del texto que se comparte** (`utils/compartir.ts`). Compartir es redistribuir, y ahí
   fuera ya no hay rótulos que expliquen qué es previsto y qué medido: el texto tiene que decirlo.

## Detalles técnicos que muerden

- **AEMET sirve en ISO-8859-15, no en UTF-8.** Leído como UTF-8, `VANDELLÓS` llega roto. Lo
  decodifica el servidor (`aemet/cliente.ts`); a la app llega ya bien.
- **Doble salto**: una petición a AEMET devuelve un sobre `{estado, datos, metadatos}` donde `datos`
  es una segunda URL, ya firmada, que se pide sin clave.
- **El viento de AEMET viene en m/s**; el servidor lo convierte a km/h, que es lo que enseña la app.
- **El horario y el diezminutal son formatos DISTINTOS**, no variantes. El horario usa minúsculas
  (`ta`, `hr`, `fint`) y `lat`/`lon` sueltos; el diezminutal usa mayúsculas (`TA`, `HR`, `VV10m`),
  llama `Fecha` a la hora y mete las coordenadas en un GeoJSON `LOC` con el orden `[lon, lat]`.
- **Las unidades del diezminutal no están documentadas**: AEMET sirve para esa ruta los metadatos
  del fichero horario, que describen otros campos. Se comprobaron cotejando las dos rutas para la
  misma estación y los mismos trece instantes: temperatura, humedad, presión, viento medio,
  dirección y punto de rocío coinciden valor a valor. Los únicos que no cuadran son los de ventana
  distinta: `VMAX10m` es la racha de **10 minutos** y `vmax` la de **60**; igual con las mínimas y
  máximas. El sufijo `10m` es la ventana, no otra unidad.
- **Las fechas de AEMET traen el desfase pegado** (`+0000`, sin dos puntos). Es ISO 8601 válido pero
  no la forma que el estándar de JavaScript obliga a interpretar, y Hermes es más estricto que Node:
  se normaliza en `utils/observacionTexto.ts` antes de parsear.
- **No hace falta el inventario de estaciones**: cada observación ya trae `lat`, `lon`, `alt` y
  nombre en decimal.
- **La medición no se guarda en disco**, al revés que la previsión. Una previsión de hace un rato
  sigue valiendo; una medición de hace un rato ya no es una medición de ahora.
