# Propuesta: el widget de EasyWeather

Borrador del 2026-10-21 para decidir antes de escribir código. Nada de esto está aprobado.

Lo que se pide: **que cada persona elija qué datos de la app salen en el widget.**

---

## 1. Dónde se elige

iOS ya tiene un sitio para esto: mantener pulsado el widget → **Editar widget**. Sale una hoja del
sistema con las opciones que la app declare, y cada widget guarda las suyas: se pueden tener dos
widgets, uno de Madrid y otro de la ubicación actual, cada uno con sus datos. Es una pantalla de
iOS, no nuestra, así que VoiceOver la maneja como cualquier ajuste del sistema. Exige iOS 17.

Lo que se elegiría ahí:

- **El lugar**: «Ubicación actual» o cualquiera de *Mis lugares*.
- **Los datos**: un interruptor por dato (lista en el apartado 4).

Lo que **no** se elige: el aviso oficial naranja o rojo. Si lo hay, sale siempre y primero, igual
que en la pantalla del lugar.

## 2. Cómo se construye: tres caminos

### A. `expo-widgets` (de Expo, estable desde el SDK 56)

El widget se escribe en JavaScript con componentes de SwiftUI (`@expo/ui`), y las opciones de
«Editar widget» se declaran en `app.json`.

- A favor: es de Expo, va con el SDK y la app ya es Expo. `@expo/ui` tiene `accessibilityLabel`.
- **En contra, y decide:** las opciones de «Editar widget» solo pueden ser **listas fijas escritas
  en `app.json`** (comprobado en el código del generador de la 57.0.27: texto, número, sí/no o una
  lista cerrada). **No puede ofrecer *Mis lugares***, que cambian en cada teléfono. El lugar habría
  que elegirlo dentro de la app, uno para todos los widgets.
- **En contra, y también pesa:** el widget no puede pedir nada a internet. Solo enseña lo que la app
  le haya dejado al abrirse. Si no se abre la app en un día, el widget enseña datos de ayer (con su
  hora, pero de ayer).

### B. `@bacons/apple-targets` y el widget escrito en Swift (recomendado)

El plugin (de Evan Bacon, de Expo; versión 5.0.0, julio de 2026, se declara experimental) solo crea
la extensión en el proyecto nativo. El widget se escribe en SwiftUI.

- A favor: **«Editar widget» puede ofrecer la lista de *Mis lugares*** del teléfono (`AppIntent` con
  una consulta de entidades), y cada widget tiene su lugar.
- A favor: **el widget puede refrescarse solo**, sin abrir la app (apartado 3).
- A favor: control completo de lo que lee VoiceOver con las herramientas de Apple.
- En contra: hay Swift que mantener, y no se prueba con Jest. Para que sea poco, el widget **no
  decide nada**: pinta textos que ya le llegan hechos.
- En contra: «experimental». Lo que genera es un target normal de Xcode, así que si el plugin se
  abandona, el widget sigue siendo código Swift corriente.

### C. Escribirlo todo a mano con un config plugin propio

Como B pero manteniendo nosotros el plugin que añade el target al proyecto de Xcode. Es lo que hace
B, con más trabajo y sin ganar nada. Descartado.

## 3. De dónde saca los datos (solo con B)

Un widget no ejecuta la app. Hay dos fuentes, y se proponen las dos:

1. **Lo que deja la app** en un *App Group* (almacén compartido entre la app y el widget) cada vez
   que carga un lugar. Inmediato y gratis.
2. **Una ruta nueva del servidor propio**, `/apps/easyweather/widget?lat=…&lon=…`, que devuelve los
   textos del widget ya escritos. El servidor ya arma el texto de las notificaciones con el código de
   esta app (`openMeteo`, `weatherCodes`, la prueba de paridad), así que los textos salen del mismo
   sitio que los de la app y el Swift solo los pinta. Con esto el widget se pone al día solo.

**Cada cuánto se refresca no lo decide la app**: iOS da un presupuesto al día (del orden de 40 a 70
refrescos según el uso) y puede recortarlo. Se pediría cada 30 minutos y el widget **dice siempre
la hora del dato**. Un dato viejo no se presenta como actual.

Esto toca el servidor y es una ruta nueva: la propongo aquí, pero es su propia decisión.

### Cómo se actualiza, tal como quedó (2026-10-24)

El widget se redibuja por cuatro caminos:

1. **Al abrir la app**: deja sus datos en el App Group y pide a iOS que redibuje el widget en el
   momento. Tocar el widget abre la app, así que también lo actualiza: eso es lo que parecía «se
   actualiza al tocarlo» en la build 24.
2. **Al moverte**, solo «Mi ubicación»: el seguidor de la app (`modules/ubicacion-significativa`)
   recibe de iOS los cambios significativos de ubicación, también con la app cerrada (iOS la relanza
   en segundo plano). Si te has movido más de 500 m, deja la posición y el nombre del sitio en el
   App Group y pide a iOS que redibuje el widget. Necesita el permiso «Siempre»; con él se enciende
   aunque no haya avisos, y entonces la posición no sale del teléfono (al servidor de avisos solo
   se reporta si hay avisos activos, como antes). Comprobado en el simulador con la app delante,
   detrás y cerrada.
3. **Cuando iOS lo refresca**, cada media hora como mucho y según su presupuesto. En cada refresco,
   «Mi ubicación» toma la posición del seguidor si es reciente; si no, la pide el propio widget, y
   solo si iOS se lo permite (`isAuthorizedForWidgetUpdates`). Con la posición, pide al servidor
   los datos de ese sitio.
4. **Cuando cambia el texto de la hora** («A las» pasa a «Datos de las»), sin datos nuevos.

En la build 24 solo existían el 1 y el 3, y el 3 pedía la posición sin comprobar si iOS se la
daba al widget, con esperas de hasta 25 segundos que iOS podía cortar. Por eso tardaba.

## 4. Los datos que se pueden elegir

Todos existen ya en la app. Marcados con ✓ los que saldrían activados la primera vez.

| Dato | Ejemplo |
| --- | --- |
| ✓ Temperatura ahora | 18° |
| ✓ Estado del cielo | Nubes y claros |
| ✓ Máxima y mínima de hoy | Máx. 22°, mín. 12° |
| Sensación térmica | Sensación de 16° |
| ✓ Probabilidad de lluvia | Lluvia 40 % |
| Viento | Viento 25 km/h, del oeste |
| Humedad | Humedad 70 % |
| Índice UV | UV 6, alto |
| Medición de la estación AEMET | Estación de Retiro: 17,4° |
| Salida y puesta de sol | Sol de 8:21 a 19:02 |

Cuántos caben depende del tamaño. Si se eligen más de los que caben, salen los primeros de la lista
en ese orden, y **VoiceOver lee lo mismo que se ve**: el pequeño, tres datos; el mediano, siete.

> Cambiado el 2026-10-22. Al principio VoiceOver leía todos los elegidos en los dos tamaños, para no
> perder nada por falta de sitio. Con VoiceOver el pequeño y el mediano sonaban igual, y Jose pidió
> el comportamiento de los widgets de Apple: el tamaño cambia también lo que se oye. Lo que se lee
> se elige igual que lo que se ve, en «Editar widget».

| Tamaño | Lugar | Datos que caben |
| --- | --- | --- |
| Pequeño | sí | temperatura y dos más |
| Mediano | sí | temperatura y cuatro más |
| Grande | sí | todos, y los próximos tres días |
| Pantalla bloqueada, en línea | no | temperatura y cielo |
| Pantalla bloqueada, rectangular | sí | temperatura y uno más |

## 5. Los textos

Lo que se ve y lo que se oye, juntos para revisarlos de una vez.

**En «Editar widget»:**

- Título de la hoja: «Tiempo»
- «Lugar» → «Ubicación actual» / nombres de *Mis lugares*
- Un interruptor por dato, con el nombre de la primera columna de la tabla de arriba.

**En la galería de widgets:**

- Nombre: «El tiempo»
- Descripción: «La temperatura y los datos que elijas de un lugar. El pequeño ocupa el sitio de
  cuatro iconos, y el mediano, el de ocho.» (Lo que ocupa, añadido el 2026-10-22 a petición de Jose.)

**En el widget**, además de los datos:

- La hora: «A las 17:40». Si tiene más de dos horas: «Datos de las 11:10».
- Aviso: «Aviso naranja: lluvias» (el nivel y el fenómeno; el resto, al abrir la app).
- Sin datos todavía: «Abre EasyWeather para cargar este lugar.»
- Lugar borrado de *Mis lugares*: «Este lugar ya no está en Mis lugares.»

**Lo que lee VoiceOver**: un solo elemento por widget, en este orden, y tocarlo abre ese lugar en la
app:

> «Madrid. Aviso naranja: lluvias. 18 grados, nubes y claros. Máxima 22, mínima 12. Lluvia, 40 por
> ciento. A las 17:40.»

Primero el lugar, porque con varios widgets es lo que dice cuál es cuál; después el aviso, si lo hay;
la hora al final, porque es lo que menos se necesita oír cada vez.

## 6. Fases

1. **El widget con datos fijos de la app** (App Group), en el simulador. Sin «Editar widget» todavía.
   Es donde se comprueban la extensión, la firma y lo que lee VoiceOver.
2. **«Editar widget»**: el lugar y los datos.
3. **El refresco solo**, con la ruta del servidor (si se aprueba).
4. **Build 23** a TestFlight. El widget no viaja por aire: necesita build.

Cada fase se prueba en el simulador con capturas, también con letra grande y modo oscuro. Lo que no
se puede probar en el simulador, y queda para los probadores: el refresco real con el presupuesto de
iOS y VoiceOver en un teléfono.

## 7. Lo que cambia en la configuración nativa

- Una extensión nueva (target de Xcode) con su identificador: `com.jmortizsilva.tiempo.widget`, y
  `.dev.widget` en la variante de pruebas.
- Un App Group: `group.com.jmortizsilva.tiempo` (y el de pruebas aparte). Hay que darlo de alta en
  Apple; EAS lo hace solo al compilar en la nube. En local, el perfil automático ya dio guerra con
  las notificaciones (`docs/COMPILAR-EN-EL-MAC.md`), así que la firma se prueba en la fase 1.
- En el simulador no hace falta firmar, así que las fases 1 a 3 no dependen de eso.

## Fuentes

- [Widgets, documentación de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/widgets/)
- [iOS widgets and Live Activities are stable in Expo SDK 56](https://expo.dev/blog/ios-widgets-and-live-activities-in-expo)
- [@bacons/apple-targets, README](https://unpkg.com/@bacons/apple-targets@3.0.2/README.md) y
  [guía de datos compartidos](https://mintlify.com/EvanBacon/expo-apple-targets/guides/sharing-data)
- [Petición en Expo de opciones dinámicas en widgets configurables](https://github.com/expo/expo/issues/44249)
