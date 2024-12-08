<?php
	if(!isset($_GET['tabla'])){ // si no se especifica la tabla en la petición, se asigna una tabla por defecto
		$tabla = "clientes";
	}else{
		$tabla = $_GET['tabla']; 
	}
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex");
	$query = "
		SHOW COLUMNS in ".$tabla ."; // obtengo las columnas de la tabla especificada
	";
	$result = mysqli_query($mysqli, $query); 
	$aplicaciones = []; // array para guardar las columnas
	while ($row = mysqli_fetch_assoc($result)) { // recorro el resultado de la consulta
		$aplicaciones[] = $row; // añado cada columna al array
	}
	echo json_encode($aplicaciones); // devuelvo el resultado en formato json
	
?>
