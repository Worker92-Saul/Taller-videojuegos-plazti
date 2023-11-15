const canvas = document.querySelector("#game");
const game = canvas.getContext('2d'); // Metodos para dibujar
var elementSize;
var canvasSize; // Para que se reescale la pantalla

window.addEventListener('load',setCanvasSize); // Si ya ha cargado el html por completo
// puede haber errores si no se ha cargado por completo
window.addEventListener('resize',setCanvasSize); // Cuando se redimencio vulve a calcular el render


function startGame(){ // metodos del game, iniciados al inicio
    // El start game es mejor dejarlo con acciones encapsuladas.
    
    // Al redimencionarse un Canvas se elimina su contenido.
    canvas.setAttribute("width",canvasSize); // Agrega el atributo al canvas
    canvas.setAttribute("height", canvasSize); 
    
    // Obtener elementos individuales
    const mapa = maps[1].trim(); // elimina espacios en blanco del inicio y final
    var mapsRow = mapa.split('\n');
    var mapBidimensional = mapsRow.map(row => row.trim().split(''));
    // Crea un nuevo array apartir de otro, quitando los espacios de cada fila y dividiendo sus elementos en partes individuales
    console.log(mapBidimensional); 
    // Con espresiones regulares sería mejor?
    
    game.font = elementSize + "px" + " Arial"; // Asignar el tamaño del elemento 10 veces menor, se toma como texto dado al emoji
    // El segundo parametro representa los indice igualmente
    mapBidimensional.forEach((row,i) => { // Entrega filas individualmente bi
        row.forEach((col,j) =>{ // Entrega elemento de la columna individualmente uni
            posX = elementSize * j;
            posY = elementSize * (i+1);
            
            game.fillText(emojis[col],posX,posY); 
            // elmento por elemento
        });
    });


    // -2 por el borde
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
    } else{
        canvasSize = window.innerHeight * .8;
    }
    elementSize = canvasSize / 10 -2; // Dividino en grillas de 10 piezas
    startGame();

}