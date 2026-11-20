# English Path: de A2 a C1 (y C2)

App web para aprender inglés por niveles, **sin IA y sin costos**: todo el contenido está dentro de la app. Funciona como una sola página (`index.html`), se publica gratis en GitHub Pages y se instala en el celular como una app.

## Qué incluye

| Sección | Qué hace |
|---|---|
| **Prueba de ubicación** | Unos 10 minutos para encontrar tu nivel real (A2 a C2). |
| **Sesión de hoy** | 4 tareas diarias que se marcan solas: tarjetas, gramática o repaso, escucha y una actividad que rota (lectura, conversación o escritura). |
| **Tarjetas** | ~700 palabras y expresiones por temas, en dos direcciones (reconocer y escribir), con el algoritmo de repaso **FSRS**: los botones muestran cuándo volverá a aparecer cada tarjeta. |
| **Verbos irregulares** | 124 verbos (A2 a B2) agrupados por patrón. Cada día entran 5 nuevos a tus tarjetas: ves el verbo y escribes el pasado y el participio. También hay práctica rápida. |
| **Gramática** | 49 lecciones y 300 ejercicios (opción múltiple, completar, ordenar, traducir y corregir), con repasos programados a los 2, 7, 21, 60 y 120 días. |
| **Escuchar** | Diálogos con varias voces y dictados con corrección palabra por palabra. |
| **Leer** | Lecturas del curso con preguntas, y **Mi lector**: pegas cualquier texto en inglés, tocas una palabra y ves definición, pronunciación real y traducción, y la conviertes en tarjeta. |
| **Hablar** | Conversaciones guiadas con respuestas modelo, **Sonidos** (14 unidades de pronunciación para hispanohablantes: pares mínimos, -ed, -s, acento, schwa, unión de palabras) y shadowing. Puedes **grabarte** y compararte con el modelo. También incluye un curso de **🔗 connected speech** (9 unidades: uniones, formas débiles, reducciones como gonna/wanna, asimilación, elisión, T americana y ritmo) con dictados a velocidad natural. |
| **Escribir** | Temas por nivel con modelo y lista de control, escritura libre, y **corrector automático** de gramática y ortografía (LanguageTool) que guarda tus errores. |
| **💻 Inglés TI** | Inglés para desarrolladores de software: 8 situaciones de trabajo (daily, bugs, code review, pedir ayuda, estimar y decir que no, commits/PRs/Slack, demos, gramática técnica) con frases clave y ejercicios; ~150 palabras técnicas que entran a tus tarjetas (5 por día); 6 conversaciones guiadas (daily, explicar un bug, code review, entrevista, requisitos, negociar fechas); diálogos de reuniones; lecturas (oferta de empleo, postmortem, README, blog); escritura (commits, bug report, PR, Slack, correo a reclutador, LinkedIn); 15 preguntas de entrevista con consejo y respuesta modelo; pronunciación de 30 términos técnicos. |
| **Exámenes** | Exámenes de nivel (4 habilidades) y **4 simulacros tipo Cambridge** (B2 First y C1 Advanced, Use of English) con cronómetro. |
| **Inmersión** | Plan guiado en 5 fases (de contenido para estudiantes con subtítulos en inglés hasta vivir en inglés), con rutina diaria, meta semanal de minutos, criterios para avanzar de fase, guía de técnicas (método de 3 pasadas, regla del 70%, shadowing…), registro de actividades y recursos gratuitos. |
| **Progreso** | Diagnóstico de tus temas más débiles con repaso enfocado, acierto por habilidad y por tipo de ejercicio, retención de tarjetas e historial de exámenes. También incluye **Mis errores**, para practicar todo lo que fallaste. |

### Servicios gratuitos que usa (sin clave)

- **LanguageTool** (corrector): `api.languagetool.org`. Límite: 20 revisiones por minuto.
- **Free Dictionary API** (definiciones y audio): `api.dictionaryapi.dev`.
- **MyMemory** (traducción): 5.000 caracteres al día, o 50.000 si pones tu correo en Ajustes.

Estos servicios funcionan en la versión publicada (GitHub Pages). Dentro de Claude, la página no puede conectarse a servicios externos.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio (por ejemplo `app-ingles`).
2. En GitHub, entra a **Settings → Pages → Deploy from a branch**, elige la rama `main` y la carpeta `/ (root)`, y guarda.
3. En un par de minutos la app estará en `https://TU-USUARIO.github.io/app-ingles/`.
4. Instálala en tu celular:
   - **Android:** abre la dirección en Chrome y toca **⋮ → Instalar app** (o "Agregar a pantalla de inicio").
   - **iPhone/iPad:** abre la dirección en **Safari**, toca **Compartir** (el cuadrado con la flecha hacia arriba) y luego **Agregar a inicio**. Desde iOS 16.4 también funciona desde Chrome o Edge con su botón Compartir.

## Sincronizar tu progreso con Supabase (gratis)

Sin base de datos, el progreso se guarda en cada navegador y puedes moverlo con **Ajustes → Respaldo manual**. Para que se sincronice solo entre computador y celular:

1. Crea una cuenta en <https://supabase.com> y un proyecto nuevo. El plan gratuito es suficiente.
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y toca **Run**.
3. En **Project Settings → API**, copia la **Project URL** y la clave **anon public**.
4. Escoge una de estas dos opciones:
   - **En la app:** ve a **Ajustes → Sincronización**, pega la URL y la clave, escribe tu correo y una contraseña y toca **Crear cuenta**. Si Supabase te pide confirmar el correo, confírmalo y luego toca **Iniciar sesión**.
   - **Para todos tus dispositivos de una vez:** pon la URL y la clave en `src/config.js`, ejecuta `python3 build.py` y sube los cambios. Después solo tendrás que iniciar sesión en cada dispositivo.
5. Repite el inicio de sesión en cada dispositivo. El progreso más reciente se sincroniza al abrir la app y cada vez que estudias.

> Seguridad: la clave *anon* está pensada para ser pública. Lo que protege tus datos es la política RLS del archivo SQL (cada usuario solo puede leer y escribir su propia fila) y tu contraseña. **Nunca** pongas en el código la clave `service_role`.
>
> Si solo vas a usar la app tú, en Supabase puedes ir a **Authentication → Sign In / Providers** y desactivar "Allow new users to sign up" después de crear tu cuenta.

## Editar o agregar contenido

- `src/content.js`: niveles, lecciones base, vocabulario base y frases.
- `src/extras/`: pronunciación (`pron.js`), verbos irregulares (`irregular.js`), simulacros Cambridge (`mocks.js`), vocabulario adicional (`vocab_more.js`) y recursos de inmersión (`resources.js`) y guía de inmersión por fases (`immersion_guide.js`).
- `src/levels/a2.js` … `c2.js`: lecciones adicionales, vocabulario por temas, lecturas, diálogos, conversaciones guiadas, temas de escritura y objetivos de cada nivel.
- `src/app.js`, `src/app2.js`, `src/start.js`: lógica de la app. `src/shell.html`: estructura y estilos. `src/config.js`: Supabase.

Después de editar, regenera la página y súbela:

```bash
python3 build.py
git add . && git commit -m "Actualizo contenido" && git push
```

### Formato de los ejercicios

```js
["mc",   "Pregunta con ___", ["opción A", "opción B", "opción C"], 1, "explicación"]  // opción múltiple (índice desde 0)
["fill", "She ___ (go) to work.", ["goes"], "explicación"]                          // completar
["ord",  "Significado en español", "Frase correcta en inglés"]                       // ordenar palabras
["tr",   "Frase en español", ["Traducción aceptada 1", "Traducción 2"], "nota"]       // traducir
["fix",  "Frase con un error", ["Frase corregida"], "explicación"]                    // corregir
```

## Connected speech en toda la app

Debajo de las frases de dictado, shadowing, diálogos, conversaciones, ejercicios, tarjetas, textos modelo, entrevistas y frases de Inglés TI aparece el recuadro **🔗 Así suena**, que marca automáticamente cómo se pronuncia la frase a velocidad normal: palabras que se unen (‿), formas débiles (to → tə), reducciones (going to → gonna), sonidos que casi desaparecen y la T americana. Es una guía aproximada basada en reglas del inglés estadounidense. Se activa o desactiva en **Ajustes**.

## Voz y micrófono

- **Audios de alta calidad:** las palabras, verbos irregulares, frases de dictado, diálogos, conversaciones guiadas, unidades de pronunciación, correcciones de los ejercicios, ejemplos de las lecciones y el glosario tienen audios pregrabados (unas 2.900 en total, incluidas las de Inglés TI y connected speech) con una voz neuronal de código abierto (Kokoro): voz estadounidense para la persona A, británica para la B y estadounidense masculina para la C. Están en la carpeta `audio/` y se activan o desactivan en **Ajustes → Voz y audio**.
- **Voces del dispositivo:** lo que no tiene audio pregrabado usa las voces de tu celular o computador. En **Ajustes → Voz y audio** eliges la voz principal y las voces de los diálogos (★ = alta calidad) y encuentras cómo instalar voces más naturales en Android, iPhone y Windows. En computador, Microsoft Edge trae voces "Natural" muy realistas.
- **Velocidad:** se ajusta en Ajustes y aplica tanto a los audios como a las voces del dispositivo.
- **Micrófono:** funciona en Chrome y Edge, en computador y Android. En iPhone puedes usar el dictado del teclado.

### Generar más audios (opcional)

Si agregas contenido, o quieres audio también para los ejemplos del vocabulario, las lecturas y los textos modelo de escritura (lo único que todavía usa la voz del dispositivo):

```bash
pip install kokoro-onnx soundfile        # y ten ffmpeg instalado
# Descarga kokoro-v1.0.int8.onnx y voices-v1.0.bin de
# https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0), fuera de la carpeta del proyecto
node tools/audio_texts.js --all > audio/texts.json
python tools/generate_audio.py --model RUTA/kokoro-v1.0.int8.onnx --voices RUTA/voices-v1.0.bin
```

Es incremental: solo crea los audios que faltan y actualiza `audio/index.json`. Faltan unos 900 (≈2–3 horas en un computador normal). Puedes dividir el trabajo entre dos computadores con `--part 1/2` y `--part 2/2`.
