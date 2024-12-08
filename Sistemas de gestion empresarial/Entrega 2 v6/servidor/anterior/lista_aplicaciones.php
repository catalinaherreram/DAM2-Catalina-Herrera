<?php

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex");

	$query = "
		SELECT 
			nombre, 
			descripcion, 
			icono 
		FROM aplicaciones 
		WHERE activa = 1
	"; // obtengo las aplicaciones activas (donde activa = 1)

	$result = mysqli_query($mysqli, $query); // ejecuto la consulta en la base de datos
	$aplicaciones = []; // creo un array vacío para almacenar las aplicaciones

	while ($row = mysqli_fetch_assoc($result)) { // recorro los resultados de la consulta
		$aplicaciones[] = $row; // añado cada aplicación al array
	}

	echo json_encode($aplicaciones); // devuelvo las aplicaciones en formato json
	
?>
