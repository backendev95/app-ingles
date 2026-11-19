// ===== RECURSOS GRATUITOS PARA INMERSIÓN POR NIVEL =====
const IMMERSION_TYPES = [["serie", "📺 Serie o película"], ["podcast", "🎧 Podcast o audio"], ["video", "▶️ Video"], ["lectura", "📖 Lectura"], ["conversacion", "🗣️ Conversación real"], ["musica", "🎵 Música con letra"]];
const RESOURCES = {
  A2: [
    { name: "BBC Learning English", type: "Web y audio", desc: "Lecciones cortas por nivel, con transcripción. Empieza por las secciones para principiantes.", url: "https://www.bbc.co.uk/learningenglish" },
    { name: "News in Levels (nivel 1 y 2)", type: "Noticias", desc: "La misma noticia escrita en 3 niveles de dificultad, con audio.", url: "https://www.newsinlevels.com" },
    { name: "Series con subtítulos en inglés", type: "Series", desc: "Comedias con diálogos cotidianos y episodios cortos: Friends, Modern Family, The Good Place. Activa los subtítulos en inglés, no en español." },
    { name: "Libros graduados", type: "Lectura", desc: "Colecciones como Penguin Readers u Oxford Bookworms tienen libros adaptados por nivel. Busca el nivel 2–3." }
  ],
  B1: [
    { name: "BBC 6 Minute English", type: "Podcast", desc: "Episodios de 6 minutos sobre temas actuales, con vocabulario explicado y transcripción.", url: "https://www.bbc.co.uk/learningenglish" },
    { name: "Breaking News English", type: "Noticias", desc: "Noticias en varios niveles con ejercicios, audio a diferentes velocidades.", url: "https://breakingnewsenglish.com" },
    { name: "News in Levels (nivel 3)", type: "Noticias", desc: "Noticias reales con audio en su nivel más alto.", url: "https://www.newsinlevels.com" },
    { name: "Series", type: "Series", desc: "Brooklyn Nine-Nine, The Office, Ted Lasso. Primero con subtítulos en inglés; luego, escenas repetidas sin subtítulos." },
    { name: "YouTube en inglés sobre tus hobbies", type: "Video", desc: "Busca en inglés videos de lo que ya te gusta (cocina, tecnología, fútbol). El interés hace que entiendas más." }
  ],
  B2: [
    { name: "TED Talks", type: "Charlas", desc: "Charlas de 10–18 minutos con transcripción interactiva y subtítulos.", url: "https://www.ted.com" },
    { name: "BBC Learning English: The English We Speak", type: "Podcast", desc: "Expresiones coloquiales explicadas en 3 minutos.", url: "https://www.bbc.co.uk/learningenglish" },
    { name: "Podcasts para nativos sencillos", type: "Podcast", desc: "Programas conversacionales sobre temas que te interesen; busca los que tengan transcripción." },
    { name: "Series", type: "Series", desc: "Stranger Things, Breaking Bad, Suits, The Crown. Mira cada episodio dos veces: con y sin subtítulos." },
    { name: "Novelas juveniles", type: "Lectura", desc: "Libros escritos para jóvenes nativos tienen lenguaje natural pero accesible: un gran paso antes de novelas adultas." }
  ],
  C1: [
    { name: "TED Talks sin subtítulos", type: "Charlas", desc: "Escucha primero sin texto; luego verifica con la transcripción.", url: "https://www.ted.com" },
    { name: "Prensa en inglés", type: "Lectura", desc: "Artículos de opinión y análisis de periódicos y revistas internacionales: es el registro del C1 Advanced." },
    { name: "Podcasts de ideas y entrevistas", type: "Podcast", desc: "Programas largos de entrevistas, ciencia, economía o historia, a velocidad nativa." },
    { name: "Cambridge English: modelos de examen", type: "Exámenes", desc: "Material oficial gratuito de muestra para C1 Advanced.", url: "https://www.cambridgeenglish.org" },
    { name: "Clásicos y no ficción", type: "Lectura", desc: "Novelas contemporáneas y ensayos. En Project Gutenberg hay clásicos gratis.", url: "https://www.gutenberg.org" }
  ],
  C2: [
    { name: "Literatura y ensayo", type: "Lectura", desc: "Novela literaria, ensayo y crítica: estilo, ironía y matices." },
    { name: "Comedia en vivo y sátira", type: "Video", desc: "El humor es lo más difícil de entender: juegos de palabras, referencias culturales y acentos." },
    { name: "Debates y conferencias académicas", type: "Charlas", desc: "Escucha argumentación compleja y toma notas como práctica de síntesis." },
    { name: "Escribir en público", type: "Escritura", desc: "Blogs, reseñas o foros en inglés: escribir para lectores reales cambia la calidad del texto." }
  ]
};
