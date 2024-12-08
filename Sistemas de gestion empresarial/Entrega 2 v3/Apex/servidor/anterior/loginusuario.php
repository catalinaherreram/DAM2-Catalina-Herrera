<?php
header('Content-Type: application/json');

$mysqli = mysqli_connect("localhost", "apex", "apex", "apex");

if (!$mysqli) {
    echo json_encode(["resultado" => "error", "mensaje" => "Error de conexión"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$usuario = $input['usuario'];
$contrasena = $input['contrasena'];

// Consulta directa
$query = "SELECT Identificador, usuario FROM usuarios WHERE usuario = '$usuario' AND contrasena = '$contrasena'";
$result = mysqli_query($mysqli, $query);

if (mysqli_num_rows($result) > 0) {
    $row = mysqli_fetch_assoc($result);
    $userId = $row['Identificador']; // Suponiendo que 'id' es el identificador único del usuario en la tabla 'usuarios'
    echo json_encode(["resultado" => "ok", "redirect" => "../cliente/escritorio/index.html?userId=$userId"]);

} else {
    echo json_encode(["resultado" => "ko"]);
}

mysqli_close($mysqli);
?>
