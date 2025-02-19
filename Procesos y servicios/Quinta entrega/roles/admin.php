<?php
session_start();
if (!isset($_SESSION["username"]) || $_SESSION["role"] !== "admin") {
    header("Location: index.php");
    exit();
}

echo "<h1>Panel de Administración</h1>";
echo "<p>Solo los administradores pueden ver esta página.</p>";
echo '<p><a href="dashboard.php">Volver</a></p>';
echo '<p><a href="logout.php">Cerrar sesión</a></p>';
?>
