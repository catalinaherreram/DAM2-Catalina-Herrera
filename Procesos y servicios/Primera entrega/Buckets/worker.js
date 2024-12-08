// función que se ejecuta cuando el worker recibe un mensaje del hilo principal
onmessage = function(datos){
    // muestro un mensaje en la consola indicando que el worker ha comenzado
    console.log("worker arrancado, vamos a trabajar");

    // recorro cada píxel en los datos de la imagen
    // los datos de la imagen están organizados como un array en el formato [r, g, b, a, r, g, b, a, ...]
    // el incremento es de 4 porque cada píxel tiene 4 valores (rojo, verde, azul, alfa)
    for(let i = 0; i < datos.data.length; i += 4){              
        // variable c para simplificar el acceso a los datos del píxel
        let c = datos.data;

        // **filtro gris:**
        /*
        // calculo el promedio de los valores rojo, verde y azul para obtener el nivel de gris
        let gris = Math.round((c[i] + c[i+1] + c[i+2]) / 3);   
        // actualizo el valor rojo con el nivel de gris
        datos.data[i] = gris;                               
        // actualizo el valor verde con el nivel de gris
        datos.data[i+1] = gris;                             
        // actualizo el valor azul con el nivel de gris
        datos.data[i+2] = gris;                             
        */

        // **filtro negativo:**
        /*
        // invierto el valor del canal rojo (255 - valor actual)
        datos.data[i] = 255 - datos.data[i];                               
        // invierto el valor del canal verde
        datos.data[i+1] = 255 - datos.data[i+1];                             
        // invierto el valor del canal azul
        datos.data[i+2] = 255 - datos.data[i+2];                             
        */

        // **filtro umbral:**
        // si el valor del canal rojo es menor a 100, convierto el píxel en negro
        if(datos.data[i] < 100){
            datos.data[i] = 0;                              // canal rojo a 0
            datos.data[i+1] = 0;                            // canal verde a 0
            datos.data[i+2] = 0;                            // canal azul a 0
        }else{
            // si el valor es mayor o igual a 100, convierto el píxel en blanco
            datos.data[i] = 255;                            // canal rojo a 255
            datos.data[i+1] = 255;                          // canal verde a 255
            datos.data[i+2] = 255;                          // canal azul a 255
        }
    }

    // mensaje para indicar que el worker ha finalizado el procesamiento
    console.log("worker finalizado, devolvemos al hilo principal");

    // devuelvo los datos procesados al hilo principal usando postMessage
    postMessage(datos.data);
}
