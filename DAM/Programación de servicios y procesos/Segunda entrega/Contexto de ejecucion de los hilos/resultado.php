<?php

    // abre el archivo "resultados.txt" en modo "a" (append), lo que significa que 
    // cualquier dato que se escriba se agregará al final del archivo sin sobrescribir el contenido existente
    $myfile = fopen("resultados.txt", "a");

    // obtiene el parámetro "resultado" de la URL (enviado a través de una solicitud GET)
    // y lo convierte en una cadena con un salto de línea al final
    $txt = $_GET['resultado']."\n";

    // escribe la cadena ($txt) en el archivo abierto ("resultados.txt"), agregándola al final
    fwrite($myfile, $txt);

    // cierra el archivo para liberar recursos del servidor y asegurar que los cambios se guarden correctamente
    fclose($myfile);

?>