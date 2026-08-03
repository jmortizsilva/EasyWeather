# Política de privacidad de EasyWeather

_Última actualización: 1 de agosto de 2026_

EasyWeather es una aplicación de previsión meteorológica. Esta política explica qué datos usa
la app y cómo los trata. En resumen: **EasyWeather no crea cuentas, no muestra publicidad y no
hace seguimiento de sus usuarios.** La app funciona sin enviar datos a servidores propios; la
única excepción son los **avisos** (el de temperatura y el de resumen), funciones opcionales
que, si las activas, registran algunos datos en nuestro servidor para poder avisarte del tiempo
del sitio donde estés, aunque no tengas la app abierta (se explica más abajo).

## Datos que usa la app

- **Ubicación.** Si concedes el permiso, la app usa las coordenadas de tu dispositivo
  para mostrarte la previsión de tu zona. Para ver la previsión, esas coordenadas se envían
  al servicio meteorológico Open-Meteo únicamente para obtener los datos y no se almacenan en
  ningún servidor gestionado por nosotros. Puedes usar la app sin conceder el permiso de
  ubicación, buscando lugares por su nombre. **Si activas algún aviso**, la ubicación también
  se envía a nuestro servidor, como se describe en el apartado siguiente.
- **Lugares guardados y preferencias.** Los lugares que añades y la previsión reciente se
  guardan **solo en tu dispositivo** (almacenamiento local de la app) y se borran si
  desinstalas la app. La configuración de los avisos que actives se guarda además en nuestro
  servidor, porque es él quien te los envía (ver más abajo).

## Avisos (opcional)

La app incluye dos tipos de aviso, ambos opcionales y desactivados por defecto:

- **Aviso de temperatura**: te notifica cuando la temperatura de tu ubicación sube o baja de
  los límites que elijas.
- **Aviso de resumen**: te envía a la hora que elijas un resumen del tiempo, de tu ubicación o
  de una ciudad concreta.

Como estos avisos deben llegarte **aunque no tengas la app abierta y estés donde estés**, los
prepara y envía un servidor propio (alojado en Cloudflare). **Solo si activas algún aviso** se
registran en ese servidor estos datos:

- Un **identificador de notificaciones** de tu dispositivo (token de push), que no revela tu
  identidad.
- Las **coordenadas** de tu ubicación actual y tu **zona horaria** (para enviarte el aviso a tu
  hora local y del sitio donde estás). Para que los avisos te sigan cuando te desplazas, la app
  puede actualizar esas coordenadas **en segundo plano** cuando cambias de zona; por eso, al
  activar un aviso, iOS te pedirá el permiso de ubicación **"Siempre"**. Si no lo concedes, los
  avisos seguirán funcionando pero usarán tu última ubicación conocida.
- La **configuración de cada aviso**: los límites de temperatura, y para cada resumen su hora,
  los datos que has elegido incluir y el lugar (tu ubicación o una ciudad concreta).

El servidor usa esos datos **únicamente** para consultar el tiempo y enviarte las notificaciones.
No se asocian a tu nombre ni a ningún dato personal, no se usan para publicidad ni analítica, y
**se eliminan del servidor en cuanto desactivas los avisos**. Si no activas ninguno, no se envía
ninguno de estos datos.

## Servicios de terceros

- **Open-Meteo** (https://open-meteo.com): proporciona los datos meteorológicos y la búsqueda
  de lugares. Al pedir la previsión se le envían las coordenadas o el nombre del lugar
  consultado. Consulta su política en https://open-meteo.com/en/terms.
- **Cloudflare**: aloja el servidor de los avisos, con los datos descritos en el apartado
  anterior.
- **Expo y Apple**: entregan las notificaciones push de los avisos a tu iPhone.

## Lo que la app NO hace

- No requiere registro ni cuenta de usuario.
- No incluye publicidad ni redes de seguimiento.
- No recopila identificadores para publicidad ni analítica.
- No guarda un historial de tus ubicaciones: en el servidor solo se conserva tu última
  ubicación conocida mientras tengas algún aviso activo.
- No comparte tus datos con terceros más allá de lo descrito en esta política.

## Contacto

Si tienes cualquier duda sobre esta política, escribe a: jmortizsilva (arroba) gmail (punto) com
