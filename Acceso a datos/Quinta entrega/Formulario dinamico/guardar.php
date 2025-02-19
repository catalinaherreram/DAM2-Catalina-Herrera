<?php
require 'config.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['nombre']) || !isset($data['edad']) || !isset($data['email']) || !isset($data['storage_mode'])) {
    echo json_encode(["message" => "Datos inválidos"]);
    exit;
}

$storageMode = $data['storage_mode']; // Opción seleccionada por el usuario

if ($storageMode === "mysql") {
    // Conexión a MySQL
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        die(json_encode(["message" => "Error en la conexión a la base de datos"]));
    }

    // Insertar datos en MySQL
    $stmt = $conn->prepare("INSERT INTO registros (nombre, edad, email) VALUES (?, ?, ?)");
    $stmt->bind_param("sis", $data['nombre'], $data['edad'], $data['email']);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(["message" => "Datos guardados en MySQL"]);
} elseif ($storageMode === "xml") {
    // Guardar en XML
    $dir = 'xml';
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
    $filename = $dir . '/registro_' . time() . '.xml';
    $xml = new SimpleXMLElement('<registro/>');
    foreach ($data as $key => $value) {
        if ($key !== "storage_mode") { // No guardar la opción en XML
            $xml->addChild($key, htmlspecialchars($value));
        }
    }
    $xml->asXML($filename);
    echo json_encode(["message" => "Datos guardados en XML"]);
} else {
    echo json_encode(["message" => "Modo de almacenamiento inválido"]);
}
?>
