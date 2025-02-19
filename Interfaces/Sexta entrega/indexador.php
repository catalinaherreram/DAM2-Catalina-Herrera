<?php
function parseFolderAndFiles($folderPath) {
    if (!is_dir($folderPath)) {
        die("The folder does not exist: $folderPath");
    }

    // Función recursiva para escanear la estructura del directorio
    function scanDirRecursively($path, $indent = 0) {
        $items = scandir($path);
        foreach ($items as $item) {
            // Ignorar "." y ".."
            if ($item === '.' || $item === '..') {
                continue;
            }

            $fullPath = $path . DIRECTORY_SEPARATOR . $item;

            // Aplicar sangría visual para jerarquía
            echo str_repeat("&nbsp;&nbsp;&nbsp;", $indent) . "📂 " . $item . "<br>";

            // Si es una carpeta, hacer un llamado recursivo
            if (is_dir($fullPath)) {
                scanDirRecursively($fullPath, $indent + 1);
            }
        }
    }

    // Iniciar escaneo desde la carpeta raíz
    echo "<h2>Índice de: " . basename($folderPath) . "</h2>";
    scanDirRecursively($folderPath);
}

// Carpeta a indexar
$folderPath = 'Multimedia';
parseFolderAndFiles($folderPath);
?>
