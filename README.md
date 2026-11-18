# English Path: de A2 a C1 (y C2)

App web para aprender inglés por niveles, **sin IA y sin costos**: todo el contenido está dentro de la app. Funciona como una sola página (`index.html`), se publica gratis en GitHub Pages y se instala en el celular como una app.

## Qué incluye

| Sección | Qué hace |
|---|---|
| **Prueba de ubicación** | Unos 10 minutos para encontrar tu nivel real (A2 a C2) y desbloquear lo anterior. |
| **Sesión de hoy** | 4 tareas diarias que se marcan solas: tarjetas, gramática o repaso, escucha y una actividad que rota (lectura, conversación o escritura). |
| **Tarjetas** | ~500 palabras y expresiones por temas, con repetición espaciada (SM-2) **en dos direcciones**: inglés → español (reconocer) y español → inglés (escribir). Puedes agregar tus propias palabras. |
| **Gramática** | 49 lecciones (A2 a C2) con explicación en español y ~300 ejercicios de 5 tipos: opción múltiple, completar, ordenar, **traducir** y **corregir errores**. Las lecciones aprobadas vuelven a aparecer a los 2, 7, 21, 60 y 120 días para que no se olviden. |
| **Examen de nivel** | 4 secciones (gramática, vocabulario, lectura y escucha). Para subir de nivel necesitas 75% en total y al menos 60% en cada sección. |
| **Escuchar** | Diálogos con varias voces y preguntas, más dictados con corrección palabra por palabra. |
| **Leer** | Textos originales por nivel, con preguntas de comprensión, glosario y audio. |
| **Hablar** | Conversaciones guiadas (entrevistas, quejas, negociaciones, debates…) con respuestas modelo, y práctica de pronunciación (shadowing) con micrófono. |
| **Escribir** | Temas por nivel con expresiones útiles, lista de control y un texto modelo para comparar. |
| **Errores** | Todo lo que fallas queda guardado y se practica escribiendo la forma correcta. |
| **Progreso** | Racha de días, XP, gráfica de 14 días, porcentaje por habilidad y objetivos del nivel ("Puedo…"). |

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a un repositorio (por ejemplo `app-ingles`).
2. En GitHub, entra a **Settings → Pages → Deploy from a branch**, elige la rama `main` y la carpeta `/ (root)`, y guarda.
3. En un par de minutos la app estará en `https://TU-USUARIO.github.io/app-ingles/`.
4. En el celular, abre esa dirección en Chrome y toca **⋮ → Agregar a pantalla de inicio**.

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
- `src/levels/a2.js` … `c2.js`: lecciones adicionales, vocabulario por temas, lecturas, diálogos, conversaciones guiadas, temas de escritura y objetivos de cada nivel.
- `src/app.js`: lógica de la app. `src/shell.html`: estructura y estilos. `src/config.js`: Supabase.

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

## Voz y micrófono

- La voz usa las voces en inglés del sistema. En Ajustes puedes cambiar la velocidad.
- El micrófono funciona en Chrome y Edge, en computador y Android. En iPhone puedes usar el dictado del teclado en las casillas de texto.
- Los ejercicios funcionan sin internet una vez instalada la app.
