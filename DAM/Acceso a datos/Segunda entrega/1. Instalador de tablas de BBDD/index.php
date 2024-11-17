<?php
// desactivar la visualización de errores en pantalla
ini_set('display_errors', 0);
error_reporting(0);

// variable para almacenar los mensajes de error o éxito
$mensaje = "";

if (isset($_POST['usuario'])) {
    try {
        // intentar conectar con la base de datos
        $enlace = mysqli_connect(
            $_POST['servidor'],
            $_POST['usuario'],
            $_POST['contrasena'],
            $_POST['basededatos']
        );

        // si falla la conexión, lanzar una excepción
        if (!$enlace) {
            throw new Exception("No se pudo conectar a la base de datos. Verifica las credenciales ingresadas.");
        }

        // verificar si el archivo json existe y es legible
        if (!file_exists("modelodedatos.json") || !is_readable("modelodedatos.json")) {
            throw new Exception("El archivo modelodedatos.json no existe o no es legible.");
        }

        // leer y decodificar el json
        $json = file_get_contents("modelodedatos.json");
        $datos = json_decode($json, true);

        // verificar que la decodificación fue exitosa
        if ($datos === null) {
            throw new Exception("Error al decodificar el archivo JSON. Verifica el formato.");
        }

        // crear las tablas en base a la estructura json
        foreach ($datos as $dato) {
            $nombredetabla = $dato['nombre'];
            $cadena = "CREATE TABLE " . $nombredetabla . " (
                Identificador INT NOT NULL AUTO_INCREMENT, ";

            // agregar cada columna
            foreach ($dato['columnas'] as $columna) {
                $cadena .= $columna['nombre'] . " " . $columna['tipo'];
                if ($columna['tipo'] != "TEXT") {
                    $cadena .= " (" . $columna['longitud'] . ")";
                }
                $cadena .= ",";
            }

            $cadena .= "PRIMARY KEY (Identificador)) ENGINE = InnoDB";

            // ejecutar la consulta y manejar errores si falla
            if (!mysqli_query($enlace, $cadena)) {
                throw new Exception("No se pudo crear la tabla '$nombredetabla': " . mysqli_error($enlace));
            }

            // mensaje de éxito por cada tabla creada
            $mensaje .= "<p style='color: green; font-size: 10px;'>Tabla '$nombredetabla' creada exitosamente.</p>";

        }

        mysqli_close($enlace); // cerrar la conexión

    } catch (Exception $e) {
        // mostrar el mensaje de error en la misma página
        $mensaje .= "<p style='color: red; font-size: 10px;'>" . $e->getMessage() . "</p>";
    }
}
?>

<!doctype html>
<html>
<head>
    <title>Instalador de BBDD</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body, html {
            height: 100%; padding: 0px; margin: 0px;
            background: url(fondoinstalador.jpg); background-size: cover;
            font-family: 'Roboto', sans-serif;
        }
        form {
            width: 300px; height: auto; background: rgba(6, 6, 6, 0.23);
            box-sizing: border-box; padding: 20px; border-radius: 20px;
            position: absolute; top: 50%; left: 50%;
            margin-left: -150px; transform: translateY(-50%);
            text-align: center; color: white;
            backdrop-filter: blur(20px);
        }
        form input {
            width: 100%; padding: 10px 0px; margin: 5px 0px;
            outline: none; border: none; border-bottom: 1px solid white; background: none;
            color: white; /* cambia el color del texto a blanco */
        }
        form input::placeholder { color: white; }
        form input[type=submit] {
            background: rgba(6, 6, 6, 0.4);
            border-radius: 20px; margin-top: 30px;
            color: white; font-weight: bold; border: none;
            cursor: pointer; transition: background-color 0.3s ease;
        }
        form input[type=submit]:hover {
            background: rgba(224, 224, 234, 0.23); border-radius: 20px; color: black;
        }
        .message {
            font-size: 10px; /* tamaño del texto de mensaje */
            margin-top: 15px;
        }
    </style>
    <script>
        // redirección tras 3 segundos si hay un mensaje
        document.addEventListener("DOMContentLoaded", function() {
            if (document.querySelector(".message").innerHTML.trim() !== "") {
                setTimeout(function() {
                    window.location.href = "index.php";
                }, 3000);
            }
        });
    </script>
</head>
<body>
    <form method="POST" action="?">
        <h1>Instalador</h1>
        <input type="text" name="usuario" placeholder="Usuario de la base de datos">
        <input type="text" name="contrasena" placeholder="Contraseña de la base de datos">
        <input type="text" name="servidor" placeholder="Servidor de la base de datos">
        <input type="text" name="basededatos" placeholder="Nombre de la base de datos">
        <input type="submit" value="Instalar">
        <!-- mostrar mensajes de error o éxito debajo del botón submit -->
        <div class="message"><?php if (!empty($mensaje)) echo $mensaje; ?></div>
    </form>
</body>
</html>
