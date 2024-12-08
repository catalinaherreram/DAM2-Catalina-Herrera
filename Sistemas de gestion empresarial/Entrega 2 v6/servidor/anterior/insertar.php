<?php
	$mysqli = mysqli_connect(
		"localhost", 
		"apex", 
		"apex", 
		"apex"
	); 
	
	$json = file_get_contents('php://input'); // recojo los datos enviados desde el formulario en formato json
	$data = json_decode($json, true); // decodifico los datos json en un array asociativo
	
	foreach($data as $clave => $valor){ // recorro las claves del array
		if($clave == 'tabla'){ // si la clave es 'tabla'
			$tabla = $valor; // guardo el nombre de la tabla
		}
	}
	
	$peticion = "INSERT INTO ".$tabla." VALUES(NULL,"; // inicio la consulta de inserción con un valor NULL para el identificador
	
	foreach($data as $clave => $valor){ // recorro las claves del array nuevamente
		if($clave != "Identificador" && $clave != 'tabla'){ // si la clave no es 'Identificador' ni 'tabla'
			$peticion .= "'".$valor."',"; // añado el valor a la consulta SQL
		}
	}
	
	$peticion = substr($peticion, 0, -1); // elimino la última coma sobrante
	$peticion .= ");"; // cierro la consulta SQL con el paréntesis final
	
	echo $peticion; // imprimo la consulta SQL para depuración
	$result = mysqli_query($mysqli, $peticion); // ejecuto la consulta
?>
