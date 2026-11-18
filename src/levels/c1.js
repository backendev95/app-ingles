// ===== NIVEL C1: contenido adicional =====
LESSONS.C1.push(
  { id: "c1-7", title: "Tiempos narrativos avanzados", explain: `<p>Para narrar con precisión se combinan: <b>pasado simple</b> (eventos principales), <b>pasado continuo</b> (contexto), <b>pasado perfecto</b> (algo anterior) y <b>pasado perfecto continuo</b> (duración antes de otro momento): <i>By the time the police arrived, the thieves had already escaped. She had been working there for years before anyone noticed her talent.</i></p><p>Futuro en el pasado: <b>was going to / would / was about to</b>: <i>I was about to leave when he called.</i></p>`, ex: [
    ["mc", "By the time we got to the cinema, the film ___.", ["started", "had already started", "has started"], 1, "Anterior a otro pasado: past perfect."],
    ["mc", "She was exhausted because she ___ all night.", ["had been studying", "has studied", "was study"], 0, "Duración antes de un momento pasado."],
    ["fill", "I was ___ to call you when you arrived. (a punto de)", ["about"], "Was about to = estaba a punto de."],
    ["tr", "Nunca había visto el mar antes de ese viaje.", ["I had never seen the sea before that trip.", "I'd never seen the sea before that trip."], "Past perfect con never."],
    ["fix", "When I arrived, everyone already left.", ["When I arrived, everyone had already left."], "Acción anterior: had left."],
    ["mc", "He told us he ___ the following week, but he never did.", ["would visit", "will visit", "visits"], 0, "Futuro en el pasado: would."],
    ["mc", "We ___ for two hours when the bus finally came.", ["were waiting", "had been waiting", "have waited"], 1, "Duración hasta un punto pasado."],
    ["ord", "Había estado lloviendo toda la noche.", "It had been raining all night"]
  ]},
  { id: "c1-8", title: "Marcadores del discurso y cohesión", explain: `<p>En textos C1 se espera variedad y precisión: <b>adición</b> (furthermore, what is more, not to mention), <b>contraste</b> (nonetheless, even so, that said, on the other hand), <b>causa/efecto</b> (consequently, hence, owing to, given that), <b>concesión</b> (admittedly, granted), <b>ejemplificación</b> (to illustrate, namely), <b>conclusión</b> (all things considered, in short).</p><p>Ojo con la puntuación: <i>However,</i> / <i>Therefore,</i> al inicio llevan coma; <i>owing to</i> va con sustantivo.</p>`, ex: [
    ["mc", "The plan is risky. ___, it's our best option.", ["Even so", "Owing to", "Namely"], 0, "Contraste: even so."],
    ["mc", "The match was cancelled ___ the storm.", ["owing to", "although", "hence"], 0, "Owing to + sustantivo."],
    ["fill", "___, the results were disappointing. (Hay que admitirlo)", ["admittedly"], "Concesión: admittedly."],
    ["mc", "Prices rose sharply; ___, demand fell.", ["consequently", "nonetheless", "granted"], 0, "Efecto: consequently."],
    ["mc", "Two countries, ___ Peru and Chile, signed the deal.", ["namely", "hence", "albeit"], 0, "Namely = a saber."],
    ["fix", "Despite of the rain, we went out.", ["Despite the rain, we went out.", "In spite of the rain, we went out."], "Despite sin of."],
    ["tr", "Dicho esto, no estoy totalmente en contra.", ["That said, I'm not completely against it.", "That said, I am not completely against it.", "Having said that, I'm not completely against it.", "That said, I'm not totally against it."], "That said = dicho esto."],
    ["mc", "___, the new policy has been a success.", ["All things considered", "Owing to", "Even though"], 0, "Conclusión."]
  ]},
  { id: "c1-9", title: "Verbos con dependencias y patrones complejos", explain: `<p>Verbos cuyo significado cambia con -ing o to: <b>remember/forget</b> (<i>I remember meeting her</i> = recuerdo haberla conocido; <i>Remember to call</i> = no olvides llamar), <b>stop</b>, <b>try</b> (<i>try to</i> = esforzarse; <i>try -ing</i> = probar), <b>regret</b>, <b>go on</b>, <b>mean</b>.</p><p>Verbo + objeto + infinitivo sin to: <b>make, let, have</b> (<i>They made me wait</i>); con to: <b>allow, force, encourage</b>.</p>`, ex: [
    ["mc", "I'll never forget ___ the Pope.", ["to meet", "meeting", "meet"], 1, "Recuerdo del pasado: -ing."],
    ["mc", "We stopped ___ a coffee on the way.", ["to have", "having", "have"], 0, "Paramos para tomar: to."],
    ["mc", "If the printer doesn't work, try ___ it off and on.", ["to turn", "turning", "turn"], 1, "Probar una solución: -ing."],
    ["fill", "My boss made me ___ (stay) late.", ["stay"], "Make + objeto + verbo base."],
    ["mc", "I regret ___ you that your application was rejected.", ["to inform", "informing", "inform"], 0, "Regret to inform = lamentar comunicar."],
    ["fix", "They didn't let me to leave early.", ["They didn't let me leave early."], "Let + verbo base."],
    ["tr", "Me animó a postularme al puesto.", ["She encouraged me to apply for the job.", "He encouraged me to apply for the job.", "She encouraged me to apply for the position.", "He encouraged me to apply for the position."], "Encourage + objeto + to."],
    ["mc", "This new job will mean ___ abroad.", ["to move", "moving", "move"], 1, "Mean + -ing = implicar."]
  ]},
  { id: "c1-10", title: "Intensificadores, atenuadores y adverbios precisos", explain: `<p>Con adjetivos "fuertes" (absolutos) se usa <b>absolutely, utterly, totally</b>: <i>absolutely exhausted</i> (no <i>very exhausted</i>). Con adjetivos graduables, <b>very, extremely, fairly, rather</b>.</p><p>Colocaciones de adverbio: <i>deeply concerned, bitterly disappointed, highly recommended, widely believed, painfully slow, strongly disagree</i>. Atenuadores: <i>somewhat, slightly, a tad, to some extent</i>.</p>`, ex: [
    ["mc", "The view from the top was ___ breathtaking.", ["very", "absolutely", "fairly"], 1, "Adjetivo extremo: absolutely."],
    ["mc", "I ___ disagree with that decision.", ["strongly", "highly", "deeply"], 0, "Strongly disagree."],
    ["mc", "It is ___ believed that the painting is a fake.", ["widely", "strongly", "heavily"], 0, "Widely believed."],
    ["fill", "The service was ___ slow. We waited an hour. (dolorosamente)", ["painfully"], "Painfully slow."],
    ["fix", "I was very furious with him.", ["I was absolutely furious with him.", "I was really furious with him.", "I was utterly furious with him."], "Furious es extremo: absolutely/really."],
    ["mc", "The results were ___ better than expected (un poco).", ["slightly", "utterly", "absolutely"], 0, "Atenuador: slightly."],
    ["mc", "This hotel comes ___ recommended.", ["highly", "deeply", "widely"], 0, "Highly recommended."]
  ]}
);

VOCAB.C1 += `
# Académico y análisis
hypothesis|hipótesis|The data support the hypothesis.
assumption|suposición|That's a dangerous assumption.
framework|marco (teórico)|We need a clear framework.
underlying|subyacente|The underlying problem is trust.
implication|implicación|What are the implications?
correlation|correlación|Correlation isn't causation.
feasibility|viabilidad|A feasibility study was carried out.
bias|sesgo|The study shows a clear bias.
robust|sólido / robusto|We need robust evidence.
comprehensive|exhaustivo / integral|A comprehensive review.
# Negocios y liderazgo
leverage|aprovechar / apalancar|We should leverage our experience.
streamline|optimizar / agilizar|We streamlined the process.
benchmark|referencia / punto de comparación|Set a benchmark for quality.
accountability|rendición de cuentas|There's no accountability here.
oversee|supervisar|She oversees three departments.
delegate|delegar|Learn to delegate tasks.
setback|contratiempo|The project suffered a setback.
headway|avance / progreso|We're making headway.
bottleneck|cuello de botella|Approval is the main bottleneck.
win-win|beneficio mutuo|It's a win-win situation.
# Sociedad, política y ética
controversial|polémico|A controversial decision.
widespread|generalizado|There's widespread concern.
marginalised|marginado|Marginalised communities.
legislation|legislación|New legislation was passed.
advocate|defender / defensor|She advocates equal pay.
backlash|reacción negativa|The ad caused a backlash.
loophole|vacío legal|They exploited a loophole.
transparency|transparencia|We demand more transparency.
accountable|responsable (rendir cuentas)|Leaders must be held accountable.
dilemma|dilema|It's an ethical dilemma.
# Verbos precisos
acknowledge|reconocer|He acknowledged his mistake.
anticipate|prever|We didn't anticipate the problem.
attribute to|atribuir a|Success is attributed to teamwork.
comply with|cumplir con|Comply with the rules.
endorse|respaldar|The plan was endorsed by the board.
exacerbate|agravar|It could exacerbate the crisis.
outweigh|superar (en peso)|The benefits outweigh the risks.
reinforce|reforzar|This reinforces stereotypes.
undertake|emprender / asumir|We undertook a major review.
yield|producir / rendir|The study yielded surprising results.
# Adjetivos y adverbios avanzados
arguably|posiblemente (se podría decir)|It's arguably the best book.
inherently|intrínsecamente|It's not inherently bad.
substantially|considerablemente|Costs rose substantially.
seemingly|aparentemente|A seemingly simple task.
meticulous|meticuloso|She's meticulous about details.
versatile|versátil|A versatile actor.
tedious|tedioso|A tedious process.
daunting|intimidante|A daunting challenge.
elusive|esquivo / difícil de alcanzar|Success remained elusive.
viable|viable|Is it a viable option?
# Expresiones idiomáticas
the bottom line|lo esencial / el resultado final|The bottom line is we need money.
a double-edged sword|un arma de doble filo|Fame is a double-edged sword.
get the hang of|agarrarle el truco|You'll get the hang of it.
go the extra mile|esforzarse más de lo necesario|She always goes the extra mile.
in the long run|a la larga|It pays off in the long run.
keep a low profile|pasar desapercibido|He kept a low profile.
miss the point|no captar lo esencial|You're missing the point.
play it by ear|improvisar sobre la marcha|Let's play it by ear.
read between the lines|leer entre líneas|Read between the lines.
the tip of the iceberg|la punta del iceberg|This is just the tip of the iceberg.
think outside the box|pensar fuera de la caja|We need to think outside the box.
a steep learning curve|curva de aprendizaje empinada|The job has a steep learning curve.
be on the same page|estar en sintonía|Are we on the same page?
touch base|ponerse en contacto|Let's touch base next week.
call it a day|dar por terminado (el día)|Let's call it a day.`;

SENTENCES.C1.push("By the time I realised what was happening, it was already too late.", "Admittedly, the proposal has its flaws, but the benefits clearly outweigh the risks.", "Owing to unforeseen circumstances, the event has been postponed indefinitely.", "I strongly disagree with the assumption that technology is inherently harmful.", "The bottom line is that we cannot afford another setback this quarter.", "Had the board endorsed the plan earlier, we would have made far more headway.", "What struck me most was how meticulously every detail had been planned.", "It is widely believed that the policy will exacerbate existing inequalities.");

READINGS.C1 = [
  { title: "The paradox of choice", text: `Conventional wisdom holds that more choice is always better. If one type of jam makes customers happy, surely twenty-four types will make them happier still. Yet a growing body of research suggests that, beyond a certain point, an abundance of options can be counterproductive.\n\nIn a frequently cited experiment, shoppers who were presented with a display of twenty-four varieties of jam were considerably more likely to stop and look than those who saw only six. However, they were roughly ten times less likely to actually make a purchase. Faced with too many alternatives, people seemed to become paralysed, unable to commit to a decision for fear of choosing wrongly.\n\nThe phenomenon extends well beyond supermarkets. Psychologists argue that excessive choice in careers, relationships and even streaming platforms can lead to anxiety, regret and a nagging sense that we might have done better. Paradoxically, those who insist on finding the "best" option, so-called maximisers, tend to report lower levels of satisfaction than "satisficers", who settle for an option that is simply good enough.\n\nThat said, the evidence is not entirely conclusive. Subsequent studies have struggled to replicate the original findings consistently, and some researchers contend that the effect depends heavily on context, such as how familiar people are with the product or how options are organised. What seems undeniable, however, is that more is not invariably better, and that learning when to stop searching may be a skill worth cultivating.`, q: [
    ["What is the 'conventional wisdom' mentioned in the first paragraph?", ["Fewer options are better.", "More choice always improves outcomes.", "Jam is a popular product.", "Customers dislike choosing."], 1],
    ["What happened with the 24-jam display?", ["It attracted fewer people.", "It attracted more people but led to far fewer purchases.", "Sales increased tenfold.", "Nobody stopped."], 1],
    ["How do 'maximisers' differ from 'satisficers'?", ["Maximisers are happier.", "Maximisers seek the best and tend to be less satisfied.", "Satisficers spend more money.", "There is no difference."], 1],
    ["What does the final paragraph suggest about the evidence?", ["It's completely conclusive.", "It has been proved false.", "It's not entirely conclusive and may depend on context.", "Nobody has tried to replicate it."], 2],
    ["What is the writer's overall stance?", ["Choice should be eliminated.", "More is not always better; knowing when to stop is valuable.", "Supermarkets should sell less jam.", "Psychology research is unreliable."], 1]
  ], gloss: [["conventional wisdom", "creencia generalizada"], ["counterproductive", "contraproducente"], ["commit to", "comprometerse con"], ["nagging", "persistente / que molesta"], ["settle for", "conformarse con"], ["invariably", "invariablemente"]] },
  { title: "Should we trust our memories?", text: `Most of us assume that our memories function rather like a video recording: an accurate, if occasionally blurry, record of what happened. Decades of research in cognitive psychology, however, paint a very different picture. Memory, it turns out, is not so much retrieved as reconstructed every time we recall an event.\n\nIn a series of landmark studies, participants watched footage of a car accident and were then asked how fast the cars were going when they "smashed into" or "hit" each other. Those who heard the word "smashed" not only estimated higher speeds but, a week later, were far more likely to falsely remember seeing broken glass at the scene. A single word had been enough to alter their recollection.\n\nThe implications are profound, particularly for the justice system. Eyewitness testimony has long been regarded as among the most persuasive forms of evidence in court, yet it has been implicated in a substantial proportion of wrongful convictions later overturned by DNA evidence. Witnesses are rarely lying; rather, they are sincerely convinced of memories that have been shaped by leading questions, conversations with others or media coverage.\n\nNone of this means that memory is useless. For everyday purposes, it serves us remarkably well. But it should make us more humble about the certainty with which we recount the past, and more cautious about treating confident recollection as proof of accuracy.`, q: [
    ["How do most people think memory works, according to the text?", ["Like a reconstruction", "Like a video recording", "Like a dream", "Like a computer search"], 1],
    ["What did the 'smashed' group tend to remember falsely?", ["A second car", "Broken glass", "A police officer", "Rain"], 1],
    ["Why is this research important for the justice system?", ["Witnesses often lie.", "Eyewitness testimony has contributed to wrongful convictions.", "DNA evidence is unreliable.", "Courts don't use witnesses."], 1],
    ["According to the writer, why do witnesses give inaccurate testimony?", ["They are paid to lie.", "They sincerely believe memories shaped by external influences.", "They have poor eyesight.", "They forget everything."], 1],
    ["What is the main lesson of the final paragraph?", ["Memory is useless.", "We should be more humble about the certainty of our memories.", "Eyewitnesses should be banned.", "We should record everything on video."], 1]
  ], gloss: [["retrieved", "recuperado"], ["landmark", "histórico / emblemático"], ["footage", "grabación"], ["recollection", "recuerdo"], ["wrongful conviction", "condena injusta"], ["leading question", "pregunta tendenciosa"]] },
  { title: "Report: Reducing staff turnover", text: `Introduction\nThe aim of this report is to examine the reasons behind the high staff turnover recorded in the customer service department over the past year and to propose measures to address the issue.\n\nFindings\nExit interviews conducted with 34 former employees reveal three recurring concerns. Firstly, over two thirds of respondents cited a lack of opportunities for career progression as their primary reason for leaving. Secondly, many felt that their workload had increased substantially without a corresponding rise in salary. Finally, a significant number reported that they had received little or no feedback from their managers, which left them feeling undervalued.\n\nRecommendations\nIn light of these findings, it is recommended that the company introduce a clear career framework, outlining the skills and experience required for promotion at each level. Furthermore, workloads should be reviewed on a quarterly basis to ensure they remain manageable. It would also be advisable to provide training for managers in giving regular, constructive feedback.\n\nConclusion\nWhile implementing these measures will require an initial investment, the cost of recruiting and training new staff is considerably higher. Should the proposals be adopted, turnover is likely to fall significantly within twelve months.`, q: [
    ["What is the purpose of the report?", ["To announce redundancies", "To examine causes of turnover and propose solutions", "To compare salaries", "To hire new managers"], 1],
    ["What was the most frequent reason for leaving?", ["Low salary", "Lack of career progression", "Bad location", "Long hours"], 1],
    ["What problem did employees report about managers?", ["They were rude.", "They gave little or no feedback.", "They were always absent.", "They changed too often."], 1],
    ["How often should workloads be reviewed?", ["Monthly", "Quarterly", "Yearly", "Weekly"], 1],
    ["What argument is used in the conclusion?", ["The measures are free.", "Replacing staff costs more than the measures.", "Turnover doesn't matter.", "Managers should be replaced."], 1]
  ], gloss: [["staff turnover", "rotación de personal"], ["exit interview", "entrevista de salida"], ["career progression", "desarrollo profesional"], ["undervalued", "infravalorado"], ["advisable", "aconsejable"], ["should the proposals be adopted", "si se adoptaran las propuestas"]] }
];

LISTENING.C1 = [
  { title: "Presentación de un proyecto", lines: [["A", "Good morning, everyone. Over the next ten minutes, I'd like to walk you through our proposal for the new customer platform."], ["A", "To put it in context, our current system dates back almost a decade, and frankly, it's no longer fit for purpose. Response times have doubled over the past two years."], ["B", "Sorry to interrupt, but what's the estimated cost?"], ["A", "Good question. We're looking at roughly half a million in the first year, but we anticipate that the efficiency gains will outweigh that within eighteen months."], ["B", "And what about the risk of disruption during the transition?"], ["A", "That's a legitimate concern. That's why we're proposing a phased rollout, starting with a pilot in a single region, so that any issues can be ironed out before we scale up."]], q: [
    ["Why does the current system need replacing?", ["It's too expensive.", "It's outdated and response times have doubled.", "Customers asked for it.", "It was hacked."], 1],
    ["When should the investment pay off?", ["Within six months", "Within a year", "Within eighteen months", "Within five years"], 2],
    ["What concern does the listener raise?", ["The design", "Disruption during the transition", "Staff training", "The supplier"], 1],
    ["How will the presenter reduce the risk?", ["By delaying the project", "With a phased rollout and a pilot", "By hiring consultants", "By keeping both systems forever"], 1]
  ]},
  { title: "Podcast: el valor del aburrimiento", lines: [["A", "Today's guest argues that boredom, far from being a waste of time, is actually essential for creativity. Welcome to the show."], ["B", "Thanks for having me. The thing is, we've practically eliminated boredom from our lives. The moment we have a spare second, we reach for our phones."], ["A", "And why is that a problem?"], ["B", "Because when the mind wanders, it starts making unexpected connections. There's research showing that people who did a dull task beforehand came up with more creative ideas afterwards."], ["A", "So you're saying we should deliberately be bored?"], ["B", "In a sense, yes. I'm not suggesting we throw away our phones, but leaving some unstructured time, say a walk without headphones, can make a real difference."]], q: [
    ["What is the guest's main argument?", ["Boredom is harmful.", "Boredom is essential for creativity.", "Phones improve creativity.", "Creativity can't be learnt."], 1],
    ["How have we 'eliminated' boredom?", ["By working more", "By reaching for our phones at every spare moment", "By sleeping less", "By travelling"], 1],
    ["What did the research show?", ["Dull tasks reduce creativity.", "People were more creative after a dull task.", "Phones make people smarter.", "Walking is boring."], 1],
    ["What does the guest recommend?", ["Throwing away phones", "Leaving some unstructured time", "Working longer hours", "Listening to podcasts"], 1]
  ]},
  { title: "Discusión ética en la oficina", lines: [["A", "I need your advice. I found out that a colleague has been inflating his sales figures."], ["B", "That's serious. Are you absolutely sure?"], ["A", "Fairly sure. The numbers in the report don't match the client invoices."], ["B", "Have you considered talking to him directly before going to management?"], ["A", "I have, but I'm worried he'll just deny it and cover his tracks."], ["B", "That's a risk. Still, giving him the chance to explain might be fairer. If he refuses, then you'd be fully justified in escalating it."], ["A", "I suppose you're right. I just don't want to be seen as the one who got him fired."], ["B", "Look, if he's falsifying data, that's on him, not you."]], q: [
    ["What has the colleague been doing?", ["Arriving late", "Inflating sales figures", "Stealing money", "Insulting clients"], 1],
    ["How did the speaker discover it?", ["A client complained.", "The report didn't match the invoices.", "Another colleague told her.", "The manager noticed."], 1],
    ["What does B advise first?", ["Going straight to management", "Talking to the colleague directly", "Ignoring it", "Calling the police"], 1],
    ["What is A worried about?", ["Losing her own job", "Being seen as responsible for his dismissal", "Making a mistake in the report", "The client leaving"], 1]
  ]}
];

ROLEPLAY.C1 = [
  { title: "Presentar una propuesta a la gerencia", intro: "Presentas a los directivos una propuesta para implementar el trabajo híbrido.", turns: [
    ["Thanks for coming in. So, what's your proposal?", "Introduce la propuesta: implementar un modelo híbrido de tres días en oficina y dos en casa.", ["I'd like to propose a hybrid model, with three days in the office and two working from home.", "Our proposal is to introduce a hybrid model: three days in the office and two remotely.", "What I'm proposing is a hybrid arrangement of three office days and two remote days."]],
    ["What evidence do you have that it would work?", "Menciona que un piloto de tres meses mostró un aumento del 12% en productividad.", ["A three-month pilot showed a 12% increase in productivity.", "We ran a three-month pilot, and productivity rose by twelve percent.", "Our three-month trial resulted in a 12% rise in productivity."]],
    ["I'm concerned it could damage team cohesion.", "Reconoce la preocupación y propón que todos estén en la oficina los mismos días.", ["That's a legitimate concern, which is why we suggest that everyone comes in on the same days.", "I understand your concern. To address it, the whole team would be in the office on the same days.", "Admittedly, that's a risk. That's why we'd make sure everyone is in the office on the same three days."]],
    ["And what about the costs?", "Explica que se podría reducir el espacio de oficina y ahorrar en arriendo.", ["In fact, it would allow us to reduce office space and save on rent.", "We could actually cut costs by reducing office space and rent.", "It would enable us to downsize the office, which would substantially reduce rent."]],
    ["Interesting. What would be the next step?", "Propón un periodo de prueba de seis meses con evaluación al final.", ["I'd suggest a six-month trial period, followed by a full evaluation.", "The next step would be a six-month trial with an evaluation at the end.", "We propose a six-month trial, after which we'd review the results."]]
  ]},
  { title: "Defender una postura polémica", intro: "Debates sobre si la inteligencia artificial destruirá más empleos de los que crea.", turns: [
    ["Surely AI is going to destroy millions of jobs. How can anyone deny that?", "Matiza: reconoce que algunos empleos desaparecerán pero que la historia muestra que surgen otros.", ["Admittedly, some jobs will disappear, but history shows that new ones tend to emerge.", "I don't deny that some jobs will go, but historically technology has also created new ones.", "Granted, certain jobs will be lost, but past revolutions have always created new types of work."]],
    ["But this time it's different. AI can do intellectual work too.", "Concede el punto pero di que la transición es el verdadero problema, no la tecnología.", ["That's a fair point, but I'd argue the real issue is the transition rather than the technology itself.", "You may be right, but the real challenge is managing the transition, not the technology.", "I take your point. Even so, the key problem is how we handle the transition."]],
    ["So what should governments do?", "Propón invertir en formación y reconversión profesional.", ["They should invest heavily in training and retraining workers.", "Governments ought to invest in education and retraining programmes.", "I think the priority should be investing in reskilling the workforce."]],
    ["That sounds expensive and slow.", "Responde que lo sería, pero que el costo de no hacerlo sería mucho mayor.", ["It would be, but the cost of doing nothing would be far greater.", "Granted, but the cost of inaction would be much higher.", "It might be, but not doing it would be considerably more expensive in the long run."]],
    ["Well, I'm still not fully convinced.", "Cierra con cortesía: di que es un debate complejo y que valoras su punto de vista.", ["Fair enough. It's a complex issue, and I appreciate your point of view.", "That's understandable. It's a complicated debate, and I value your perspective.", "I respect that. It's far from a simple issue, and your arguments are valid."]]
  ]}
];

WRITING.C1 = [
  { title: "Ensayo: ¿regular la IA?", task: "Escribe un ensayo argumentativo: ¿deberían los gobiernos regular estrictamente la inteligencia artificial? Presenta ambas posturas y defiende la tuya.", words: "250–280", phrases: ["It is often argued that...", "Proponents of... contend that...", "While there is some merit in this view,...", "It would be naive to assume that...", "On balance, I would argue that..."], check: ["Introducción que contextualiza y plantea la tesis", "Contraargumento presentado con justicia y refutado", "Usé inversión, hedging o estructuras de énfasis al menos una vez", "Vocabulario preciso, sin repetir las mismas palabras", "Conclusión que no solo repite, sino que sintetiza"], model: "Few technologies have advanced as rapidly as artificial intelligence, and few have generated such intense debate. While some believe that strict regulation is essential to protect society, others warn that it could stifle innovation. This essay will argue that regulation is necessary, provided that it is targeted rather than restrictive.\n\nProponents of minimal regulation contend that excessive rules would slow progress and push companies to relocate to countries with looser legislation. There is some merit in this view: poorly designed laws could indeed place smaller firms at a disadvantage, since only large corporations can afford complex compliance processes.\n\nNevertheless, it would be naive to assume that the market will regulate itself. AI systems are already being used to make decisions about loans, job applications and even medical treatment, often with little transparency. Should these systems contain hidden biases, the consequences for marginalised groups could be severe. What is more, the potential for misinformation and fraud is growing at an alarming rate.\n\nThe solution, therefore, lies not in banning technologies but in regulating their use according to risk. Applications that affect people's rights or safety ought to be subject to independent audits and clear accountability, whereas low-risk tools could remain largely unrestricted.\n\nOn balance, I would argue that well-designed regulation is not an obstacle to innovation but a precondition for public trust. Without that trust, AI is unlikely to reach its full potential." },
  { title: "Informe para tu jefe", task: "Escribe un informe proponiendo una mejora en tu empresa (por ejemplo: formación, bienestar, procesos). Usa secciones con títulos.", words: "220–260", phrases: ["The aim of this report is to...", "It was found that... / Findings indicate that...", "In light of these findings, it is recommended that...", "It would also be advisable to...", "Should these measures be adopted,..."], check: ["Tiene títulos: Introduction, Findings, Recommendations, Conclusion", "Usé lenguaje impersonal y pasivas", "Las recomendaciones son concretas y justificadas", "Usé al menos un condicional formal (Should..., Were...)"], model: "Introduction\nThe aim of this report is to assess the effectiveness of the current onboarding process for new employees and to recommend improvements.\n\nFindings\nA survey of 25 employees who joined in the last year indicates that the onboarding process is perceived as disorganised. Over half reported that they did not receive the necessary equipment on their first day, and many stated that they had to rely on colleagues to understand basic procedures. Furthermore, it was found that new employees take on average four months to become fully productive, compared to the industry benchmark of two.\n\nRecommendations\nIn light of these findings, it is recommended that a structured two-week onboarding programme be introduced, including a clear schedule, training sessions and a designated mentor for each new employee. It would also be advisable to prepare all equipment and system access before the start date. Finally, a short feedback survey should be conducted after the first month in order to identify further areas for improvement.\n\nConclusion\nWhile these measures will require some time and coordination, they are relatively inexpensive. Should they be adopted, new employees are likely to become productive considerably sooner, which would benefit both the teams and the company as a whole." },
  { title: "Artículo de opinión", task: "Escribe un artículo para una revista sobre el impacto de las redes sociales en la forma en que nos relacionamos.", words: "230–260", phrases: ["Ask anyone under thirty...", "There is no denying that...", "What is rarely discussed, however, is...", "Paradoxically,...", "Perhaps the real question is not... but..."], check: ["Título atractivo y una apertura que enganche al lector", "Tono personal pero argumentado", "Usé preguntas retóricas o recursos de estilo", "Incluí al menos una oración escindida (What..., It is... that...)", "Final memorable"], model: "Connected, but Alone?\n\nAsk anyone under thirty how many friends they have, and the answer may well run into the hundreds. Ask how many of those they could call at three in the morning, and the number shrinks dramatically.\n\nThere is no denying that social media has transformed the way we relate to one another. It allows us to stay in touch with relatives abroad, find communities of like-minded people and share our lives instantly. For many, particularly those who feel isolated, these platforms have been a lifeline.\n\nWhat is rarely discussed, however, is the quality of these connections. Paradoxically, the more time we spend interacting online, the lonelier many of us seem to feel. Likes and comments offer a quick sense of approval, but they are no substitute for the depth of a face-to-face conversation. It is the effort of meeting in person, the awkward silences, the shared laughter, that builds genuine intimacy.\n\nNone of this means we should abandon our accounts. Perhaps the real question is not whether social media is good or bad, but whether we use it to enrich our relationships or to replace them. The next time you are tempted to scroll through a friend's photos, you might consider calling them instead. Chances are, they would be glad to hear from you." }
];

CANDO.C1 = [
  "Puedo expresarme con fluidez y espontaneidad sin buscar palabras de forma evidente.",
  "Puedo usar el idioma con flexibilidad en contextos sociales, académicos y profesionales.",
  "Puedo entender textos largos y exigentes, y captar significados implícitos.",
  "Puedo presentar y defender propuestas complejas ante directivos.",
  "Puedo escribir ensayos, informes y artículos bien estructurados y matizados.",
  "Puedo entender conferencias, podcasts y películas sin mucho esfuerzo.",
  "Puedo ajustar el registro (formal, neutro, informal) según la situación."
];
