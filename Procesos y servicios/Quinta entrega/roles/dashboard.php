<?php
session_start();
if (!isset($_SESSION["username"])) {
    header("Location: index.php");
    exit();
}

echo "<h1>Bienvenido, " . $_SESSION["username"] . "</h1>";
echo "<p>Tu rol es: " . $_SESSION["role"] . "</p>";

if ($_SESSION["role"] === "admin") {
    echo '<p><a href="admin.php">Ir a panel de administrador</a></p>';
}

echo '<p><a href="logout.php">Cerrar sesión</a></p>';
?>
