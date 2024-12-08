function select(selector) {

    let contenedores = []; // creo un array para almacenar los contenedores personalizados

    contenedores.push(document.createElement("div")); // creo un nuevo contenedor div
    contenedores[contenedores.length - 1].classList.add("select"); // añado una clase al contenedor

    contenedores[contenedores.length - 1].onclick = function (e) {
        e.stopPropagation(); // detengo la propagación del evento para evitar cierres inesperados
    };

    selector.replaceWith(contenedores[contenedores.length - 1]); // reemplazo el select original por el contenedor personalizado
    let caja = document.createElement("div"); // creo un div para simular la selección
    caja.classList.add("caja"); // añado una clase al div
    caja.textContent = selector.querySelector("option:first-child").textContent; // añado el texto del primer option
    contenedores[contenedores.length - 1].appendChild(caja); // añado la caja al contenedor
    contenedores[contenedores.length - 1].appendChild(selector); // vuelvo a añadir el select al contenedor (oculto)

    caja.onclick = function (e) { // cuando hago clic en la caja
        e.stopPropagation(); // detengo la propagación
        caja.classList.add("radio2"); // cambio la clase para simular un estado activo

        let resultados = document.createElement("div"); // creo un div para mostrar los resultados
        resultados.classList.add("resultados"); // añado una clase al div
        this.appendChild(resultados); // añado los resultados a la caja

        let buscador = document.createElement("input"); // creo un input para búsqueda
        buscador.setAttribute("type", "search"); // especifico el tipo como búsqueda
        buscador.setAttribute("placeholder", "busca..."); // añado un texto de marcador de posición
        resultados.appendChild(buscador); // añado el input a los resultados

        buscador.onclick = function (e) {
            e.stopPropagation(); // detengo la propagación al hacer clic en el buscador
        };

        buscador.onkeyup = function () { // detecto el ingreso de texto
            let busca = this.value; // obtengo el texto ingresado
            contieneresultados.innerHTML = ""; // vacío los resultados actuales

            opciones.forEach(function (opcion) { // para cada opción del select
                if (opcion.textContent.toLowerCase().includes(busca.toLowerCase())) { // si coincide con la búsqueda
                    let texto = document.createElement("p"); // creo un párrafo
                    texto.textContent = opcion.textContent; // añado el texto de la opción
                    contieneresultados.appendChild(texto); // añado el párrafo a los resultados
                    texto.onclick = function () { // cuando se selecciona una opción
                        resultados.remove(); // elimino los resultados
                        caja.textContent = texto.textContent; // actualizo la caja con el texto seleccionado

                        let opciones2 = selector.querySelectorAll("option"); // obtengo todas las opciones
                        opciones2.forEach(function (opcion2) { // para cada opción
                            if (opcion2.textContent == texto.textContent) { // si coincide con el texto seleccionado
                                opcion2.setAttribute("selected", true); // marco la opción como seleccionada
                            } else {
                                opcion2.removeAttribute("selected"); // desmarco las demás
                            }
                        });
                    };
                }
            });
        };

        let contieneresultados = document.createElement("div"); // creo un contenedor para los resultados
        contieneresultados.onclick = function (e) {
            e.stopPropagation(); // detengo la propagación al interactuar con los resultados
        };

        let opciones = selector.querySelectorAll("option"); // obtengo todas las opciones del select
        opciones.forEach(function (opcion) { // para cada opción
            let texto = document.createElement("p"); // creo un párrafo
            texto.textContent = opcion.textContent; // añado el texto de la opción
            contieneresultados.appendChild(texto); // añado el párrafo a los resultados
            texto.onclick = function () { // cuando se selecciona una opción
                resultados.remove(); // elimino los resultados
                caja.textContent = texto.textContent; // actualizo la caja con el texto seleccionado

                let opciones2 = selector.querySelectorAll("option"); // obtengo todas las opciones
                opciones2.forEach(function (opcion2) { // para cada opción
                    if (opcion2.textContent == texto.textContent) { // si coincide con el texto seleccionado
                        opcion2.setAttribute("selected", true); // marco la opción como seleccionada
                    } else {
                        opcion2.removeAttribute("selected"); // desmarco las demás
                    }
                });
            };
        });

        resultados.appendChild(contieneresultados); // añado el contenedor de resultados al div de resultados
        resultados.onclick = function (e) {
            e.stopPropagation(); // detengo la propagación al interactuar con los resultados
        };
    };

    document.onclick = function () { // al hacer clic en cualquier parte del documento
        contenedores.forEach(function (contenedor) { // recorro los contenedores
            try {
                contenedor.querySelector(".resultados").remove(); // elimino los resultados abiertos
                contenedor.querySelector(".caja").classList.remove("radio2"); // desactivo el estado activo de la caja
            } catch (error) {
                console.log("error pero no pasa nada"); // manejo el error si no hay resultados abiertos
            }
        });
    };
}
