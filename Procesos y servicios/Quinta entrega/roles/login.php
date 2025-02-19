<?php
session_start();
$users = include 'users.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    foreach ($users as $user) {
        if ($user["username"] === $username && $user["password"] === $password) {
            $_SESSION["username"] = $username;
            $_SESSION["role"] = $user["role"];
            
            // Redirigir según rol
            if ($user["role"] === "admin") {
                header("Location: admin.php");
            } else {
                header("Location: dashboard.php");
            }
            exit();
        }
    }

    echo "Usuario o contraseña incorrectos.";
}
?>
