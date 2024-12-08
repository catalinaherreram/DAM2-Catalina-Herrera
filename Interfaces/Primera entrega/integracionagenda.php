<?php
// configuración de la base de datos
$host = "localhost";
$user = "agendaiban";
$password = "agendaiban";
$database = "agendaiban";

// conectar a la base de datos
$conn = new mysqli($host, $user, $password, $database);

// verificar si hay error en la conexión
if ($conn->connect_error) {
    die("Error al conectar a la base de datos: " . $conn->connect_error);
}

// consulta para obtener todos los registros de la tabla
$query = "SELECT Identificador, iban, tipoContacto, alias FROM registros";
$result = $conn->query($query);

// generar las opciones para el select con el alias en lugar del IBAN
$options = "";
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // guardar los datos de cada registro en el arreglo $data usando el identificador como clave
        $data[$row['Identificador']] = $row;
        // generar las opciones del select con el alias
        $options .= "<option value='{$row['Identificador']}'>{$row['alias']}</option>";
    }
} else {
    // si no hay datos, mostrar una opción indicando que no hay datos disponibles
    $options = "<option value=''>No hay datos disponibles</option>";
}

// cerrar la conexión a la base de datos
$conn->close();
?>

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
            padding: 20px;
        }
        
        h1{
            text-align: center;
        }

        .contenedor {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        .select {
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 4px;
            position: relative;
            width: 98%;
            background-color: #f9f9f9;
            margin-bottom: 10px;
        }

        .caja {
            cursor: pointer;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #fff;
        }

        .resultados {
            border: 1px solid #ccc;
            max-height: 200px;
            overflow-y: auto;
            background-color: #fff;
            position: absolute;
            z-index: 10;
            width: 100%;
        }

        .resultados p {
            padding: 10px;
            margin: 0;
            cursor: pointer;
        }

        .resultados p:hover {
            background-color: #f0f0f0;
        }

        .radio2 {
            background-color: #f0f0f0;
        }

        input[type="text"] {
            width: 98%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        
        input[type="text"]:focus,
        #iban:focus,
        #alias:focus,
        select:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
          outline: none;
        }

        input[type="text"]:readonly {
            background-color: #e9ecef;
        }
        
        #footer {
      color: gray;
      text-align: center;
      font-size: 12px;
    }
    </style>
</head>
<body>
    <div class="contenedor">
        <h1>Agenda</h1>
        <!-- campo select oculto con las opciones generadas dinámicamente desde PHP -->
        <select hidden id="tipoContacto">
            <option>Selecciona el alias</option>
            <?= $options ?> <!-- las opciones generadas por PHP se insertan aquí -->
        </select>

        <div id="details">
            <!-- campos de entrada para mostrar el IBAN, tipo de contacto y alias seleccionados -->
            <label>IBAN:</label>
            <input type="text" id="iban" readonly>
            <label>Tipo de Contacto:</label>
            <input type="text" id="tipoContactoDetalle" readonly>
            <label>Alias:</label>
            <input type="text" id="alias" readonly>
        </div>

        <!-- enlace para regresar al registro de contactos -->
        <div class="grupo-formulario" style="text-align: center; margin-top: 20px;">
            <a href="integracion.php" style="color: #007bff; text-decoration: none; font-size: 14px;">Regresar al registro de contactos</a>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const selector = document.getElementById("tipoContacto");
            const ibanInput = document.getElementById("iban");
            const tipoContactoInput = document.getElementById("tipoContactoDetalle");
            const aliasInput = document.getElementById("alias");

            // datos traídos desde PHP y generados dinámicamente (se usan para mostrar la información del contacto)
            const data = <?= json_encode($data); ?>;

            // función para crear un selector personalizado
            function select(selector) {
                let contenedores = [];
                contenedores.push(document.createElement("div")); // crear un contenedor para el selector
                contenedores[contenedores.length - 1].classList.add("select");

                // evitar que el clic en el contenedor cierre la lista de opciones
                contenedores[contenedores.length - 1].onclick = function (e) {
                    e.stopPropagation();
                };

                selector.replaceWith(contenedores[contenedores.length - 1]); // reemplazar el select original por el nuevo contenedor
                let caja = document.createElement("div");
                caja.classList.add("caja");
                caja.textContent =
                    selector.querySelector("option:first-child").textContent ||
                    "Seleccione...";
                contenedores[contenedores.length - 1].appendChild(caja);
                contenedores[contenedores.length - 1].appendChild(selector);

                caja.onclick = function (e) {
                    e.stopPropagation();
                    caja.classList.add("radio2");

                    let resultados = document.createElement("div");
                    resultados.classList.add("resultados");
                    this.appendChild(resultados);

                    let buscador = document.createElement("input");
                    buscador.setAttribute("type", "search");
                    buscador.setAttribute("placeholder", "Busca...");
                    resultados.appendChild(buscador);

                    buscador.onclick = function (e) {
                        e.stopPropagation();
                    };
                    buscador.onkeyup = function (e) {
                        let busca = this.value;
                        contieneresultados.innerHTML = "";
                        opciones.forEach(function (opcion) {
                            if (
                                opcion.textContent
                                    .toLowerCase()
                                    .includes(busca.toLowerCase())
                            ) {
                                let texto = document.createElement("p");
                                texto.textContent = opcion.textContent;
                                contieneresultados.appendChild(texto);
                                texto.onclick = function () {
                                    resultados.remove();
                                    caja.textContent = texto.textContent;
                                    selector.value = opcion.value;

                                    // actualizar los campos de IBAN, tipo de contacto y alias
                                    const registro = data[selector.value];
                                    ibanInput.value = registro ? registro.iban : "";
                                    tipoContactoInput.value = registro
                                        ? registro.tipoContacto
                                        : "";
                                    aliasInput.value = registro ? registro.alias : "";
                                };
                            }
                        });
                    };

                    let contieneresultados = document.createElement("div");
                    contieneresultados.onclick = function (e) {
                        e.stopPropagation();
                    };

                    let opciones = selector.querySelectorAll("option");
                    opciones.forEach(function (opcion) {
                        let texto = document.createElement("p");
                        texto.textContent = opcion.textContent;
                        contieneresultados.appendChild(texto);
                        texto.onclick = function () {
                            resultados.remove();
                            caja.textContent = texto.textContent;
                            selector.value = opcion.value;

                            // actualizar los datos de los campos al seleccionar una opción
                            const registro = data[selector.value];
                            ibanInput.value = registro ? registro.iban : "";
                            tipoContactoInput.value = registro
                                ? registro.tipoContacto
                                : "";
                            aliasInput.value = registro ? registro.alias : "";
                        };
                    });

                    resultados.appendChild(contieneresultados);
                    resultados.onclick = function (e) {
                        e.stopPropagation();
                    };
                };

                // cuando se haga clic fuera del selector, se cierran los resultados
                document.onclick = function () {
                    contenedores.forEach(function (contenedor) {
                        try {
                            contenedor.querySelector(".resultados").remove();
                            contenedor.querySelector(".caja").classList.remove("radio2");
                        } catch (error) {}
                    });
                };
            }

            // inicializamos el selector con las opciones generadas
            select(selector);
        });
    </script>
</body>
<footer>
  <h4 id="footer">miBanco por CodeCath. 2024. Todos los derechos reservados.</h4>
</footer>
</html>