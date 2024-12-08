<?php

	$mysqli = mysqli_connect("localhost", "apex", "apex", "apex");

// Verificar la conexión
if (!$mysqli) {
    die("Error en la conexión a la base de datos: " . mysqli_connect_error());
}

// Consulta para llamar al procedimiento almacenado
$query = "CALL EspanaES();";

// Ejecutar la consulta
$result = mysqli_query($mysqli, $query);

// Verificar si la consulta fue exitosa
if ($result) {
    echo "El procedimiento se ejecutó correctamente y los datos fueron actualizados.";
} else {
    echo "Error en la ejecución de la consulta: " . mysqli_error($mysqli);
}

// Cerrar la conexión
mysqli_close($mysqli);


?>
