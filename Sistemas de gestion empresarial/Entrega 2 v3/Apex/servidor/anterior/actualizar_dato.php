<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); // Establezco el nivel de retorno de errores de PHP
$mysqli = mysqli_connect("localhost", "apex", "apex", "apex"); // Me conecto a la base de datos

// Decodifico los datos JSON recibidos en el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

$tabla = $data['tabla'];
$clavePrimaria = $data['clavePrimaria'];
$campo = $data['campo'];
$valor = $data['valor'];

// Construyo la consulta UPDATE para actualizar el valor en la base de datos
$query = "
    UPDATE $tabla SET $campo = ? WHERE Identificador = ?
";

// Preparo y ejecuto la consulta con parámetros para evitar inyecciones SQL
$stmt = $mysqli->prepare($query);
$stmt->bind_param("si", $valor, $clavePrimaria); // "si" indica que $valor es un string y $clavePrimaria un entero

if ($stmt->execute()) {
    echo json_encode(["success" => true]); // Retorno éxito si la consulta fue ejecutada correctamente
} else {
    echo json_encode(["error" => "Error al actualizar el registro."]);
}

$stmt->close();
$mysqli->close();
?>

