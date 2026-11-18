// ===== NIVEL B1: contenido adicional =====
LESSONS.B1.push(
  { id: "b1-9", title: "Presente perfecto continuo", explain: `<p><b>have/has been + -ing</b>: acción que empezó en el pasado y <b>sigue</b> (o acaba de parar), con énfasis en la <b>duración</b>: <i>I've been waiting for an hour. She's been working here since March.</i></p><p>Comparación: <i>I've read the book</i> (terminado, resultado) vs. <i>I've been reading the book</i> (actividad en curso).</p>`, ex: [
    ["mc", "I'm tired because I ___ all day.", ["have worked", "have been working", "worked"], 1, "Duración + efecto presente."],
    ["fill", "How long have you ___ (learn) English?", ["been learning"], "How long + have been + -ing."],
    ["mc", "She ___ three emails this morning.", ["has written", "has been writing", "writes"], 0, "Cantidad terminada → simple."],
    ["tr", "Llevo dos horas esperándote.", ["I've been waiting for you for two hours.", "I have been waiting for you for two hours."], "Llevar + tiempo + gerundio = have been + -ing + for."],
    ["fix", "I am living here since 2019.", ["I have been living here since 2019.", "I've been living here since 2019.", "I have lived here since 2019.", "I've lived here since 2019."], "Con since no se usa el presente continuo."],
    ["mc", "It ___ all morning. The streets are wet.", ["has been raining", "rains", "is raining since"], 0, "Actividad reciente con resultado visible."],
    ["ord", "¿Cuánto tiempo llevas trabajando aquí?", "How long have you been working here"],
    ["mc", "I ___ him for ten years.", ["have been knowing", "have known", "know"], 1, "Know es de estado: no va en continuo."]
  ]},
  { id: "b1-10", title: "Too / enough, so / such", explain: `<p><b>too + adjetivo</b> = demasiado (problema): <i>It's too expensive.</i> <b>adjetivo + enough</b> = suficiente: <i>He isn't old enough.</i> <b>enough + sustantivo</b>: <i>enough time</i>.</p><p><b>so + adjetivo</b> y <b>such (a) + adjetivo + sustantivo</b> para intensificar: <i>It was so cold. It was such a cold day.</i></p>`, ex: [
    ["mc", "This coffee is ___ hot to drink.", ["too", "enough", "so"], 0, "Too + adj + to."],
    ["mc", "She isn't tall ___ to play basketball.", ["too", "enough", "such"], 1, "Adj + enough."],
    ["mc", "It was ___ a good film!", ["so", "such", "too"], 1, "Such a + adj + sustantivo."],
    ["fill", "We don't have ___ money for a new car.", ["enough"], "Enough + sustantivo."],
    ["fix", "The exam was such difficult.", ["The exam was so difficult."], "So + adjetivo solo."],
    ["tr", "Hacía demasiado frío para nadar.", ["It was too cold to swim.", "It was too cold for swimming."], "Too + adj + to + verbo."],
    ["mc", "They were ___ tired that they fell asleep.", ["such", "so", "too"], 1, "So + adj + that."]
  ]},
  { id: "b1-11", title: "Verbos modales de obligación en pasado", explain: `<p>Pasado de <b>must/have to</b>: <b>had to</b>. <i>I had to work late.</i> Pasado de <b>can</b>: <b>could / was able to</b>.</p><p><b>should have + participio</b> = crítica o arrepentimiento: <i>You should have told me.</i> <b>didn't need to</b> = no era necesario.</p>`, ex: [
    ["mc", "Yesterday I ___ wake up at 4 am for my flight.", ["must", "had to", "have to"], 1, "Pasado de have to."],
    ["mc", "You ___ studied more. You failed the exam.", ["should", "should have", "must have"], 1, "Crítica sobre el pasado."],
    ["fill", "When I was five, I ___ swim. (podía)", ["could"], "Habilidad pasada: could."],
    ["tr", "Tuve que llamar a mi jefe.", ["I had to call my boss."], "Had to + verbo."],
    ["fix", "I musted go to the doctor yesterday.", ["I had to go to the doctor yesterday."], "Must no tiene pasado: had to."],
    ["mc", "We ___ take a taxi; my friend drove us.", ["didn't need to", "mustn't", "shouldn't have"], 0, "No fue necesario."],
    ["ord", "Debería haberte llamado.", "I should have called you"]
  ]}
);

VOCAB.B1 += `
# Trabajo y carrera
colleague|colega|I'm meeting a colleague for lunch.
promotion|ascenso|She got a promotion last month.
resign|renunciar|He resigned after ten years.
unemployed|desempleado|He's been unemployed since May.
workload|carga de trabajo|My workload is huge this week.
schedule|horario / agenda|I'll check my schedule.
interview|entrevista|I have a job interview tomorrow.
strength|fortaleza|What are your main strengths?
weakness|debilidad|My weakness is public speaking.
responsible for|responsable de|I'm responsible for the budget.
# Viajes y problemas
book in advance|reservar con antelación|It's cheaper to book in advance.
delayed|retrasado|Our flight was delayed.
check in|registrarse|We checked in at 3 pm.
check out|salir del hotel|Check out is at noon.
lost luggage|equipaje perdido|I have to report lost luggage.
refund|reembolso|I'd like a refund, please.
destination|destino|Our final destination is Lima.
accommodation|alojamiento|The accommodation was excellent.
souvenir|recuerdo (objeto)|I bought some souvenirs.
landscape|paisaje|The landscape was amazing.
# Salud y estilo de vida
healthy|saludable|Try to eat healthy food.
injury|lesión|He has a knee injury.
prescription|receta médica|You need a prescription.
symptoms|síntomas|What are your symptoms?
recover|recuperarse|She recovered quickly.
stressed|estresado|I feel stressed about work.
get in shape|ponerse en forma|I want to get in shape.
balanced diet|dieta equilibrada|A balanced diet is important.
lack of|falta de|Lack of sleep is a problem.
take up|empezar (un hobby)|I took up yoga last year.
# Tecnología y medios
download|descargar|Download the app for free.
device|dispositivo|Turn off your devices.
screen|pantalla|I spend too much time in front of a screen.
password|contraseña|I forgot my password.
update|actualizar / actualización|I need to update my phone.
post|publicar / publicación|She posted a photo online.
headline|titular|Did you read the headlines?
advertisement|anuncio|There are too many advertisements.
# Opiniones y discusión
I'd rather|preferiría|I'd rather stay at home.
it seems that|parece que|It seems that he's angry.
on the one hand|por un lado|On the one hand, it's cheap.
in my view|en mi opinión|In my view, it's a good idea.
I see your point|entiendo tu punto|I see your point, but I disagree.
convince|convencer|She convinced me to go.
argue|discutir / argumentar|They argued about money.
point of view|punto de vista|From my point of view, it's fair.
# Sentimientos y personalidad
anxious|ansioso / preocupado|I feel anxious before exams.
confident|seguro de sí mismo|She's very confident.
jealous|celoso / envidioso|He's jealous of his brother.
grateful|agradecido|I'm grateful for your help.
disappointed|decepcionado|I was disappointed with the film.
annoyed|molesto / fastidiado|I'm annoyed with my neighbours.
relieved|aliviado|I was relieved to hear the news.
patient|paciente|Be patient, please.
generous|generoso|My uncle is very generous.
stubborn|terco|She's so stubborn!
# Conectores y expresiones
as well|también|I'd like a coffee as well.
unless|a menos que|I'll go unless it rains.
in case|por si acaso|Take an umbrella in case it rains.
even though|aunque (incluso si)|Even though he was sick, he worked.
so that|para que|I left early so that I wasn't late.
anyway|de todas formas|Anyway, let's continue.
by the way|por cierto|By the way, did you call Ana?
make sense|tener sentido|That makes sense.
make up your mind|decidirse|Make up your mind!
it's up to you|tú decides|It's up to you.`;

SENTENCES.B1.push("I've been waiting for the bus for twenty minutes.", "If I were you, I would talk to your manager.", "The hotel was nice, but the room was too small.", "We had to cancel the trip because of the storm.", "By the way, have you finished the report yet?", "I'd rather stay at home tonight, if you don't mind.", "She's been learning Japanese since she was a teenager.", "Take an umbrella in case it rains later.");

READINGS.B1 = [
  { title: "Why I quit social media for a month", text: `Last January I decided to try an experiment: one month without social media. I deleted Instagram, TikTok and Facebook from my phone. I kept WhatsApp, because I need it for work.\n\nThe first week was really hard. I kept picking up my phone without thinking, and I felt anxious because I didn't know what my friends were doing. I realised that I used to check my phone more than a hundred times a day.\n\nBy the second week, things started to change. I was sleeping better, because I wasn't looking at a screen in bed. I read two books, something I hadn't done for years, and I started cooking more.\n\nThe biggest surprise was my relationships. Instead of liking my friends' photos, I called them or met them for coffee. Our conversations were longer and more real.\n\nWhen the month finished, I installed Instagram again, but I use it differently now. I've turned off notifications and I only check it once a day. I don't think social media is bad, but I've learnt that I need to control it, not the other way round.`, q: [
    ["Why did the writer keep WhatsApp?", ["To talk to family", "Because it's needed for work", "Because it's not social media", "To read news"], 1],
    ["How did the writer feel in the first week?", ["Relaxed", "Anxious", "Happy", "Bored"], 1],
    ["Why did the writer sleep better?", ["Because of exercise", "Because of no screen in bed", "Because of reading", "Because of less work"], 1],
    ["What changed in the writer's relationships?", ["They saw fewer friends.", "They had more real conversations.", "They argued more.", "Nothing changed."], 1],
    ["What is the writer's conclusion?", ["Social media is dangerous.", "Never use social media.", "You need to control social media.", "Social media is great."], 2]
  ], gloss: [["delete", "borrar"], ["kept", "seguí / conservé"], ["realise", "darse cuenta"], ["instead of", "en lugar de"], ["turn off", "desactivar"], ["the other way round", "al revés"]] },
  { title: "A complaint that worked", text: `Two months ago, I ordered a new laptop online. The website promised delivery in three days, but after two weeks it still hadn't arrived. I called customer service four times. Each time, a different person told me that the laptop was "on its way".\n\nI was getting really frustrated, so I decided to write a formal complaint. A friend who works in sales gave me some advice: be polite, be clear and say exactly what you want.\n\nIn my email, I explained the situation with dates and order numbers. I said that I was disappointed with the service and that I wanted either the laptop within five days or a full refund. I didn't shout or insult anyone.\n\nThe next day, the manager called me personally. She apologised, explained that there had been a problem with the warehouse, and offered me the laptop the same week plus a 20% discount on my next order.\n\nThe lesson? Anger doesn't solve problems, but a calm, organised complaint often does.`, q: [
    ["What was the original problem?", ["The laptop was broken.", "The laptop didn't arrive.", "The price was wrong.", "They sent the wrong model."], 1],
    ["What did the friend advise?", ["To shout", "To cancel the order", "To be polite and clear", "To call again"], 2],
    ["What did the writer ask for?", ["A discount", "The laptop in five days or a refund", "A new model", "To speak to the CEO"], 1],
    ["What caused the delay?", ["A strike", "A warehouse problem", "The weather", "A wrong address"], 1],
    ["What did the company offer?", ["Only an apology", "A free laptop", "The laptop plus a discount", "A refund only"], 2]
  ], gloss: [["delivery", "entrega"], ["on its way", "en camino"], ["frustrated", "frustrado"], ["either... or", "o... o"], ["apologise", "disculparse"], ["warehouse", "bodega"]] },
  { title: "Living abroad: expectations vs. reality", text: `When Daniel moved from Cali to Toronto to study, he thought the hardest thing would be the language. He had studied English for years and he could understand films without subtitles, so he felt confident.\n\nIn reality, the language was only one part of the challenge. People spoke much faster than in the films, and they used lots of expressions he had never heard. But the biggest surprise was the weather. His first winter was minus twenty degrees, and he didn't even have proper boots.\n\nHe also missed the food and the warmth of people back home. "In Colombia, you talk to strangers all the time. Here, people are friendly but more reserved," he says.\n\nAfter a year, though, Daniel feels at home. He has made friends from all over the world, he has learnt to love ice skating and his English has improved enormously. "If I had to give advice to someone moving abroad," he says, "I'd tell them to be patient. The first six months are difficult for everyone."`, q: [
    ["What did Daniel expect to be the hardest thing?", ["The weather", "The language", "The food", "Making friends"], 1],
    ["Why was understanding people difficult?", ["They had strong accents only.", "They spoke fast and used many expressions.", "They didn't want to talk.", "He didn't study English."], 1],
    ["What was the biggest surprise?", ["The food", "The prices", "The weather", "The university"], 2],
    ["How are people in Toronto, according to Daniel?", ["Rude", "Friendly but reserved", "Very open", "Always busy"], 1],
    ["What is his advice?", ["Learn more grammar", "Be patient", "Buy good boots", "Stay at home"], 1]
  ], gloss: [["subtitles", "subtítulos"], ["proper", "adecuado"], ["strangers", "desconocidos"], ["reserved", "reservado"], ["though", "sin embargo (al final)"], ["enormously", "enormemente"]] }
];

LISTENING.B1 = [
  { title: "Problema en el hotel", lines: [["A", "Good evening, reception. How can I help you?"], ["B", "Hi, I'm calling from room 312. I'm afraid the air conditioning isn't working."], ["A", "Oh, I'm sorry about that. Have you tried the remote control?"], ["B", "Yes, I've changed the batteries and it still doesn't work. It's really hot in here."], ["A", "I'll send someone from maintenance right away. If they can't fix it, we'll move you to another room."], ["B", "Thank you. How long will it take?"], ["A", "About fifteen minutes. And we'll send up a complimentary drink for the inconvenience."]], q: [
    ["What's the problem?", ["The TV is broken.", "The air conditioning doesn't work.", "The room is dirty.", "There's no hot water."], 1],
    ["What has the guest already done?", ["Called maintenance", "Changed the batteries", "Opened the window", "Changed rooms"], 1],
    ["What will happen if they can't fix it?", ["They'll get a refund.", "They'll move to another room.", "They'll get a fan.", "Nothing."], 1],
    ["What will the hotel send?", ["A free drink", "A free dinner", "A discount", "Flowers"], 0]
  ]},
  { title: "Entrevista de trabajo", lines: [["A", "So, tell me a bit about your experience."], ["B", "Well, I've been working in customer service for four years, mainly in a call centre for an airline."], ["A", "And why do you want to leave?"], ["B", "I've learnt a lot, but I'm looking for a role where I can use my English more and take on more responsibility."], ["A", "What would you say is your biggest weakness?"], ["B", "I used to find it hard to say no to extra work, but I've learnt to organise my priorities better."], ["A", "Good. And when could you start?"], ["B", "I'd need to give one month's notice, so from the first of next month."]], q: [
    ["How long has the candidate worked in customer service?", ["Two years", "Three years", "Four years", "Five years"], 2],
    ["Why do they want to change jobs?", ["Better salary", "To use English more and have more responsibility", "Problems with the boss", "To work from home"], 1],
    ["What was their weakness?", ["Being late", "Saying no to extra work", "Speaking in public", "Using computers"], 1],
    ["When can they start?", ["Tomorrow", "Next week", "In one month", "In three months"], 2]
  ]},
  { title: "Consejos de un amigo", lines: [["A", "You look stressed. Is everything OK?"], ["B", "Not really. I've got three deadlines this week and I haven't been sleeping well."], ["A", "Have you talked to your manager about it?"], ["B", "No. I don't want her to think I can't cope."], ["A", "If I were you, I'd tell her. Maybe she can move one of the deadlines."], ["B", "You might be right. I should have said something earlier."], ["A", "And try to switch off your phone after ten. It really helps me sleep."]], q: [
    ["Why is the friend stressed?", ["Money problems", "Too many deadlines", "A family problem", "A new job"], 1],
    ["Why hasn't she talked to her manager?", ["The manager is on holiday.", "She doesn't want to look weak.", "She forgot.", "She doesn't like her."], 1],
    ["What does the friend suggest first?", ["To quit", "To talk to the manager", "To work at night", "To take a holiday"], 1],
    ["What else does he recommend?", ["Exercise", "Switching off the phone after ten", "Drinking less coffee", "Meditation"], 1]
  ]}
];

ROLEPLAY.B1 = [
  { title: "Entrevista de trabajo", intro: "Te entrevistan para un puesto en una empresa internacional.", turns: [
    ["Thanks for coming. Could you tell me a little about yourself?", "Di tu profesión y cuántos años de experiencia tienes.", ["I'm a software developer and I've been working in this field for five years.", "I'm an accountant and I have six years of experience.", "I've been working as a designer for four years."]],
    ["Why are you interested in this position?", "Di que quieres trabajar en un ambiente internacional y usar tu inglés.", ["I'd like to work in an international environment and use my English every day.", "Because I want to work in an international company and improve my English.", "I'm interested because I want to use my English and work with people from other countries."]],
    ["What's your greatest strength?", "Di que eres organizado y trabajas bien en equipo.", ["I'm very organised and I work well in a team.", "I think I'm organised and I'm good at working in teams.", "My greatest strength is that I'm organised and a good team player."]],
    ["Can you tell me about a problem you solved at work?", "Cuenta que un cliente estaba enojado y tú lo ayudaste a resolver el problema.", ["Once, a customer was very angry because of a delay, so I called him and helped him solve the problem.", "A client was angry about an error, and I helped him fix it quickly.", "Last year an angry customer called, and I listened to him and solved the problem."]],
    ["Do you have any questions for us?", "Pregunta cómo es un día normal en el puesto.", ["What does a typical day look like in this role?", "Could you tell me what a normal day is like in this job?", "What is a typical day like in this position?"]]
  ]},
  { title: "Queja en el hotel", intro: "Llegas al hotel y tu habitación tiene problemas.", turns: [
    ["Hello, reception. How can I help?", "Di que llamas de la habitación 205 y que la ducha no tiene agua caliente.", ["Hi, I'm calling from room 205. There's no hot water in the shower.", "Hello, this is room 205. The shower doesn't have hot water.", "Hi, I'm in room 205 and there isn't any hot water."]],
    ["I'm so sorry. Have you waited a few minutes for the water to warm up?", "Di que sí, que has esperado diez minutos.", ["Yes, I've waited for ten minutes and it's still cold.", "Yes, I've been waiting for ten minutes.", "Yes, I waited ten minutes, but it's still cold."]],
    ["I'll send someone to check it.", "Pregunta cuánto tiempo tardarán, porque tienes una reunión en una hora.", ["How long will it take? I have a meeting in an hour.", "How long will that take? I've got a meeting in one hour.", "When will they come? I have a meeting in an hour."]],
    ["About twenty minutes. Or we could move you to another room now.", "Di que prefieres cambiar de habitación.", ["I'd rather move to another room, please.", "I'd prefer to change rooms, please.", "Moving to another room would be better, thanks."]],
    ["Of course. Room 410 is ready for you.", "Agradece y pregunta si te pueden ayudar con las maletas.", ["Thank you. Could someone help me with my luggage?", "Thanks! Can someone help me with my bags?", "Thank you very much. Could you help me with my luggage?"]]
  ]}
];

WRITING.B1 = [
  { title: "Una experiencia que me cambió", task: "Cuenta una experiencia importante de tu vida: qué pasó, cómo te sentiste y qué aprendiste.", words: "120–150", phrases: ["I'll never forget the day when...", "At first, I felt... but then...", "While I was..., ...", "Looking back, I realise that...", "It taught me that..."], check: ["Combiné pasado simple y pasado continuo", "Usé conectores de secuencia (at first, then, finally)", "Describí sentimientos con adjetivos variados", "Expliqué qué aprendí (conclusión)"], model: "I'll never forget the day I moved to Bogotá on my own. I was nineteen and I had never lived away from my family. At first, I felt excited, but after a few weeks I was really lonely. While I was walking home one night, I met a neighbour who invited me to play football with his friends. That small invitation changed everything. I started to feel part of the city, and I made friends who are still very important to me. Looking back, I realise that I was too shy to ask for help. It taught me that it's OK to feel lost, and that saying yes to new people can change your life." },
  { title: "Correo formal: pedir información", task: "Escribe un correo formal a una escuela de idiomas preguntando por un curso de inglés (horarios, precio, nivel).", words: "100–130", phrases: ["Dear Sir or Madam,", "I am writing to enquire about...", "I would be grateful if you could tell me...", "Could you also let me know whether...", "I look forward to hearing from you. Yours faithfully,"], check: ["Usé un saludo y despedida formales", "No usé contracciones (I'm → I am)", "Hice al menos 3 preguntas indirectas y corteses", "Expliqué brevemente quién soy y qué busco"], model: "Dear Sir or Madam,\n\nI am writing to enquire about the intensive English courses advertised on your website. I am a 28-year-old engineer from Colombia and my current level is B1.\n\nI would be grateful if you could tell me when the next course starts and how many hours of classes there are per week. Could you also let me know whether the price includes materials and a final certificate? Finally, I would like to know if you offer evening classes, as I work during the day.\n\nThank you in advance for your help. I look forward to hearing from you.\n\nYours faithfully,\nAndrés Gómez" },
  { title: "Opinión: ¿ciudad o campo?", task: "¿Es mejor vivir en la ciudad o en el campo? Da tu opinión con razones y ejemplos.", words: "120–150", phrases: ["In my opinion,...", "On the one hand,... On the other hand,...", "For example,...", "Another reason is that...", "To sum up,..."], check: ["Di mi opinión clara al inicio", "Presenté ventajas y desventajas", "Usé ejemplos concretos", "Terminé con una conclusión"], model: "In my opinion, living in the city is better for young people, but the countryside is better for families. On the one hand, cities offer more opportunities. There are more jobs, universities and cultural activities. For example, in Bogotá you can go to a concert or a museum almost every day. On the other hand, cities are noisy, polluted and expensive. Another reason to prefer the countryside is that life is calmer and people know their neighbours. Children can play outside safely and the air is cleaner. To sum up, I think the best place to live depends on your stage of life. Right now I prefer the city, but one day I would like to live in a small town." }
];

CANDO.B1 = [
  "Puedo manejar la mayoría de situaciones de un viaje (hotel, aeropuerto, problemas).",
  "Puedo contar experiencias, sueños y planes, y explicar mis razones.",
  "Puedo dar mi opinión y estar de acuerdo o en desacuerdo con cortesía.",
  "Puedo participar en una entrevista de trabajo sencilla.",
  "Puedo entender las ideas principales de conversaciones y noticias claras.",
  "Puedo escribir correos formales e informales y textos de opinión sencillos.",
  "Puedo hablar con fluidez razonable de temas conocidos sin preparar."
];
