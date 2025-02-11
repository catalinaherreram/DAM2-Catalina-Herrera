document.querySelectorAll(".tabla").forEach(function (tabla) {
    let contenido = []; // Guarda los datos actuales de la tabla
    let contenidoOriginal = []; // Guarda una copia de los datos originales
    let indices = []; // Guarda los nombres de las columnas
    let cabeceras = tabla.querySelectorAll("thead tr th"); // Obtiene las cabeceras de la tabla
    let estadoOrden = {}; // Guarda el estado del ordenamiento de cada columna

    // Crear una fila extra en el encabezado para los filtros de búsqueda
    let filaFiltros = document.createElement("tr");

    cabeceras.forEach(function (cabecera, colIndex) {
        let nombreColumna = cabecera.textContent.trim();
        indices.push(nombreColumna);
        estadoOrden[nombreColumna] = 1; // Inicialmente orden ascendente

        let filtroCelda = document.createElement("th");

        // No se agrega filtro a la columna "ID"
        if (nombreColumna !== "ID") {
            let inputBusqueda = document.createElement("input");
            inputBusqueda.type = "text";
            inputBusqueda.placeholder = "Buscar...";
            inputBusqueda.style.width = "90%";
            inputBusqueda.dataset.columna = nombreColumna;

            inputBusqueda.addEventListener("input", filtrarTabla); // Agrega evento de búsqueda
            filtroCelda.appendChild(inputBusqueda);
        }

        filaFiltros.appendChild(filtroCelda);

        // Agregar funcionalidad de ordenamiento al hacer clic en la cabecera
        cabecera.onclick = function () {
            // Remover flechas de ordenación en todas las cabeceras
            cabeceras.forEach(col => col.innerText = col.textContent.replace(/ 🔼| 🔽/, ""));
            let ordenActual = estadoOrden[nombreColumna];

            if (ordenActual === 0) {
                // Si el orden está en "sin ordenar", se devuelve al estado original
                contenido = [...contenidoOriginal];
            } else {
                // Ordenar los datos según el estado actual
                contenido.sort(function (a, b) {
                    let valA = a[nombreColumna].toLowerCase();
                    let valB = b[nombreColumna].toLowerCase();

                    // Verificar si los valores son numéricos para ordenarlos correctamente
                    if (!isNaN(valA) && !isNaN(valB)) {
                        valA = parseFloat(valA);
                        valB = parseFloat(valB);
                    }

                    return (valA > valB ? 1 : valA < valB ? -1 : 0) * ordenActual;
                });

                // Agregar el indicador de ordenación en la cabecera
                cabecera.innerText = nombreColumna + (ordenActual === 1 ? " 🔽" : " 🔼");
            }

            // Alternar el estado de ordenación
            estadoOrden[nombreColumna] = ordenActual === 1 ? -1 : ordenActual === -1 ? 0 : 1;
            poblarTabla();
        };
    });

    // Agregar columnas extras para "Eliminar" y "Informe"
    let thEliminar = document.createElement("th");
    thEliminar.textContent = "Eliminar";
    filaFiltros.appendChild(document.createElement("th"));

    let thDescargar = document.createElement("th");
    thDescargar.textContent = "Informe";
    filaFiltros.appendChild(document.createElement("th"));

    // Agregar las columnas a la tabla
    tabla.querySelector("thead tr").appendChild(thEliminar);
    tabla.querySelector("thead tr").appendChild(thDescargar);

    tabla.querySelector("thead").appendChild(filaFiltros);

    // Extraer datos de la tabla y almacenarlos en un array
    let registros = tabla.querySelectorAll("tbody tr");
    registros.forEach(function (registro) {
        let linea = {};
        let celdas = registro.querySelectorAll("td");
        celdas.forEach(function (celda, index) {
            linea[indices[index]] = celda.textContent.trim();
        });
        contenido.push(linea);
    });

    contenidoOriginal = [...contenido]; // Guardamos la copia original
    poblarTabla(); // Llamamos a la función para mostrar los datos en la tabla

    // Función para poblar la tabla con datos actualizados
    function poblarTabla(filtrado = contenido) {
        let tbody = tabla.querySelector("tbody");
        tbody.innerHTML = ""; // Limpiar contenido previo

        filtrado.forEach(function (linea, filaIndex) {
            let fila = document.createElement("tr");

            indices.forEach(function (campo) {
                let celda = document.createElement("td");
                celda.innerText = linea[campo];

                // Permitir edición de las celdas excepto la columna "ID"
                if (campo !== "ID") {
                    celda.ondblclick = function () {
                        let input = document.createElement("input");
                        input.type = "text";
                        input.value = celda.innerText;
                        celda.innerText = "";
                        celda.appendChild(input);
                        input.focus();

                        input.onblur = function () {
                            linea[campo] = input.value.trim();
                            celda.innerText = input.value.trim();
                        };

                        // Guardar cambios al presionar Enter
                        input.addEventListener("keypress", function (event) {
                            if (event.key === "Enter") {
                                input.blur();
                            }
                        });
                    };
                }

                fila.appendChild(celda);
            });

            // Agregar botón para eliminar fila
            let celdaEliminar = document.createElement("td");
            let btnEliminar = document.createElement("button");
            btnEliminar.textContent = "❌";
            btnEliminar.style.cursor = "pointer";
            btnEliminar.style.border = "none";
            btnEliminar.style.background = "transparent";
            btnEliminar.style.fontSize = "18px";

            btnEliminar.onclick = function () {
                contenido.splice(filaIndex, 1);
                contenidoOriginal = [...contenido];
                poblarTabla();
            };

            celdaEliminar.appendChild(btnEliminar);
            fila.appendChild(celdaEliminar);

            // Agregar botón para descargar informe
            let celdaDescargar = document.createElement("td");
            let btnDescargar = document.createElement("button");
            btnDescargar.textContent = "📄";
            btnDescargar.style.cursor = "pointer";
            btnDescargar.style.border = "none";
            btnDescargar.style.background = "transparent";
            btnDescargar.style.fontSize = "18px";

            btnDescargar.onclick = function () {
                descargarInforme(linea);
            };

            celdaDescargar.appendChild(btnDescargar);
            fila.appendChild(celdaDescargar);

            tbody.appendChild(fila);
        });
    }

    // Función para generar y descargar el informe de una fila en formato .txt
    function descargarInforme(datosFila) {
        let contenidoInforme = "Informe de Registro\n";
        contenidoInforme += "===================\n";

        for (let clave in datosFila) {
            if (clave !== "ID") { // Excluir ID del informe
                contenidoInforme += `${clave}: ${datosFila[clave]}\n`;
            }
        }

        let blob = new Blob([contenidoInforme], { type: "text/plain" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "informe.txt";
        link.click();
    }

    // Función para filtrar los datos de la tabla en tiempo real
    function filtrarTabla() {
        let filtros = {};
        let inputs = filaFiltros.querySelectorAll("input");

        // Capturar valores de los filtros
        inputs.forEach(input => {
            let columna = input.dataset.columna;
            let valor = input.value.toLowerCase();
            if (valor) filtros[columna] = valor;
        });

        // Filtrar el contenido basado en los valores ingresados en los filtros
        let filtrado = contenidoOriginal.filter(fila =>
            Object.keys(filtros).every(campo => fila[campo].toLowerCase().includes(filtros[campo]))
        );

        poblarTabla(filtrado); // Volver a dibujar la tabla con los resultados filtrados
    }
});
