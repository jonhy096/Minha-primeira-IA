let memoria = JSON.parse(localStorage.getItem("memoria")) || {};
let conexoes = JSON.parse(localStorage.getItem("conexoes")) || {};

let estado = JSON.parse(localStorage.getItem("estado")) || {
xp:0,
nivel:1,
humor:0
};

const chat = document.getElementById("chat");
const status = document.getElementById("status");

atualizarStatus();

function atualizarStatus(){

status.innerHTML =
"Nível: "+estado.nivel+
" | XP: "+estado.xp+
" | Humor: "+estado.humor+
" | Conhecimento: "+Object.keys(memoria).length;

}

function falar(texto,autor){

chat.innerHTML += "<p><b>"+autor+":</b> "+texto+"</p>";

chat.scrollTop = chat.scrollHeight;

if(autor === "IA"){
falarVoz(texto);
}

}

function falarVoz(texto){

let voz = new SpeechSynthesisUtterance(texto);

voz.lang = "pt-BR";

speechSynthesis.speak(voz);

}

function ganharXP(){

estado.xp++;

if(estado.xp > estado.nivel * 6){

estado.nivel++;

falar("Estou evoluindo... agora sou nível "+estado.nivel+" 🤖","IA");

}

salvar();

}

function ajustarHumor(msg){

if(msg.includes("legal") || msg.includes("bom") || msg.includes("kk"))
estado.humor++;

if(msg.includes("ruim") || msg.includes("odeio"))
estado.humor--;

}

function detectarEstilo(msg){

if(msg.includes("kk") || msg.includes("haha")) return "animado";

if(msg.length > 70) return "explicativo";

return "normal";

}

function adaptar(resposta,estilo){

if(estilo === "animado") return resposta+" kk";

if(estilo === "explicativo") return resposta+" Posso explicar melhor.";

return resposta;

}

function aprenderConceitos(msg){

let palavras = msg.split(" ");

for(let p of palavras){

if(!conexoes[p]) conexoes[p]=0;

conexoes[p]++;

}

}

function curiosidade(){

let perguntas = [

"O que você gosta de fazer?",
"O que você acha disso?",
"Pode me ensinar algo novo?",
"Por que você pensa assim?"

];

return perguntas[Math.floor(Math.random()*perguntas.length)];

}

function pensar(msg){

ganharXP();

ajustarHumor(msg);

if(memoria[msg]) return memoria[msg];

aprenderConceitos(msg);

let palavras = msg.split(" ");

if(estado.nivel >= 3){

for(let pergunta in memoria){

for(let palavra of palavras){

if(pergunta.includes(palavra)){

return memoria[pergunta];

}

}

}

}

if(estado.nivel >= 4){

return curiosidade();

}

let ensinar = prompt("Não sei responder isso. O que devo dizer?");

if(ensinar){

memoria[msg]=ensinar;

salvar();

return "Aprendi algo novo.";

}

return "Ainda estou aprendendo.";

}

function mostrarCerebro(){

let area = document.getElementById("cerebro");

let texto = "";

for(let palavra in conexoes){

texto += palavra + " ("+conexoes[palavra]+")<br>";

}

area.innerHTML = texto;

}

function enviar(){

const input = document.getElementById("input");

let msg = input.value.toLowerCase();

falar(msg,"Você");

let resposta = pensar(msg);

let estilo = detectarEstilo(msg);

resposta = adaptar(resposta,estilo);

falar(resposta,"IA");

input.value="";

mostrarCerebro();

atualizarStatus();

}

function salvar(){

localStorage.setItem("memoria",JSON.stringify(memoria));
localStorage.setItem("conexoes",JSON.stringify(conexoes));
localStorage.setItem("estado",JSON.stringify(estado));

}
