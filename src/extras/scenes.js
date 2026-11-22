// ===== CONVERSACIONES CON RAMIFICACIONES Y MAPA DE SITUACIONES =====
// Cada nodo: npc = lo que dice el personaje; task = qué debes hacer (opcional);
// opts = caminos posibles. Lo que digas se compara con las frases de cada camino y la conversación sigue por el más parecido.
// Un nodo con end: true cierra la conversación.
const MAP_PLACES = [
  { id: "cafe", name: "Cafetería", icon: "☕", x: 14, y: 18 },
  { id: "restaurant", name: "Restaurante", icon: "🍽️", x: 40, y: 12 },
  { id: "party", name: "Fiesta", icon: "🎉", x: 70, y: 16 },
  { id: "shop", name: "Tienda de ropa", icon: "🛍️", x: 88, y: 34 },
  { id: "pharmacy", name: "Farmacia", icon: "💊", x: 12, y: 46 },
  { id: "station", name: "Estación de tren", icon: "🚉", x: 38, y: 40 },
  { id: "taxi", name: "Taxi", icon: "🚕", x: 62, y: 44 },
  { id: "doctor", name: "Consultorio", icon: "🩺", x: 16, y: 74 },
  { id: "hotel", name: "Hotel", icon: "🏨", x: 42, y: 70 },
  { id: "airport", name: "Aeropuerto", icon: "✈️", x: 84, y: 64 },
  { id: "office", name: "Oficina", icon: "🏢", x: 64, y: 82 },
  { id: "forum", name: "Auditorio", icon: "🎤", x: 88, y: 90 }
];
// Conversaciones que ya existían, ubicadas en el mapa
const MAP_EXTRA = { restaurant: ["A2-p0"], party: ["A2-p1"], hotel: ["B1-p1"], office: ["B1-p0", "B2-p0", "C1-p0", "dev-p0", "dev-p1", "dev-p2", "dev-p3", "dev-p4", "dev-p5"], forum: ["B2-p1", "C1-p1", "C2-p0", "C2-p1"] };

const SCENES = [
  { id: "sc-cafe", place: "cafe", level: "A2", title: "Pedir un café", intro: "Entras a una cafetería en Nueva York. Hay fila y el barista es muy rápido.", start: "a", nodes: {
    a: { npc: "Hi there! What can I get you today?", task: "Pide una bebida o pregunta qué te recomienda.", opts: [
      { label: "Pedir un café directamente", say: ["Can I get a latte, please?", "I'd like a cappuccino, please.", "A medium black coffee, please.", "Can I have an iced coffee, please?"], next: "size" },
      { label: "Preguntar qué te recomienda", say: ["What do you recommend?", "What's popular here?", "What's your favourite drink here?", "I'm not sure. What's good?"], next: "rec" } ] },
    rec: { npc: "Our caramel latte is really popular. We also have a great cold brew if you want something less sweet.", task: "Elige una de las dos opciones.", opts: [
      { label: "Elegir el latte de caramelo", say: ["I'll try the caramel latte, please.", "The caramel latte sounds good.", "I'll have the caramel latte."], next: "size" },
      { label: "Elegir el cold brew", say: ["I'll go for the cold brew.", "The cold brew, please.", "Something less sweet. The cold brew, please."], next: "size" } ] },
    size: { npc: "Sure! What size would you like? Small, medium or large?", task: "Di el tamaño y pide algo de comer, si quieres.", opts: [
      { label: "Decir solo el tamaño", say: ["Medium, please.", "A small one, please.", "Large, please."], next: "name" },
      { label: "Tamaño y algo de comer", say: ["Medium, please. And can I get a blueberry muffin too?", "Large, please, and a croissant.", "Small, please. Do you have any sandwiches?"], next: "food" } ] },
    food: { npc: "Of course! Do you want it warmed up?", task: "Responde si quieres que lo calienten.", opts: [
      { label: "Sí, caliéntenlo", say: ["Yes, please.", "Yes, warm it up, please.", "Sure, that would be great."], next: "name" },
      { label: "No, así está bien", say: ["No, thanks. It's fine like that.", "No, that's okay.", "No, thank you."], next: "name" } ] },
    name: { npc: "Great. Can I get a name for the order? And is that for here or to go?", task: "Di tu nombre y si es para tomar aquí o para llevar.", opts: [
      { label: "Para tomar aquí", say: ["It's Daniel. For here, please.", "My name is Sofia, and it's for here.", "Carlos. I'll have it here."], next: "pay" },
      { label: "Para llevar", say: ["It's Daniel. To go, please.", "Sofia, and it's to go.", "Carlos. Take away, please."], next: "pay" } ] },
    pay: { npc: "Perfect. That'll be seven fifty. Cash or card?", task: "Paga y da las gracias.", opts: [
      { label: "Pagar con tarjeta", say: ["Card, please.", "I'll pay by card.", "Can I pay with my phone?"], next: "end" },
      { label: "Pagar en efectivo", say: ["Cash. Here you go.", "Here's ten. Keep the change.", "In cash, please."], next: "end" } ] },
    end: { npc: "Thanks! Your order will be ready at the end of the counter. Have a great day!", end: true } } },

  { id: "sc-taxi", place: "taxi", level: "A2", title: "Tomar un taxi", intro: "Acabas de llegar a Londres y tomas un taxi en la calle.", start: "a", nodes: {
    a: { npc: "Hello! Where to?", task: "Di a dónde vas.", opts: [
      { label: "Dar la dirección del hotel", say: ["To the Grand Hotel on Oxford Street, please.", "Can you take me to this address, please?", "The Grand Hotel, please."], next: "time" },
      { label: "Ir al centro primero", say: ["To the city centre, please.", "Can you take me downtown?", "I'd like to go to the centre."], next: "centre" } ] },
    centre: { npc: "The centre is big. Any particular place?", task: "Di un lugar concreto.", opts: [
      { label: "Una plaza o monumento", say: ["Trafalgar Square, please.", "Near Big Ben, please.", "Somewhere near the London Eye."], next: "time" },
      { label: "Cambiar al hotel", say: ["Actually, take me to my hotel, the Grand Hotel.", "Sorry, the Grand Hotel on Oxford Street.", "Let's go to my hotel first."], next: "time" } ] },
    time: { npc: "No problem. The traffic is heavy today, so it'll take about thirty minutes.", task: "Pregunta el precio o si puede ir más rápido.", opts: [
      { label: "Preguntar cuánto cuesta", say: ["How much will it cost?", "How much is it, more or less?", "What's the price, roughly?"], next: "price" },
      { label: "Pedir que vaya rápido", say: ["I'm in a hurry. Is there a faster way?", "Can we go a bit faster?", "Is there a quicker route?"], next: "fast" } ] },
    price: { npc: "Probably around twenty-five pounds, depending on traffic.", task: "Pregunta si aceptan tarjeta.", opts: [
      { label: "Preguntar por tarjeta", say: ["Can I pay by card?", "Do you take credit cards?", "Is it okay to pay with card?"], next: "arrive" } ] },
    fast: { npc: "I can take the river road. It's a bit longer but usually quicker.", task: "Acepta la propuesta.", opts: [
      { label: "Aceptar", say: ["Okay, that sounds good.", "Yes, let's do that.", "Great, thank you."], next: "arrive" } ] },
    arrive: { npc: "Here we are! That's twenty-three pounds.", task: "Paga, deja propina o pide un recibo.", opts: [
      { label: "Pagar y pedir recibo", say: ["Here you are. Can I have a receipt, please?", "Could I get a receipt?", "Card, please, and a receipt."], next: "end" },
      { label: "Pagar y dejar propina", say: ["Here's twenty-five. Keep the change.", "Keep the change. Thank you!", "Thanks a lot. Keep the change."], next: "end" } ] },
    end: { npc: "Thank you! Enjoy your stay in London.", end: true } } },

  { id: "sc-shop", place: "shop", level: "A2", title: "Comprar ropa", intro: "Estás en una tienda de ropa buscando una chaqueta.", start: "a", nodes: {
    a: { npc: "Hi! Are you looking for anything in particular?", task: "Di qué buscas o que solo estás mirando.", opts: [
      { label: "Buscar una chaqueta", say: ["Yes, I'm looking for a jacket.", "I need a winter jacket.", "Do you have any jackets?"], next: "jacket" },
      { label: "Solo mirar", say: ["I'm just looking, thanks.", "Just browsing, thank you.", "I'm only looking for now."], next: "browse" } ] },
    browse: { npc: "No problem. Let me know if you need help. By the way, jackets are twenty percent off today.", task: "Muestra interés por las chaquetas.", opts: [
      { label: "Preguntar por las chaquetas", say: ["Really? Where are the jackets?", "Oh, can you show me the jackets?", "Great, I'd like to see the jackets."], next: "jacket" } ] },
    jacket: { npc: "They're over here. What size are you?", task: "Di tu talla.", opts: [
      { label: "Decir la talla", say: ["I'm a medium.", "Medium, I think.", "Small, please.", "I usually wear a large."], next: "try" },
      { label: "No sé mi talla", say: ["I'm not sure. Maybe a medium?", "I don't know my size here.", "Can you help me with the size?"], next: "measure" } ] },
    measure: { npc: "These run a bit small, so I'd try a large.", task: "Pide probártela.", opts: [
      { label: "Pedir el probador", say: ["Can I try it on?", "Where are the fitting rooms?", "Okay, I'll try a large."], next: "fit" } ] },
    try: { npc: "Here you are. Would you like to try it on?", task: "Responde.", opts: [
      { label: "Sí, probarla", say: ["Yes, please. Where are the fitting rooms?", "Sure, I'll try it on.", "Yes, thank you."], next: "fit" } ] },
    fit: { npc: "How does it fit?", task: "Di cómo te queda.", opts: [
      { label: "Te queda bien, la compras", say: ["It fits perfectly. I'll take it.", "It's great. I'll buy it.", "I love it. I'll take it."], next: "pay" },
      { label: "Te queda grande o pequeña", say: ["It's a bit too big. Do you have a smaller size?", "It's too small. Do you have it in a bigger size?", "It doesn't fit very well."], next: "other" } ] },
    other: { npc: "Let me check... Yes, here's the other size. This one looks better!", task: "Decide comprarla.", opts: [
      { label: "Comprarla", say: ["Yes, much better. I'll take it.", "Perfect, I'll buy this one.", "This one is great. I'll take it."], next: "pay" } ] },
    pay: { npc: "Great choice! With the discount, it's forty-eight dollars. Would you like a bag?", task: "Responde y paga.", opts: [
      { label: "Sí, una bolsa", say: ["Yes, please. Here's my card.", "Yes, a bag, please.", "Sure. Can I pay by card?"], next: "end" },
      { label: "No necesitas bolsa", say: ["No, thanks. I'll wear it now.", "No bag, thank you.", "No, I have my own bag."], next: "end" } ] },
    end: { npc: "Here's your receipt. You can return it within thirty days. Have a nice day!", end: true } } },

  { id: "sc-pharmacy", place: "pharmacy", level: "A2", title: "En la farmacia", intro: "No te sientes bien y entras a una farmacia.", start: "a", nodes: {
    a: { npc: "Good morning. How can I help you?", task: "Explica qué te pasa.", opts: [
      { label: "Dolor de cabeza", say: ["I have a terrible headache.", "My head hurts a lot.", "I've had a headache since yesterday."], next: "head" },
      { label: "Resfriado y dolor de garganta", say: ["I have a cold and a sore throat.", "I think I have a cold. My throat hurts.", "I've got a sore throat and a runny nose."], next: "cold" } ] },
    head: { npc: "I'm sorry to hear that. Are you allergic to any medicine?", task: "Responde.", opts: [
      { label: "No eres alérgico", say: ["No, I'm not allergic to anything.", "No, I don't have any allergies.", "Not that I know of."], next: "pills" },
      { label: "Eres alérgico a algo", say: ["Yes, I'm allergic to aspirin.", "I'm allergic to penicillin.", "Yes, to ibuprofen."], next: "pills" } ] },
    cold: { npc: "Do you have a fever?", task: "Responde.", opts: [
      { label: "Sí, tienes fiebre", say: ["Yes, a little.", "I think so. I feel hot.", "Yes, I had a fever last night."], next: "doctor" },
      { label: "No tienes fiebre", say: ["No, I don't.", "No fever, just a sore throat.", "No, I don't think so."], next: "pills" } ] },
    doctor: { npc: "Then I'd recommend seeing a doctor if it doesn't get better in two days. For now, take these.", task: "Pregunta cómo tomarlas.", opts: [
      { label: "Preguntar la dosis", say: ["How often should I take them?", "How many should I take?", "When do I take them?"], next: "dose" } ] },
    pills: { npc: "These tablets should help. They're very effective.", task: "Pregunta cómo tomarlas.", opts: [
      { label: "Preguntar la dosis", say: ["How often should I take them?", "How many should I take a day?", "Should I take them with food?"], next: "dose" } ] },
    dose: { npc: "One tablet every eight hours, after meals. Don't take more than three a day.", task: "Confirma y paga.", opts: [
      { label: "Confirmar y preguntar el precio", say: ["Okay, one every eight hours. How much is it?", "Got it. How much do I owe you?", "Thank you. How much are they?"], next: "end" } ] },
    end: { npc: "That's six dollars. I hope you feel better soon!", end: true } } },

  { id: "sc-station", place: "station", level: "A2", title: "Comprar un tiquete de tren", intro: "Estás en la estación y quieres ir a Oxford.", start: "a", nodes: {
    a: { npc: "Next, please! Where are you travelling to?", task: "Di a dónde vas y qué tipo de tiquete quieres.", opts: [
      { label: "Ida solamente", say: ["A single to Oxford, please.", "One-way ticket to Oxford, please.", "I need a ticket to Oxford, just one way."], next: "when" },
      { label: "Ida y vuelta", say: ["A return ticket to Oxford, please.", "Round trip to Oxford, please.", "I'd like a return to Oxford."], next: "back" } ] },
    back: { npc: "When are you coming back?", task: "Di cuándo regresas.", opts: [
      { label: "El mismo día", say: ["Today, in the evening.", "I'm coming back today.", "Later today."], next: "when" },
      { label: "Otro día", say: ["On Sunday.", "Next Friday.", "In three days."], next: "when" } ] },
    when: { npc: "The next train leaves at 10:15, or there's a cheaper one at 11:40.", task: "Elige un tren.", opts: [
      { label: "El de las 10:15", say: ["The 10:15, please.", "I'll take the first one.", "I'd prefer the earlier train."], next: "platform" },
      { label: "El más barato", say: ["The cheaper one, please.", "I'll take the 11:40.", "I don't mind waiting. The cheaper one."], next: "platform" } ] },
    platform: { npc: "Here's your ticket. That's thirty-two pounds.", task: "Paga y pregunta de qué andén sale.", opts: [
      { label: "Preguntar el andén", say: ["Which platform does it leave from?", "What platform is it?", "Where does the train leave from?"], next: "end" } ] },
    end: { npc: "Platform four. Check the screens in case it changes. Have a good trip!", end: true } } },

  { id: "sc-airport", place: "airport", level: "B1", title: "Check-in en el aeropuerto", intro: "Llegas al mostrador de la aerolínea para tu vuelo a Toronto.", start: "a", nodes: {
    a: { npc: "Good afternoon. Can I see your passport and booking reference, please?", task: "Entrega los documentos.", opts: [
      { label: "Entregar documentos", say: ["Sure, here you are.", "Here's my passport and my booking reference.", "Of course. Here they are."], next: "bags" },
      { label: "No encuentras la reserva", say: ["Here's my passport, but I can't find my booking reference.", "I don't have the reference number. Is my passport enough?", "Sorry, I think I lost the booking email."], next: "noref" } ] },
    noref: { npc: "That's fine, I can find it with your passport. Here it is. Are you checking any bags?", task: "Responde sobre el equipaje.", opts: [
      { label: "Una maleta", say: ["Yes, just this suitcase.", "One bag, please.", "Yes, I'm checking one suitcase."], next: "weight" },
      { label: "Solo equipaje de mano", say: ["No, only hand luggage.", "Just this carry-on.", "No bags to check."], next: "seat" } ] },
    bags: { npc: "Thank you. Are you checking any bags today?", task: "Responde sobre el equipaje.", opts: [
      { label: "Una maleta", say: ["Yes, just this suitcase.", "One bag, please.", "Yes, I'm checking one suitcase."], next: "weight" },
      { label: "Solo equipaje de mano", say: ["No, only hand luggage.", "Just this carry-on.", "No bags to check."], next: "seat" } ] },
    weight: { npc: "I'm afraid your bag is two kilos over the limit. There's a fee of forty dollars.", task: "Paga o busca una solución.", opts: [
      { label: "Sacar algunas cosas", say: ["Can I take some things out and put them in my hand luggage?", "Let me move some things to my backpack.", "Is it okay if I take a few things out?"], next: "fixed" },
      { label: "Pagar el cargo", say: ["Okay, I'll pay the fee.", "That's fine. Can I pay by card?", "No problem, I'll pay."], next: "seat" } ] },
    fixed: { npc: "Sure, go ahead... Perfect, it's under the limit now.", task: "Agradece.", opts: [
      { label: "Agradecer", say: ["Great, thank you so much.", "Thanks for your help.", "Perfect, thanks."], next: "seat" } ] },
    seat: { npc: "Would you prefer a window or an aisle seat?", task: "Elige tu asiento.", opts: [
      { label: "Ventana", say: ["A window seat, please.", "I'd like a window seat.", "Window, if possible."], next: "gate" },
      { label: "Pasillo", say: ["An aisle seat, please.", "I'd prefer the aisle.", "Aisle, please. I have long legs."], next: "gate" } ] },
    gate: { npc: "Done. Here's your boarding pass. Boarding starts at 3:40 at gate B12.", task: "Pregunta algo útil antes de irte.", opts: [
      { label: "Preguntar si el vuelo está a tiempo", say: ["Is the flight on time?", "Is there any delay?", "Is everything on schedule?"], next: "end" },
      { label: "Preguntar cómo llegar a la puerta", say: ["How do I get to gate B12?", "Which way is gate B12?", "Is the gate far from here?"], next: "end" } ] },
    end: { npc: "It's on time, and the gate is about ten minutes past security. Have a pleasant flight!", end: true } } },

  { id: "sc-hotel", place: "hotel", level: "B1", title: "Registrarse en el hotel", intro: "Llegas a la recepción del hotel después de un vuelo largo.", start: "a", nodes: {
    a: { npc: "Welcome to the Riverside Hotel! Do you have a reservation?", task: "Di que sí y da tu nombre, o que no tienes reserva.", opts: [
      { label: "Tienes reserva", say: ["Yes, I have a reservation under the name García.", "Yes, it's under Sofia García.", "I booked a room for three nights. My name is García."], next: "id" },
      { label: "No tienes reserva", say: ["No, I don't. Do you have any rooms available?", "I don't have a reservation. Is there a room for tonight?", "No. Do you have a free room?"], next: "walkin" } ] },
    walkin: { npc: "Let me check... We have a double room with a city view for one hundred and twenty dollars a night.", task: "Acepta o pregunta por algo más barato.", opts: [
      { label: "Aceptar", say: ["That's fine. I'll take it.", "Okay, I'll take the room.", "Perfect, one night, please."], next: "id" },
      { label: "Pedir algo más barato", say: ["Do you have anything cheaper?", "Is there a cheaper room?", "That's a bit expensive. Anything less?"], next: "cheap" } ] },
    cheap: { npc: "We have a smaller room without a view for ninety dollars.", task: "Decide.", opts: [
      { label: "Tomar la más barata", say: ["That's fine, I'll take that one.", "The cheaper one is perfect.", "Okay, I don't need a view."], next: "id" } ] },
    id: { npc: "Great. Could I see your ID and a credit card for incidentals, please?", task: "Entrégalos y pregunta por el desayuno.", opts: [
      { label: "Preguntar por el desayuno", say: ["Here you are. Is breakfast included?", "Sure. What time is breakfast?", "Here they are. Does the price include breakfast?"], next: "breakfast" },
      { label: "Preguntar por el wifi", say: ["Here you are. Is there free Wi-Fi?", "Sure. What's the Wi-Fi password?", "Here they are. Does the room have Wi-Fi?"], next: "wifi" } ] },
    breakfast: { npc: "Yes, breakfast is included. It's served from seven to ten in the restaurant on the ground floor.", task: "Pregunta a qué hora debes dejar la habitación.", opts: [
      { label: "Preguntar el check-out", say: ["What time is check-out?", "When do I have to leave the room?", "Is late check-out possible?"], next: "end" } ] },
    wifi: { npc: "Yes, it's free. The password is on your key card holder.", task: "Pregunta a qué hora debes dejar la habitación.", opts: [
      { label: "Preguntar el check-out", say: ["What time is check-out?", "When do I have to leave the room?", "Is late check-out possible?"], next: "end" } ] },
    end: { npc: "Check-out is at eleven, but I can give you until one if you need it. Here's your key: room 512. Enjoy your stay!", end: true } } },

  { id: "sc-doctor", place: "doctor", level: "B1", title: "Cita con el médico", intro: "Tienes una cita médica porque te duele la espalda.", start: "a", nodes: {
    a: { npc: "Hello, please take a seat. What seems to be the problem?", task: "Explica tu problema.", opts: [
      { label: "Dolor de espalda", say: ["I've had back pain for about a week.", "My lower back hurts, especially in the morning.", "I have a pain in my back."], next: "how" } ] },
    how: { npc: "I see. Did you do anything that might have caused it?", task: "Explica la posible causa.", opts: [
      { label: "Levantaste algo pesado", say: ["I think I lifted something too heavy.", "I helped a friend move and carried a lot of boxes.", "I lifted a heavy suitcase."], next: "exam" },
      { label: "Pasas muchas horas sentado", say: ["I sit at my computer all day.", "I work long hours sitting at a desk.", "I don't know. I sit a lot because of my job."], next: "desk" } ] },
    desk: { npc: "That's very common. How many hours a day do you sit, and do you take breaks?", task: "Responde con honestidad.", opts: [
      { label: "Muchas horas sin pausas", say: ["About ten hours, and I hardly ever take breaks.", "Too many hours. I rarely stand up.", "Eight or nine hours, almost without breaks."], next: "exam" } ] },
    exam: { npc: "Let me have a look... It seems to be a muscle problem, nothing serious.", task: "Pregunta qué debes hacer.", opts: [
      { label: "Preguntar el tratamiento", say: ["What should I do?", "Do I need any medicine?", "How can I make it better?"], next: "advice" },
      { label: "Preguntar si puedes hacer ejercicio", say: ["Can I still go to the gym?", "Is it okay to exercise?", "Should I stop running for a while?"], next: "advice" } ] },
    advice: { npc: "Take an anti-inflammatory for five days, avoid heavy lifting, and try some gentle stretching every day.", task: "Confirma y pregunta si debes volver.", opts: [
      { label: "Preguntar si debes volver", say: ["Should I come back for a check-up?", "Do I need another appointment?", "What if it doesn't get better?"], next: "end" } ] },
    end: { npc: "If it isn't better in two weeks, book another appointment and we'll do an X-ray. Take care!", end: true } } },

  { id: "sc-firstday", place: "office", level: "B1", title: "Primer día en el trabajo", intro: "Es tu primer día como desarrollador. Tu nueva jefa, Laura, te recibe.", start: "a", nodes: {
    a: { npc: "Welcome to the team! How was your trip here this morning?", task: "Saluda y responde.", opts: [
      { label: "Bien, sin problemas", say: ["Thank you! It was fine, no traffic at all.", "Thanks, it was easy. I took the subway.", "Pretty good, thanks. I'm excited to be here."], next: "tour" },
      { label: "Hubo un problema", say: ["Thanks! There was a lot of traffic, but I made it.", "The bus was late, but I'm here now.", "A bit stressful, to be honest. I got lost."], next: "lost" } ] },
    lost: { npc: "Oh no! Don't worry, it happens to everyone on the first day. Let me show you around.", task: "Agradece.", opts: [
      { label: "Agradecer", say: ["Thanks, that would be great.", "Thank you, I appreciate it.", "Great, thanks."], next: "tour" } ] },
    tour: { npc: "This is your desk, and that's the meeting room. Our daily stand-up is at 9:30. Any questions so far?", task: "Haz una pregunta sobre el trabajo.", opts: [
      { label: "Preguntar por tu primera tarea", say: ["What will I be working on first?", "What's my first task?", "Which project will I join?"], next: "task" },
      { label: "Preguntar por el horario", say: ["What are the working hours?", "Is the schedule flexible?", "Can I work from home some days?"], next: "hours" } ] },
    hours: { npc: "We're flexible. Most people work from nine to five, and you can work from home on Fridays.", task: "Ahora pregunta por tu primera tarea.", opts: [
      { label: "Preguntar por tu primera tarea", say: ["Great. What will I be working on first?", "Perfect. What's my first task?", "Nice. Which project will I join?"], next: "task" } ] },
    task: { npc: "This week, just set up your environment and fix a couple of small bugs. Tom will be your buddy.", task: "Responde mostrando entusiasmo.", opts: [
      { label: "Mostrar entusiasmo", say: ["Sounds good. I'm looking forward to it.", "Perfect. I'll talk to Tom right away.", "Great, I can't wait to start."], next: "end" },
      { label: "Pedir documentación", say: ["Is there any documentation I should read first?", "Where can I find the project documentation?", "Do you have a guide for new developers?"], next: "end" } ] },
    end: { npc: "There's a wiki with everything you need. Welcome aboard, and don't hesitate to ask questions!", end: true } } },

  { id: "sc-meeting-delay", place: "office", level: "B2", title: "Avisar un retraso en una reunión", intro: "Estás en una reunión con un cliente. Tu equipo no va a llegar a la fecha de entrega.", start: "a", nodes: {
    a: { npc: "So, are we still on track to launch the new feature next Monday?", task: "Da la mala noticia con tacto.", opts: [
      { label: "Admitir el retraso con tacto", say: ["I'm afraid we're running a bit behind schedule.", "Unfortunately, we won't be able to launch on Monday.", "To be honest, we've run into some problems and need more time."], next: "why" },
      { label: "Proponer lanzar una parte", say: ["We can launch part of it on Monday, but not everything.", "We could release a basic version on Monday.", "Most of it will be ready, but not all of it."], next: "partial" } ] },
    why: { npc: "That's disappointing. What happened?", task: "Explica la causa sin culpar a nadie.", opts: [
      { label: "Explicar el problema técnico", say: ["We found a security issue that we need to fix before going live.", "The payment integration turned out to be more complex than expected.", "We discovered a serious bug during testing."], next: "when" } ] },
    partial: { npc: "Which part wouldn't be ready?", task: "Explica qué faltaría.", opts: [
      { label: "Explicar qué faltaría", say: ["The reports section would come a week later.", "Everything except the payment integration.", "The admin panel would need one more week."], next: "when" } ] },
    when: { npc: "I see. When do you realistically think it will be ready?", task: "Da una fecha realista y ofrece algo.", opts: [
      { label: "Dar fecha y ofrecer reportes", say: ["By the end of next week. We'll send you daily updates in the meantime.", "We need about one more week, and I'll keep you posted every day.", "Realistically, next Friday. I'll share our progress daily."], next: "client" } ] },
    client: { npc: "Okay. I'd rather have it working properly than rushed. But I need to inform my boss today.", task: "Ofrece ayuda para esa comunicación.", opts: [
      { label: "Ofrecer un resumen escrito", say: ["I'll send you a short summary you can share with him.", "Would it help if I wrote a summary for your boss?", "I can join a call with your boss to explain."], next: "end" } ] },
    end: { npc: "That would be great, thanks. I appreciate your honesty.", end: true } } }
];
