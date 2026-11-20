// ===== HISTORIAS GRADUADAS: "Code & Coffee" =====
// Serie con personajes recurrentes. El nivel sube episodio a episodio.
// Personajes: Sofía (desarrolladora de Medellín), Daniel (su compañero de piso, chef),
// Mark (su jefe en Londres), Priya (diseñadora en Toronto), Tom (desarrollador junior).
const STORY_SERIES = {
  title: "Code & Coffee",
  intro: "Sofía es una desarrolladora de Medellín que consigue su primer trabajo remoto con una empresa de Londres. Episodio a episodio la acompañas en su vida, su trabajo y su inglés. El vocabulario y la gramática suben de nivel contigo, y los personajes se repiten, así que cada episodio se entiende mejor que el anterior.",
  cast: [["Sofía", "Desarrolladora de Medellín, 27 años"], ["Daniel", "Su compañero de piso, chef"], ["Mark", "Su jefe, en Londres"], ["Priya", "Diseñadora del equipo, en Toronto"], ["Tom", "Desarrollador junior, en Manchester"]]
};
const STORIES = [
  { id: "st01", level: "A2", ep: 1, title: "The email",
    text: `Sofía is twenty-seven years old. She lives in Medellín with her friend Daniel. Daniel is a chef, and he cooks amazing food. Sofía is a software developer, but she works for a small local company and she wants something new.

One Monday morning, she opens her laptop and sees an email from a company in London. The subject says: "Job offer". Sofía reads the email three times. She can't believe it. The company wants her to join their team as a remote developer.

"Daniel! Come here!" she shouts. Daniel runs from the kitchen with a spoon in his hand. "What happened? Are you OK?"

"I got the job! The job in London!"

"That's fantastic! But wait... do you have to move to London?"

"No, it's remote. I can work from here. But there's one problem," Sofía says. "All the meetings are in English. My English is... OK, but not great."

Daniel smiles. "Then you need to practise every day. You can start tonight. I'm making arepas, and you can tell me about the job. In English!"`,
    q: [["Where does Sofía live?", ["In London", "In Medellín", "In Bogotá"], 1], ["What is Daniel's job?", ["He's a developer", "He's a teacher", "He's a chef"], 2], ["Does Sofía have to move to London?", ["Yes, next month", "No, the job is remote", "She doesn't know"], 1], ["What is Sofía worried about?", ["Her English", "The salary", "Her laptop"], 0]],
    gloss: [["job offer", "oferta de trabajo"], ["she can't believe it", "no lo puede creer"], ["to join a team", "unirse a un equipo"], ["to shout", "gritar"], ["to move", "mudarse"], ["to practise", "practicar"]] },
  { id: "st02", level: "A2", ep: 2, title: "The first meeting",
    text: `It's Sofía's first day. The meeting starts at 9 a.m. in London, so it's 3 a.m. in Medellín... No, wait. Sofía checks again. London is five hours ahead, so the meeting is at 4 a.m. her time? No! The meeting is at 3 p.m. in London, so it's 9 a.m. in Medellín. Perfect.

She makes a big cup of coffee and turns on her camera. There are four people in the call. A man with grey hair says, "Hi everyone, I'm Mark. I'm the team lead. Welcome, Sofía!"

"Thank you. Nice to meet you," Sofía says. Her voice is a little nervous.

"This is Priya, our designer. She lives in Toronto. And this is Tom. He's a junior developer, like you were a few years ago."

Tom waves. "Hi Sofía! Don't worry, everybody is friendly here."

Mark speaks very fast. Sofía doesn't understand everything, but she writes the important words in a notebook: "sprint", "backlog", "deploy on Thursday". After the meeting, she sends a message to Tom: "Sorry, can you explain what a sprint is here? I want to be sure."

Tom answers in two minutes. "Sure! No problem. Asking questions is a good thing."`,
    q: [["What time is the meeting in Medellín?", ["3 a.m.", "9 a.m.", "3 p.m."], 1], ["Who is Mark?", ["The designer", "The team lead", "A junior developer"], 1], ["Where does Priya live?", ["In Toronto", "In London", "In Manchester"], 0], ["What does Sofía do when she doesn't understand?", ["She says nothing", "She writes words and asks Tom", "She leaves the meeting"], 1]],
    gloss: [["ahead", "adelante (hora)"], ["to turn on", "encender"], ["team lead", "líder del equipo"], ["to wave", "saludar con la mano"], ["nervous", "nerviosa"], ["to be sure", "estar seguro"]] },
  { id: "st03", level: "A2", ep: 3, title: "Daniel's restaurant",
    text: `On Saturday, Sofía doesn't work. She goes with Daniel to the market early in the morning. Daniel wants to open a small restaurant, and he needs fresh fruit and vegetables for a new menu.

"Why do you want a restaurant?" Sofía asks. "You have a good job at the hotel."

"Yes, but I always cook what my boss wants. I want to cook my own food. Colombian food with a modern style."

At the market, a tourist from Canada asks Daniel about a strange fruit. "Excuse me, what is this?"

Daniel looks at Sofía. He doesn't speak much English. Sofía helps him. "It's called lulo. It's a little sour, but it's great for juice."

The tourist buys five lulos and says thank you. Daniel is surprised. "Your English is good, Sofía!"

"It's getting better. I practise every day now. Hey... maybe your restaurant needs a menu in English, too. Lots of tourists come to Medellín."

Daniel thinks about it. "OK. You help me with the English menu, and I cook dinner for you every Friday. Deal?"

"Deal!"`,
    q: [["Why does Daniel want a restaurant?", ["He doesn't like his boss", "He wants to cook his own food", "He wants more money"], 1], ["What is lulo like, according to Sofía?", ["Sweet", "Sour", "Salty"], 1], ["Who helps the tourist?", ["Daniel", "Sofía", "Another tourist"], 1], ["What is the deal between Sofía and Daniel?", ["English menu for dinners", "Money for coffee", "Help with the laptop"], 0]],
    gloss: [["fresh", "fresco"], ["sour", "ácido / agrio"], ["juice", "jugo"], ["to get better", "mejorar"], ["deal", "trato"], ["menu", "carta / menú"]] },
  { id: "st04", level: "B1", ep: 4, title: "A bug on Friday",
    text: `It was Friday afternoon, and Sofía was looking forward to a quiet weekend. She had finished her tasks, and Daniel was already cooking dinner. Then her phone buzzed. It was a message from Mark: "Urgent. Customers can't log in. Can you have a look?"

Sofía's heart started beating faster. The login page was part of the code she had changed that week. She opened the logs and saw hundreds of errors. While she was reading them, Tom joined the call.

"I think it's my fault," Tom said quietly. "I deployed a small change an hour ago. I didn't run all the tests."

Sofía didn't get angry. She remembered her first job, when she had deleted a whole database by mistake. "Don't worry. Let's find the problem together. Can you share your screen?"

After forty minutes, they found it. A configuration file had the wrong value. Tom fixed it, and Sofía checked everything twice. The customers could log in again.

Later, Mark wrote in the team chat: "Great job, both of you. Next week let's talk about how to stop this happening again. No blame, just better processes."

Sofía closed her laptop and went to the kitchen. "Sorry I'm late. The food smells amazing."

"It was hot an hour ago," Daniel laughed. "But it's still good."`,
    q: [["What was the problem?", ["The website was slow", "Customers couldn't log in", "The database was deleted"], 1], ["Why did Tom think it was his fault?", ["He deployed without running all the tests", "He deleted the logs", "He didn't come to work"], 0], ["How did Sofía react?", ["She got angry", "She stayed calm and helped", "She called Mark"], 1], ["What did Mark want to do next week?", ["Fire Tom", "Talk about better processes", "Change the login page"], 1]],
    gloss: [["to look forward to", "esperar con ganas"], ["to buzz", "vibrar (el celular)"], ["fault", "culpa"], ["by mistake", "por error"], ["to share your screen", "compartir pantalla"], ["no blame", "sin culpar a nadie"]] },
  { id: "st05", level: "B1", ep: 5, title: "Priya's idea",
    text: `Priya, the designer from Toronto, sent Sofía a private message one morning. "Do you have ten minutes? I've got an idea, but I'm not sure if it's crazy."

They started a video call. Priya explained that many users had complained about the app's checkout process. "It has six steps," she said. "If you ask me, it should have three. People get tired and leave before they pay."

Sofía agreed, but she could see a problem. "I see what you mean, but changing it will take a lot of time. Mark wants us to focus on the new features."

"That's exactly why I need your help," Priya said. "If we show him numbers, he'll listen. Can you find out how many people leave at each step?"

Sofía spent the afternoon working with the data. The result surprised both of them: almost forty percent of users left at step four, where they had to create an account.

The next day they presented the numbers to Mark. He was quiet for a moment. Then he said, "OK. I wasn't expecting that. Let's try a guest checkout without an account. Priya, can you design it? Sofía, can you build it in the next sprint?"

After the meeting, Priya sent a message with three coffee emojis. Sofía answered: "Your crazy idea wasn't so crazy after all."`,
    q: [["What was Priya's idea about?", ["A new logo", "Making the checkout shorter", "Hiring more designers"], 1], ["Why did Sofía think it could be difficult?", ["Mark wanted to focus on new features", "Priya was in another country", "She didn't like the idea"], 0], ["Where did many users leave the process?", ["At the first step", "At the account creation step", "After paying"], 1], ["What did Mark decide?", ["To wait until next year", "To try a guest checkout", "To remove the checkout"], 1]],
    gloss: [["to complain", "quejarse"], ["checkout", "proceso de pago"], ["to find out", "averiguar"], ["to leave (an app)", "abandonar"], ["guest checkout", "compra como invitado"], ["after all", "después de todo"]] },
  { id: "st06", level: "B1", ep: 6, title: "The phone call",
    text: `Daniel had finally found a place for his restaurant, a small house with a garden near Parque Lleras. The owner lived in Miami and only spoke English, so Daniel asked Sofía to help him with the phone call.

"I'm so nervous," he said. "What if he asks me something I don't understand?"

"Then I'll translate. But try to say the first part yourself. We practised it."

The owner, Mr. Harris, answered after three rings. Daniel took a deep breath. "Good morning, Mr. Harris. My name is Daniel Restrepo. I'm calling about the house on Calle 10. I'd like to rent it for a restaurant."

Sofía gave him a thumbs up. Mr. Harris asked several questions: how long Daniel wanted to rent it for, whether he would make changes to the kitchen, and when he could start. Sofía helped with the difficult parts, but Daniel understood more than he expected.

Then Mr. Harris said something that made them both stop. "The rent is two thousand dollars a month, and I need six months in advance."

Daniel looked at Sofía. It was much more than he had. Sofía whispered, "Ask him if it's negotiable."

"Is the price... negotiable?" Daniel asked.

There was a long silence. "Well," Mr. Harris said, "if you can sign a contract for two years, I could accept three months in advance."

When they hung up, Daniel was smiling. "I can't believe I negotiated in English!"`,
    q: [["Why did Daniel need help?", ["The owner only spoke English", "He couldn't find the house", "His phone didn't work"], 0], ["What surprised them during the call?", ["The size of the garden", "The price and the advance payment", "The owner's accent"], 1], ["What did Sofía suggest?", ["To hang up", "To ask if the price was negotiable", "To look for another house"], 1], ["What did the owner finally offer?", ["A lower monthly rent", "Three months in advance with a two-year contract", "The house for free"], 1]],
    gloss: [["owner", "dueño"], ["to rent", "arrendar"], ["to take a deep breath", "respirar hondo"], ["thumbs up", "pulgar arriba"], ["in advance", "por adelantado"], ["to hang up", "colgar"]] },
  { id: "st07", level: "B2", ep: 7, title: "The promotion",
    text: `Six months after joining the company, Sofía received an unexpected invitation to a one-to-one meeting with Mark. She spent the morning wondering whether she had done something wrong.

"I'll get straight to the point," Mark said. "We're setting up a new team to rebuild the payments system, and I'd like you to lead it."

Sofía was speechless. Leading a team meant running meetings, giving feedback and, above all, speaking English all day long, often under pressure. "I'm flattered," she managed to say. "Having said that, I'm not sure I'm ready. My English still lets me down sometimes, especially when people speak fast."

Mark nodded. "I appreciate your honesty. But when it comes to communication, what matters most is being clear, not sounding like a native speaker. You ask good questions, you explain things simply and you never pretend to understand when you don't. Those are rare skills."

Sofía asked for a couple of days to think it over. That evening she talked to Daniel, who was exhausted after a long day at the restaurant, which had opened the month before.

"Do you remember the phone call with Mr. Harris?" he said. "I was terrified, and you told me to say the first part myself. Maybe you should take your own advice."

The following Monday, Sofía accepted the offer, on one condition: that the company paid for a public speaking course. Mark agreed immediately.`,
    q: [["What was the meeting about?", ["A problem with Sofía's work", "An offer to lead a new team", "A salary reduction"], 1], ["Why did Sofía hesitate?", ["She didn't like the payments system", "She worried about her English under pressure", "She wanted to leave the company"], 1], ["According to Mark, what matters most in communication?", ["Sounding like a native speaker", "Being clear", "Speaking fast"], 1], ["What condition did Sofía set?", ["A higher salary", "Working only four days", "A public speaking course"], 2]],
    gloss: [["to get straight to the point", "ir directo al grano"], ["speechless", "sin palabras"], ["to be flattered", "sentirse halagado"], ["to let someone down", "fallarle a alguien"], ["to pretend", "fingir"], ["to think it over", "pensarlo bien"]] },
  { id: "st08", level: "B2", ep: 8, title: "Tom's mistake",
    text: `Leading a team turned out to be harder than Sofía had anticipated, and not because of the technical challenges. Tom, who had joined her team, had been missing deadlines for weeks. His code was good when it arrived, but it rarely arrived on time, and the rest of the team had started to notice.

Sofía kept putting off the conversation. She liked Tom; he had been the first person to make her feel welcome. But at the end of the day, it was her responsibility.

She prepared carefully, using a structure from her public speaking course: describe the situation, explain the impact, and ask questions before drawing conclusions.

"Tom, can I share something I've noticed? The last three tasks were delivered between four and six days late. That's had an impact on Priya, who couldn't start her designs, and on our release date. I'm not here to blame you. I'd really like to understand what's going on."

There was a long pause. Then Tom admitted that his mother had been ill and that he had been travelling to Leeds every weekend to look after her. He hadn't said anything because he was afraid it would sound like an excuse.

"It doesn't sound like an excuse at all," Sofía said. "It sounds like something we should have known about. Let's look at your workload and see what we can move. And please, next time, tell me earlier. I'd much rather adjust a plan than lose a teammate."

Tom looked relieved. A month later, he was meeting every deadline, and he had become the team's most reliable reviewer.`,
    q: [["What was the problem with Tom's work?", ["His code had many bugs", "He was missing deadlines", "He was rude to Priya"], 1], ["Why did Sofía delay the conversation?", ["She liked Tom and found it difficult", "She was on holiday", "Mark told her to wait"], 0], ["What structure did she use?", ["Situation, impact, questions", "Criticism, warning, deadline", "Praise, criticism, praise"], 0], ["Why hadn't Tom explained his situation?", ["He thought it would sound like an excuse", "He didn't trust Sofía", "He didn't know about the deadlines"], 0]],
    gloss: [["to anticipate", "prever"], ["deadline", "fecha límite"], ["to put off", "aplazar"], ["to draw conclusions", "sacar conclusiones"], ["workload", "carga de trabajo"], ["relieved", "aliviado"]] },
  { id: "st09", level: "B2", ep: 9, title: "A night at the restaurant",
    text: `Daniel's restaurant had been open for almost a year when a food critic from an international travel magazine booked a table without warning. Daniel only found out because the critic's assistant called to confirm the reservation and accidentally mentioned the magazine's name.

Panic spread through the kitchen. Daniel asked Sofía to come and help at the front of the restaurant, since she was the only person he trusted who could chat comfortably in English.

The critic turned out to be a soft-spoken woman called Helen, who asked detailed questions about every dish. Sofía explained that the menu was inspired by Daniel's grandmother's recipes, reinterpreted with modern techniques. When Helen asked why the dessert combined lulo with dark chocolate, Sofía realised she didn't know the answer, so she did what she had learned at work: instead of making something up, she said, "That's a great question. Let me ask the chef."

Daniel came out of the kitchen, wiping his hands on his apron, and answered in slow but confident English. "The lulo is sour, the chocolate is bitter. Together, they are like Medellín: a little intense, but you want more."

Helen laughed and wrote something in her notebook.

Two months later the article was published. The headline read: "A taste of Medellín, one honest answer at a time." Daniel framed it and hung it next to the kitchen door.`,
    q: [["How did Daniel find out about the critic?", ["She announced it on social media", "Her assistant mentioned the magazine by accident", "Sofía recognised her"], 1], ["Why did Daniel ask Sofía to help?", ["She could speak English comfortably", "She was a professional waitress", "She knew the critic"], 0], ["What did Sofía do when she didn't know an answer?", ["She invented one", "She said she would ask the chef", "She changed the subject"], 1], ["What did Daniel compare the dessert to?", ["His grandmother", "The city of Medellín", "The critic's personality"], 1]],
    gloss: [["without warning", "sin previo aviso"], ["to spread", "extenderse"], ["soft-spoken", "de voz suave"], ["to make something up", "inventarse algo"], ["apron", "delantal"], ["to frame", "enmarcar"]] },
  { id: "st10", level: "C1", ep: 10, title: "The conference talk",
    text: `When the organisers of a developer conference in Lisbon invited Sofía to give a talk on how her team had rebuilt the payments system, her first instinct was to decline. Speaking to a room of three hundred engineers, many of them native speakers, struck her as an entirely different proposition from running a stand-up meeting.

What changed her mind was a remark Priya made over a video call. "You keep assuming the audience wants a flawless accent. What they actually want is someone who's been through the mess and can tell them what went wrong. Nobody else can tell that story."

Sofía spent weeks preparing. Rather than memorising a script, she rehearsed the key transitions until she could deliver them in her sleep, and she deliberately left room for improvisation. She also recorded herself and noticed she tended to rush whenever she felt insecure, so she wrote a single word at the top of each slide note: "Breathe."

On the day, ten minutes into the talk, the projector died. For a few seconds the room was silent. Sofía felt the familiar panic rising, then heard herself say, "Well, I did promise you a talk about systems failing in production." The audience burst out laughing, and by the time a technician had fixed the projector, she had already explained the architecture by drawing it on a whiteboard.

Afterwards, a senior engineer from a major bank approached her. "I've been to dozens of these conferences," he said, "and that was the first time I actually understood how a payments migration works." On the flight back, Sofía caught herself thinking, for the first time, not in Spanish or in English, but simply in ideas.`,
    q: [["Why did Sofía initially want to decline?", ["She had no time to prepare", "Speaking to a large expert audience intimidated her", "She disagreed with the organisers"], 1], ["What was Priya's main argument?", ["Sofía's accent was already perfect", "The audience values real experience over a perfect accent", "Talks should be memorised word for word"], 1], ["What did Sofía notice when she recorded herself?", ["She spoke too quietly", "She rushed when she felt insecure", "She used too many slides"], 1], ["How did she handle the projector failing?", ["She ended the talk early", "She made a joke and used a whiteboard", "She waited silently for the technician"], 1]],
    gloss: [["to decline", "rechazar (una invitación)"], ["to strike someone as", "parecerle a alguien"], ["flawless", "impecable"], ["to rehearse", "ensayar"], ["to burst out laughing", "echarse a reír"], ["to catch yourself + -ing", "sorprenderse a uno mismo haciendo algo"]] },
  { id: "st11", level: "C1", ep: 11, title: "Two offers",
    text: `The conference talk had consequences Sofía hadn't foreseen. Within a fortnight she had received two job offers. The first came from the bank whose engineer had approached her in Lisbon: a senior architect role in London, with a salary nearly double her current one and a relocation package thrown in. The second, less glamorous but intriguing, came from a small start-up in Medellín that was building software for local farmers to sell directly to restaurants.

On paper, the decision was straightforward. In practice, it was anything but. Moving to London would mean leaving Daniel, whose restaurant was finally thriving, and starting from scratch in a city where she knew no one. On the other hand, it was the kind of opportunity that had seemed unthinkable two years earlier, when she had read that first email three times in disbelief.

She drew up a list of pros and cons, which, predictably, solved nothing. So she turned to the people whose judgement she trusted most. Mark, to her surprise, urged her to consider the start-up seriously. "Big companies will always be there," he said. "Chances to build something from the ground up, with people you care about, are far rarer." Priya took the opposite view: "You've earned the right to be ambitious. Don't talk yourself out of it."

Daniel, characteristically, said very little and cooked her favourite meal. Only at the end of the evening did he add: "Whatever you choose, make sure it's because you want it, not because you're afraid of the alternative."

Sofía went to bed that night realising that, for the first time, the language she would work in was no longer the deciding factor. The decision had become, quite simply, a question of who she wanted to be.`,
    q: [["What did the start-up do?", ["It built banking software", "It connected local farmers with restaurants", "It organised conferences"], 1], ["What was Mark's advice?", ["To accept the bank's offer", "To seriously consider the start-up", "To stay in her current job"], 1], ["What was Priya's view?", ["Sofía should be ambitious", "Sofía should stay in Medellín", "Sofía should start her own company"], 0], ["What did Daniel emphasise?", ["The salary", "Choosing out of desire rather than fear", "The restaurant's needs"], 1]],
    gloss: [["to foresee", "prever"], ["a fortnight", "dos semanas"], ["relocation package", "paquete de reubicación"], ["to thrive", "prosperar"], ["from scratch", "desde cero"], ["to talk yourself out of something", "convencerse de no hacer algo"]] },
  { id: "st12", level: "C1", ep: 12, title: "Full circle",
    text: `A year later, on a Monday morning not unlike the one on which she had first opened that email from London, Sofía was sitting in a cramped office above a bakery in Envigado, interviewing candidates for the start-up she had chosen to join as its chief technology officer.

The last candidate of the day was a twenty-three-year-old developer called Valentina, whose technical test had been outstanding. Midway through the interview, Sofía switched to English, as the company now worked with clients in Canada and the United States. Valentina's confidence visibly evaporated. She stumbled over her words, apologised twice, and finally admitted, in Spanish, that her English was "more or less A2".

Sofía put down her pen. "Can I tell you something? Four years ago, I was exactly where you are now. I used to write down every word I didn't understand in meetings and look them up at night. I recorded myself, I made a fool of myself on phone calls, and I once told a whole meeting I was 'constipated' when I meant I had a cold."

Valentina laughed in spite of herself.

"Your English will improve if you use it every single day, even when it's uncomfortable. Especially when it's uncomfortable. The code you wrote, on the other hand, is something I can't teach. We'd like to offer you the job."

That evening, Sofía walked to Daniel's restaurant, where Mark and Priya, visiting Colombia for the first time, were waiting at a table in the garden. Tom had joined them by video, the laptop propped against a bottle of wine. Daniel came out with a dessert that wasn't on the menu: lulo and dark chocolate.

"To Code & Coffee," Priya said, raising her glass.

"And to asking questions," Tom added from the screen.

Sofía raised hers and said nothing for a moment. Then, in an English that was no longer something she performed but simply the way she spoke, she said, "To the first email. And to everyone who made me answer it."`,
    q: [["What was Sofía's role at the start-up?", ["Junior developer", "Chief technology officer", "Designer"], 1], ["Why did Valentina lose confidence?", ["Her technical test went badly", "The interview switched to English", "Sofía criticised her code"], 1], ["What point was Sofía making with her own story?", ["English can't be learned as an adult", "Daily, uncomfortable practice makes you improve", "Technical skills are less important than English"], 1], ["What did Daniel serve that evening?", ["Arepas", "The lulo and chocolate dessert", "A new dish from Canada"], 1]],
    gloss: [["cramped", "estrecho / apretado"], ["outstanding", "sobresaliente"], ["to evaporate", "evaporarse / desaparecer"], ["to stumble over your words", "trabarse al hablar"], ["to make a fool of yourself", "hacer el ridículo"], ["in spite of herself", "sin poder evitarlo"]] }
];
