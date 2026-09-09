# Política de privacidad de EasyWeather

_Última actualización: 9 de septiembre de 2026_

EasyWeather es una aplicación de previsión meteorológica. Esta política explica qué datos usa
la app y cómo los trata. En resumen: **EasyWeather no crea cuentas, no muestra publicidad y no
hace seguimiento de sus usuarios.**

Para enseñarte el tiempo, la app consulta el servicio Open-Meteo y un servidor propio, al que
pide la medición de la estación más cercana y los avisos oficiales de AEMET. En esas consultas
viajan las coordenadas del lugar que estás mirando, pero **no se guardan**: se usan para
responder y se descartan. Solo si activas algún **aviso** —funciones opcionales y desactivadas
de fábrica— se registran datos en ese servidor, para poder avisarte del tiempo del sitio donde
estés aunque no tengas la app abierta (se explica más abajo).

## Datos que usa la app

- **Ubicación.** Si concedes el permiso, la app usa las coordenadas de tu dispositivo
  para mostrarte la previsión de tu zona. Esas coordenadas se envían al servicio
  meteorológico Open-Meteo y también a nuestro propio servidor, que las necesita para buscar
  la estación de medida más cercana y los avisos oficiales que afectan a ese punto. En ninguno
  de los dos casos se almacenan: se usan para responder a esa consulta y se descartan. Lo
  mismo vale para cualquier lugar que busques o tengas guardado. Puedes usar la app sin
  conceder el permiso de ubicación, buscando lugares por su nombre. **Si activas algún
  aviso**, la ubicación además queda registrada en nuestro servidor, como se describe en el
  apartado siguiente.
- **Lugares guardados y preferencias.** Los lugares que añades y la previsión reciente se
  guardan **solo en tu dispositivo** (almacenamiento local de la app) y se borran si
  desinstalas la app. La configuración de los avisos que actives se guarda además en nuestro
  servidor, porque es él quien te los envía (ver más abajo).

## Avisos (opcional)

La app incluye tres tipos de aviso, todos opcionales y desactivados por defecto:

- **Aviso de temperatura**: te notifica cuando la temperatura de tu ubicación sube o baja de
  los límites que elijas.
- **Aviso de resumen**: te envía a la hora que elijas un resumen del tiempo, de tu ubicación o
  de una ciudad concreta.
- **Avisos oficiales de AEMET**: te notifica los avisos meteorológicos que la Agencia Estatal
  de Meteorología publica para la zona donde estés, desde el nivel que elijas (amarillo,
  naranja o rojo). Puedes silenciar los fenómenos que no te interesen; silenciarlos apaga la
  notificación, pero el aviso se sigue viendo en la pantalla.

Como estos avisos deben llegarte **aunque no tengas la app abierta y estés donde estés**, los
prepara y envía un servidor propio, que funciona en un servidor privado virtual (VPS) alquilado
para ello y al que la app se conecta en `https://api.jmortiz.es`. Los datos se guardan en ese
servidor y no se ceden a nadie más. **Solo si activas algún aviso** se registran allí estos datos:

- Un **identificador de notificaciones** de tu dispositivo (token de push), que no revela tu
  identidad.
- Las **coordenadas** y el **nombre** de tu ubicación actual (por ejemplo, la ciudad) y tu
  **zona horaria** (para enviarte el aviso a tu hora local, del sitio donde estás y pudiendo
  nombrarlo en la notificación). El nombre lo resuelve tu propio iPhone a partir de las
  coordenadas. Para que los avisos te sigan cuando te desplazas, la app puede actualizar esos
  datos **en segundo plano** cuando cambias de zona; por eso, al activar un aviso, iOS te pedirá
  el permiso de ubicación **"Siempre"**. Si no lo concedes, los avisos seguirán funcionando pero
  usarán tu última ubicación conocida.
- La **configuración de cada aviso**: los límites de temperatura; para cada resumen su hora,
  los datos que has elegido incluir y el lugar (tu ubicación o una ciudad concreta); y para
  los avisos oficiales, el nivel a partir del cual quieres que te avisen y la lista de
  fenómenos que hayas silenciado.

El servidor usa esos datos **únicamente** para consultar el tiempo y enviarte las notificaciones.
No se asocian a tu nombre ni a ningún dato personal, no se usan para publicidad ni analítica, y
**se eliminan del servidor en cuanto desactivas los avisos**. Si no activas ninguno, no se envía
ninguno de estos datos.

## Servicios de terceros

- **Open-Meteo** (https://open-meteo.com): proporciona los datos meteorológicos y la búsqueda
  de lugares. Al pedir la previsión se le envían las coordenadas o el nombre del lugar
  consultado. Consulta su política en https://open-meteo.com/en/terms.
- **El proveedor del servidor privado virtual (VPS)** donde funciona nuestro servidor de avisos:
  aloja los datos descritos en el apartado anterior. No accede a ellos ni los usa para nada
  propio; se limita a proporcionar la máquina.
- **AEMET** (Agencia Estatal de Meteorología, https://www.aemet.es): es la fuente de los
  avisos oficiales y de las mediciones de sus estaciones. **AEMET no recibe ningún dato
  tuyo**: nuestro servidor descarga los boletines de toda España y los datos de las
  estaciones, y es él quien mira después cuáles te corresponden. Ni tus coordenadas ni el
  identificador de tu dispositivo salen hacia AEMET.
- **Expo y Apple**: entregan las notificaciones push de los avisos a tu iPhone.

## Registros técnicos

Como cualquier servidor, el nuestro anota las peticiones que recibe para poder detectar
averías: la fecha, la ruta consultada y la dirección IP desde la que se conectó. Si una
consulta falla, la anotación incluye además las coordenadas de esa consulta. Estos registros no
se asocian a ningún usuario ni se usan para nada que no sea arreglar problemas, y se pierden
cada vez que el servidor se actualiza.

## Lo que la app NO hace

- No requiere registro ni cuenta de usuario.
- No incluye publicidad ni redes de seguimiento.
- No recopila identificadores para publicidad ni analítica.
- No guarda un historial de tus ubicaciones: en el servidor solo se conserva tu última
  ubicación conocida mientras tengas algún aviso activo.
- No comparte tus datos con terceros más allá de lo descrito en esta política.

## Contacto

Si tienes cualquier duda sobre esta política, escribe a: jmortizsilva (arroba) gmail (punto) com
