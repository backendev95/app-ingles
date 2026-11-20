// ===== VOCABULARIO VISUAL (diccionario con imágenes) =====
// Va en un archivo que carga después de vocab_more.js para no cambiar los identificadores de las tarjetas existentes.
// Formato: inglés|español|ejemplo|emoji
const VISUAL_VOCAB = {
  A2: `
# 🖼️ La casa
sofa|sofá|Let's sit on the sofa.|🛋️
bed|cama|I make my bed every morning.|🛏️
chair|silla|Pull up a chair.|🪑
door|puerta|Close the door, please.|🚪
window|ventana|Open the window, it's hot.|🪟
mirror|espejo|She looked in the mirror.|🪞
key|llave|I can't find my keys.|🔑
lamp|lámpara|Turn on the lamp.|💡
shower|ducha|I take a shower every morning.|🚿
bathtub|bañera|The bathtub is full.|🛁
toilet|inodoro / baño|Where's the toilet?|🚽
fridge|nevera|Put the milk in the fridge.|🧊
broom|escoba|Where's the broom?|🧹
bucket|balde|Fill the bucket with water.|🪣
sponge|esponja|Use a sponge to wash the dishes.|🧽
soap|jabón|Wash your hands with soap.|🧼
towel|toalla|Can I have a clean towel?|🛀
plant|planta|Water the plants on Sunday.|🪴
# 🖼️ Comida y bebida
bread|pan|I'll buy some bread.|🍞
cheese|queso|Do you like cheese?|🧀
egg|huevo|I had two eggs for breakfast.|🥚
rice|arroz|Rice and beans, please.|🍚
chicken|pollo|Grilled chicken with salad.|🍗
fish|pescado|We had fish for dinner.|🐟
meat|carne|I don't eat much meat.|🥩
salt|sal|Pass the salt, please.|🧂
apple|manzana|An apple a day…|🍎
banana|banano|Bananas are cheap here.|🍌
strawberry|fresa|Strawberries with cream.|🍓
grapes|uvas|A bunch of grapes.|🍇
lemon|limón|Add some lemon juice.|🍋
pineapple|piña|Pineapple juice is my favourite.|🍍
avocado|aguacate|Avocado on toast.|🥑
tomato|tomate|Cut the tomatoes.|🍅
carrot|zanahoria|Rabbits love carrots.|🥕
potato|papa|Mashed potatoes.|🥔
corn|maíz|Corn on the cob.|🌽
onion|cebolla|Chop the onion.|🧅
garlic|ajo|A clove of garlic.|🧄
mushroom|champiñón|Mushroom soup.|🍄
soup|sopa|Hot soup for a cold day.|🍲
coffee|café|A cup of coffee, please.|☕
tea|té|Would you like some tea?|🍵
juice|jugo|Orange juice, no sugar.|🧃
milk|leche|Do you take milk?|🥛
water|agua|A glass of water, please.|💧
cake|torta / pastel|Birthday cake!|🎂
ice cream|helado|Chocolate ice cream.|🍦
cookie|galleta|She baked cookies.|🍪
# 🖼️ Ropa
shirt|camisa|A white shirt.|👔
T-shirt|camiseta|A cotton T-shirt.|👕
trousers|pantalones|Black trousers.|👖
dress|vestido|A red dress.|👗
shoes|zapatos|New shoes.|👞
trainers|tenis|Running trainers.|👟
boots|botas|Winter boots.|🥾
socks|medias|A pair of socks.|🧦
coat|abrigo|Take your coat, it's cold.|🧥
hat|sombrero|A straw hat.|👒
cap|gorra|A baseball cap.|🧢
scarf|bufanda|A wool scarf.|🧣
gloves|guantes|Wear gloves.|🧤
glasses|gafas|I need my glasses to read.|👓
bag|bolso|Where's my bag?|👜
backpack|mochila|A heavy backpack.|🎒
wallet|billetera|I lost my wallet.|👛
ring|anillo|A wedding ring.|💍
watch|reloj de pulsera|My watch is slow.|⌚
# 🖼️ El cuerpo
head|cabeza|My head hurts.|🗣️
eye|ojo|She has blue eyes.|👁️
ear|oreja / oído|My ear hurts.|👂
nose|nariz|A runny nose.|👃
mouth|boca|Open your mouth.|👄
tooth|diente|I broke a tooth.|🦷
hand|mano|Raise your hand.|✋
arm|brazo|I broke my arm.|💪
leg|pierna|My leg hurts.|🦵
foot|pie|On foot.|🦶
brain|cerebro|Use your brain!|🧠
heart|corazón|My heart is beating fast.|❤️
bone|hueso|A broken bone.|🦴
# 🖼️ Lugares
house|casa|A big house.|🏠
building|edificio|A tall building.|🏢
hospital|hospital|He's in hospital.|🏥
school|colegio|The kids are at school.|🏫
bank|banco|I need to go to the bank.|🏦
hotel|hotel|A cheap hotel.|🏨
church|iglesia|An old church.|⛪
supermarket|supermercado|I'll go to the supermarket.|🛒
park|parque|Let's go to the park.|🏞️
beach|playa|A day at the beach.|🏖️
mountain|montaña|We climbed the mountain.|⛰️
river|río|A long river.|🏞️
island|isla|A small island.|🏝️
city|ciudad|A busy city.|🏙️
bridge|puente|Cross the bridge.|🌉
stadium|estadio|The stadium was full.|🏟️
airport|aeropuerto|Take me to the airport.|🛫
library|biblioteca|I study at the library.|📚
museum|museo|A science museum.|🏛️
# 🖼️ Transporte
car|carro|A fast car.|🚗
bus|bus|I take the bus to work.|🚌
taxi|taxi|Let's get a taxi.|🚕
train|tren|The train is late.|🚆
plane|avión|The plane took off.|✈️
bike|bicicleta|I ride my bike to work.|🚲
motorbike|moto|He has a motorbike.|🏍️
boat|bote / barco|A small boat.|⛵
truck|camión|A delivery truck.|🚚
underground|metro|Take the underground.|🚇
# 🖼️ Naturaleza y animales
sun|sol|The sun is shining.|☀️
moon|luna|A full moon.|🌙
star|estrella|Look at the stars.|⭐
rain|lluvia|Heavy rain.|🌧️
snow|nieve|It's snowing.|❄️
tree|árbol|A tall tree.|🌳
flower|flor|A bunch of flowers.|🌸
leaf|hoja|Autumn leaves.|🍂
sea|mar|The sea is calm.|🌊
dog|perro|My dog is friendly.|🐕
cat|gato|The cat is sleeping.|🐈
bird|pájaro|A little bird.|🐦
horse|caballo|He rides a horse.|🐴
cow|vaca|Cows eat grass.|🐄
pig|cerdo|A pink pig.|🐖
chicken (animal)|gallina|The hen laid an egg.|🐔
butterfly|mariposa|A beautiful butterfly.|🦋
bee|abeja|A bee stung me.|🐝
snake|serpiente|A long snake.|🐍
monkey|mono|The monkey ate a banana.|🐒
# 🖼️ Acciones cotidianas
wake up|despertarse|I wake up at six.|⏰
sleep|dormir|I sleep eight hours.|😴
eat|comer|Let's eat!|🍽️
drink|beber|Drink more water.|🥤
cook|cocinar|I love to cook.|🧑‍🍳
wash|lavar|Wash your hands.|🧼
brush your teeth|cepillarse los dientes|Brush your teeth twice a day.|🪥
walk|caminar|I walk to work.|🚶
run|correr|I run every morning.|🏃
swim|nadar|Can you swim?|🏊
dance|bailar|Let's dance!|💃
sing|cantar|She sings beautifully.|🎤
read|leer|I read before bed.|📖
write|escribir|Write your name.|✍️
listen|escuchar|Listen carefully.|👂
speak|hablar|Speak slowly, please.|🗣️
call|llamar (por teléfono)|Call me later.|📞
buy|comprar|I bought a new phone.|🛍️
drive|manejar|Can you drive?|🚗
open|abrir|Open the box.|📦
close|cerrar|Close your eyes.|🚪
push (a door)|empujar|Push the door.|👐
pull (a door)|halar|Pull, don't push!|🫳
throw|lanzar|Throw the ball!|⚾
catch (a ball)|atrapar|Catch!|🧤
climb|escalar / subir|Climb the stairs.|🧗
fall|caerse|Be careful, don't fall!|🤕
laugh|reír|We laughed a lot.|😂
cry|llorar|The baby is crying.|😢
smile|sonreír|Smile for the photo!|😊
think|pensar|Let me think.|🤔
hug|abrazar|Give me a hug!|🤗
kiss|besar|She kissed him.|😘
wave (your hand)|saludar con la mano|She waved goodbye.|👋
point|señalar|Don't point at people.|👉
clap|aplaudir|Everyone clapped.|👏
`,
  B1: `
# 🖼️ Herramientas y objetos
hammer|martillo|Pass me the hammer.|🔨
screwdriver|destornillador|I need a screwdriver.|🪛
saw|serrucho|Cut the wood with a saw.|🪚
ladder|escalera (de mano)|Hold the ladder.|🪜
nail|clavo|Hit the nail.|📌
scissors|tijeras|Where are the scissors?|✂️
knife|cuchillo|A sharp knife.|🔪
fork|tenedor|A knife and fork.|🍴
spoon|cuchara|A wooden spoon.|🥄
plate|plato|A dirty plate.|🍽️
glass|vaso|A glass of wine.|🥂
cup|taza|A cup of tea.|☕
pan|sartén|Heat the oil in a pan.|🍳
candle|vela|Light a candle.|🕯️
battery|batería / pila|My battery is low.|🔋
plug|enchufe|Is it plugged in?|🔌
magnifying glass|lupa|Look with a magnifying glass.|🔍
lock|candado / cerradura|Lock the door.|🔒
envelope|sobre|Put the letter in an envelope.|✉️
parcel|paquete|A parcel arrived for you.|📦
map|mapa|Look at the map.|🗺️
compass|brújula|Use the compass.|🧭
tent|carpa|We slept in a tent.|⛺
rope|cuerda|Tie it with a rope.|🪢
thread|hilo|A needle and thread.|🧵
pillow|almohada|A soft pillow.|🛏️
blanket|cobija|Can I have another blanket?|🧣
# 🖼️ Profesiones
doctor|médico|See a doctor.|🧑‍⚕️
nurse|enfermero/a|The nurse took my blood.|🩺
teacher|profesor|My English teacher.|🧑‍🏫
farmer|agricultor|Farmers grow food.|🧑‍🌾
chef|chef|The chef cooked for us.|🧑‍🍳
firefighter|bombero|Call the firefighters!|🧑‍🚒
police officer|policía|Ask a police officer.|👮
pilot|piloto|The pilot spoke to us.|🧑‍✈️
mechanic|mecánico|The mechanic fixed my car.|🧑‍🔧
scientist|científico|A famous scientist.|🧑‍🔬
artist|artista|A talented artist.|🧑‍🎨
judge|juez|The judge made a decision.|🧑‍⚖️
# 🖼️ Acciones y verbos de movimiento
jump|saltar|Jump as high as you can.|🦘
kick|patear|Kick the ball.|⚽
lift|levantar|Lift with your legs.|🏋️
shake hands|dar la mano|They shook hands.|🤝
knock|tocar (la puerta)|Knock before you enter.|🚪
dig|cavar|The dog is digging.|⛏️
pour|servir / verter|Pour the coffee.|🫗
stir|revolver|Stir the soup.|🥄
chop|picar|Chop the vegetables.|🔪
fold|doblar|Fold your clothes.|👕
hang (up)|colgar|Hang your coat here.|🧥
tie|amarrar|Tie your shoes.|👟
shout|gritar|Don't shout!|📢
whisper|susurrar|She whispered a secret.|🤫
yawn|bostezar|He yawned all through the movie.|🥱
sneeze|estornudar|Bless you! You sneezed.|🤧
cough|toser|I can't stop coughing.|😷
sweat|sudar|I sweat a lot when I run.|😅
shiver|temblar (de frío)|I was shivering.|🥶
bow|hacer una reverencia|The actors bowed.|🙇
kneel|arrodillarse|He knelt down.|🧎
`
};
(() => {
  const PIC_EXTRA = {};
  Object.entries(VISUAL_VOCAB).forEach(([lv, txt]) => {
    let lines = [];
    txt.trim().split("\n").forEach((line) => {
      if (line.startsWith("#")) { lines.push(line); return; }
      const [en, es, ex, pic] = line.split("|");
      if (!pic) return;
      lines.push([en, es, ex].join("|"));
      PIC_EXTRA[en.toLowerCase()] = pic;
    });
    VOCAB[lv] += "\n" + lines.join("\n") + "\n";
  });
  globalThis.PIC_VISUAL = PIC_EXTRA;
})();
