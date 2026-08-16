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
| Temperatura y cielo "de ahora" | Open-Meteo | **Previsión** para la hora en curso | Directo desde el móvil |
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
------------------------------
Medido: 28,5º a las 13:00        <- AEMET. Con hora, porque no es "ahora".
Estación Madrid-Retiro, a 2,3 km
```

Antes ese bloque se titulaba **"Ahora"**, y era falso: el número siempre ha sido una previsión de
Open-Meteo para la hora en curso, no algo que nadie hubiera medido.

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

### El retraso de AEMET

AEMET publica el parte horario con unos **85 minutos de retraso**, de forma sistemática (medido
sobre las 849 estaciones: la mediana coincide con el mínimo). Por eso la hora de la medición se
enseña **siempre** y por eso el número grande sigue siendo el previsto: titular con un valor de hace
hora y media sería presentar un dato viejo como actual.

Existe un endpoint diezminutal que daría datos mucho más frescos, pero devuelve 429 con esta clave
incluso tras diez minutos sin usarla: o tiene cuota propia o no está incluido. Queda pendiente de
volver a probar.

## Atribución y licencias

- **AEMET**: autoriza el uso y la reproducción **citando a AEMET como autora** de la información.
- **Open-Meteo**: gratuito para uso no comercial, con atribución.

## Detalles técnicos que muerden

- **AEMET sirve en ISO-8859-15, no en UTF-8.** Leído como UTF-8, `VANDELLÓS` llega roto. Lo
  decodifica el servidor (`aemet/cliente.ts`); a la app llega ya bien.
- **Doble salto**: una petición a AEMET devuelve un sobre `{estado, datos, metadatos}` donde `datos`
  es una segunda URL, ya firmada, que se pide sin clave.
- **El viento de AEMET viene en m/s**; el servidor lo convierte a km/h, que es lo que enseña la app.
- **Las fechas de AEMET traen el desfase pegado** (`+0000`, sin dos puntos). Es ISO 8601 válido pero
  no la forma que el estándar de JavaScript obliga a interpretar, y Hermes es más estricto que Node:
  se normaliza en `utils/observacionTexto.ts` antes de parsear.
- **No hace falta el inventario de estaciones**: cada observación ya trae `lat`, `lon`, `alt` y
  nombre en decimal.
- **La medición no se guarda en disco**, al revés que la previsión. Una previsión de hace un rato
  sigue valiendo; una medición de hace un rato ya no es una medición de ahora.
