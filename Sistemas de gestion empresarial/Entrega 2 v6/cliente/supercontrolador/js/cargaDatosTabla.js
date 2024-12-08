/////////////////////////////////// CREO UNA FUNCIÓN PARA CARGAR DINÁMICAMENTE TABLAS /////////////////////////////////////////////

function cargaDatosTabla(tabla) {
    let campoclave; // almacena el nombre del campo que es clave primaria

    /////////////////////////////////// LISTADO DE COLUMNAS DE TABLA /////////////////////////////////////////////

    fetch("../../servidor/?o=columnastabla&tabla=" + tabla) // obtengo las columnas de la tabla desde el servidor
        .then(response => response.json()) // transformo la respuesta a JSON
        .then(datos => {
            columnas_tabla = []; // vacío las columnas previas
            tipos_tabla = []; // array para los tipos de datos de las columnas
            claves_tabla = []; // array para las claves de las columnas
            campos_busqueda = []; // array para los inputs del buscador
            let cabeceras_tabla = document.querySelector("table thead tr"); // selecciono las cabeceras de la tabla
            cabeceras_tabla.innerHTML = ""; // vacío las cabeceras previas

            datos.forEach(function (dato) { // recorro cada columna
                let elemento = document.createElement("th"); // creo una nueva cabecera
                columnas_tabla.push(dato['Field']); // añado la columna al array
                elemento.textContent = dato['Field']; // añado el texto con el nombre de la columna

                let campoBusqueda = document.createElement("input"); // creo un input para búsqueda
                campoBusqueda.setAttribute("placeholder", dato['Field']); // añado un placeholder con el nombre de la columna
                campoBusqueda.setAttribute("type", convierteTipoDato(dato['Type'])); // establezco el tipo de dato del input
                campos_busqueda.push(campoBusqueda); // añado el input al array de campos
                elemento.appendChild(campoBusqueda); // añado el input a la cabecera
                cabeceras_tabla.appendChild(elemento); // añado la cabecera a la tabla

                tipos_tabla.push(convierteTipoDato(dato['Type'])); // guardo el tipo de dato
                claves_tabla.push(dato['Key']); // guardo el tipo de clave

                if (dato['Key'] == "PRI") { // si es clave primaria
                    campoclave = dato['Field']; // almaceno el nombre de la clave primaria
                }
            });

            let elemento = document.createElement("th"); // creo una cabecera adicional para la lupa
            elemento.textContent = "🔍"; // añado el icono de lupa
            cabeceras_tabla.appendChild(elemento); // añado la cabecera a la tabla
            elemento.onclick = function () { // al hacer clic en la lupa
                let mensaje = {}; // objeto para los filtros de búsqueda
                campos_busqueda.forEach(function (campo) { // recorro los inputs de búsqueda
                    let columna = campo.getAttribute("placeholder"); // obtengo el nombre de la columna
                    let valor = campo.value; // obtengo el valor ingresado
                    if (valor != "") { // si el campo no está vacío
                        mensaje[columna] = valor; // añado el valor al objeto de filtros
                    }
                });

                fetch("../../servidor/?o=buscarSimilar&tabla=" + tabla, { // envío los filtros al servidor
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                    .then(response => response.json()) // obtengo los datos filtrados
                    .then(datos => {
                        pueblaTabla(datos, campoclave, tabla); // lleno la tabla con los datos filtrados
                    });
            };

            /////////////////////////////////// MODAL PARA INSERTAR NUEVOS DATOS /////////////////////////////////////////////

            let contiene_modal = document.querySelector("#contienemodal"); // selecciono el modal
            contiene_modal.innerHTML = "<h1>Formulario de inserción: " + tabla + "</h1>"; // titulo del modal
            let seccion = document.createElement("section"); // creo una sección para los campos

            columnas_tabla.forEach(function (columna, index) { // recorro las columnas de la tabla
                let contenedor = document.createElement("div");
                let texto = document.createElement("p");
                texto.textContent = "Inserta un nuevo elemento para: " + columna;
                contenedor.appendChild(texto);

                if (claves_tabla[index] != "MUL") { // si no es clave foránea
                    let campoInput = document.createElement("input");
                    campoInput.setAttribute("type", tipos_tabla[index]); // tipo de dato
                    campoInput.setAttribute("placeholder", columna); // nombre de la columna como placeholder
                    contenedor.appendChild(campoInput);
                } else { // si es clave foránea
                    let selectElement = document.createElement("select");
                    let defaultOption = document.createElement("option");
                    defaultOption.textContent = "Selecciona una opción:";
                    selectElement.appendChild(defaultOption);
                    fetchOptionsForSelect(selectElement, columna); // obtengo las opciones para el select
                    contenedor.appendChild(selectElement);
                }

                seccion.appendChild(contenedor); // añado el contenedor a la sección
            });

            contiene_modal.appendChild(seccion);

            let boton_enviar = document.createElement("button"); // creo un botón para enviar el formulario
            boton_enviar.textContent = "Enviar";
            boton_enviar.onclick = function () { // al hacer clic en el botón
                let formData = new FormData();
                campos_busqueda.forEach(function (campo) {
                    if (campo.getAttribute('type') === "file") {
                        formData.append(campo.getAttribute('placeholder'), campo.files[0]);
                    } else {
                        formData.append(campo.getAttribute('placeholder'), campo.value);
                    }
                });

                fetch("../../servidor/?o=insertar&tabla=" + tabla, { // envío el formulario al servidor
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.text())
                    .then(datos => {
                        console.log(datos);
                        document.querySelector("#modal").classList.add("desaparece");
                        setTimeout(() => {
                            document.querySelector("#modal").style.display = "none";
                        }, 1000);
                    });
            };
            contiene_modal.appendChild(boton_enviar);

            /////////////////////////////////// CONTENIDO DE LA TABLA /////////////////////////////////////////////

            fetch("../../servidor/?o=tabla&tabla=" + tabla) // obtengo los datos de la tabla
                .then(response => response.json())
                .then(datos => {
                    pueblaTabla(datos, campoclave, tabla); // lleno la tabla con los datos
                });
        });
}

function fetchOptionsForSelect(selectElement, column) {
    fetch("../../servidor/?o=tabla&tabla=" + column.split("_")[0]) // obtengo las opciones para el select
        .then(response => response.json())
        .then(datos => {
            datos.forEach(function (dato) {
                let option = document.createElement("option");
                option.value = dato['Identificador'];
                option.textContent = Object.values(dato).join(' - ');
                selectElement.appendChild(option);
            });
        });
}

