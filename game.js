const canvas = document.querySelector("#game");
const game = canvas.getContext('2d'); // Metodos para dibujar
var elementSize;
var canvasSize; // Para que se reescale la pantalla

// Referencias a los botones
const up = document.querySelector("#up");
const left = document.querySelector("#left");
const right = document.querySelector("#right");
const down = document.querySelector("#down");

// los objetos si se pueden modificar
const playerPosition = {
    x: undefined,
    y: undefined
};

const giftPosition = {
    x: undefined,
    y: undefined
}

var enemiesPosition = []; // posiciones de las bombas, muerte
var flag=true; // Bandera para reyenar el array una vez más

var level = 0;
var lives = 2;

var timeStart;
var timeNow;
var timeIntervale;

const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#recordTime");
const parReslt = document.querySelector("#result");

const messageFail = document.querySelector(".fail");
const messageWin = document.querySelector(".win");
const buttomFail = document.querySelector("#winRestart");
const buttomWin = document.querySelector("#failRestart");

window.addEventListener('load',setCanvasSize); // Si ya ha cargado el html por completo
// puede haber errores si no se ha cargado por completo
window.addEventListener('resize',setCanvasSize); // Cuando se redimencio vulve a calcular el render

// ------------Listeners de movimiento------------
// Movimientos de botones en la interfaz
up.addEventListener('click', movUp);
left.addEventListener('click', movLeft);
right.addEventListener('click', movRight);
down.addEventListener('click', movDown);

// Eventos de teclado keydown
window.addEventListener('keydown', moveKeys);
// ------------Listeners de movimiento------------

buttomFail.addEventListener('click',reiniciar);
buttomWin.addEventListener('click',reiniciar);

function startGame(){ // metodos del game, iniciados al inicio
    // El start game es mejor dejarlo con acciones encapsuladas.
    
    // Al redimencionarse un Canvas se elimina su contenido.
    canvas.setAttribute("width",canvasSize); // Agrega el atributo al canvas
    canvas.setAttribute("height", canvasSize); 
    
    renderizado();
    movePlayer();
    showLives();
    reiniciarRelog();
    /* 
    for (let index = 0; index < 10; index++) { // 0 para que se pinte desde la esquina
        for (let j = 1; j < 11; j++) { // y para que se vea
            game.fillText(emojis[mapBidimensional[index][j-1]],elementSize * index, elementSize * j);  
        }
        
    } */


    /* game.fillRect(100,25,100,100); // x , y -> inicia la accion | cuanto mide (dimenciones del rec anc y alt), hasta donde x, y
    game.clearRect(125,50,50,50); // borra con forma de rectangulo

    game.font = "25px Arial"; // tamaño de letra y tipo de letra, una propiedad.
    game.fillStyle = "red"; // color de fuente
    game.textAlign = "start"; // le dice a las cordenadas si empiezan o terminan en tales coordenas más adelante. end, star, center.
    game.fillText("hola",20,30); // cre tecto, mensaje y posicion */
}

function setCanvasSize(){

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * .8; // optiene el valor de x y de la pantalla
        canvasSize = Number(canvasSize.toFixed(2));
    } else{
        canvasSize = window.innerHeight * .8;
        canvasSize = Number(canvasSize.toFixed(2));
    }
    elementSize = canvasSize / 10 -1; // Dividino en grillas de 10 piezas
    // -2 por el borde
    playerPosition.x  = undefined;
    startGame();
}

// Metodos de movimiento
function movUp(){
    let comparativa = (playerPosition.y - elementSize)
    comparativa = Number(comparativa.toFixed(2));

    if(comparativa > 10){
        playerPosition.y -= elementSize;
        startGame();
    }
}
function movLeft(){
    let comparativa = (playerPosition.x - elementSize)
    comparativa = Number(comparativa.toFixed(2));

    if(comparativa >= 0){
        playerPosition.x -= elementSize;
        startGame();
    }
}
function movRight(){
    let comparativa = (playerPosition.x + elementSize)
    comparativa = Number(comparativa.toFixed(2));

    if(comparativa < (canvasSize-20)){
        playerPosition.x += elementSize;
        startGame();
    }
}
function movDown(){
    let comparativa = (playerPosition.x + elementSize)
    comparativa = Number(comparativa.toFixed(2));

    if(comparativa < canvasSize){
        playerPosition.y += elementSize;
        startGame();
    }
}

// Metodo para captar el evento de teclado
function moveKeys(event){
    if(event.key == "ArrowUp"){
        movUp();
    } else if(event.key == "ArrowLeft"){
        movLeft();
    } else if(event.key == "ArrowRight"){
        movRight();
    } else if(event.key == "ArrowDown"){
        movDown();
    }
    
}

function movePlayer(){
    let x = Number(playerPosition.x.toFixed(2));
    let y = Number(playerPosition.y.toFixed(2));
    
    game.fillText(emojis['PLAYER'],x,y);

    if(x == giftPosition.x && y == giftPosition.y){
        levelNext();
        return;
    }
    const enemyCollisions = enemiesPosition.find(enemy => {
        let enemyCollisionsX = enemy.x == Number(playerPosition.x.toFixed(2));
        let enemyCollisionsY = enemy.y == Number(playerPosition.y.toFixed(2));
        return enemyCollisionsX && enemyCollisionsY;
    });

    if(enemyCollisions){
        levelFail();
    }

}

function levelNext(){ // reinicia los valores de las variables
    playerPosition.x = undefined; 
    enemiesPosition = [];
    flag = true;

    if((level +1 ) < maps.length ){ // que no se pase y cicla los niveles
        level += 1; 
        startGame(); // reinicia el juego.
    } else{
        messageWin.classList.remove("inactive");
        stopIntervale();
        console.log("You Win!!"); // Agregar pantalla 
        level = 0;
    }
    
}

function levelFail(){
    if(lives > 0){
        lives--;
        playerPosition.x = undefined
        startGame();
    } else{
        lives = -1;
        showLives();
        stopIntervale();
        messageFail.classList.remove("inactive");
    }
    
}

function reiniciar(){
    messageFail.classList.add('inactive');
    messageWin.classList.add('inactive');
    timeStart = undefined;
    lives = 2;
    playerPosition.x = undefined; 
    enemiesPosition = [];
    flag = true;
    level = 0;
    startGame();

}
function reiniciarRelog(){
    if(!timeStart){ // Esta vacia undefinite?
        timeStart = Date.now(); // Imprime el tiempo en milisengundos
        timeIntervale = setInterval(showTime,100);
        showRecord();
        //const intervalo = setInterval(() => console.log("imprime"),1000); // Ejecuta metodo cada intervalo establecido.
        // Podemos detenerlo asignandolo a una variable y usando clear intervale(inter);
        //clearInterval(intervalo);
        //setTimeout(() => console.log('imprime'),1000); // Ejecuta 1 vez despues del tiempo establecido.

    }
}
function stopIntervale(){
    // Detener intervalo
    console.log("stop");
    clearInterval(timeIntervale);
    const recordTime = localStorage.getItem('record_time');
    if(!recordTime){
        localStorage.setItem('record_time',spanTime.innerHTML);
    } else{
        if(spanTime.innerHTML < recordTime){
            localStorage.setItem('record_time',spanTime.innerHTML);
            console.log("me actualizo");
            parReslt.innerHTML = "Record Superado";
        }
    }
}
function renderizado(){
    // Obtener elementos individuales
    const mapa = maps[level].trim(); // elimina espacios en blanco del inicio y final
    var mapsRow = mapa.split('\n');
    var mapBidimensional = mapsRow.map(row => row.trim().split(''));
    // Con espresiones regulares sería mejor?
    
    game.font = elementSize + "px" + " Arial"; // Asignar el tamaño del elemento 10 veces menor, se toma como texto dado al emoji
    // El segundo parametro representa los indice igualmente

    game.clearRect(0,0,canvasSize,canvasSize);

    mapBidimensional.forEach((row,i) => { // Entrega filas individualmente bi
        row.forEach((col,j) =>{ // Entrega elemento de la columna individualmente uni
            posX = (elementSize * j);
            posY = elementSize * (i+1);

            game.fillText(emojis[col],posX,posY);
            
            // elmento por elemento
            if(col == 'O' && playerPosition.x == undefined){
                playerPosition.x = posX;
                playerPosition.y = posY;
            }
            if(col == 'I'){
                giftPosition.x = Number(posX.toFixed(2));
                giftPosition.y = Number(posY.toFixed(2));
            }
            if(col == 'X' && flag){
                enemiesPosition.push({x:Number(posX.toFixed(2)),y:Number(posY.toFixed(2))});
            } 
        });
    });
    flag = false;
}

function showLives(){
    spanLives.innerHTML = emojis['HEARTH'].repeat(lives+1);
}
function showTime(){
    timeNow = Date.now();
    spanTime.innerHTML =formatTime(timeNow-timeStart); // Tiempo transcurrido

    /* // Puedes guardar datos perdurables en el navegador(no backend) con localStorage, como una lista
    localStorage.setItem("data",5); // Crea variable
    localStorage.getItem("data"); // recupera variable
    localStorage.removeItem("data"); // elimina variable;
    localStorage.remove(); // Limapia el localStorage */
}
function showRecord(){
    spanRecord.innerHTML = localStorage.getItem("record_time");
}

function formatTime(ms){
    const cs = parseInt(ms/10) % 100
    const seg = parseInt(ms/1000) % 60
    const min = parseInt(ms/60000) % 60

    const csStr = `${cs}`.padStart(2,"0")
    const segStr = `${seg}`.padStart(2,"0")
    const minStr = `${min}`.padStart(2,"0")
    return`${minStr}:${segStr}:${csStr}`
}
