<?php
if (!isset($_GET['file'])) {
    die("Archivo no especificado.");
}

$file = 'xml/' . basename($_GET['file']);

if (!file_exists($file)) {
    die("El archivo no existe.");
}

$xml = simplexml_load_file($file);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($_POST as $key => $value) {
        $xml->$key = htmlspecialchars($value);
    }
    $xml->asXML($file);
    header("Location: panel.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar archivo XML</title>
</head>
<body>

    <h2>Editar archivo: <?= htmlspecialchars($_GET['file']) ?></h2>
    <form method="POST">
        <?php foreach ($xml->children() as $key => $value): ?>
            <label><?= $key ?>:</label>
            <input type="text" name="<?= $key ?>" value="<?= htmlspecialchars($value) ?>"><br>
        <?php endforeach; ?>
        <button type="submit">Guardar Cambios</button>
    </form>

</body>
</html>
