<?php

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); 
	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex"); 

	$query = "
		SHOW TABLES;
	"; // obtengo una lista de todas las tablas en la base de datos

	$result = mysqli_query($mysqli, $query); // ejecuto la consulta en la base de datos
	$aplicaciones = []; // creo un array vacío para almacenar los resultados

	while ($row = mysqli_fetch_assoc($result)) { // recorro las tablas devueltas por la consulta
		$aplicaciones[] = $row; // añado cada tabla al array
	}

	echo json_encode($aplicaciones); // devuelvo las tablas en formato json
	
?>
