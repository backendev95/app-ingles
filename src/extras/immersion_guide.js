// ===== GUÍA DE INMERSIÓN POR FASES =====
const IMM_MODES = [["3pasadas", "Método de 3 pasadas"], ["subs_en", "Con subtítulos en inglés"], ["sin_subs", "Sin subtítulos"], ["pasiva", "Escucha de fondo (pasiva)"], ["lectura", "Lectura"], ["shadowing", "Shadowing / repetir en voz alta"], ["conversacion", "Conversación real"], ["resumen", "Resumen hablado o escrito"]];

const IMM_PHASES = [
  { n: 1, title: "Fase 1 · Escuchar contenido para estudiantes", level: "A2", weeks: "Semanas 1 a 6", minutes: 20,
    goal: "Acostumbrar el oído al inglés con contenido hecho para estudiantes, siempre con apoyo escrito.",
    content: ["Podcasts y videos para estudiantes con transcripción (BBC Learning English, News in Levels nivel 1–2)", "Videos cortos de YouTube para principiantes (2–5 minutos)", "Libros graduados de nivel 2–3"],
    routine: ["Elige un audio o video corto (3–5 min) para estudiantes", "Aplica el método de 3 pasadas: subtítulos en inglés → sin subtítulos → con subtítulos otra vez", "Anota 3 expresiones nuevas y agrégalas a tus tarjetas", "Repite en voz alta 3 frases imitando la entonación"],
    tips: ["Siempre subtítulos o transcripción en inglés, nunca en español.", "Está bien no entender todo: si entiendes el 60–70%, vas bien.", "Repetir el mismo audio varias veces vale más que escuchar muchos distintos."],
    criteria: ["Entiendo la idea general de un audio para estudiantes sin leer la transcripción", "Puedo seguir un video de 5 minutos para estudiantes sin pausar a cada rato", "Llevo al menos 3 semanas registrando inmersión casi todos los días"] },
  { n: 2, title: "Fase 2 · Series con subtítulos en inglés", level: "A2 → B1", weeks: "Semanas 6 a 14", minutes: 30,
    goal: "Pasar del contenido para estudiantes a series reales, apoyándote en los subtítulos en inglés.",
    content: ["Comedias con episodios cortos y lenguaje cotidiano (Friends, Modern Family, The Good Place)", "Podcasts para estudiantes mientras caminas o viajas (escucha de fondo)", "Noticias en niveles (News in Levels nivel 3, Breaking News English)"],
    routine: ["Ve un episodio (20 min) con subtítulos en inglés", "Elige una escena de 1–2 minutos que te guste y mírala sin subtítulos hasta entenderla", "Agrega 3–5 frases útiles de la escena a tus tarjetas", "Escucha 10 minutos de podcast de fondo (de camino, cocinando)"],
    tips: ["Ve series que ya viste en español: conoces la trama y te concentras en el idioma.", "No pauses por cada palabra: pausa solo si pierdes el hilo.", "Elige algo que de verdad te guste; si te aburre, cambia de serie."],
    criteria: ["Sigo la trama de un episodio con subtítulos en inglés sin pausar mucho", "Entiendo escenas cortas sin subtítulos después de verlas 2–3 veces", "Entiendo podcasts para estudiantes sin transcripción"] },
  { n: 3, title: "Fase 3 · Quitar los subtítulos poco a poco", level: "B1", weeks: "Meses 4 a 8", minutes: 45,
    goal: "Ganar independencia de los subtítulos y empezar con contenido para nativos sencillo.",
    content: ["Episodios que ya viste, ahora sin subtítulos", "YouTubers nativos que hablan de tus hobbies (cocina, tecnología, fútbol, viajes)", "Podcasts conversacionales para nativos con transcripción", "Novelas juveniles o libros graduados de nivel 4–5"],
    routine: ["Mira los primeros 10 minutos de un episodio nuevo SIN subtítulos; si te pierdes, actívalos", "Re-ve un episodio anterior completo sin subtítulos", "Lee 10 minutos en inglés (libro o artículo) usando Mi lector para las palabras nuevas", "Resume en voz alta durante 1 minuto lo que viste o leíste"],
    tips: ["Es normal sentir que entiendes menos al quitar los subtítulos: el oído se adapta en 2–3 semanas.", "Si entiendes menos del 50%, el contenido es demasiado difícil: baja un nivel.", "Cambia el idioma del celular y de tus redes sociales al inglés."],
    criteria: ["Entiendo el 60–70% de un video de YouTube para nativos sin subtítulos", "Puedo ver episodios que ya conozco sin subtítulos", "Leo un capítulo de un libro juvenil sin traducir cada palabra", "He tenido al menos una conversación real en inglés (intercambio, clase, trabajo)"] },
  { n: 4, title: "Fase 4 · Contenido nativo sin apoyo", level: "B2", weeks: "Meses 8 a 14", minutes: 60,
    goal: "Consumir contenido nativo sin subtítulos y empezar a producir: hablar y escribir sobre lo que consumes.",
    content: ["Series y películas sin subtítulos (dramas, thrillers, series de abogados o médicos)", "Podcasts para nativos sin transcripción", "Noticias y artículos de opinión", "Novelas contemporáneas para adultos", "Charlas TED"],
    routine: ["Mira un episodio o película sin subtítulos (actívalos solo para revisar una escena difícil)", "Escucha un podcast nativo de 20–30 minutos", "Escribe un resumen de 5–8 líneas de lo que viste y pásalo por el corrector de la app", "Haz shadowing de 1 minuto de un diálogo real"],
    tips: ["Varía los acentos: británico, estadounidense, australiano, irlandés.", "La escucha intensiva (entender cada palabra de un fragmento corto) debe ser el 20% del tiempo; el 80% es escucha extensiva y relajada.", "Busca conversación real cada semana: intercambios de idiomas, clubes o trabajo."],
    criteria: ["Veo series sin subtítulos y entiendo el 80% o más", "Entiendo podcasts para nativos sin transcripción", "Leo noticias en inglés con facilidad", "Puedo resumir en voz alta un episodio sin preparar", "Saqué 60% o más en un simulacro B2 First de la app"] },
  { n: 5, title: "Fase 5 · Vivir en inglés", level: "C1", weeks: "Mes 14 en adelante", minutes: 90,
    goal: "Integrar el inglés en tu vida diaria y dominar registros complejos: debates, temas académicos y profesionales.",
    content: ["Documentales y debates", "Conferencias académicas y podcasts de ideas, economía o ciencia", "Comedia en vivo (lo más difícil: juegos de palabras y referencias culturales)", "Prensa de calidad y ensayos", "Novelas literarias"],
    routine: ["Consume 60+ minutos de contenido nativo exigente (podcasts a velocidad 1.0–1.25x)", "Lee un artículo de opinión largo y anota 5 expresiones o colocaciones avanzadas", "Escribe o habla 10 minutos sobre un tema complejo (argumenta una postura)", "Piensa en inglés: narra mentalmente lo que haces durante el día"],
    tips: ["Tu celular, tus redes, tus búsquedas y tus series deberían estar en inglés.", "Busca entender el humor y la ironía: es la última barrera hacia el C1–C2.", "Produce para audiencias reales: comentarios, reseñas, presentaciones en el trabajo."],
    criteria: ["Entiendo debates rápidos y comedia sin subtítulos", "Leo artículos de opinión y libros para adultos sin diccionario la mayor parte del tiempo", "Puedo argumentar en inglés sobre temas complejos con fluidez", "Saqué 60% o más en un simulacro C1 Advanced de la app"] }
];

const IMM_TECHNIQUES = [
  { title: "Método de las 3 pasadas", body: "Elige un fragmento corto (1–5 min). 1) Míralo con subtítulos en inglés para entenderlo. 2) Míralo sin subtítulos y fíjate cuánto captas. 3) Míralo otra vez con subtítulos para confirmar lo que no entendiste. Repetir el mismo fragmento entrena el oído mucho más que ver contenido nuevo sin parar." },
  { title: "La regla del 70%", body: "El contenido ideal es el que entiendes en un 70–80%. Si entiendes menos del 50%, es demasiado difícil y te frustrará; si entiendes el 95%, es demasiado fácil y aprendes poco. Ajusta el nivel según cómo te sientas." },
  { title: "Escucha intensiva vs. extensiva", body: "Intensiva: un fragmento corto, con atención total, repitiéndolo hasta entender cada palabra (20% del tiempo). Extensiva: mucho contenido, relajado, sin pausar, disfrutándolo (80% del tiempo). Necesitas las dos." },
  { title: "Minería de frases", body: "Cuando oigas o leas una expresión útil, guárdala completa (no solo la palabra) en tus tarjetas. Con Mi lector de la app puedes pegar el texto o la transcripción y agregar las palabras con un toque." },
  { title: "Shadowing", body: "Pon un fragmento corto de una serie o podcast y repite en voz alta al mismo tiempo, imitando ritmo, entonación y velocidad. Graba tu voz con la app y compárala. Mejora la pronunciación y la fluidez más rápido que cualquier otra técnica." },
  { title: "Resumen activo", body: "Después de ver o leer algo, cuéntalo en voz alta o escríbelo en 5 líneas. Convierte lo que entendiste (pasivo) en lo que puedes decir (activo). Pasa el resumen por el corrector de la sección Escribir." },
  { title: "Lo que NO funciona", body: "Subtítulos en español (lees en español y no escuchas). Pausar cada palabra que no entiendes (pierdes el hilo y te cansas). Contenido que te aburre (lo abandonarás). Solo escuchar de fondo sin nunca prestar atención (ayuda poco por sí solo)." }
];
