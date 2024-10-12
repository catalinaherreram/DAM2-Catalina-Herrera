onmessage = function(datos) { // el worker escucha mensajes desde el hilo principal
    console.log("Ha recibido el mensaje el núcleo", datos.data); // muestra un mensaje indicando el núcleo que ha recibido el mensaje

    
    let numero = 1.0000000054; // define un número inicial para las operaciones
    let iteraciones = 100000000000; // define el número de iteraciones para el cálculo
    for(let i = 0; i < iteraciones; i++) { // bucle que realiza operaciones en el número durante las iteraciones especificadas
        numero *= 1.000000000076; // multiplica el número por un valor cercano a uno para simular una carga de procesamiento
    }
    postMessage("El worker ha finalizado y vuelve al proceso principal"); // envía un mensaje de confirmación al hilo principal cuando termina
    
}

