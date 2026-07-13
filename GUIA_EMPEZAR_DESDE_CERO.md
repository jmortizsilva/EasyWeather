# Cómo crear apps accesibles para iPhone con Claude, desde cero

Esta guía es para empezar sin saber nada: nada de programación, ni de Expo, ni de
comandos. Está pensada para Windows y para usarse con lector de pantalla. La vas a poder
seguir paso a paso, y si algo se atasca, tu hermano (que ya lo ha hecho) puede echarte
una mano.

Léela entera una vez para hacerte una idea general y luego vuelve a la parte que
necesites. No hace falta memorizar nada.


## 1. Qué vas a conseguir y cómo funciona

Vas a crear una aplicación para iPhone **sin escribir código tú mismo** y **sin tener un
Mac**. La idea es esta:

- Le describes con tus palabras (en español normal) qué quieres que haga la app.
- **Claude** (el asistente de inteligencia artificial) escribe y modifica el código por
  ti. Tú no tienes que entender el código: solo probar la app y decir qué cambiar.
- La app se construye con una tecnología llamada **Expo**, que permite crear apps de
  iPhone desde un ordenador Windows, compilándolas en la nube (los servidores de Expo lo
  hacen por ti).
- Puedes **probarla en tu propio iPhone** y, como usas lector de pantalla, la revisas con
  **VoiceOver** igual que cualquier otra app.

Este flujo de trabajo es muy cómodo con lector de pantalla, porque casi todo es **texto**:
tú escribes lo que quieres, lees las respuestas de Claude, y la parte visual (ver la app)
la resuelves probándola con VoiceOver en el móvil o pidiéndole a Claude que te describa y
verifique las cosas.


## 2. Las cuentas que necesitas (créalas antes de empezar)

Tres cuentas. Dos son gratis; una es de pago.

1. **Cuenta de Claude.** Es el asistente que escribe el código. Se usa desde la web
   (página `claude.ai`) o desde su aplicación de escritorio para Windows. Más abajo, en
   el paso 4, se explica cómo instalarlo.

2. **Cuenta de Expo (gratis).** Es el servicio que compila la app en la nube. Ve a la
   página `expo.dev` y regístrate con tu correo. Apunta el usuario y la contraseña.

3. **Cuenta de desarrollador de Apple (de pago, unos 99 dólares al año).** Es
   **obligatoria** para poder instalar la app en iPhones y para usar TestFlight (que
   explico al final). Ve a `developer.apple.com`, y en la sección "Account" / "Program"
   date de alta en el "Apple Developer Program". El alta puede tardar un rato o algún día
   en activarse. Necesitarás tu Apple ID (el mismo del iPhone) con la verificación en dos
   pasos activada (te llega un código a tus dispositivos Apple al iniciar sesión).


## 3. Instalar los programas base en Windows

Vas a instalar unas pocas herramientas. Todos los instaladores son asistentes normales de
Windows: se recorren con el tabulador y las flechas, y se confirma con Intro. NVDA o JAWS
los leen sin problema.

1. **Node.js.** Es el motor que necesitan las herramientas de Expo. Ve a la página
   `nodejs.org` y descarga la versión marcada como **LTS** (la recomendada). Ejecuta el
   instalador y acepta las opciones por defecto.

2. **Git.** Sirve para guardar el historial de cambios del proyecto; Claude y Expo lo
   usan. Ve a `git-scm.com`, descarga la versión para Windows e instala con las opciones
   por defecto.

3. **Comprobar que funcionan.** Abre la aplicación **Terminal** de Windows (o
   **PowerShell**; ambas vienen con Windows y son accesibles). Escribe estas dos líneas,
   una cada vez, y pulsa Intro. Si cada una responde con un número de versión, todo va
   bien:

   ```
   node --version
   git --version
   ```

Nota sobre la terminal: es una ventana de texto donde escribes comandos. Con lector de
pantalla se maneja muy bien; lo que escribes y lo que responde el ordenador se leen como
texto normal.


## 4. Instalar Claude (el asistente que programa por ti)

Claude, en su versión para programar, se llama **Claude Code**. En Windows tienes dos
formas cómodas de usarlo:

- **Aplicación de escritorio para Windows** (la más sencilla para empezar). Se descarga
  desde la web de Claude. Es una ventana donde escribes lo que quieres y lees sus
  respuestas.
- **Versión web**, entrando en `claude.ai/code` desde el navegador.

Recomendación: usa la **aplicación de escritorio**, que es la que usa tu hermano, así os
resulta más fácil compararla si te atascas. Al abrirla, le indicas la carpeta de tu
proyecto y ya puedes empezar a hablar con Claude.

(Si en algún momento ves instrucciones que mencionan escribir `claude` en la terminal, es
otra manera de usar el mismo Claude Code desde la ventana de comandos. No es necesaria
para empezar.)


## 5. Instalar la herramienta de compilación de Expo

Falta una herramienta más, llamada **EAS**, que es la que ordena a Expo compilar la app
en la nube. Se instala desde la terminal. Abre la Terminal y escribe:

```
npm install -g eas-cli
```

Cuando termine, inicia sesión con tu cuenta de Expo (la del paso 2):

```
eas login
```

Te pedirá el usuario y la contraseña de Expo. Esto solo hay que hacerlo una vez.


## 6. Cómo trabajar con Claude en el día a día

Aquí está lo importante, y es más fácil de lo que parece.

1. **Abre tu proyecto en Claude** (la carpeta donde vive la app).
2. **Pídele las cosas con tus palabras**, de una en una. Por ejemplo: "Quiero una app del
   tiempo que muestre la previsión de mi ciudad" o "Añade un botón para guardar lugares".
3. **Deja que Claude escriba el código.** No tienes que entenderlo. Él te irá explicando
   qué hace y qué ha cambiado.
4. **Prueba y da tu opinión.** Le dices qué está bien y qué no, y él lo ajusta. Es una
   conversación: puedes corregirle todas las veces que haga falta.

Consejos para principiante:

- Pide **un cambio cada vez**; así es más fácil probar si ha quedado bien.
- Si no entiendes algo, dile "explícamelo en lenguaje sencillo". Está para eso.
- Cuéntale desde el principio que **eres usuario de lector de pantalla** y que la app
  **tiene que ser accesible con VoiceOver**. Puedes darle preferencias concretas, por
  ejemplo: que las fechas se lean completas, que los datos se puedan recorrer con gestos,
  o que haya buen contraste. Cuanto más claro seas, mejor lo hará.
- Claude **no puede iniciar sesión por ti** en Apple ni en sitios que pidan contraseña o
  el código de verificación. Esos pasos concretos los harás tú en tu terminal; él te va
  guiando y tú le pegas lo que salga.


## 7. Probar la app en tu iPhone

Para ver la app en tu móvil hay dos situaciones:

- **Al principio, cuando la app es sencilla**, puedes usar una aplicación gratuita
  llamada **Expo Go** (se descarga del App Store). Con ella, y ejecutando en el ordenador
  el comando `npx expo start`, escaneas un código y la app aparece en tu iPhone al
  momento, con VoiceOver y todo.

- **Cuando la app crece** y usa componentes más avanzados, Expo Go deja de servir y hay
  que crear una **"build de desarrollo"**: una versión especial de tu app que se instala
  una sola vez en el iPhone (compilándola con `eas build`), y que a partir de ahí carga
  los cambios desde el ordenador igual de rápido. Claude te avisará cuando se llegue a ese
  punto y te dará los comandos.

En ambos casos, la gracia es que **los cambios de código normales se ven al instante** en
el móvil, sin tener que compilar cada vez. Solo hace falta compilar de nuevo cuando se
cambian cosas "de fondo" (el icono, el nombre, permisos, etc.).

Y lo mejor para ti: pruebas la app con **VoiceOver** directamente, así compruebas tú mismo
si se lee bien y se navega bien.


## 8. Compartir la app con otras personas (TestFlight)

Cuando la app esté lista para que la usen más personas, se distribuye con **TestFlight**,
la aplicación oficial de Apple para probar apps antes de que estén en la tienda. Con ella,
cualquiera puede instalarla en su iPhone con solo un enlace o una invitación por correo.

El camino, muy resumido (Claude te acompaña en cada paso):

1. Compilar la versión final: `eas build --platform ios --profile production`.
2. Subirla a Apple: `eas submit --platform ios --profile production --latest`.
3. En la web `appstoreconnect.apple.com`, en la sección TestFlight, invitar a las personas
   que van a probarla.

Para invitar a personas de fuera de tu equipo, Apple pide una **política de privacidad**
(una página web sencilla que explica qué datos usa la app) y una pequeña **revisión** que
suele aprobarse en menos de un día. Claude te ayuda a redactar y publicar esa página.


## 9. Errores típicos de principiante (y cómo evitarlos)

Estos son tropiezos habituales al empezar. Que no te asusten: tienen solución fácil.

- **Expo Go deja de abrir la app.** Es normal cuando la app ya usa componentes nativos.
  La solución es crear la "build de desarrollo" (paso 7). Claude te avisa cuando toca.
- **Al instalar una versión, desaparece la otra.** En el iPhone, dos apps con el mismo
  "identificador" se consideran la misma y se sustituyen. Si quieres tener a la vez la
  versión de pruebas y la definitiva, hay que darles identificadores y nombres distintos.
  Es un ajuste que Claude hace en un momento.
- **Apple te pide un código al iniciar sesión.** Es la verificación en dos pasos: el
  código llega a tus dispositivos Apple. Tenlos a mano.
- **El nombre de la app en la tienda ya está cogido.** El nombre público debe ser único en
  toda la App Store; si "Tiempo" está ocupado, se elige otro, por ejemplo "EasyWeather".
- **Algún símbolo se lee raro con VoiceOver.** Pasa, por ejemplo, con el símbolo de grados.
  Si notas algo así, díselo a Claude y lo corrige para que se lea bien.
- **Ten paciencia con la primera configuración de Apple y Expo.** La primera vez lleva su
  tiempo (cuentas, permisos, certificados). Después, el día a día es rápido.


## 10. Pequeño glosario

- **Claude / Claude Code:** el asistente de inteligencia artificial que escribe el código
  por ti a partir de lo que le pides en lenguaje normal.
- **Expo:** la tecnología con la que se construye la app; permite hacer apps de iPhone
  desde Windows.
- **EAS:** la parte de Expo que compila la app en la nube y la envía a Apple.
- **Build:** una versión compilada de la app, lista para instalar.
- **Build de desarrollo:** una versión para ir probando cambios rápido en tu iPhone.
- **TestFlight:** la app de Apple para que otras personas prueben tu app antes de la
  tienda.
- **Terminal (o PowerShell):** la ventana de texto donde se escriben comandos.
- **Comando:** una instrucción de una línea que escribes en la terminal.
- **npm:** el instalador de herramientas que viene con Node.js.
- **Identificador de paquete:** el "nombre técnico" único de la app dentro de iOS
  (por ejemplo, algo como `com.tunombre.miapp`).
- **VoiceOver:** el lector de pantalla del iPhone, con el que probarás la accesibilidad.


## 11. Resumen de comandos (para reconocerlos)

Normalmente Claude ejecuta o te dicta estos comandos; no hace falta que te los aprendas,
pero está bien reconocerlos:

- `node --version` y `git --version`: comprobar que Node.js y Git están instalados.
- `npm install -g eas-cli`: instalar la herramienta de compilación de Expo.
- `eas login`: iniciar sesión en Expo.
- `npx expo start`: arrancar la app para probarla en el iPhone (recarga en caliente).
- `eas build --platform ios --profile development`: crear la versión de pruebas.
- `eas build --platform ios --profile production`: crear la versión final.
- `eas submit --platform ios --profile production --latest`: enviarla a TestFlight.


## En resumen

No necesitas saber programar ni tener un Mac. Necesitas: las tres cuentas (Claude, Expo y
Apple), instalar Node.js, Git y la herramienta EAS, y luego **hablar con Claude en
español** para que construya la app contigo, probándola con VoiceOver en tu iPhone. Ve
paso a paso, pide las cosas de una en una, y apóyate en tu hermano para las primeras veces.
