// ===== NIVEL C2: contenido adicional =====
LESSONS.C2.push(
  { id: "c2-4", title: "Énfasis: do/does/did, fronting y but", explain: `<p><b>Auxiliar enfático</b> en afirmativas: <i>I do understand your concern. She did warn us.</i></p><p><b>Fronting</b> (adelantar información) para énfasis o cohesión: <i>Strange as it may seem, ... / Much as I admire him, ... / Try as she might, she couldn't open it.</i></p><p><b>Adjetivo/adverbio + as/though + sujeto + verbo</b> = aunque: <i>Tired as we were, we kept going.</i></p>`, ex: [
    ["mc", "___ as it may seem, I actually enjoy exams.", ["Strange", "Strangely", "Stranger"], 0, "Adjetivo + as + sujeto + may seem."],
    ["mc", "___ I admire his talent, I can't stand his attitude.", ["Much as", "As much", "So much"], 0, "Much as = por mucho que."],
    ["fill", "I ___ appreciate your help, honestly. (enfático)", ["do"], "Do enfático."],
    ["mc", "Try ___ she might, she couldn't convince them.", ["as", "though", "so"], 0, "Try as she might = por más que lo intentara."],
    ["fix", "Tired as were we, we finished the race.", ["Tired as we were, we finished the race."], "Sujeto + verbo en orden normal."],
    ["tr", "Por muy difícil que sea, no me rendiré.", ["Difficult as it may be, I won't give up.", "However difficult it may be, I won't give up.", "However difficult it is, I won't give up.", "Difficult as it is, I won't give up."], "Adjetivo + as + it may be."]
  ]},
  { id: "c2-5", title: "Registro y estilo: formal vs. coloquial", explain: `<p>A nivel C2 se domina el cambio de registro. Formal: <i>commence, endeavour, request, sufficient, prior to, in the event of</i>. Neutro: <i>start, try, ask, enough, before, if</i>. Coloquial: <i>kick off, have a go, ask for, plenty, beforehand, in case</i>.</p><p>El registro formal prefiere pasivas, nominalizaciones y verbos de origen latino; el coloquial, phrasal verbs, contracciones y elipsis.</p>`, ex: [
    ["mc", "Versión formal de 'We need to start the meeting':", ["We need to kick off the meeting.", "The meeting must commence.", "Let's get going with the meeting."], 1, "Commence = registro formal."],
    ["mc", "Versión formal de 'before':", ["prior to", "ahead", "beforehand of"], 0, "Prior to + sustantivo."],
    ["mc", "Versión coloquial de 'I will endeavour to help':", ["I'll have a go at helping.", "I shall attempt assistance.", "Assistance will be endeavoured."], 0, "Have a go = intentar (coloquial)."],
    ["fill", "In the ___ of fire, use the stairs. (en caso de)", ["event"], "In the event of = formal."],
    ["mc", "Formal para 'enough':", ["plenty", "sufficient", "loads"], 1, "Sufficient."],
    ["tr", "Se ruega a los pasajeros que no dejen su equipaje desatendido.", ["Passengers are requested not to leave their luggage unattended.", "Passengers are kindly requested not to leave their luggage unattended.", "Passengers are asked not to leave their luggage unattended."], "Pasiva formal + request."]
  ]},
  { id: "c2-6", title: "Expresiones idiomáticas avanzadas", explain: `<p>El hablante C2 entiende y usa modismos con naturalidad, sin exagerar: <i>to be on thin ice</i> (en situación arriesgada), <i>to bite off more than you can chew</i> (abarcar demasiado), <i>to beat around the bush</i> (andarse con rodeos), <i>to throw someone under the bus</i> (traicionar para salvarse), <i>a can of worms</i> (asunto problemático), <i>to have a chip on your shoulder</i> (resentimiento).</p>`, ex: [
    ["mc", "Stop beating around the ___ and tell me what happened.", ["tree", "bush", "garden"], 1, "Beat around the bush."],
    ["mc", "Taking three jobs at once? You've bitten off more than you can ___.", ["eat", "chew", "swallow"], 1, "Bite off more than you can chew."],
    ["mc", "'Opening a can of worms' significa:", ["Empezar algo fácil", "Crear un problema complicado", "Ir de pesca"], 1, "Asunto que genera más problemas."],
    ["fill", "After missing three deadlines, he's on thin ___.", ["ice"], "On thin ice = en peligro."],
    ["mc", "He has a ___ on his shoulder about not going to university.", ["chip", "rock", "stone"], 0, "Chip on your shoulder = resentimiento."],
    ["mc", "When things went wrong, my manager threw me under the ___.", ["car", "bus", "train"], 1, "Throw someone under the bus."]
  ]},
  { id: "c2-7", title: "Precisión gramatical: errores sutiles", explain: `<p>Errores que incluso usuarios avanzados cometen: <i>less</i> (incontables) vs. <i>fewer</i> (contables); <i>who</i> vs. <i>whom</i> (objeto, formal); <i>lie/lay</i> (lie = yacer, sin objeto; lay = poner, con objeto); participios colgantes (<i>Walking home, the rain started</i> ✗); concordancia con <i>neither/each/none</i>.</p>`, ex: [
    ["mc", "There were ___ people than expected.", ["less", "fewer", "lesser"], 1, "Contable: fewer."],
    ["mc", "To ___ it may concern,", ["who", "whom", "whose"], 1, "Objeto de preposición: whom."],
    ["mc", "I need to ___ down for a while.", ["lay", "lie", "laid"], 1, "Lie down (sin objeto)."],
    ["fix", "Walking home, the rain started.", ["Walking home, I got caught in the rain.", "While I was walking home, the rain started.", "As I was walking home, the rain started.", "While I was walking home, it started to rain."], "Participio colgante: el sujeto debe ser quien camina."],
    ["mc", "Neither of the candidates ___ suitable.", ["is", "are", "were being"], 0, "Neither + singular (formal)."],
    ["fill", "Please ___ the documents on my desk. (poner)", ["lay", "put", "leave"], "Lay + objeto."]
  ]}
);

VOCAB.C2 += `
# Matices y precisión
nuance|matiz|She captured every nuance.
subtle|sutil|A subtle difference.
tacit|tácito|A tacit agreement.
implicit|implícito|An implicit criticism.
explicit|explícito|Explicit instructions.
tenuous|tenue / débil (vínculo)|A tenuous connection.
spurious|espurio / falso|A spurious argument.
salient|destacado / sobresaliente|The salient points.
pertinent|pertinente|A pertinent question.
germane|relevante (formal)|That's not germane to the issue.
# Argumentación y crítica
substantiate|fundamentar|Can you substantiate that claim?
refute|refutar|He refuted the allegations.
corroborate|corroborar|Witnesses corroborated her story.
concede|conceder / admitir|I concede that you have a point.
undermine|socavar|It undermines your credibility.
fallacy|falacia|That's a common fallacy.
contentious|polémico / conflictivo|A contentious issue.
dichotomy|dicotomía|A false dichotomy.
caveat|advertencia / salvedad|One caveat: it's expensive.
premise|premisa|The premise is flawed.
# Carácter y conducta
complacent|complaciente / confiado en exceso|Don't become complacent.
diligent|diligente|A diligent student.
candid|franco / sincero|A candid interview.
aloof|distante|He seems aloof.
gregarious|sociable|She's very gregarious.
pragmatic|pragmático|A pragmatic approach.
obstinate|obstinado|An obstinate refusal.
magnanimous|magnánimo|Magnanimous in victory.
conscientious|concienzudo|A conscientious worker.
disingenuous|falso / poco sincero|A disingenuous apology.
# Verbos sofisticados
alleviate|aliviar|Measures to alleviate poverty.
circumvent|eludir / sortear|They circumvented the rules.
galvanise|impulsar / galvanizar|The speech galvanised the crowd.
jeopardise|poner en peligro|Don't jeopardise your career.
procrastinate|procrastinar|Stop procrastinating!
scrutinise|examinar minuciosamente|They scrutinised every detail.
substantiate|fundamentar|The data substantiate the claim.
supersede|reemplazar / sustituir|The new law supersedes the old one.
vindicate|reivindicar|The results vindicated her approach.
waver|vacilar|He never wavered in his support.
# Expresiones avanzadas
to be on thin ice|estar en la cuerda floja|You're on thin ice.
to beat around the bush|andarse con rodeos|Stop beating around the bush.
a can of worms|un asunto problemático|That opens a can of worms.
to bite off more than you can chew|abarcar más de lo que puedes|Don't bite off more than you can chew.
to have a chip on your shoulder|estar resentido|He has a chip on his shoulder.
to throw someone under the bus|traicionar a alguien|He threw me under the bus.
the elephant in the room|el tema que todos evitan|Let's address the elephant in the room.
to cut to the chase|ir al grano|Let's cut to the chase.
to split hairs|buscarle tres pies al gato|Now you're splitting hairs.
to err on the side of caution|pecar de precavido|Let's err on the side of caution.
a moot point|una cuestión discutible|Whether he knew is a moot point.
by the same token|del mismo modo|By the same token, we must act.
in a nutshell|en pocas palabras|In a nutshell, we failed.
for all intents and purposes|a efectos prácticos|For all intents and purposes, it's finished.`;

SENTENCES.C2.push("Much as I admire her tenacity, I can't help feeling she has bitten off more than she can chew.", "Prior to commencing the procedure, all personnel are requested to read the guidelines.", "Strange as it may seem, the most salient point was barely mentioned.", "Let's cut to the chase and address the elephant in the room.", "Neither of the proposals is sufficiently substantiated to warrant further investment.", "Try as they might, the negotiators failed to circumvent the deadlock.");

READINGS.C2 = [
  { title: "The tyranny of metrics", text: `There is a seductive logic to measurement. What gets measured, the adage goes, gets managed, and in an era awash with data, it has become almost an article of faith that any institution worth its salt should quantify its performance. Hospitals are ranked by waiting times, schools by examination results, academics by citation counts.\n\nYet the relentless pursuit of metrics carries a hidden cost, one that the economist Charles Goodhart identified decades ago. When a measure becomes a target, he observed, it ceases to be a good measure. Surgeons judged on mortality rates may quietly decline to operate on high-risk patients; teachers evaluated on test scores may "teach to the test" at the expense of genuine understanding; police forces rewarded for falling crime figures may be tempted to reclassify offences. In each case, the number improves while the underlying reality it was meant to capture stays the same, or even deteriorates.\n\nNone of this is to suggest that measurement is inherently pernicious. Data can expose inefficiencies, reveal inequalities and hold the powerful to account. The problem arises when numbers are mistaken for the things they represent, when the map is confused with the territory. Many of the qualities we value most, such as trust, curiosity and professional judgement, are precisely those that resist quantification.\n\nThe challenge, then, is not to abandon metrics but to use them with humility: as instruments for inquiry rather than instruments of control. That requires something no spreadsheet can supply, namely the willingness to accept that not everything that counts can be counted.`, q: [
    ["What does 'an article of faith' imply in the first paragraph?", ["A religious duty", "A belief accepted without question", "A legal obligation", "A scientific fact"], 1],
    ["What is Goodhart's observation?", ["Data is always reliable.", "A measure that becomes a target stops being a good measure.", "Targets improve performance.", "Metrics should be secret."], 1],
    ["What do the examples of surgeons, teachers and police illustrate?", ["Professional incompetence", "Numbers improving while reality doesn't", "The value of rankings", "Corruption in public services"], 1],
    ["What does 'the map is confused with the territory' mean here?", ["People get lost.", "Numbers are mistaken for the reality they represent.", "Maps are inaccurate.", "Institutions grow too large."], 1],
    ["What is the writer's conclusion?", ["Abandon metrics entirely.", "Use metrics humbly, as tools for inquiry.", "Measure everything more precisely.", "Only use qualitative data."], 1]
  ], gloss: [["awash with", "inundado de"], ["worth its salt", "que se precie"], ["relentless", "implacable"], ["pernicious", "pernicioso"], ["hold to account", "pedir cuentas"], ["inquiry", "indagación"]] },
  { title: "In praise of slowness in language learning", text: `Language learning apps promise fluency in weeks, and social media is replete with polyglots who claim to have mastered Mandarin in a summer. It is hardly surprising, then, that so many learners feel disheartened when, after years of study, they still stumble over phrasal verbs or fail to catch a joke at a dinner party.\n\nThe disconnect stems, in part, from a misunderstanding of what advanced proficiency entails. Reaching an intermediate level is largely a matter of acquiring grammar and core vocabulary, which can indeed be achieved relatively quickly with sustained effort. Beyond that point, however, progress becomes less visible. The gap between a competent speaker and a truly proficient one lies in thousands of collocations, idioms, cultural references and subtle shifts of register, knowledge that is absorbed gradually through extensive exposure rather than memorised in lists.\n\nThis is why the so-called intermediate plateau is so common, and so dispiriting. Learners continue to put in the hours yet feel they are standing still. In reality, they are consolidating: their comprehension is deepening, their recall becoming faster, their intuition for what sounds natural growing sharper. These changes are real, but they rarely announce themselves.\n\nThe remedy, if there is one, is to shift from studying the language to living in it: reading novels rather than graded texts, listening to podcasts at native speed, writing for real audiences. Above all, it means accepting that mastery is less a destination than a direction, a process measured not in weeks but in years.`, q: [
    ["Why do many learners feel disheartened?", ["Apps are too expensive.", "They compare themselves with unrealistic promises.", "Grammar is impossible.", "They have no time."], 1],
    ["What distinguishes a proficient speaker from a competent one?", ["Basic grammar", "Thousands of collocations, idioms and subtleties", "A better accent only", "Speed of speech"], 1],
    ["What is really happening during the 'plateau'?", ["Nothing; learners stop improving.", "Learners are consolidating knowledge in less visible ways.", "Learners forget vocabulary.", "Learners should quit."], 1],
    ["What remedy does the writer propose?", ["More grammar drills", "Living in the language through authentic materials", "Using more apps", "Studying less"], 1],
    ["What does 'mastery is less a destination than a direction' mean?", ["Mastery is impossible.", "Mastery is an ongoing process, not an endpoint.", "Travel helps language learning.", "Directions are hard to learn."], 1]
  ], gloss: [["replete with", "repleto de"], ["disheartened", "desanimado"], ["stumble over", "trastabillar con"], ["entails", "implica"], ["dispiriting", "desalentador"], ["consolidating", "consolidando"]] }
];

LISTENING.C2 = [
  { title: "Entrevista radial: el futuro de las ciudades", lines: [["A", "Professor, you've argued that the car-centric city is, in your words, a twentieth-century anomaly. Isn't that rather provocative?"], ["B", "Deliberately so. For most of human history, cities were built at walking pace. It's only in the last hundred years or so that we've reshaped them around vehicles, and frankly, the results have been mixed at best."], ["A", "But surely cars brought enormous freedom?"], ["B", "They did, and I wouldn't dream of denying that. My point is that we've allowed that freedom to come at the expense of everyone who doesn't drive: children, the elderly, people who can't afford a car."], ["A", "So what would you have city planners do?"], ["B", "Nothing radical, really. Reclaim some street space for pedestrians and cyclists, invest in reliable public transport, and design neighbourhoods where daily needs are within a fifteen-minute walk. Paris and Bogotá have already shown it can be done."]], q: [
    ["What does the professor mean by 'a twentieth-century anomaly'?", ["Cities are too old.", "Car-centric cities are historically unusual.", "Cars were invented recently.", "Cities grew too fast."], 1],
    ["What does the professor concede?", ["Cars are useless.", "Cars brought enormous freedom.", "Cities should ban cars.", "Walking is outdated."], 1],
    ["Who does he say has paid the price?", ["Car manufacturers", "People who don't drive", "City planners", "Taxi drivers"], 1],
    ["How does he describe his proposals?", ["Revolutionary", "Not radical", "Expensive", "Impossible"], 1]
  ]},
  { title: "Conversación informal: un malentendido", lines: [["A", "So, did you sort things out with Mark in the end?"], ["B", "Sort of. It turns out the whole thing was a storm in a teacup. He thought I'd thrown him under the bus in the meeting."], ["A", "And had you?"], ["B", "Not at all! I was trying to defend him, but I suppose I didn't word it very well. Anyway, we cleared the air over a coffee."], ["A", "Good. I was worried it'd open a whole can of worms with the rest of the team."], ["B", "Me too, to be honest. But he's not one to hold a grudge, thankfully."]], q: [
    ["What does 'a storm in a teacup' suggest?", ["A serious crisis", "A lot of fuss about something minor", "A dangerous situation", "A happy surprise"], 1],
    ["What did Mark think had happened?", ["That B had praised him", "That B had betrayed him in the meeting", "That he would be promoted", "That the meeting was cancelled"], 1],
    ["How did they resolve it?", ["Through HR", "By talking over a coffee", "By email", "They didn't resolve it"], 1],
    ["What does B say about Mark's character?", ["He's always angry.", "He doesn't usually hold grudges.", "He's very shy.", "He's untrustworthy."], 1]
  ]}
];

ROLEPLAY.C2 = [
  { title: "Persuadir a un inversor escéptico", intro: "Presentas tu startup a un inversor que duda del modelo de negocio.", turns: [
    ["Frankly, I've seen dozens of apps like yours. Why should I believe yours is any different?", "Responde con seguridad: lo que te distingue es que ya tienes clientes que pagan y un crecimiento sostenido.", ["What sets us apart is that we already have paying customers and sustained growth.", "The difference is that we're not just an idea: we have paying clients and consistent growth.", "Unlike most, we already have a paying customer base and steady growth month on month."]],
    ["Growth numbers can be misleading. What about retention?", "Concede el punto y da el dato: el 85% de los clientes renueva después del primer año.", ["That's a fair point, which is why I'd highlight that 85% of our clients renew after the first year.", "You're right to ask. Our retention rate is 85% after the first year.", "Granted, growth alone means little; our first-year renewal rate, however, stands at 85%."]],
    ["And what happens when a big player copies you?", "Explica que vuestra ventaja son los datos acumulados y las relaciones con clientes, difíciles de replicar.", ["Our edge lies in the data we've accumulated and our client relationships, which are hard to replicate.", "They could copy the product, but not our data or the trust we've built with clients.", "What they couldn't easily replicate is our data and the relationships we've built."]],
    ["Hmm. I'm still not convinced the market is big enough.", "Matiza: reconoce que el mercado inicial es pequeño, pero que es la puerta de entrada a uno mucho mayor.", ["Admittedly, our initial market is niche, but it's a gateway to a far larger one.", "The initial market is indeed modest, but it serves as a springboard into a much bigger one.", "I take your point; however, this niche is only our entry point into a considerably larger market."]],
    ["Alright, what exactly are you asking for?", "Ve al grano: pides 500.000 dólares por el 10% de la empresa.", ["To cut to the chase, we're seeking 500,000 dollars for a 10% stake.", "In a nutshell, we're asking for half a million for ten percent of the company.", "Put simply, we're looking for 500,000 dollars in exchange for a 10% stake."]]
  ]},
  { title: "Analizar una obra", intro: "Conversas con un amigo sobre una novela que ambos leyeron.", turns: [
    ["I have to say, I found the ending deeply unsatisfying.", "Di que entiendes la reacción, pero que el final ambiguo es deliberado.", ["I can see why, but I'd argue the ambiguity is entirely deliberate.", "I understand, though I think the open ending is intentional.", "That's understandable, but I suspect the ambiguity was the author's intention all along."]],
    ["Deliberate or not, it felt like the author just ran out of ideas.", "Rebate: el final refleja el tema central de la novela, la incertidumbre.", ["On the contrary, it mirrors the novel's central theme: uncertainty.", "I'd disagree. The ending reflects the very theme of the book, which is uncertainty.", "Far from it. The ending embodies the novel's preoccupation with uncertainty."]],
    ["Fair enough, but what about the pacing? The middle section dragged.", "Concede: admite que la parte central es lenta, aunque el lenguaje lo compensa.", ["Granted, the middle section is slow, but the prose more than makes up for it.", "I'll concede the pacing falters in the middle, though the writing compensates.", "Admittedly, it drags a bit, but the quality of the language makes up for it."]],
    ["Would you recommend it, then?", "Recomiéndalo con matices: no a cualquiera, sino a lectores pacientes.", ["Yes, though not to everyone; it rewards patient readers.", "I would, with a caveat: it's best suited to patient readers.", "Definitely, albeit to readers who don't mind a slow burn."]]
  ]}
];

WRITING.C2 = [
  { title: "Ensayo crítico", task: "Ensayo: ¿el progreso tecnológico nos hace más libres? Desarrolla un argumento matizado, con ejemplos y contraargumentos.", words: "300–350", phrases: ["It has become something of a truism that...", "This view, however, rests on the premise that...", "To dismiss... would be equally misguided.", "Herein lies the paradox:...", "Ultimately, the question is not whether... but..."], check: ["Tesis matizada, no binaria", "Argumentación con ejemplos concretos y precisos", "Variedad de estructuras: inversión, fronting, escindidas, nominalización", "Vocabulario C2 preciso (sin repetir 'important', 'big', 'good')", "Cohesión impecable y conclusión que aporta una idea nueva"], model: "It has become something of a truism that technological progress has liberated humanity. We can communicate instantly across continents, access the sum of human knowledge from our pockets and work from almost anywhere. Yet this narrative of emancipation, compelling as it is, obscures a more ambivalent reality.\n\nThere is no denying that technology has expanded the range of choices available to us. Remote work has freed millions from the tyranny of the daily commute; online education has opened doors to those who could never have afforded a university; social platforms have given a voice to communities long ignored by traditional media. To dismiss these gains would be not only ungrateful but misguided.\n\nThis view, however, rests on the premise that more options necessarily translate into greater freedom. In practice, the very devices that connect us also monitor us, harvesting data to predict and shape our behaviour. The algorithms that curate our news feeds subtly narrow the range of opinions we encounter, while the expectation of constant availability has blurred the boundary between work and private life. Herein lies the paradox: the tools that promise autonomy may, if left unchecked, erode it.\n\nWhat matters, then, is not technology itself but the conditions under which it is designed and used. Where users understand and control how their data is employed, and where regulation ensures transparency, technology can genuinely enhance freedom. Where it is driven solely by the imperative to capture attention, it risks becoming a gilded cage.\n\nUltimately, the question is not whether technological progress makes us freer, but whether we are prepared to shape it so that it does." },
  { title: "Discurso persuasivo", task: "Escribe un discurso para una conferencia internacional defendiendo una reforma educativa que consideres necesaria.", words: "280–320", phrases: ["Ladies and gentlemen,", "Imagine, for a moment,...", "Let me be clear:...", "It is not enough to...; we must...", "The question before us is not whether we can afford to..., but whether we can afford not to."], check: ["Apertura que capta la atención", "Uso de recursos retóricos (tríadas, preguntas, repetición)", "Argumentos sólidos con datos o ejemplos", "Llamado a la acción claro al final", "Registro formal pero cercano a la audiencia"], model: "Ladies and gentlemen,\n\nImagine, for a moment, a child who can recite the dates of every major battle in history but cannot tell a reliable news source from a fabricated one. Imagine a graduate who has memorised hundreds of formulas yet has never been asked to solve a problem that matters to her community. This, I would argue, is the paradox at the heart of many education systems today.\n\nLet me be clear: knowledge matters. But in a world where information is abundant and instantly available, what distinguishes an educated person is no longer how much they know, but what they can do with what they know. Can they evaluate evidence? Can they collaborate with people who think differently? Can they adapt when the jobs of today disappear tomorrow?\n\nThe reform I am proposing is neither radical nor untested. It rests on three pillars: teaching critical thinking explicitly, from primary school onwards; replacing a significant proportion of standardised exams with project-based assessment; and investing in the training of teachers, who remain, without doubt, the single most important factor in any classroom.\n\nCountries that have embraced similar approaches have seen not only higher levels of student engagement but also stronger results in international assessments. The evidence, in short, is on our side.\n\nIt is not enough to update our textbooks; we must rethink what we expect education to achieve. The question before us is not whether we can afford to reform our schools, but whether we can afford not to.\n\nThank you." }
];

CANDO.C2 = [
  "Puedo entender prácticamente todo lo que oigo o leo, incluidos textos especializados y literarios.",
  "Puedo expresarme con precisión, distinguiendo matices finos de significado.",
  "Puedo reformular ideas con naturalidad para evitar o salvar dificultades.",
  "Puedo usar modismos y expresiones coloquiales con naturalidad y oportunidad.",
  "Puedo escribir textos complejos con estilo apropiado y estructura lógica impecable.",
  "Puedo resumir y reconstruir argumentos de varias fuentes de forma coherente."
];
