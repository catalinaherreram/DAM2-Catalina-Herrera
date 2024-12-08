<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>miBanco</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }

    .contenedor {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }

    h1 {
      text-align: center;
      color: #333;
    }

    .grupo-formulario {
      margin-bottom: 20px;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
      color: #555;
    }

    input[type="text"],
    select,
    #iban,
    #alias {
      width: calc(100% - 20px);
      padding: 10px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
      background-color: #f9f9f9;
      transition: border-color 0.3s, box-shadow 0.3s;
        margin-right: 8px;
    }

    input[type="text"]:focus,
    #iban:focus,
    #alias:focus,
    select:focus {
      border-color: #007bff;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
      outline: none;
    }

    .contenedor-iban {
      position: relative;
    }

    .grupo-iban {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .contenedor-checkbox {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .contenedor-checkbox label {
      margin: 0;
      text-align: center;
      margin-bottom: 5px;
    }

    .interruptor {
      position: relative;
      display: inline-block;
      width: 34px;
      height: 20px;
    }

    .interruptor input {
      display: none;
    }

    .control-deslizante {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 20px;
    }

    .control-deslizante::before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }

    .interruptor input:checked + .control-deslizante {
      background-color: #4caf50;
    }

    .interruptor input:checked + .control-deslizante::before {
      transform: translateX(14px);
    }

    button {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #0056b3;
    }

    button.clickeado {
      background-color: #28a745;
    }

    button.clickeado:hover {
      background-color: #218838;
    }

    #tipoContacto,
    #alias {
      display: none;
    }

    #footer {
      color: gray;
      text-align: center;
      font-size: 12px;
    }
      #detalles{
          margin-bottom: 5px;
      }
  </style>
</head>
<body>
  <div class="contenedor">
    <h1>Guardar contactos bancarios</h1>

    <!-- formulario -->
    <form method="POST" action="">
      <!-- validación de IBAN con checkbox -->
      <div class="grupo-formulario contenedor-iban">
        <!-- etiqueta que indica el campo para introducir el IBAN -->
        <label>Introduce el IBAN del contacto a guardar</label>
        <div class="grupo-iban">
          <!-- campo de texto para ingresar el IBAN -->
          <input id="iban" name="iban" placeholder="EJ: ES00 1234 5678 9012 3456 7890" />
          <div class="contenedor-checkbox">
            <!-- etiqueta "detalles" y checkbox para mostrar/ocultar campos -->
            <label id=detalles>Detalles</label>
            <label class="interruptor">
              <!-- checkbox que activa o desactiva la visualización de campos adicionales -->
              <input type="checkbox" id="cambiarCheckbox">
              <span class="control-deslizante"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- desplegable y alias alineados horizontalmente -->
      <div class="grupo-formulario grupo-entrada" style="display: flex; gap: 10px; align-items: flex-start;">
        <!-- campo desplegable para seleccionar el tipo de contacto -->
        <select id="tipoContacto" name="tipoContacto" style="flex: 1;">
          <option>Tipo de contacto</option>
        </select>
        <!-- campo de texto para ingresar un alias para el contacto -->
        <input id="alias" name="alias" style="flex: 1;" placeholder="Alias" />
      </div>

      <!-- botón -->
      <div class="grupo-formulario">
        <!-- botón que envía el formulario -->
        <button id="botonEstado" type="submit">Guardar información de contacto</button>
      </div>

      <!-- enlace adicional -->
      <div class="grupo-formulario" style="text-align: center; margin-top: 10px;">
        <!-- enlace a otra página llamada integracionagenda.php -->
        <a href="integracionagenda.php" style="color: #007bff; text-decoration: none; font-size: 14px;">Acceder a la agenda</a>
      </div>
    </form>
  </div>

  <script>
    // función que verifica si un carácter es una letra
    function esLetra(caracter) {
        return /^[a-zA-Z]$/.test(caracter);
    }

    // función para validar si el IBAN es correcto
    function esIBANValido(iban) {
        const contenido = iban.replace(/\s+/g, ""); // eliminar espacios en blanco
        // verificamos la longitud y que los primeros dos caracteres sean letras
        if (contenido.length !== 24) return false;
        if (!esLetra(contenido[0]) || !esLetra(contenido[1])) return false;
        // aseguramos que solo contenga caracteres alfanuméricos
        if (!/^[A-Z0-9]+$/.test(contenido)) return false;
        return true;
    }

    // escuchar el evento de entrada en el campo del IBAN para validar su formato
    document.querySelector("#iban").addEventListener("input", function () {
        const contenido = this.value.trim(); // obtener el valor sin espacios
        // si el IBAN es válido, cambiamos el color de fondo a verde claro
        if (esIBANValido(contenido)) {
            this.style.background = "rgb(200,255,200)";
        } else {
            // si no es válido, cambiamos el color de fondo a rojo claro
            this.style.background = "rgb(255,200,200)";
        }
    });

    // seleccionamos el checkbox que muestra/oculta los campos adicionales
    const checkbox = document.querySelector("#cambiarCheckbox");
    const desplegable = document.querySelector("#tipoContacto");
    const campoAlias = document.querySelector("#alias");

    // escuchamos el cambio en el checkbox para mostrar/ocultar los campos tipo de contacto y alias
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        // cuando el checkbox está marcado, mostramos los campos
        desplegable.style.display = "block";
        campoAlias.style.display = "block";
      } else {
        // cuando el checkbox no está marcado, ocultamos los campos
        desplegable.style.display = "none";
        campoAlias.style.display = "none";
      }
    });

    // solicitamos los datos del contacto desde un archivo JSON
    fetch("contacto.json")
      .then(respuesta => respuesta.json()) // convertimos la respuesta en JSON
      .then(datos => {
        const contactos = datos.contacto || []; // obtenemos la lista de contactos
        // para cada contacto, creamos una opción en el desplegable
        contactos.forEach(contacto => {
          const opcion = document.createElement("option");
          opcion.textContent = contacto; // asignamos el nombre del contacto
          desplegable.appendChild(opcion); // agregamos la opción al select
        });
      })
      .catch(error => {
        // mostramos un mensaje de error si no se pueden cargar los datos
        console.error("Error al cargar los datos del desplegable:", error);
      });
  </script>
</body>
<footer>
  <h4 id="footer">miBanco por CodeCath. 2024. Todos los derechos reservados.</h4>
</footer>

<?php
// comprobamos si el formulario fue enviado mediante el método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // datos de conexión a la base de datos
    $host = 'localhost';
    $db = 'agendaiban';
    $user = 'agendaiban';
    $password = 'agendaiban';

    // creamos una conexión con la base de datos
    $conn = new mysqli($host, $user, $password, $db);

    // si hay un error en la conexión, mostramos un mensaje
    if ($conn->connect_error) {
        die('Error de conexión: ' . $conn->connect_error);
    }

    // recogemos los valores enviados por el formulario y los escapamos para evitar inyecciones SQL
    $iban = $conn->real_escape_string($_POST['iban']);
    $alias = $conn->real_escape_string($_POST['alias']);
    $tipoContacto = $conn->real_escape_string($_POST['tipoContacto']);

    // creamos la consulta SQL para insertar los datos en la base de datos
    $query = "INSERT INTO registros (iban, alias, tipoContacto) VALUES ('$iban', '$alias', '$tipoContacto')";

    // ejecutamos la consulta y mostramos un mensaje dependiendo del resultado
    if ($conn->query($query) === TRUE) {
        echo "<script>alert('Datos guardados correctamente.');</script>";
    } else {
        echo "<script>alert('Error al guardar los datos: " . $conn->error . "');</script>";
    }

    // cerramos la conexión a la base de datos
    $conn->close();
}
?>