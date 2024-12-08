/////////////////////////////////// CREO UNA FUNCIÓN PARA POBLAR EL CONTENIDO DE LAS TABLAS /////////////////////////////////////////////

function pueblaTabla(datos, campoclave, tabla) {
    let contenidotabla = document.querySelector("section table tbody"); // selecciono el cuerpo de la tabla
    contenidotabla.innerHTML = ""; // vacío el contenido previo de la tabla

    datos.forEach(function (registro) { // recorro el array de registros
        let clave_primaria;
        let nuevafila = document.createElement("tr"); // creo una nueva fila

        Object.keys(registro).forEach(clave => { // recorro las propiedades del objeto registro
            if (clave == campoclave) { // si la clave es la clave primaria
                clave_primaria = registro[clave]; // guardo el valor como identificador
            }
            let nuevacolumna = document.createElement("td"); // creo una nueva celda
            nuevacolumna.textContent = registro[clave]; // añado el contenido de la propiedad a la celda
            nuevacolumna.setAttribute("tabla", tabla); // añado atributos personalizados a la celda
            nuevacolumna.setAttribute("columna", clave);
            nuevacolumna.setAttribute("Identificador", clave_primaria);

            nuevacolumna.ondblclick = function () { // al hacer doble clic en la celda
                console.log("Has hecho click en una celda");
                this.setAttribute("contenteditable", "true"); // habilito la edición
                this.focus(); // enfoco la celda
            };

            nuevacolumna.onblur = function () { // al salir de la celda
                this.setAttribute("contenteditable", "false"); // deshabilito la edición
                let mensaje = {
                    "tabla": this.getAttribute("tabla"),
                    "columna": this.getAttribute("columna"),
                    "Identificador": this.getAttribute("Identificador"),
                    "valor": this.textContent // recojo el nuevo valor
                };
                // realizo una petición al servidor con el objeto mensaje
                fetch("../../servidor/?o=actualizar", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(mensaje),
                })
                    .then(response => {
                        return response.json(); // espero una respuesta en JSON
                    })
                    .then(datos => {
                        console.log(datos); // muestro la respuesta en la consola
                    });
                console.log(mensaje);
            };

            nuevafila.appendChild(nuevacolumna); // añado la celda a la fila
        });

        let nuevacolumna = document.createElement("td"); // creo una celda para el botón de eliminar
        nuevacolumna.textContent = "🗑️"; // añado un icono de papelera
        nuevacolumna.setAttribute("claveprimaria", clave_primaria); // añado un atributo personalizado con la clave primaria
        nuevacolumna.onclick = function () { // al hacer clic en la papelera
            console.log("Vamos a eliminar algo");
            let identificador = this.getAttribute("claveprimaria"); // obtengo el identificador del registro
            // hago una petición al servidor para eliminar el registro
            fetch("../../servidor/?o=eliminar&tabla=" + tabla + "&id=" + identificador);
            this.parentElement.remove(); // elimino visualmente la fila de la tabla
        };

        nuevafila.appendChild(nuevacolumna); // añado la celda de eliminar a la fila
        contenidotabla.appendChild(nuevafila); // añado la fila al cuerpo de la tabla
    });
}

