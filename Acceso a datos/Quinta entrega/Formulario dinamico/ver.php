<?php
if (!isset($_GET['file'])) {
    die("Archivo no especificado.");
}

$file = 'xml/' . basename($_GET['file']);

if (!file_exists($file)) {
    die("El archivo no existe.");
}

header('Content-Type: text/xml');
readfile($file);
?>
