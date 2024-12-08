<?php
	///////////////////// TAREAS /////////////////////////////////////////////////
	
	// define la ruta del archivo "tareas.txt", que contiene una lista de tareas
	$file = 'tareas.txt';

	// lee el contenido completo del archivo "tareas.txt" y lo convierte en un array donde cada línea es un elemento
	$lines = file($file);

	// selecciona la primera línea del archivo, que corresponde a la primera tarea disponible
	$tarea = $lines[0];

	// envía la primera tarea al navegador (al JavaScript del cliente) para que pueda usarla
	echo $lines[0];

	// elimina la primera línea del array (quita la tarea que se acaba de asignar)
	array_shift($lines);

	// sobrescribe el archivo "tareas.txt" con el contenido actualizado (sin la tarea asignada)
	file_put_contents($file, implode('', $lines));

	///////////////////// ASIGNACIONES /////////////////////////////////////////////////

	// abre el archivo "asignaciones.txt" en modo "a" (append) para agregar un nuevo registro
	$myfile = fopen("asignaciones.txt", "a");

	// crea un registro en formato: "Al usuario[nombre_usuario] le ha tocado la tarea: [tarea]"
	$txt = "Al usuario".$_GET['usuario']." le ha tocado la tarea: ".$tarea."\n";

	// escribe el registro en el archivo "asignaciones.txt"
	fwrite($myfile, $txt);

	// cierra el archivo "asignaciones.txt" para liberar recursos y guardar cambios
	fclose($myfile);
?>