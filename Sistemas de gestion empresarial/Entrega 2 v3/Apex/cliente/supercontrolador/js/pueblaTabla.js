/////////////////////////////////// FUNCIÓN PARA EDITAR UNA CELDA /////////////////////////////////////////////
function editarCelda(celda, campoclave, clavePrimaria, tabla) {
    const claveCampo = celda.getAttribute("data-clave"); // Campo de la celda
    const valorOriginal = celda.textContent; // Valor inicial
    const input = document.createElement("input"); // Crear un input
    input.type = "text";
    input.value = valorOriginal;
    celda.textContent = ""; // Vaciar el contenido original
    celda.appendChild(input); // Añadir el input

    input.onblur = input.onkeydown = function (event) {
        if (event.type === "blur" || event.key === "Enter") {
            const nuevoValor = input.value.trim();
            if (nuevoValor !== valorOriginal) {
                // Llamada al servidor para actualizar
                fetch("../../servidor/?o=actualizaTabla", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tabla, clavePrimaria, campo: claveCampo, valor: nuevoValor })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) celda.textContent = nuevoValor;
                        else celda.textContent = valorOriginal;
                    })
                    .catch(() => celda.textContent = valorOriginal);
            } else celda.textContent = valorOriginal;
        }
    }

    input.focus();
    input.select();
}

/////////////////////////////////// CREO UNA FUNCIÓN PARA POBLAR EL CONTENIDO DE LAS TABLAS /////////////////////////////////////////////
function pueblaTabla(datos, campoclave, tabla) {
    let contenidotabla = document.querySelector("section table tbody"); // Selecciono el contenido vacío de la tabla
    contenidotabla.innerHTML = ""; // Vacío la tabla por si había algo

    datos.forEach(function (registro) { // Como datos es un array, hago un forEach para repasarlo
        let clave_primaria;
        let nuevafila = document.createElement("tr"); // Creo una nueva fila como un elemento html vacío
        Object.keys(registro).forEach(clave => { // Fórmula para recorrer correctamente las propiedades de un objeto
            if (clave == campoclave) { // Si este campo que estoy viendo ahora mismo es además la clave primaria
                clave_primaria = registro[clave]; // Guarda el número de la clave primaria como identificador de registro
            }
            let nuevacolumna = document.createElement("td"); // Creo una nueva columna html
            nuevacolumna.textContent = registro[clave]; // Le pongo el contenido en texto
            nuevacolumna.setAttribute("data-clave", clave); // Agrego un atributo con el nombre del campo
            nuevacolumna.setAttribute("data-id", clave_primaria); // Agrego un atributo con la clave primaria
            nuevacolumna.setAttribute("data-tabla", tabla); // Agrego un atributo con el nombre de la tabla

            // Agrego el evento de doble clic para editar la celda
            nuevacolumna.ondblclick = function () {
                editarCelda(this, campoclave, this.getAttribute("data-id"), this.getAttribute("data-tabla"));
            };

            nuevafila.appendChild(nuevacolumna); // Introduzco la columna dentro de la fila
        });

        let nuevacolumna = document.createElement("td"); // Creo una nueva columna
        nuevacolumna.textContent = "🗑️"; // Le doy el emoji de la papelera
        nuevacolumna.setAttribute("claveprimaria", clave_primaria); // Además le pongo un atributo que se llama claveprimaria
        nuevafila.appendChild(nuevacolumna); // Lo pongo en las columnas
        nuevacolumna.onclick = function () { // Cuando haga clic en la papelera
            console.log("Vamos a eliminar algo"); // Vamos a eliminar algo
            let identificador = this.getAttribute("claveprimaria"); // Tomo el identificador
            fetch("../../servidor/?o=eliminar&tabla=" + tabla + "&id=" + identificador) // Hago una petición a un microservicio para eliminar un registro
                .then(() => this.parentElement.remove()) // Elimino visualmente el elemento
                .catch(console.error);
        };
        contenidotabla.appendChild(nuevafila); // Introduzco la fila dentro de la tabla
    });
}
