# Revisar la accesibilidad de EasyWeather con el puente

Cómo se hace **en esta app**. Lo general —qué es el puente, los tres frenos que impiden que llegue
a una build publicada, las ocho condiciones del sistema y la lista de qué mirar en cada captura—
está en [`comun/herramientas/puente/README.md`](../../../comun/herramientas/puente/README.md), y no
se repite aquí. Esto es solo lo que cambia por ser esta app.

## Arrancar

```bash
node ../../comun/herramientas/puente/servidor/servidor.mjs   # una terminal, se deja abierta
npm start                                                    # otra: la app en desarrollo
```

La app se conecta sola y reintenta cada tres segundos, así que el orden da igual.

```bash
curl http://127.0.0.1:8790/estado      # ¿hay móvil?
node herramientas/comprobar-puente.mjs # repasa todo de un tirón y dice qué está roto
```

`comprobar-puente.mjs` recorre las piezas en orden —conexión, las tres pestañas, las seis acciones,
lo que tiene que contestar diciéndolo— y separa lo que está **mal** de lo que está **pendiente de
build**. Se pasa después de tocar cualquier cosa del puente, y en los pasos visibles avisa de que hay
que mirar el móvil, porque eso no lo puede comprobar él.

> **No se añade un `npm run puente`.** La regla de `comun/` es por la huella nativa; aquí
> `runtimeVersion` es una cadena fija y no la política `fingerprint`, así que no habría
> riesgo, pero el guion tampoco hace falta y la costumbre se mantiene igual en los dos proyectos.

## Lo que aquí es distinto: se navega por PESTAÑAS, no por rutas

Esta app no usa Expo Router (la migración está aplazada; ver PENDIENTE.md). Navega con
`PestanasContext`, así que el servicio `navegar` espera **la clave de la pestaña**, no una ruta:

```bash
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json"      -d '{"servicio":"navegar","parametros":{"ruta":"avisos"}}'
```

Las tres son `hoy`, `lugares` y `avisos`. El porqué y cómo se inyecta la navegación está en
[`src/desarrollo/navegacion.ts`](../src/desarrollo/navegacion.ts).

Y **`volver` no existe de verdad**: no hay pila de navegación. Contesta diciéndolo y listando las
acciones, en vez de callarse y dejar pensando que la orden se ejecutó.

## Todo lo demás se abre con acciones

La búsqueda vive dentro de «Mis lugares» y las tres secciones de avisos dentro de «Avisos»: se abren
con estado local, no navegando. Por eso hay acciones registradas:

| Acción | Qué abre | Dónde está registrada |
|---|---|---|
| `abrirBusqueda` / `cerrarBusqueda` | La hoja de búsqueda | `src/screens/PlacesScreen.tsx` |
| `abrirPrevision` | La ficha de Madrid sin guardar, dentro de la búsqueda | idem |
| `abrirTemperatura` | Aviso de temperatura | `src/screens/avisos/AvisosIndexScreen.tsx` |
| `abrirResumenes` | Resúmenes | idem |
| `abrirOficiales` | Avisos oficiales de AEMET | idem |
| `cerrarSeccion` | Cierra la hoja que haya abierta | idem |

```bash
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json"      -d '{"servicio":"acciones"}'                      # las de la pestaña que está delante
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json"      -d '{"servicio":"accion","parametros":{"nombre":"abrirTemperatura"}}'
```

Son **las mismas funciones que llaman las filas**, no un toque simulado: sirven para llegar al
estado y fotografiarlo, no para comprobar que el toque funciona.

## La tanda

`docs/pantallas.txt` es la definición de «todas las pantallas» de esta app, estados incluidos. Se
actualiza al añadir una.

```bash
node ../../comun/herramientas/puente/servidor/tanda.mjs docs/pantallas.txt --condicion normal
node ../../comun/herramientas/puente/servidor/tanda.mjs docs/pantallas.txt --condicion texto-grande
node ../../comun/herramientas/puente/servidor/tanda.mjs docs/pantallas.txt --condicion oscuro
```

Una tanda por condición; quien tiene el móvil solo cambia el ajuste del sistema entre tanda y tanda.
Si solo hay tiempo para una además de la normal, **texto grande + modo oscuro**.

Al final, lo encontrado se escribe en `docs/` con fecha: qué se revisó, qué salió, qué se arregló y
qué se dejó pendiente con su motivo.

## Lo que queda por debajo de la pantalla

La tanda solo fotografía lo que cabe en la pantalla, y con la letra grande lo roto suele estar
abajo: así se le escapó a la revisión del 6 de octubre todo lo de la
[del 10](REVISION-ACCESIBILIDAD-2026-10-10.md). Para eso hay tres servicios, añadidos el
2026-10-10:

```bash
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json" \
     -d '{"servicio":"desplazables"}'                                  # qué zonas hay ahora
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json" \
     -d '{"servicio":"paginaCompleta","parametros":{"nombre":"hoy"}}'  # la zona entera, en base64
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json" \
     -d '{"servicio":"desplazar","parametros":{"nombre":"hoy","y":1800}}'
```

Cada zona se apunta en su pantalla con `useDesplazableDePuente('nombre')`
([`src/desarrollo/desplazables.ts`](../src/desarrollo/desplazables.ts)). Hay: `hoy` (la página
del lugar que está delante), `dia`, `estacion`, `avisos-del-lugar`, `lugares`, `buscar`, `avisos`,
`aviso-temperatura`, `avisos-resumen`, `resumen-editor` y `fenomenos`. Una zona solo existe
mientras está montada: las ventanas hay que abrirlas antes.

Para las ventanas de «Hoy» hay acciones: `abrirDia` (la ficha de mañana), `abrirHoraAHora` (la de
hoy), `abrirEstacion`, `abrirAvisosDelLugar` y `cerrarVentana`.

**`paginaCompleta` se deja cosas**: dibuja con `renderInContext`, porque el método normal falla
con zonas altas, y ese no pinta el texto de los botones ni del campo de búsqueda, entre otras
cosas. Lo que salga raro ahí se confirma con `desplazar` y una captura normal antes de darlo por
fallo. Y `desplazar` no frena al final del contenido: una `y` de más enseña un hueco en blanco.

## Medir, cuando la captura no basta

Una captura dice QUE algo no cabe, pero no CUÁNTO ocupa cada cosa. Para eso están dos servicios:

```bash
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json"      -d '{"servicio":"entorno"}'   # escala de letra, ventana, tema, qué binario es
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json"      -d '{"servicio":"medidas"}'   # alturas reales de lo que se haya instrumentado
curl -X POST http://127.0.0.1:8790/pedir -H "content-type: application/json"      -d '{"servicio":"recargar"}'  # recarga el bundle, como la «r» de Metro
```

`medidas` empieza vacío: se llena colgando un `onLayout` de lo que se quiera medir.

```tsx
import { anotarMedida } from '../desarrollo/medidas';

<View onLayout={(e) => anotarMedida('cabecera', e.nativeEvent.layout)}>
```

Se quita al terminar el diagnóstico; no se deja puesto en las pantallas. Así se resolvió el
2026-10-06 por qué «Hoy» se quedaba sin contenido con la letra al máximo: la cabecera medía 850
puntos de los 874 de la pantalla, y 724 eran del título.

**Y una trampa de este mismo servicio**: tras un Fast Refresh las medidas pueden ser VIEJAS. Al
cambiar algo que afecta a cómo se mide el texto, usar `recargar` antes de creerse un número. El
mismo título daba 724 puntos recién editado y 162 tras recargar.

## El rastro, que es lo que la captura no enseña

El servicio `rastro` devuelve qué se anunció y a dónde fue el foco, en orden y con milisegundos.
**Hoy devuelve siempre una lista vacía**, y eso no es un fallo del puente: hay que llamar a
`anotarSuceso` desde las funciones que anuncian y mueven el foco (paso 5 del README de `comun/`).
Esta app todavía no tiene un `src/accesibilidad/` propio con esas funciones centralizadas; mientras
no lo tenga, el rastro no se llena.

## Lo que falta para que haya capturas

**Una build de desarrollo nueva.** `react-native-view-shot` es un módulo nativo: está instalado y el
código lo llama, pero hasta que no entre en una build el servicio `pantalla` contestará
`{"ok":false}` con el error del módulo que no está. Lo demás —`navegar`, `acciones`, `accion`,
`rastro`, los informes— funciona ya con la build que haya.

En la misma build entra el texto de `NSLocalNetworkUsageDescription`, ya declarado en `app.json`.
Sin él, el cliente de desarrollo de Expo muestra uno genérico; no impide que el puente funcione.
