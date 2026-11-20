// ===== HABLA 1 MINUTO: temas por nivel =====
// [tema en inglés, ayuda en español, [chunks sugeridos], [preguntas guía]]
const SPEAK_PROMPTS = {
  A2: [
    ["Describe your typical day.", "Describe tu día típico.", ["I usually...", "After that,...", "In the evening,..."], ["What time do you get up?", "What do you do in the afternoon?", "What do you do before bed?"]],
    ["Talk about your best friend.", "Habla de tu mejor amigo/a.", ["My best friend is...", "We met when...", "I like him/her because..."], ["How did you meet?", "What is he/she like?", "What do you do together?"]],
    ["Describe your home.", "Describe tu casa o apartamento.", ["I live in...", "There is / There are...", "My favourite room is..."], ["Where is it?", "How many rooms are there?", "What do you like about it?"]],
    ["Talk about your favourite food.", "Habla de tu comida favorita.", ["My favourite food is...", "I usually eat it...", "It tastes..."], ["What is it?", "Who cooks it?", "When do you eat it?"]],
    ["Describe your last weekend.", "Cuenta tu último fin de semana.", ["On Saturday, I...", "Then I...", "It was..."], ["Where did you go?", "Who were you with?", "Did you enjoy it?"]],
    ["Talk about your job or studies.", "Habla de tu trabajo o estudios.", ["I work as...", "Every day I have to...", "The best part is..."], ["What do you do?", "What do you like?", "What is difficult?"]],
    ["Describe your city.", "Describe tu ciudad.", ["My city is...", "You can...", "The weather is usually..."], ["What is it famous for?", "What can tourists do?", "Do you like living there?"]],
    ["Talk about a hobby.", "Habla de un pasatiempo.", ["In my free time, I like...", "I started when...", "I do it because..."], ["How often do you do it?", "When did you start?", "Why do you like it?"]]
  ],
  B1: [
    ["Describe a trip you will never forget.", "Describe un viaje que nunca olvidarás.", ["I'll never forget the time...", "All of a sudden,...", "In the end,..."], ["Where did you go?", "What happened?", "How did you feel?"]],
    ["What are your plans for the next year?", "¿Cuáles son tus planes para el próximo año?", ["I'm planning to...", "I'm thinking of + -ing", "I'm looking forward to..."], ["What do you want to achieve?", "What will be difficult?", "Why is it important to you?"]],
    ["Is it better to live in a city or in the countryside?", "¿Es mejor vivir en la ciudad o en el campo?", ["If you ask me,...", "On the other hand,...", "I'd rather... than..."], ["What are the advantages of each?", "Where would you prefer to live?", "Why?"]],
    ["Talk about a person who has influenced you.", "Habla de una persona que te ha influido.", ["The person who... is...", "What I admire most is...", "Thanks to him/her,..."], ["Who is it?", "What did they do?", "How did they change you?"]],
    ["Describe a problem you solved at work or school.", "Describe un problema que resolviste.", ["The thing is,...", "So I decided to...", "It turned out that..."], ["What was the problem?", "What did you do?", "What did you learn?"]],
    ["Why are you learning English?", "¿Por qué estás aprendiendo inglés?", ["The main reason is...", "I've been learning for...", "My goal is to..."], ["Since when?", "What is hard for you?", "What will you do with it?"]],
    ["Talk about a film or series you recommend.", "Recomienda una película o serie.", ["It's about...", "What I liked most was...", "I'd definitely recommend it because..."], ["What is it about?", "Who is in it?", "Why should people watch it?"]],
    ["Describe a mistake you learned from.", "Describe un error del que aprendiste.", ["Back then,...", "I made a mistake when...", "Since then, I've..."], ["What happened?", "What were the consequences?", "What do you do differently now?"]]
  ],
  B2: [
    ["Should remote work be the norm?", "¿Debería ser normal el trabajo remoto?", ["The way I see it,...", "Having said that,...", "At the end of the day,..."], ["What are the benefits?", "What are the risks?", "What is your conclusion?"]],
    ["How has technology changed the way we communicate?", "¿Cómo ha cambiado la tecnología la comunicación?", ["When it comes to...", "On top of that,...", "That's why..."], ["What has improved?", "What has got worse?", "Give a personal example."]],
    ["Describe a decision that changed your life.", "Describe una decisión que cambió tu vida.", ["Looking back,...", "If I hadn't..., I wouldn't...", "It turned out to be..."], ["What did you decide?", "Was it difficult?", "Would you do it again?"]],
    ["Is social media good for young people?", "¿Son buenas las redes sociales para los jóvenes?", ["There's no doubt that...", "Not to mention...", "I'm not entirely convinced that..."], ["What are the positive effects?", "What are the dangers?", "What should parents do?"]],
    ["What makes a good team leader?", "¿Qué hace a un buen líder de equipo?", ["First and foremost,...", "What really matters is...", "A good example of this is..."], ["Which qualities are essential?", "Have you had a good boss?", "What did they do well?"]],
    ["Talk about an achievement you're proud of.", "Habla de un logro del que estás orgulloso.", ["I'm particularly proud of...", "It wasn't easy because...", "What I learned was..."], ["What did you achieve?", "What obstacles did you face?", "Why does it matter to you?"]],
    ["Should university be free for everyone?", "¿Debería ser gratis la universidad?", ["Supporters argue that...", "Critics point out that...", "On balance,..."], ["What are the arguments for?", "And against?", "What do you think?"]],
    ["Explain how something works (a tool you use, a recipe, an app).", "Explica cómo funciona algo.", ["Basically,...", "The first step is...", "What I mean is..."], ["What is it?", "What are the steps?", "Why is it useful?"]]
  ],
  C1: [
    ["To what extent should governments regulate artificial intelligence?", "¿Hasta qué punto deben los gobiernos regular la IA?", ["It could be argued that...", "By the same token,...", "That being said,..."], ["What are the risks of no regulation?", "What are the risks of too much?", "Where would you draw the line?"]],
    ["Is it ever acceptable to lie?", "¿Es aceptable mentir alguna vez?", ["It depends to a large extent on...", "Take, for instance,...", "Ultimately,..."], ["Give an example where it may be justified.", "What are the consequences?", "Where is the limit?"]],
    ["Describe a turning point in your career or studies.", "Describe un punto de inflexión en tu carrera.", ["In hindsight,...", "It was only when... that...", "Had I known..., I would have..."], ["What happened?", "How did it change your direction?", "What would you tell your past self?"]],
    ["What role should tradition play in modern society?", "¿Qué papel debe tener la tradición hoy?", ["There's a fine line between...", "Far from being...,", "On the whole,..."], ["Which traditions are worth keeping?", "Which should change?", "Give examples from your country."]],
    ["Has globalisation done more harm than good?", "¿La globalización ha hecho más daño que bien?", ["While it's true that...,", "Nevertheless,...", "All things considered,..."], ["Who benefits?", "Who loses?", "What is your overall judgement?"]],
    ["Talk about a skill that schools don't teach but should.", "Una habilidad que las escuelas no enseñan pero deberían.", ["It strikes me as odd that...", "What's more,...", "The upshot is that..."], ["What skill?", "Why is it missing?", "How could it be taught?"]],
    ["How do you deal with failure?", "¿Cómo manejas el fracaso?", ["I've come to realise that...", "The key, as far as I'm concerned, is...", "It's not so much... as..."], ["Describe a failure.", "How did you react?", "What has changed since?"]],
    ["Pitch a product or app idea in one minute.", "Presenta una idea de producto en un minuto.", ["Imagine a world where...", "What sets it apart is...", "The bottom line is..."], ["What problem does it solve?", "Who is it for?", "Why now?"]]
  ],
  C2: [
    ["Is objectivity in journalism achievable or merely an ideal?", "¿Es alcanzable la objetividad en el periodismo?", ["One might contend that...", "Be that as it may,...", "It is precisely for this reason that..."], ["What threatens objectivity?", "Is neutrality the same as objectivity?", "What should readers do?"]],
    ["Does language shape the way we think?", "¿El idioma moldea la forma en que pensamos?", ["There is a compelling case for...", "Conversely,...", "If anything,..."], ["Give an example from Spanish and English.", "Do you feel different in each language?", "What is your conclusion?"]],
    ["Should we value happiness or meaning more highly?", "¿Valorar más la felicidad o el sentido?", ["To put it another way,...", "Notwithstanding...,", "In the final analysis,..."], ["How do they differ?", "Can you have both?", "Which do you prioritise?"]],
    ["Critique a common piece of advice everyone gives.", "Critica un consejo que todos repiten.", ["Conventional wisdom has it that...", "This overlooks the fact that...", "A more nuanced view would be..."], ["What is the advice?", "Why is it flawed?", "What would you say instead?"]],
    ["What will work look like in thirty years?", "¿Cómo será el trabajo dentro de treinta años?", ["It's not inconceivable that...", "Assuming current trends continue,...", "Whatever the case,..."], ["What will disappear?", "What will emerge?", "How should we prepare?"]],
    ["Defend an unpopular opinion you hold.", "Defiende una opinión impopular que tengas.", ["I'm well aware that this may sound...", "Hear me out:...", "I'd go as far as to say..."], ["What is the opinion?", "Why do people disagree?", "What's your strongest argument?"]]
  ]
};
