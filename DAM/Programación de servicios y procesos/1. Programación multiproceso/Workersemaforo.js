onmessage = function(datos) { // el worker escucha mensajes desde el hilo principal
    console.log("hola soy el núcleo", datos.data); // muestra un mensaje indicando el núcleo que ha recibido el mensaje
    
    let numero = 1.0000000054; // define un número inicial para realizar las operaciones
    let iteraciones = 10000000000; // define el número de iteraciones para el cálculo
    for (let i = 0; i < iteraciones; i++) { // bucle que realiza el cálculo durante el número especificado de iteraciones
        numero *= 1.000000000076; // multiplica el número por un valor cercano a uno en cada iteración
    }
    postMessage("el worker vuelve al proceso principal"); // envía un mensaje de confirmación al hilo principal
}
