function poblarMenuNavegacion(datos) {
    let menu = document.querySelector("nav ul"); // selecciono el menú de navegación donde se añadirán las entradas dinámicas

    datos.forEach(function (tabla) { // recorro cada tabla obtenida de la base de datos
        let nombre_de_la_tabla = tabla['Tables_in_apex']; // obtengo el nombre de la tabla
        let elemento = document.createElement("li"); // creo un nuevo elemento de lista
        elemento.textContent = nombre_de_la_tabla; // establezco el nombre de la tabla como texto del elemento

        // añado atributos personalizados
        elemento.setAttribute("tooltip", "Haz click para cargar la información de la tabla " + nombre_de_la_tabla);
        elemento.setAttribute("comentario", tabla['Comentario']); // guardo el comentario de la tabla

        elemento.onclick = function () { // al hacer clic en el elemento
            let texto = this.textContent; // obtengo el texto del elemento
            cargaDatosTabla(texto); // llamo a la función para cargar los datos de la tabla seleccionada
            document.querySelector(".titulotabla h5").textContent = this.textContent; // actualizo el título
            document.querySelector(".titulotabla p").textContent = this.getAttribute("comentario"); // actualizo el comentario

            // quito la clase de selección de todos los elementos del menú
            let elementosmenu = document.querySelectorAll("nav ul li");
            elementosmenu.forEach(function (elemento) {
                elemento.classList.remove("menuseleccionado");
            });

            this.classList.add("menuseleccionado"); // añado la clase de selección al elemento actual
        };

        menu.appendChild(elemento); // añado el nuevo elemento al menú
    });
}
