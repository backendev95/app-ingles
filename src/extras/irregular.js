// ===== VERBOS IRREGULARES =====
// Formato: "base|pasado|participio|español". Si hay dos formas válidas, sepáralas con "/" (ej. learnt/learned).
const IRREGULAR = {
  A2: `be|was/were|been|ser / estar
have|had|had|tener / haber
do|did|done|hacer
say|said|said|decir
go|went|gone|ir
get|got|got/gotten|conseguir / llegar
make|made|made|hacer / fabricar
know|knew|known|saber / conocer
think|thought|thought|pensar
take|took|taken|tomar / llevar
see|saw|seen|ver
come|came|come|venir
give|gave|given|dar
find|found|found|encontrar
tell|told|told|decir / contar
become|became|become|convertirse en
leave|left|left|salir / dejar
feel|felt|felt|sentir(se)
put|put|put|poner
bring|brought|brought|traer
begin|began|begun|empezar
keep|kept|kept|mantener / guardar
hold|held|held|sostener
write|wrote|written|escribir
stand|stood|stood|estar de pie
hear|heard|heard|oír
let|let|let|dejar / permitir
mean|meant|meant|significar / querer decir
meet|met|met|conocer / reunirse
run|ran|run|correr
pay|paid|paid|pagar
sit|sat|sat|sentarse
speak|spoke|spoken|hablar
lose|lost|lost|perder
buy|bought|bought|comprar
eat|ate|eaten|comer
drink|drank|drunk|beber
sleep|slept|slept|dormir
drive|drove|driven|conducir
read|read|read|leer (el pasado se pronuncia «red»)
swim|swam|swum|nadar
sing|sang|sung|cantar
teach|taught|taught|enseñar
understand|understood|understood|entender
wear|wore|worn|llevar puesto
win|won|won|ganar
send|sent|sent|enviar
spend|spent|spent|gastar / pasar (tiempo)
sell|sold|sold|vender
cost|cost|cost|costar
cut|cut|cut|cortar
fly|flew|flown|volar
forget|forgot|forgotten|olvidar
set|set|set|poner / establecer`,
  B1: `break|broke|broken|romper
build|built|built|construir
catch|caught|caught|atrapar / tomar (bus)
choose|chose|chosen|elegir
draw|drew|drawn|dibujar
fall|fell|fallen|caer
feed|fed|fed|alimentar
fight|fought|fought|pelear
forgive|forgave|forgiven|perdonar
freeze|froze|frozen|congelar
grow|grew|grown|crecer / cultivar
hide|hid|hidden|esconder
hit|hit|hit|golpear
hurt|hurt|hurt|doler / lastimar
lead|led|led|liderar / conducir
learn|learnt/learned|learnt/learned|aprender
lend|lent|lent|prestar
light|lit|lit|encender
ride|rode|ridden|montar (bici, caballo)
ring|rang|rung|sonar / llamar
rise|rose|risen|subir / elevarse
shake|shook|shaken|sacudir / temblar
shoot|shot|shot|disparar
show|showed|shown|mostrar
shut|shut|shut|cerrar
steal|stole|stolen|robar
throw|threw|thrown|lanzar
wake|woke|woken|despertar(se)
burn|burnt/burned|burnt/burned|quemar
dream|dreamt/dreamed|dreamt/dreamed|soñar
smell|smelt/smelled|smelt/smelled|oler
spell|spelt/spelled|spelt/spelled|deletrear
forbid|forbade|forbidden|prohibir
bite|bit|bitten|morder
blow|blew|blown|soplar
hang|hung|hung|colgar
beat|beat|beaten|vencer / golpear
bleed|bled|bled|sangrar
mistake|mistook|mistaken|confundir`,
  B2: `arise|arose|arisen|surgir
bear|bore|borne|soportar
bend|bent|bent|doblar
bet|bet|bet|apostar
bind|bound|bound|atar / obligar
breed|bred|bred|criar
deal|dealt|dealt|tratar / repartir
dig|dug|dug|cavar
flee|fled|fled|huir
forecast|forecast|forecast|pronosticar
lay|laid|laid|colocar / poner
lean|leant/leaned|leant/leaned|inclinarse / apoyarse
overcome|overcame|overcome|superar
seek|sought|sought|buscar
shrink|shrank|shrunk|encoger
sink|sank|sunk|hundir(se)
slide|slid|slid|deslizar(se)
spin|spun|spun|girar
split|split|split|dividir
spread|spread|spread|extender / difundir
stick|stuck|stuck|pegar / atascarse
sting|stung|stung|picar (insecto)
strike|struck|struck|golpear / impactar
swear|swore|sworn|jurar / decir groserías
tear|tore|torn|rasgar
undertake|undertook|undertaken|emprender
upset|upset|upset|molestar / alterar
weep|wept|wept|llorar
withdraw|withdrew|withdrawn|retirar
foresee|foresaw|foreseen|prever
mislead|misled|misled|engañar / despistar`
};
