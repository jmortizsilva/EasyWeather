# Política de privacidad de EasyWeather

_Última actualización: 24 de julio de 2026_

EasyWeather es una aplicación de previsión meteorológica. Esta política explica qué datos usa
la app y cómo los trata. En resumen: **EasyWeather no crea cuentas, no muestra publicidad y no
hace seguimiento de sus usuarios.** La app funciona sin enviar datos a servidores propios; la
única excepción es el **aviso de temperatura**, una función opcional que, si la activas, registra
algunos datos en nuestro servidor para poder avisarte (se explica más abajo).

## Datos que usa la app

- **Ubicación.** Si concedes el permiso, la app usa las coordenadas de tu dispositivo
  para mostrarte la previsión de tu zona. Esas coordenadas se envían al servicio
  meteorológico Open-Meteo únicamente para obtener la previsión y no se almacenan en
  ningún servidor gestionado por nosotros. Puedes usar la app sin conceder el permiso de
  ubicación, buscando lugares por su nombre.
- **Lugares guardados y preferencias.** Los lugares que añades y la previsión reciente se
  guardan **solo en tu dispositivo** (almacenamiento local de la app). No se suben a
  ningún sitio y se borran si desinstalas la app.

## Aviso de temperatura (opcional)

La app incluye un aviso opcional que te notifica cuando la temperatura de tu ubicación sube o
baja de los límites que tú elijas, incluso con la app cerrada. Para que esto funcione sin que
tengas que abrir la app, **solo si activas este aviso** se registran en nuestro servidor
(alojado en Cloudflare) estos datos:

- Un **identificador de notificaciones** de tu dispositivo (token de push), que no revela tu
  identidad.
- Las **coordenadas** de tu ubicación actual y el nombre del lugar.
- Los **límites de temperatura** que has configurado.

El servidor usa esos datos únicamente para consultar la temperatura y enviarte la notificación.
No se asocian a tu nombre ni a ningún dato personal, no se usan para publicidad ni analítica, y
**se eliminan del servidor en cuanto desactivas el aviso**. Si no activas esta función, no se
envía ninguno de estos datos.

## Servicios de terceros

- **Open-Meteo** (https://open-meteo.com): proporciona los datos meteorológicos y la búsqueda
  de lugares. Al pedir la previsión se le envían las coordenadas o el nombre del lugar
  consultado. Consulta su política en https://open-meteo.com/en/terms.
- **Cloudflare**: aloja el servidor del aviso de temperatura, con los datos descritos en el
  apartado anterior.
- **Expo y Apple**: entregan las notificaciones push del aviso de temperatura a tu iPhone.

## Lo que la app NO hace

- No requiere registro ni cuenta de usuario.
- No incluye publicidad ni redes de seguimiento.
- No recopila identificadores para publicidad ni analítica.
- No comparte tus datos con terceros más allá de lo descrito en esta política.

## Contacto

Si tienes cualquier duda sobre esta política, escribe a: jmortizsilva (arroba) gmail (punto) com
