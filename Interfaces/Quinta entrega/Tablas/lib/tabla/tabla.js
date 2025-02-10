document.querySelectorAll(".tabla").forEach(function (tabla) {
    let contenido = [];
    let contenidoOriginal = [];
    let indices = [];
    let cabeceras = tabla.querySelectorAll("thead tr th");
    let estadoOrden = {};

    // Crear una fila extra en el thead para los filtros de búsqueda
    let filaFiltros = document.createElement("tr");

    cabeceras.forEach(function (cabecera, colIndex) {
        let nombreColumna = cabecera.textContent.trim();
        indices.push(nombreColumna);
        estadoOrden[nombreColumna] = 1;

        let filtroCelda = document.createElement("th");

        if (nombreColumna !== "ID") { // No añadimos filtro para el ID
            let inputBusqueda = document.createElement("input");
            inputBusqueda.type = "text";
            inputBusqueda.placeholder = "Buscar...";
            inputBusqueda.style.width = "90%";
            inputBusqueda.dataset.columna = nombreColumna;

            inputBusqueda.addEventListener("input", filtrarTabla);
            filtroCelda.appendChild(inputBusqueda);
        }

        filaFiltros.appendChild(filtroCelda);

        // Agregamos funcionalidad de ordenamiento en las columnas
        cabecera.onclick = function () {
            cabeceras.forEach(col => col.innerText = col.textContent.replace(/ 🔼| 🔽/, ""));
            let ordenActual = estadoOrden[nombreColumna];

            if (ordenActual === 0) {
                contenido = [...contenidoOriginal];
            } else {
                contenido.sort(function (a, b) {
                    let valA = a[nombreColumna].toLowerCase();
                    let valB = b[nombreColumna].toLowerCase();

                    if (!isNaN(valA) && !isNaN(valB)) {
                        valA = parseFloat(valA);
                        valB = parseFloat(valB);
                    }

                    return (valA > valB ? 1 : valA < valB ? -1 : 0) * ordenActual;
                });

                cabecera.innerText = nombreColumna + (ordenActual === 1 ? " 🔽" : " 🔼");
            }

            estadoOrden[nombreColumna] = ordenActual === 1 ? -1 : ordenActual === -1 ? 0 : 1;
            poblarTabla();
        };
    });

    // Agregar columnas para "Eliminar" y "Informe"
    let thEliminar = document.createElement("th");
    thEliminar.textContent = "Eliminar";
    filaFiltros.appendChild(document.createElement("th"));

    let thDescargar = document.createElement("th");
    thDescargar.textContent = "Informe";
    filaFiltros.appendChild(document.createElement("th"));

    tabla.querySelector("thead tr").appendChild(thEliminar);
    tabla.querySelector("thead tr").appendChild(thDescargar);

    tabla.querySelector("thead").appendChild(filaFiltros);

    let registros = tabla.querySelectorAll("tbody tr");
    registros.forEach(function (registro) {
        let linea = {};
        let celdas = registro.querySelectorAll("td");
        celdas.forEach(function (celda, index) {
            linea[indices[index]] = celda.textContent.trim();
        });
        contenido.push(linea);
    });

    contenidoOriginal = [...contenido];
    poblarTabla();

    function poblarTabla(filtrado = contenido) {
        let tbody = tabla.querySelector("tbody");
        tbody.innerHTML = "";
        filtrado.forEach(function (linea, filaIndex) {
            let fila = document.createElement("tr");

            indices.forEach(function (campo) {
                let celda = document.createElement("td");
                celda.innerText = linea[campo];

                // Permitir edición de los valores, excepto el ID
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

                        input.addEventListener("keypress", function (event) {
                            if (event.key === "Enter") {
                                input.blur();
                            }
                        });
                    };
                }

                fila.appendChild(celda);
            });

            // Agregar botón de eliminación
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

    // Función para generar y descargar el informe en formato .txt
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

    // Filtrar datos de la tabla basado en los inputs de búsqueda
    function filtrarTabla() {
        let filtros = {};
        let inputs = filaFiltros.querySelectorAll("input");

        inputs.forEach(input => {
            let columna = input.dataset.columna;
            let valor = input.value.toLowerCase();
            if (valor) filtros[columna] = valor;
        });

        let filtrado = contenidoOriginal.filter(fila =>
            Object.keys(filtros).every(campo => fila[campo].toLowerCase().includes(filtros[campo]))
        );

        poblarTabla(filtrado);
    }
});
