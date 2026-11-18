// ===== CONTENIDO DEL CURSO (A2 → C2) =====
// Ejercicios: ["mc", pregunta, [opciones], índiceCorrecto, explicación]
//             ["fill", "frase con ___", ["respuestas aceptadas"], explicación]
//             ["ord", "significado en español", "frase correcta en inglés"]
const LEVELS = ["A2", "B1", "B2", "C1", "C2"];
const LEVEL_INFO = {
  A2: { name: "Básico alto", goal: "Hablar de tu rutina, tu pasado y tus planes con frases simples." },
  B1: { name: "Intermedio", goal: "Defenderte en viajes y en el trabajo, contar experiencias y dar opiniones." },
  B2: { name: "Intermedio alto", goal: "Conversar con fluidez con nativos, argumentar y entender textos complejos." },
  C1: { name: "Avanzado", goal: "Usar el inglés con flexibilidad en contextos académicos y profesionales." },
  C2: { name: "Maestría", goal: "Expresarte con precisión, matices y estilo casi como un nativo." }
};

const LESSONS = {
  A2: [
    { id: "a2-1", title: "Presente simple vs. continuo", explain: `<p><b>Presente simple</b>: hábitos y verdades. <i>I work in Bogotá. She drinks coffee every day.</i> En 3.ª persona (he/she/it) se agrega <b>-s</b>.</p><p><b>Presente continuo</b> (am/is/are + -ing): lo que pasa <b>ahora</b> o en este periodo. <i>I'm studying English this month.</i></p><p>Ojo: verbos de estado (<i>like, know, want, need</i>) casi nunca van en -ing: <i>I want</i>, no <i>I'm wanting</i>.</p>`, ex: [
      ["mc", "Look! It ___ outside.", ["rains", "is raining", "rain"], 1, "\"Look!\" indica que está pasando ahora: presente continuo."],
      ["fill", "My sister ___ (work) in a hospital.", ["works"], "Hábito/hecho permanente + 3.ª persona: works."],
      ["mc", "I ___ the answer.", ["know", "am knowing", "knows"], 0, "Know es verbo de estado: no se usa en -ing."],
      ["fill", "What ___ you doing right now?", ["are"], "Pregunta en continuo: are you doing."],
      ["ord", "Él no come carne.", "He doesn't eat meat"],
      ["mc", "___ she speak French?", ["Do", "Does", "Is"], 1, "He/she/it en presente simple usa does."],
      ["fill", "We usually ___ (go) to the gym on Mondays.", ["go"], "Usually = hábito → presente simple."]
    ]},
    { id: "a2-2", title: "Pasado simple", explain: `<p>Acciones terminadas en un momento del pasado. Regulares: <b>-ed</b> (<i>worked, played</i>). Irregulares hay que memorizarlos (<i>go → went, buy → bought, see → saw</i>).</p><p>Negativa y pregunta con <b>did</b> + verbo base: <i>I didn't go. Did you see it?</i> (nunca <i>didn't went</i>).</p>`, ex: [
      ["fill", "Yesterday I ___ (buy) a new phone.", ["bought"], "Buy es irregular: bought."],
      ["mc", "She didn't ___ to the party.", ["went", "go", "goes"], 1, "Después de didn't va el verbo base."],
      ["fill", "___ you see the match last night?", ["did"], "Pregunta en pasado: Did + sujeto + verbo base."],
      ["mc", "Pasado de 'think':", ["thinked", "thought", "taught"], 1, "Think → thought (taught es de teach)."],
      ["ord", "Fuimos a la playa el verano pasado.", "We went to the beach last summer"],
      ["fill", "They ___ (study) all night for the exam.", ["studied"], "Consonante + y → -ied."],
      ["mc", "Where ___ you born?", ["did", "were", "was"], 1, "Born usa el verbo be: Where were you born?"]
    ]},
    { id: "a2-3", title: "Futuro: going to vs. will", explain: `<p><b>Going to</b>: planes ya decididos y predicciones con evidencia. <i>I'm going to visit my parents. Look at those clouds, it's going to rain.</i></p><p><b>Will</b>: decisiones en el momento, promesas, ofertas y predicciones sin evidencia. <i>I'll help you. I think she'll win.</i></p>`, ex: [
      ["mc", "The phone is ringing. — I ___ answer it.", ["'ll", "'m going to", "am"], 0, "Decisión en el momento: will."],
      ["mc", "We ___ get married next June. We booked the venue.", ["will", "are going to", "go"], 1, "Plan ya decidido: going to."],
      ["fill", "Don't worry, I ___ tell anyone. (negativo de will)", ["won't", "will not"], "Promesa negativa: won't."],
      ["ord", "Voy a estudiar inglés todos los días.", "I am going to study English every day"],
      ["mc", "I think robots ___ do most jobs in the future.", ["will", "are going", "going to"], 0, "Opinión/predicción sin evidencia: will."],
      ["fill", "Be careful! You ___ going to fall!", ["are", "'re"], "Evidencia presente: you're going to fall."]
    ]},
    { id: "a2-4", title: "Comparativos y superlativos", explain: `<p>Adjetivos cortos: <b>-er / the -est</b> (<i>cheaper, the cheapest</i>). Largos: <b>more / the most</b> (<i>more expensive, the most expensive</i>).</p><p>Irregulares: <i>good → better → the best; bad → worse → the worst; far → farther/further</i>. Para comparar se usa <b>than</b>: <i>taller than me</i>.</p>`, ex: [
      ["fill", "Medellín is ___ (warm) than Bogotá.", ["warmer"], "Adjetivo corto: warm → warmer."],
      ["mc", "This is the ___ movie I've ever seen.", ["worse", "baddest", "worst"], 2, "Superlativo de bad: the worst."],
      ["fill", "English is ___ (easy) than Chinese.", ["easier"], "Consonante + y → -ier."],
      ["mc", "She is ___ intelligent than her brother.", ["more", "most", "-er"], 0, "Adjetivo largo: more intelligent than."],
      ["ord", "Este es el restaurante más caro de la ciudad.", "This is the most expensive restaurant in the city"],
      ["mc", "My English is ___ now than last year.", ["gooder", "better", "best"], 1, "Comparativo de good: better."]
    ]},
    { id: "a2-5", title: "Presente perfecto (introducción)", explain: `<p><b>have/has + participio</b> para experiencias de vida y resultados recientes, sin decir cuándo: <i>I've been to Mexico. She has lost her keys.</i></p><p>Palabras típicas: <b>ever, never, already, yet, just</b>. <i>Have you ever eaten sushi? I haven't finished yet. I've just arrived.</i></p>`, ex: [
      ["mc", "Have you ever ___ to London?", ["went", "been", "go"], 1, "Experiencia: have you ever been."],
      ["fill", "I have ___ (never) seen snow. (escribe never)", ["never"], "I have never seen..."],
      ["mc", "She ___ finished her homework yet.", ["hasn't", "didn't", "haven't"], 0, "Yet + presente perfecto; she → has."],
      ["fill", "We've ___ (just) eaten. (escribe just)", ["just"], "Just = hace un momento."],
      ["ord", "Ya he terminado el informe.", "I have already finished the report"],
      ["mc", "Participio de 'write':", ["wrote", "written", "writed"], 1, "Write – wrote – written."]
    ]},
    { id: "a2-6", title: "Modales: can, should, must, have to", explain: `<p><b>can</b>: habilidad/permiso. <b>should</b>: consejo. <b>must</b>: obligación fuerte (a menudo personal). <b>have to</b>: obligación externa. <b>don't have to</b>: no es necesario. <b>mustn't</b>: prohibido.</p><p>Después de un modal va el verbo base sin <i>to</i>: <i>You should rest</i> (no <i>should to rest</i>).</p>`, ex: [
      ["mc", "You look tired. You ___ go to bed early.", ["should", "must to", "can to"], 0, "Consejo: should + verbo base."],
      ["mc", "It's Sunday. I ___ work today. Great!", ["mustn't", "don't have to", "can't"], 1, "No es necesario → don't have to."],
      ["mc", "You ___ smoke in the hospital. It's forbidden.", ["don't have to", "mustn't", "shouldn't to"], 1, "Prohibición → mustn't."],
      ["fill", "___ you swim? — Yes, I can.", ["can"], "Habilidad: Can you swim?"],
      ["ord", "Tengo que trabajar mañana.", "I have to work tomorrow"],
      ["mc", "She ___ wear a uniform at her job.", ["has to", "have to", "must to"], 0, "3.ª persona: has to."]
    ]},
    { id: "a2-7", title: "Contables e incontables", explain: `<p><b>much</b> con incontables (<i>much water, much money</i>), <b>many</b> con contables plurales (<i>many people</i>). <b>a lot of</b> sirve para ambos.</p><p><b>some</b> en afirmativas y ofrecimientos; <b>any</b> en negativas y preguntas. Incontables comunes que en español sí se cuentan: <i>information, advice, news, furniture, homework</i>.</p>`, ex: [
      ["mc", "How ___ money do you have?", ["many", "much", "a few"], 1, "Money es incontable: much."],
      ["mc", "There aren't ___ eggs in the fridge.", ["some", "any", "much"], 1, "Negativa: any."],
      ["mc", "Can you give me some ___?", ["advices", "advice", "an advice"], 1, "Advice es incontable."],
      ["fill", "How ___ people came to the party?", ["many"], "People es contable plural: many."],
      ["ord", "Necesito algo de información.", "I need some information"],
      ["mc", "The news ___ very good today.", ["are", "is", "were"], 1, "News es singular incontable: is."]
    ]},
    { id: "a2-8", title: "Errores típicos de hispanohablantes", explain: `<p>Calcos del español que conviene evitar:</p><ul><li><i>I have 25 years</i> → <b>I am 25 years old</b></li><li><i>People is</i> → <b>People are</b></li><li><i>Explain me</i> → <b>Explain to me</b></li><li><i>Is raining</i> → <b>It is raining</b> (el sujeto es obligatorio)</li><li>Falsos amigos: <i>actually</i> = en realidad; <i>embarrassed</i> = avergonzado; <i>library</i> = biblioteca; <i>assist</i> = ayudar</li></ul>`, ex: [
      ["mc", "¿Cuál es correcta?", ["I have 30 years.", "I am 30 years old.", "I have 30 years old."], 1, "La edad se dice con be."],
      ["mc", "¿Cuál es correcta?", ["People is happy.", "People are happy.", "The people is happy."], 1, "People es plural."],
      ["mc", "'Actually' significa:", ["actualmente", "en realidad", "activamente"], 1, "Actualmente = currently/nowadays."],
      ["mc", "¿Cuál es correcta?", ["Can you explain me this?", "Can you explain this to me?", "Can you explain to me this?"], 1, "Explain something to someone."],
      ["fill", "___ is very cold today. (sujeto)", ["it"], "El inglés necesita sujeto: It is cold."],
      ["mc", "'Estoy embarazada' es:", ["I'm embarrassed.", "I'm pregnant.", "I'm embarazed."], 1, "Embarrassed = avergonzado/a."]
    ]}
  ],
  B1: [
    { id: "b1-1", title: "Presente perfecto vs. pasado simple", explain: `<p><b>Pasado simple</b>: momento terminado y específico (<i>yesterday, in 2019, last week</i>).</p><p><b>Presente perfecto</b>: periodo que sigue abierto o tiempo no especificado, y duración con <b>for</b> (periodo) / <b>since</b> (punto de inicio): <i>I've lived here for five years / since 2020.</i></p>`, ex: [
      ["mc", "I ___ here since 2018.", ["live", "lived", "have lived"], 2, "Since + algo que sigue: presente perfecto."],
      ["mc", "I ___ him last Friday.", ["have seen", "saw", "see"], 1, "Last Friday es un momento terminado."],
      ["fill", "She has worked here ___ ten years.", ["for"], "Duración: for."],
      ["fill", "They have been married ___ 2015.", ["since"], "Punto de inicio: since."],
      ["ord", "¿Cuánto tiempo has estudiado inglés?", "How long have you studied English"],
      ["mc", "___ you finish the project yesterday?", ["Have", "Did", "Has"], 1, "Yesterday → pasado simple."]
    ]},
    { id: "b1-2", title: "Pasado continuo", explain: `<p><b>was/were + -ing</b>: acción en progreso en el pasado, a menudo interrumpida por otra en pasado simple: <i>I was cooking when the phone rang.</i></p><p><b>while</b> suele ir con el continuo: <i>While I was driving, it started to rain.</i></p>`, ex: [
      ["mc", "I ___ TV when the lights went out.", ["watched", "was watching", "am watching"], 1, "Acción en progreso interrumpida."],
      ["fill", "What ___ you doing at 8 pm last night?", ["were"], "You → were."],
      ["mc", "While she ___, she cut her finger.", ["cooked", "was cooking", "cooks"], 1, "While + pasado continuo."],
      ["ord", "Estaba lloviendo cuando salimos.", "It was raining when we left"],
      ["mc", "He ___ when I called him.", ["was sleeping", "slept", "sleeping"], 0, "Acción en progreso."],
      ["fill", "They ___ (not / listen) when the teacher explained it.", ["weren't listening", "were not listening"], "Negativa: weren't + -ing."]
    ]},
    { id: "b1-3", title: "Condicionales 1 y 2", explain: `<p><b>Primer condicional</b> (real/posible): <i>If + presente, will + verbo</i>. <i>If it rains, I'll stay home.</i></p><p><b>Segundo condicional</b> (hipotético/irreal): <i>If + pasado, would + verbo</i>. <i>If I had more money, I would travel.</i> Con be se prefiere <b>were</b>: <i>If I were you...</i></p>`, ex: [
      ["mc", "If I ___ rich, I would buy a house in Cartagena.", ["am", "were", "will be"], 1, "Hipotético: If I were."],
      ["fill", "If you study, you ___ pass the exam.", ["will", "'ll"], "Real/posible: will."],
      ["mc", "If I ___ you, I'd accept the job.", ["were", "am", "would be"], 0, "Consejo: If I were you."],
      ["mc", "What would you do if you ___ the lottery?", ["win", "won", "will win"], 1, "Segundo condicional: pasado."],
      ["ord", "Si llueve, nos quedaremos en casa.", "If it rains we will stay at home"],
      ["mc", "If she ___ earlier, she won't be late.", ["leaves", "left", "will leave"], 0, "Tras if no va will: presente."]
    ]},
    { id: "b1-4", title: "La voz pasiva", explain: `<p><b>be + participio</b> cuando importa más la acción que quién la hace: <i>English is spoken here. The bridge was built in 1990.</i></p><p>Quién lo hizo se indica con <b>by</b>: <i>The book was written by García Márquez.</i></p>`, ex: [
      ["mc", "Coffee ___ in Colombia.", ["grows", "is grown", "is growing"], 1, "Pasiva en presente: is grown."],
      ["fill", "The Mona Lisa was ___ (paint) by Leonardo da Vinci.", ["painted"], "Participio: painted."],
      ["mc", "My car ___ yesterday.", ["was stolen", "stole", "is stolen"], 0, "Pasiva en pasado."],
      ["ord", "Las cartas son entregadas cada mañana.", "The letters are delivered every morning"],
      ["mc", "This house ___ in 1950.", ["built", "was built", "is build"], 1, "Pasiva pasado."],
      ["fill", "The emails ___ sent automatically every day. (presente)", ["are"], "Plural presente: are sent."]
    ]},
    { id: "b1-5", title: "Oraciones relativas", explain: `<p><b>who</b> para personas, <b>which</b> para cosas, <b>that</b> para ambos (en definiciones), <b>where</b> para lugares, <b>whose</b> para posesión.</p><p><i>The woman who lives next door is a doctor. The city where I was born is small.</i></p>`, ex: [
      ["mc", "The man ___ called you is my boss.", ["which", "who", "where"], 1, "Persona: who."],
      ["mc", "This is the restaurant ___ we had our first date.", ["which", "where", "who"], 1, "Lugar: where."],
      ["fill", "That's the girl ___ father is a pilot.", ["whose"], "Posesión: whose."],
      ["mc", "The laptop ___ I bought is very fast.", ["who", "which", "whose"], 1, "Cosa: which/that."],
      ["ord", "El libro que estoy leyendo es interesante.", "The book that I am reading is interesting"]
    ]},
    { id: "b1-6", title: "Estilo indirecto (reported speech)", explain: `<p>Al contar lo que alguien dijo, los tiempos suelen “retroceder”: <i>“I am tired” → She said (that) she was tired. “I will call” → He said he would call.</i></p><p><b>say</b> no lleva persona; <b>tell</b> sí: <i>She told me that...</i></p>`, ex: [
      ["mc", "\"I'm busy.\" → He said he ___ busy.", ["is", "was", "were"], 1, "Presente → pasado."],
      ["mc", "She ___ me that she was leaving.", ["said", "told", "say"], 1, "Tell + persona."],
      ["fill", "\"I will help you.\" → She said she ___ help me.", ["would"], "Will → would."],
      ["mc", "\"I can swim.\" → He said he ___ swim.", ["can", "could", "may"], 1, "Can → could."],
      ["ord", "Me dijo que estaba cansado.", "He told me that he was tired"]
    ]},
    { id: "b1-7", title: "Used to / be used to / get used to", explain: `<p><b>used to + verbo</b>: hábitos del pasado que ya no ocurren: <i>I used to smoke.</i></p><p><b>be used to + -ing/sustantivo</b>: estar acostumbrado. <b>get used to</b>: acostumbrarse. <i>I'm used to waking up early. I'm getting used to the cold.</i></p>`, ex: [
      ["mc", "When I was a child, I ___ play football every day.", ["used to", "am used to", "use to"], 0, "Hábito pasado."],
      ["mc", "I'm used to ___ in English at work.", ["speak", "speaking", "spoke"], 1, "Be used to + -ing."],
      ["fill", "Did you ___ to live in Cali? (use/used)", ["use"], "En pregunta con did: use to."],
      ["mc", "It took me months to ___ used to the food in London.", ["be", "get", "use"], 1, "Proceso de acostumbrarse: get used to."],
      ["ord", "Solía tener el pelo largo.", "I used to have long hair"]
    ]},
    { id: "b1-8", title: "Gerundio vs. infinitivo", explain: `<p>Algunos verbos van con <b>-ing</b>: <i>enjoy, avoid, finish, mind, suggest, keep</i>. Otros con <b>to + verbo</b>: <i>want, decide, hope, plan, agree, refuse</i>.</p><p>Después de preposición siempre -ing: <i>I'm interested in learning.</i></p>`, ex: [
      ["mc", "I enjoy ___ to music.", ["to listen", "listening", "listen"], 1, "Enjoy + -ing."],
      ["mc", "She decided ___ the job.", ["to accept", "accepting", "accept"], 0, "Decide + to."],
      ["fill", "Thank you for ___ (help) me.", ["helping"], "Preposición + -ing."],
      ["mc", "Would you mind ___ the window?", ["to open", "opening", "open"], 1, "Mind + -ing."],
      ["mc", "We're planning ___ to Europe.", ["to travel", "traveling", "travel"], 0, "Plan + to."],
      ["ord", "Dejé de fumar hace dos años.", "I stopped smoking two years ago"]
    ]}
  ],
  B2: [
    { id: "b2-1", title: "Tercer condicional y mixtos", explain: `<p><b>Tercer condicional</b> (pasado irreal): <i>If + had + participio, would have + participio</i>. <i>If I had studied, I would have passed.</i></p><p><b>Mixto</b> (pasado → presente): <i>If I had taken that job, I would be rich now.</i></p>`, ex: [
      ["mc", "If I had known, I ___ you.", ["would tell", "would have told", "will tell"], 1, "Tercer condicional."],
      ["fill", "If she ___ (leave) earlier, she wouldn't have missed the flight.", ["had left", "'d left"], "If + had + participio."],
      ["mc", "If I had studied medicine, I ___ a doctor now.", ["would have been", "would be", "will be"], 1, "Mixto: resultado presente."],
      ["mc", "We ___ the match if our goalkeeper hadn't got injured.", ["would win", "would have won", "won"], 1, "Resultado pasado."],
      ["ord", "Si hubiera sabido, habría venido.", "If I had known I would have come"]
    ]},
    { id: "b2-2", title: "Pasiva avanzada y causativo", explain: `<p>Pasiva en todos los tiempos: <i>has been done, is being done, will have been done</i>.</p><p><b>Causativo</b>: <i>have/get something done</i> = que otra persona lo haga por ti: <i>I had my hair cut. I'm getting my car repaired.</i></p>`, ex: [
      ["mc", "The road ___ at the moment.", ["is repaired", "is being repaired", "has repaired"], 1, "Pasiva continua."],
      ["mc", "I need to ___ my eyes tested.", ["have", "do", "make"], 0, "Causativo: have something done."],
      ["fill", "The results have ___ published. (be)", ["been"], "Pasiva perfecta: have been published."],
      ["mc", "She got her phone ___.", ["fix", "fixed", "fixing"], 1, "Get + objeto + participio."],
      ["ord", "Me cortaron el pelo ayer.", "I had my hair cut yesterday"]
    ]},
    { id: "b2-3", title: "Modales de deducción", explain: `<p>Presente: <b>must</b> (seguro que sí), <b>can't</b> (seguro que no), <b>might/may/could</b> (posible).</p><p>Pasado: <b>must have / can't have / might have + participio</b>. <i>She must have forgotten. He can't have seen us.</i></p>`, ex: [
      ["mc", "The lights are off. They ___ be at home.", ["must", "can't", "should"], 1, "Seguro que no."],
      ["mc", "He looks exhausted. He ___ worked all night.", ["must have", "can't have", "must"], 0, "Deducción pasada positiva."],
      ["fill", "I'm not sure where she is. She ___ be in a meeting. (posible)", ["might", "may", "could"], "Posibilidad."],
      ["mc", "You ___ seen John yesterday. He's in Japan!", ["must have", "can't have", "might have"], 1, "Imposible en el pasado."],
      ["ord", "Debe de haber perdido el bus.", "He must have missed the bus"]
    ]},
    { id: "b2-4", title: "Wish e If only", explain: `<p>Deseos sobre el presente: <b>wish + pasado</b> (<i>I wish I spoke better English</i>). Sobre el pasado: <b>wish + had + participio</b> (<i>I wish I had studied more</i>).</p><p>Quejas sobre otros: <b>wish + would</b> (<i>I wish you would stop talking</i>).</p>`, ex: [
      ["mc", "I wish I ___ taller.", ["am", "were", "will be"], 1, "Presente irreal: were."],
      ["mc", "I wish I ___ that. It was a mistake.", ["didn't say", "hadn't said", "don't say"], 1, "Arrepentimiento pasado."],
      ["fill", "I wish my neighbours ___ stop making noise.", ["would"], "Queja: wish + would."],
      ["mc", "If only I ___ more time!", ["have", "had", "will have"], 1, "If only + pasado."],
      ["ord", "Ojalá hubiera viajado más cuando era joven.", "I wish I had travelled more when I was young"]
    ]},
    { id: "b2-5", title: "Futuro continuo y perfecto", explain: `<p><b>Futuro continuo</b> (will be + -ing): acción en progreso en un momento futuro: <i>This time tomorrow I'll be flying to Madrid.</i></p><p><b>Futuro perfecto</b> (will have + participio): terminada antes de un momento futuro: <i>By 2030, I will have finished my degree.</i></p>`, ex: [
      ["mc", "By next year, I ___ here for a decade.", ["will work", "will have worked", "will be work"], 1, "Futuro perfecto con by."],
      ["mc", "Don't call at 9. I ___ dinner.", ["will have", "will be having", "have"], 1, "En progreso en ese momento."],
      ["fill", "By the time you arrive, we will have ___ (finish).", ["finished"], "Will have + participio."],
      ["ord", "Mañana a esta hora estaré trabajando.", "This time tomorrow I will be working"],
      ["mc", "She ___ the report by Friday.", ["will have finished", "will be finishing", "finishes"], 0, "Completado antes de un plazo."]
    ]},
    { id: "b2-6", title: "Conectores de contraste", explain: `<p><b>although/even though</b> + oración. <b>despite/in spite of</b> + sustantivo o -ing. <b>however</b> al inicio de oración, con coma. <b>whereas/while</b> para contrastar dos ideas.</p><p><i>Despite the rain, we went out. Although it was raining, we went out.</i></p>`, ex: [
      ["mc", "___ the traffic, we arrived on time.", ["Although", "Despite", "However"], 1, "Despite + sustantivo."],
      ["mc", "___ he was tired, he kept working.", ["Despite", "Although", "In spite"], 1, "Although + oración."],
      ["fill", "The plan is good. ___, it's too expensive.", ["however"], "However + coma."],
      ["mc", "In spite of ___ hard, he failed.", ["study", "studying", "studied"], 1, "In spite of + -ing."],
      ["mc", "I like coffee, ___ my wife prefers tea.", ["whereas", "despite", "however"], 0, "Contraste entre dos ideas."]
    ]},
    { id: "b2-7", title: "Phrasal verbs esenciales", explain: `<p>Verbo + partícula con significado nuevo: <i>give up</i> (rendirse/dejar), <i>look forward to</i> (esperar con ganas), <i>put off</i> (aplazar), <i>come up with</i> (idear), <i>run out of</i> (quedarse sin), <i>turn down</i> (rechazar), <i>figure out</i> (descifrar).</p>`, ex: [
      ["mc", "We've ___ milk. Can you buy some?", ["run out of", "given up", "put off"], 0, "Quedarse sin: run out of."],
      ["mc", "I'm looking forward to ___ you.", ["see", "seeing", "saw"], 1, "Look forward to + -ing."],
      ["fill", "Don't put ___ until tomorrow what you can do today.", ["off"], "Put off = aplazar."],
      ["mc", "She ___ a brilliant idea.", ["came up with", "turned down", "gave up"], 0, "Idear: come up with."],
      ["mc", "He ___ the job offer because the salary was low.", ["turned down", "turned up", "looked after"], 0, "Rechazar: turn down."],
      ["fill", "I can't figure ___ this problem.", ["out"], "Figure out = resolver/entender."]
    ]}
  ],
  C1: [
    { id: "c1-1", title: "Inversión para énfasis", explain: `<p>Tras expresiones negativas o restrictivas al inicio, se invierte sujeto y auxiliar (registro formal): <i>Never have I seen such chaos. Not only did she win, but she also broke the record. Hardly had we arrived when it started to rain. Under no circumstances should you open this.</i></p>`, ex: [
      ["mc", "Never ___ such a beautiful place.", ["I have seen", "have I seen", "I saw"], 1, "Never + auxiliar + sujeto."],
      ["mc", "Not only ___ late, but he also forgot the documents.", ["he was", "was he", "he is"], 1, "Not only + inversión."],
      ["fill", "Hardly ___ I sat down when the phone rang.", ["had"], "Hardly had + sujeto + participio."],
      ["mc", "Under no circumstances ___ leave the building.", ["you should", "should you", "you must"], 1, "Inversión obligatoria."],
      ["ord", "Rara vez he oído un argumento tan convincente.", "Rarely have I heard such a convincing argument"],
      ["mc", "Little ___ know what was about to happen.", ["did they", "they did", "they"], 0, "Little + did + sujeto."]
    ]},
    { id: "c1-2", title: "Oraciones escindidas (cleft sentences)", explain: `<p>Sirven para destacar información: <b>What I need is...</b>, <b>It was ... who/that...</b>, <b>All I want is...</b>, <b>The reason why... is that...</b></p><p><i>It was Maria who solved the problem. What surprised me was his attitude.</i></p>`, ex: [
      ["mc", "___ I need is a long holiday.", ["That", "What", "Which"], 1, "What + cláusula como sujeto."],
      ["mc", "It was my brother ___ broke the window.", ["which", "who", "what"], 1, "It was + persona + who."],
      ["fill", "___ I want is some peace and quiet. (todo lo que)", ["all"], "All I want is..."],
      ["ord", "Lo que más me molesta es su actitud.", "What annoys me most is his attitude"],
      ["mc", "The reason ___ I left is that I wasn't happy.", ["why", "because", "what"], 0, "The reason why..."]
    ]},
    { id: "c1-3", title: "Hipótesis avanzadas", explain: `<p>Formas formales o enfáticas: <b>Were I to...</b> / <b>Should you need...</b> / <b>Had I known...</b> (condicionales sin if). <b>But for / Without</b> + sustantivo. <b>It's (high) time</b> + pasado. <b>Supposing / Provided that / As long as</b>.</p>`, ex: [
      ["mc", "___ you need any help, don't hesitate to contact us.", ["If you should", "Should", "Would"], 1, "Should + sujeto = if."],
      ["mc", "___ I known about the problem, I would have acted.", ["If", "Had", "Have"], 1, "Had + sujeto = if I had."],
      ["fill", "It's high time you ___ (start) looking for a job.", ["started"], "It's time + pasado."],
      ["mc", "___ your help, I would have failed.", ["But for", "Unless", "Despite"], 0, "But for = sin."],
      ["mc", "You can borrow the car ___ you drive carefully.", ["provided that", "unless", "in case"], 0, "Con la condición de que."],
      ["ord", "Si fuera a renunciar, ¿qué harías?", "Were I to resign what would you do"]
    ]},
    { id: "c1-4", title: "Cláusulas de participio", explain: `<p>Reducen oraciones y dan un estilo más fluido: <i>Having finished the report, she went home</i> (después de terminar). <i>Built in 1600, the church is the oldest in town</i> (pasiva). <i>Not knowing what to do, I called my father</i> (causa).</p>`, ex: [
      ["mc", "___ the email, he closed his laptop.", ["Having sent", "Sent", "Sending to"], 0, "Acción anterior: having + participio."],
      ["mc", "___ in 1890, the bridge is still in use.", ["Building", "Built", "Having building"], 1, "Sentido pasivo: built."],
      ["fill", "Not ___ (know) the answer, she stayed silent.", ["knowing"], "Causa: not knowing."],
      ["mc", "___ from a distance, the island looks small.", ["Seen", "Seeing", "Having seen it"], 0, "Pasivo: (cuando es) visto."],
      ["ord", "Habiendo vivido en Londres, habla inglés con fluidez.", "Having lived in London he speaks English fluently"]
    ]},
    { id: "c1-5", title: "Registro formal y matización (hedging)", explain: `<p>En inglés académico y profesional se suaviza la certeza: <i>It would appear that... / This tends to suggest... / There is some evidence that... / It could be argued that...</i></p><p>Y se nominaliza: <i>They decided → The decision was made; prices increased → an increase in prices</i>.</p>`, ex: [
      ["mc", "La versión más matizada:", ["This proves that sugar causes obesity.", "This would seem to suggest a link between sugar and obesity.", "Sugar obviously causes obesity."], 1, "Hedging: would seem to suggest."],
      ["mc", "Nominalización de 'the prices rose sharply':", ["a sharp rise in prices", "a rising sharp of prices", "prices rising sharp"], 0, "Rise (sustantivo) + in."],
      ["fill", "It could be ___ that remote work increases productivity.", ["argued"], "It could be argued that..."],
      ["mc", "Más formal que 'get':", ["obtain", "grab", "pick up"], 0, "Obtain = registro formal."],
      ["mc", "'There is a ___ to overestimate risks.'", ["tendency", "tend", "tending"], 0, "Sustantivo: tendency."]
    ]},
    { id: "c1-6", title: "Colocaciones y expresiones idiomáticas", explain: `<p>Combinaciones naturales: <i>make a decision, take a risk, pay attention, heavy traffic, strong coffee, highly unlikely, deeply concerned, bitterly disappointed</i>.</p><p>Expresiones: <i>a blessing in disguise, cut corners, the last straw, on the fence, hit the nail on the head</i>.</p>`, ex: [
      ["mc", "We need to ___ a decision soon.", ["do", "make", "take out"], 1, "Make a decision."],
      ["mc", "It's ___ unlikely that he'll come.", ["highly", "strongly", "heavily"], 0, "Highly unlikely."],
      ["mc", "'On the fence' significa:", ["indeciso", "en problemas", "muy feliz"], 0, "Sin decidirse."],
      ["fill", "Losing that job was a blessing in ___.", ["disguise"], "Algo malo que resultó bueno."],
      ["mc", "Don't ___ corners on safety.", ["cut", "break", "turn"], 0, "Cut corners = hacer algo chapucero para ahorrar."],
      ["mc", "I was ___ disappointed with the results.", ["bitterly", "heavily", "strongly"], 0, "Bitterly disappointed."]
    ]}
  ],
  C2: [
    { id: "c2-1", title: "Subjuntivo y estructuras formales", explain: `<p>Tras <i>suggest, insist, recommend, demand, it is essential that</i> se usa el verbo base (subjuntivo): <i>I insist that he be present. It is vital that she attend.</i></p><p>Expresiones fijas: <i>be that as it may, come what may, so be it</i>.</p>`, ex: [
      ["mc", "The board demanded that the CEO ___.", ["resigns", "resign", "resigned"], 1, "Subjuntivo: verbo base."],
      ["mc", "It is essential that every student ___ the form.", ["complete", "completes", "will complete"], 0, "It is essential that + base."],
      ["fill", "Be that as it ___, we must continue.", ["may"], "Be that as it may = aun así."],
      ["mc", "___ what may, I'll support you.", ["Come", "Comes", "Coming"], 0, "Come what may = pase lo que pase."]
    ]},
    { id: "c2-2", title: "Elipsis y sustitución", explain: `<p>Los nativos evitan repetir: <i>I'd like to go but I can't (go). — Are you coming? — I hope so / I'm afraid not. She's more experienced than I am. — Did he? — He did, though.</i></p>`, ex: [
      ["mc", "— Will it rain tomorrow? — I hope ___.", ["not", "no", "don't"], 0, "Hope not = espero que no."],
      ["mc", "He said he'd finish on time, and he ___.", ["did", "finished on time did", "has"], 0, "Sustitución con auxiliar."],
      ["fill", "— Is she coming? — I think ___.", ["so"], "I think so."],
      ["mc", "I wanted to call you, but I forgot ___.", ["to", "it to", "calling"], 0, "Elipsis: forgot to (call)."]
    ]},
    { id: "c2-3", title: "Matices de vocabulario", explain: `<p>A nivel C2 importa elegir la palabra exacta: <i>reluctant / unwilling, imply / infer, ambiguous / ambivalent, disinterested (imparcial) / uninterested (sin interés), alternate / alternative</i>.</p>`, ex: [
      ["mc", "A judge should be ___ (imparcial).", ["uninterested", "disinterested", "unconcerned"], 1, "Disinterested = imparcial."],
      ["mc", "From his tone, I ___ that he was angry.", ["implied", "inferred", "insinuated"], 1, "El oyente infiere."],
      ["mc", "She felt ___ about the move: both excited and sad.", ["ambiguous", "ambivalent", "indifferent"], 1, "Ambivalent = sentimientos encontrados."],
      ["fill", "He was ___ to admit his mistake. (reacio)", ["reluctant"], "Reluctant = reacio."]
    ]}
  ]
};

// Vocabulario: "inglés|español|ejemplo"
const VOCAB = {
  A2: `get up|levantarse|I get up at six every day.
borrow|pedir prestado|Can I borrow your pen?
lend|prestar|Could you lend me some money?
appointment|cita (médica/trabajo)|I have a dentist appointment at 3.
bill|cuenta / factura|Can we have the bill, please?
change|cambio (dinero)|Keep the change.
cheap|barato|This shirt was really cheap.
expensive|caro|Living in London is expensive.
crowded|lleno de gente|The bus was very crowded.
delay|retraso|There was a two-hour delay.
luggage|equipaje|Don't leave your luggage alone.
book|reservar|I booked a table for two.
journey|viaje (trayecto)|The journey took five hours.
weather|clima / tiempo|The weather is lovely today.
cloudy|nublado|It's cloudy and cold.
hungry|con hambre|I'm hungry. Let's eat.
thirsty|con sed|I'm so thirsty after the run.
tired|cansado|I'm too tired to go out.
bored|aburrido (sentir)|I'm bored. Let's do something.
boring|aburrido (ser)|The film was boring.
worried|preocupado|She's worried about her exam.
angry|enojado|He was angry with me.
health|salud|Exercise is good for your health.
headache|dolor de cabeza|I have a terrible headache.
feel|sentir(se)|I don't feel well today.
job|trabajo (puesto)|She got a new job.
salary|salario|The salary is good.
boss|jefe|My boss is very friendly.
meeting|reunión|We have a meeting at ten.
neighbour|vecino|My neighbour has a big dog.
rent|alquiler / arrendar|The rent is too high.
furniture|muebles|We bought new furniture.
already|ya|I've already eaten.
yet|todavía (neg./preg.)|Have you finished yet?
still|todavía (sigue)|She still lives with her parents.
almost|casi|I almost missed the bus.
enough|suficiente|We don't have enough time.
because of|debido a|We stayed home because of the rain.
try|intentar / probar|Try this cake.
wait for|esperar a|I'm waiting for my friend.
look for|buscar|I'm looking for my keys.
look after|cuidar|She looks after her grandmother.
find out|averiguar|I need to find out the price.
turn on|encender|Turn on the lights, please.
turn off|apagar|Turn off your phone.
pick up|recoger|I'll pick you up at eight.
grow up|crecer (criarse)|I grew up in Cali.
How about...?|¿Qué tal si...?|How about going to the cinema?`,
  B1: `achieve|lograr|She achieved all her goals.
improve|mejorar|I want to improve my English.
skill|habilidad|Communication is a key skill.
experience|experiencia|Do you have any work experience?
career|carrera profesional|He has a successful career.
deadline|fecha límite|The deadline is on Friday.
apply for|postularse a|I applied for a job at Google.
hire|contratar|They hired three new people.
fire|despedir|He was fired for being late.
earn|ganar (dinero)|How much do you earn?
save|ahorrar|I'm saving for a car.
afford|permitirse (pagar)|I can't afford a new phone.
advice|consejo|Can you give me some advice?
suggest|sugerir|I suggest taking a taxi.
agree|estar de acuerdo|I agree with you.
disagree|no estar de acuerdo|I disagree with that idea.
opinion|opinión|In my opinion, it's too expensive.
however|sin embargo|It's cheap. However, it's not good.
although|aunque|Although it rained, we went out.
instead|en lugar de eso|I didn't call. I wrote instead.
eventually|finalmente|Eventually, we found the hotel.
actually|en realidad|Actually, I'm from Colombia.
currently|actualmente|I'm currently working from home.
realise|darse cuenta|I didn't realise it was so late.
remind|recordar (a alguien)|Remind me to call mom.
remember|recordar|I can't remember his name.
avoid|evitar|Try to avoid sugar.
behaviour|comportamiento|His behaviour was strange.
environment|medio ambiente / entorno|We must protect the environment.
pollution|contaminación|Pollution is a big problem.
reliable|confiable|She's a very reliable person.
lazy|perezoso|Don't be lazy!
embarrassed|avergonzado|I was so embarrassed.
proud|orgulloso|I'm proud of you.
upset|molesto / disgustado|She was upset about the news.
cancel|cancelar|They cancelled the flight.
complain|quejarse|He always complains about work.
manage to|lograr (hacer)|I managed to finish on time.
be in charge of|estar a cargo de|She's in charge of marketing.
take care of|encargarse de / cuidar|I'll take care of it.
on purpose|a propósito|He did it on purpose.
by accident|por accidente|I deleted it by accident.
as soon as|tan pronto como|Call me as soon as you arrive.
so far|hasta ahora|So far, so good.
It depends on|depende de|It depends on the weather.`,
  B2: `nevertheless|no obstante|It was hard; nevertheless, we finished.
whereas|mientras que|He likes tea, whereas I prefer coffee.
despite|a pesar de|Despite the rain, we went out.
moreover|además|The plan is cheap. Moreover, it's quick.
therefore|por lo tanto|He was ill; therefore, he stayed home.
outcome|resultado|The outcome was positive.
issue|asunto / problema|This is a serious issue.
approach|enfoque|We need a different approach.
assess|evaluar|We need to assess the risks.
claim|afirmar / reclamar|He claims he is innocent.
consistent|constante / coherente|You need to be consistent.
reluctant|reacio|She was reluctant to help.
eager|ansioso (con ganas)|He's eager to learn.
thoroughly|a fondo|Read the contract thoroughly.
overcome|superar|She overcame many obstacles.
take into account|tener en cuenta|Take the costs into account.
come up with|idear / proponer|We came up with a plan.
put off|aplazar|Don't put off the decision.
run out of|quedarse sin|We've run out of coffee.
turn down|rechazar|He turned down the offer.
figure out|descifrar / entender|I can't figure it out.
carry out|llevar a cabo|They carried out a survey.
bring up|sacar un tema / criar|Don't bring up politics.
get along with|llevarse bien con|I get along with my colleagues.
look into|investigar|We'll look into the problem.
point out|señalar|She pointed out a mistake.
drawback|desventaja|The main drawback is the price.
feasible|viable|Is the project feasible?
straightforward|sencillo / directo|The process is straightforward.
genuine|genuino / auténtico|He showed genuine interest.
fairly|bastante|It's fairly easy.
hardly|apenas|I could hardly hear you.
sensible|sensato|That's a sensible decision.
sensitive|sensible|She's very sensitive to criticism.
deal with|lidiar con / manejar|I'll deal with the client.
in the long run|a largo plazo|It will save money in the long run.
on the other hand|por otro lado|On the other hand, it's risky.
as far as I know|que yo sepa|As far as I know, he's away.
it's worth|vale la pena|It's worth visiting the museum.
to be honest|para ser honesto|To be honest, I didn't like it.`,
  C1: `albeit|aunque (formal)|It was a success, albeit a small one.
notwithstanding|no obstante / pese a|Notwithstanding the risks, we proceeded.
thereby|de ese modo|He signed, thereby accepting the terms.
whereby|por el cual|A system whereby users pay monthly.
compelling|convincente|She made a compelling argument.
nuanced|matizado|A nuanced view of the issue.
pervasive|omnipresente|The pervasive influence of social media.
detrimental|perjudicial|Smoking is detrimental to health.
underpin|sustentar|Values that underpin our work.
undermine|socavar|This undermines our credibility.
mitigate|mitigar|Measures to mitigate the risk.
scrutiny|escrutinio|The plan came under scrutiny.
unprecedented|sin precedentes|An unprecedented crisis.
inevitable|inevitable|Change is inevitable.
hinder|obstaculizar|Bad weather hindered the rescue.
foster|fomentar|We want to foster creativity.
convey|transmitir|It's hard to convey emotions.
discrepancy|discrepancia|There's a discrepancy in the data.
far-reaching|de gran alcance|Far-reaching consequences.
take for granted|dar por sentado|Don't take your health for granted.
bear in mind|tener presente|Bear in mind that it's expensive.
come to terms with|aceptar / asumir|She came to terms with the loss.
a blessing in disguise|una bendición disfrazada|Losing that job was a blessing in disguise.
cut corners|hacer algo a medias|Don't cut corners on safety.
on the fence|indeciso|I'm still on the fence about it.
hit the nail on the head|dar en el clavo|You hit the nail on the head.
the last straw|la gota que colmó el vaso|That was the last straw.
by and large|en general|By and large, it was a success.
to a certain extent|hasta cierto punto|I agree to a certain extent.
in hindsight|en retrospectiva|In hindsight, it was a mistake.
it goes without saying|ni hace falta decirlo|It goes without saying that we'll help.
be bound to|seguro que (va a)|It's bound to rain.
keen on|aficionado a|I'm not keen on spicy food.
wary of|receloso de|Be wary of strangers online.
highly unlikely|muy improbable|It's highly unlikely he'll come.`,
  C2: `ubiquitous|omnipresente|Smartphones are ubiquitous.
ambivalent|ambivalente|She's ambivalent about the move.
disinterested|imparcial|We need a disinterested judge.
infer|inferir|I inferred that he was upset.
quintessential|por excelencia|The quintessential English pub.
serendipity|casualidad afortunada|We met by pure serendipity.
idiosyncratic|peculiar / particular|His idiosyncratic style.
ephemeral|efímero|Fame is ephemeral.
cogent|contundente / convincente|A cogent argument.
obfuscate|ofuscar / oscurecer|Don't obfuscate the issue.
paradigm shift|cambio de paradigma|A paradigm shift in medicine.
moot point|cuestión discutible|That's a moot point now.
be that as it may|sea como sea|Be that as it may, we must decide.
come what may|pase lo que pase|Come what may, I'll be there.
to all intents and purposes|a todos los efectos|To all intents and purposes, it's over.
a far cry from|muy distinto de|This is a far cry from what we expected.`
};

// Frases para escuchar y hablar
const SENTENCES = {
  A2: ["I usually get up at seven o'clock.", "Can I have the bill, please?", "We went to the beach last weekend.", "My brother is taller than me.", "I'm going to visit my grandparents tomorrow.", "Have you ever been to Mexico?", "How much does this jacket cost?", "I don't have enough time today."],
  B1: ["I've been working here for three years.", "If it rains tomorrow, we'll stay at home.", "I was cooking dinner when you called.", "She told me that she was moving to Canada.", "I used to play the guitar when I was a teenager.", "I'm looking forward to seeing you soon.", "The meeting has been cancelled because of the weather.", "Would you mind closing the window?"],
  B2: ["If I had known about the traffic, I would have left earlier.", "Despite the difficulties, the project was a success.", "She must have forgotten about the meeting.", "By the end of the year, I will have saved enough money.", "I wish I had spent more time with my family.", "We need to take into account all the possible risks.", "The results were far better than we had expected.", "I'm having my apartment painted next week."],
  C1: ["Never have I seen such a remarkable performance.", "What really matters is how we respond to the challenge.", "Had I known the consequences, I would have acted differently.", "Having considered all the options, we decided to postpone the launch.", "It could be argued that technology has made us less patient.", "Not only did she finish the marathon, but she also broke her personal record.", "Bear in mind that the deadline is non-negotiable.", "In hindsight, accepting that offer was a blessing in disguise."],
  C2: ["Be that as it may, the committee insisted that the proposal be withdrawn.", "Her argument, albeit compelling, overlooked several crucial factors.", "To all intents and purposes, the negotiations had already collapsed.", "The ubiquity of misinformation poses an unprecedented challenge to democracy."]
};

// Contenido adicional por nivel (se llena en src/levels/*.js)
const READINGS = {}, LISTENING = {}, ROLEPLAY = {}, WRITING = {}, CANDO = {};
