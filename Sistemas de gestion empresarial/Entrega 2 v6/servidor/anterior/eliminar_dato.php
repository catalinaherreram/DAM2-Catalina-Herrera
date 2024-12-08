<?php
	
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); // habilito errores detallados para mysqli
	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex"); // me conecto a la base de datos
	$query = "
		DELETE FROM ".$_GET['tabla']." WHERE Identificador = ".$_GET['id']."; // elimino un registro específico basado en el identificador
	";
	echo $query; // imprimo la consulta para depuración
	$result = mysqli_query($mysqli, $query); // ejecuto la consulta en la base de datos
	$aplicaciones = [];
	while ($row = mysqli_fetch_assoc($result)) {
		$aplicaciones[] = $row;
	}
	echo json_encode($aplicaciones);
	
?>
