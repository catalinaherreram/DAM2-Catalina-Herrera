<?php
	if(!isset($_GET['tabla'])){ // si no se especifica la tabla, se usa "clientes" como valor por defecto
		$tabla = "clientes";
	}else{
		$tabla = $_GET['tabla']; 
	}
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex"); 
	$query = "
		SELECT * FROM ".$tabla ."; // obtengo todos los registros de la tabla especificada
	";
	$result = mysqli_query($mysqli, $query); 
	$aplicaciones = []; // creo un array vacío para almacenar los resultados
	while ($row = mysqli_fetch_assoc($result)) { // recorro los registros devueltos por la consulta
		$aplicaciones[] = $row; // añado cada registro al array
	}
	echo json_encode($aplicaciones); // devuelvo los registros en formato json
	
?>
