<?php

	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex");

	$query = "
		SELECT 
		usuario
		FROM usuarios 
		WHERE usuario = '".$_GET['usuario']."' 
		AND contrasena = '".$_GET['contrasena']."'
	"; // verifico si existe un usuario con las credenciales proporcionadas

	$result = mysqli_query($mysqli, $query); // ejecuto la consulta en la base de datos

	if ($row = mysqli_fetch_assoc($result)) { // si se encuentra un registro
		$row['resultado'] = 'ok'; // añado una propiedad 'resultado' con valor 'ok'
	    echo json_encode($row); // devuelvo los datos del usuario junto con el resultado
	} else { // si no se encuentra el usuario
		echo '{"resultado:":"ko"}'; // devuelvo un resultado 'ko' indicando fallo
	}
	
?>
