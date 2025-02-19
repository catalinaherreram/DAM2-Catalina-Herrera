<?php
require 'config.php';

$registros = [];

// Obtener registros de MySQL
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if ($conn->connect_error) {
    die("Error en la conexión a la base de datos");
}
$result = $conn->query("SELECT * FROM registros");
while ($row = $result->fetch_assoc()) {
    $row['storage_mode'] = "MySQL";
    $registros[] = $row;
}
$conn->close();

// Obtener registros de XML
$files = array_diff(scandir("xml"), ['.', '..']);
foreach ($files as $file) {
    $xml = simplexml_load_file("xml/" . $file);
    $registros[] = [
        "id" => $file,
        "nombre" => (string)$xml->nombre,
        "edad" => (string)$xml->edad,
        "email" => (string)$xml->email,
        "storage_mode" => "XML"
    ];
}

// Manejo de POST (Eliminar / Actualizar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['delete'])) {
        if ($_POST['storage_mode'] === "MySQL") {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $stmt = $conn->prepare("DELETE FROM registros WHERE id = ?");
            $stmt->bind_param("i", $_POST['delete']);
            $stmt->execute();
            $stmt->close();
            $conn->close();
        } else {
            unlink("xml/" . $_POST['delete']);
        }
    } elseif (isset($_POST['edit'])) {
        if ($_POST['storage_mode'] === "MySQL") {
            $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
            $stmt = $conn->prepare("UPDATE registros SET nombre=?, edad=?, email=? WHERE id=?");
            $stmt->bind_param("sisi", $_POST['nombre'], $_POST['edad'], $_POST['email'], $_POST['edit']);
            $stmt->execute();
            $stmt->close();
            $conn->close();
        } else {
            $filename = "xml/" . $_POST['edit'];
            $xml = new SimpleXMLElement('<registro/>');
            $xml->addChild('nombre', $_POST['nombre']);
            $xml->addChild('edad', $_POST['edad']);
            $xml->addChild('email', $_POST['email']);
            $xml->asXML($filename);
        }
    }
    header("Location: panel.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Control</title>
    <link rel="stylesheet" href="styles.css">
    <script>
        function toggleDetails(id) {
            let div = document.getElementById("contenido-" + id);
            div.classList.toggle("hidden");
        }
    </script>
</head>
<body>

    <div class="container">
        <h2>Panel de control</h2>
        <a href="index.html" class="btn">Volver al formulario</a>

        <?php if (empty($registros)): ?>
            <p>No hay registros disponibles</p>
        <?php else: ?>
            <ul>
                <?php foreach ($registros as $registro): ?>
                    <li class="archivo">
                        <strong><?= $registro['nombre'] ?></strong> (<?= $registro['storage_mode'] ?>) - <?= $registro['email'] ?>
                        <button onclick="toggleDetails('<?= $registro['id'] ?>')">Ver</button>
                        
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="delete" value="<?= $registro['id'] ?>">
                            <input type="hidden" name="storage_mode" value="<?= $registro['storage_mode'] ?>">
                            <button type="submit">Eliminar</button>
                        </form>

                        <div id="contenido-<?= $registro['id'] ?>" class="hidden">
                            <form method="post">
                                <input type="hidden" name="edit" value="<?= $registro['id'] ?>">
                                <input type="hidden" name="storage_mode" value="<?= $registro['storage_mode'] ?>">
                                <label>Nombre:</label>
                                <input type="text" name="nombre" value="<?= $registro['nombre'] ?>">
                                <label>Edad:</label>
                                <input type="number" name="edad" value="<?= $registro['edad'] ?>">
                                <label>Email:</label>
                                <input type="email" name="email" value="<?= $registro['email'] ?>">
                                <button type="submit">Actualizar</button>
                            </form>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </div>

</body>
</html>
