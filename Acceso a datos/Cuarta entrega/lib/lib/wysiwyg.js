document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("textarea").forEach(areaTexto => {
        let contenedor = document.createElement("div");
        contenedor.classList.add("wysiwyg");

        let barraHerramientas = document.createElement("div");
        barraHerramientas.classList.add("barra-herramientas");

        let editor = document.createElement("div");
        editor.classList.add("editor");
        editor.contentEditable = "true";  
        editor.innerHTML = areaTexto.value;  
        areaTexto.style.display = "none";  

        function crearBoton(etiqueta, comando) {
            let boton = document.createElement("button");
            boton.innerHTML = etiqueta;
            boton.onclick = function () {
                document.execCommand(comando);
                areaTexto.value = editor.innerHTML;
            };
            return boton;
        }

        function crearSelectorColor() {
            let selectorColor = document.createElement("input");
            selectorColor.type = "color";
            selectorColor.oninput = function () {
                document.execCommand("foreColor", false, selectorColor.value);
                areaTexto.value = editor.innerHTML;
            };
            return selectorColor;
        }

        function crearSelectorTamanioFuente() {
            let selectorTamanio = document.createElement("select");
            [10, 12, 14, 16, 18, 20].forEach(tamanio => {
                let opcion = document.createElement("option");
                opcion.textContent = tamanio + "px";
                opcion.value = tamanio;
                selectorTamanio.appendChild(opcion);
            });
            selectorTamanio.onchange = function () {
                document.execCommand("fontSize", false, "7");
                let fuentes = editor.querySelectorAll("font[size='7']");
                fuentes.forEach(fuente => {
                    fuente.removeAttribute("size");
                    fuente.style.fontSize = selectorTamanio.value + "px";
                });
                areaTexto.value = editor.innerHTML;
            };
            return selectorTamanio;
        }

        function crearBotonAlineacion() {
            let contenedorAlineacion = document.createElement("div");
            contenedorAlineacion.classList.add("desplegable");

            let botonAlinear = document.createElement("button");
            botonAlinear.textContent = "Alinear";
            botonAlinear.classList.add("boton-alinear");

            let opcionesAlineacion = document.createElement("div");
            opcionesAlineacion.classList.add("contenido-desplegable");

            let opciones = [
                { texto: "Izquierda", comando: "justifyLeft" },
                { texto: "Centro", comando: "justifyCenter" },
                { texto: "Derecha", comando: "justifyRight" },
                { texto: "Justificado", comando: "justifyFull" }
            ];

            opciones.forEach(opcion => {
                let item = document.createElement("button");
                item.textContent = opcion.texto;
                item.onclick = function () {
                    document.execCommand(opcion.comando);
                    opcionesAlineacion.classList.remove("mostrar");
                    areaTexto.value = editor.innerHTML;
                };
                opcionesAlineacion.appendChild(item);
            });

            botonAlinear.onclick = function () {
                opcionesAlineacion.classList.toggle("mostrar");
            };

            contenedorAlineacion.appendChild(botonAlinear);
            contenedorAlineacion.appendChild(opcionesAlineacion);

            return contenedorAlineacion;
        }

        function crearBotonesListas() {
            return [
                crearBoton("Lista", "insertUnorderedList")
            ];
        }

        function crearBotonesDeshacerRehacer() {
            let contenedorDeshacerRehacer = document.createElement("div");
            contenedorDeshacerRehacer.classList.add("grupo-botones");

            let botonDeshacer = document.createElement("button");
            botonDeshacer.textContent = "Deshacer";
            botonDeshacer.onclick = function () {
                document.execCommand("undo");
            };

            let botonRehacer = document.createElement("button");
            botonRehacer.textContent = "Rehacer";
            botonRehacer.onclick = function () {
                document.execCommand("redo");
            };

            contenedorDeshacerRehacer.appendChild(botonDeshacer);
            contenedorDeshacerRehacer.appendChild(botonRehacer);

            return contenedorDeshacerRehacer;
        }

        function crearBotonModoOscuro() {
            let botonModoOscuro = document.createElement("button");
            botonModoOscuro.textContent = "Modo Oscuro";
            botonModoOscuro.onclick = function () {
                document.body.classList.toggle("modo-oscuro");
            };
            return botonModoOscuro;
        }

        barraHerramientas.appendChild(crearBotonesDeshacerRehacer());
        barraHerramientas.appendChild(crearBoton("<b>B</b>", "bold"));
        barraHerramientas.appendChild(crearBoton("<i>I</i>", "italic"));
        barraHerramientas.appendChild(crearBoton("<u>U</u>", "underline"));
        barraHerramientas.appendChild(crearBotonAlineacion());
        barraHerramientas.appendChild(...crearBotonesListas());
        barraHerramientas.appendChild(crearSelectorColor());
        barraHerramientas.appendChild(crearSelectorTamanioFuente());
        barraHerramientas.appendChild(crearBotonModoOscuro());

        contenedor.appendChild(barraHerramientas);
        contenedor.appendChild(editor);
        areaTexto.parentNode.replaceChild(contenedor, areaTexto);

        editor.oninput = function () {
            areaTexto.value = editor.innerHTML;
        };
    });
});
