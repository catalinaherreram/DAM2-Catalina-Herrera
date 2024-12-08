/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = []                                             // Creo una variable global para almacenar las columnas

/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

window.onload = function(){
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas")                        // LLamo a un microservicio que me da la lista de tablas
        .then(response => {
          return response.json();                                   // Quiero que el servidor me devuelva un json
        })
        .then(datos => {
        		poblarMenuNavegacion(datos);
        })
    
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
     
    cargaDatosTabla("clientes")                                 // Cuando arranca el programa, le pongo una tabla por defecto
    
    /////////////////////////////////// CLICK VENTANA MODAL PARA INSERTAR /////////////////////////////////////////////
    
    document.querySelector("#insertar").onclick = function(){
        document.querySelector("#modal").style.display = "block"
        document.querySelector("#modal").classList.remove("desaparece")
        document.querySelector("#modal").classList.add("aparece")
    }
    document.querySelector("#modal").onclick = function(){
        
        document.querySelector("#modal").classList.remove("aparece")
        document.querySelector("#modal").classList.add("desaparece")
        setTimeout(function(){
            document.querySelector("#modal").style.display = "none"
        },1000)
    }
    document.querySelector("#contienemodal").onclick = function(event){
        event.stopPropagation()
    }
}


 
 
 
 


/* /////////////////////////////////// VARIABLES GLOBALES /////////////////////////////////////////////
var columnas_tabla = []; // Almacena las columnas de la tabla actual.
var campoclave;          // Guarda el nombre de la clave primaria de la tabla.

/////////////////////////////////// FUNCIÓN PARA EDITAR UNA CELDA /////////////////////////////////////////////
function editarCelda(celda, campoclave, clavePrimaria, tabla) {
    const claveCampo = celda.getAttribute("data-clave");
    const valorOriginal = celda.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.value = valorOriginal;
    celda.textContent = "";
    celda.appendChild(input);

    input.onblur = input.onkeydown = function (event) {
        if (event.type === "blur" || event.key === "Enter") {
            const nuevoValor = input.value.trim();
            if (nuevoValor !== valorOriginal) {
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
    };

    input.focus();
    input.select();
}

/////////////////////////////////// CARGA INICIAL /////////////////////////////////////////////
window.onload = function () {
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    fetch("../../servidor/?o=listatablas")
        .then(response => response.json())
        .then(datos => {
            console.log("Datos recibidos del servidor (listatablas):", datos);
            let menu = document.querySelector("nav ul");
            datos.forEach(function (tabla) {
                let nombre_de_la_tabla = tabla['Tables_in_apex'];
                let elemento = document.createElement("li");
                elemento.textContent = nombre_de_la_tabla;
                elemento.setAttribute("comentario", tabla['Comentario']);
                elemento.onclick = function () {
                    let texto = this.textContent;
                    cargaDatosTabla(texto);
                    document.querySelector(".titulotabla h5").textContent = texto;
                    document.querySelector(".titulotabla p").textContent = this.getAttribute("comentario");

                    document.querySelectorAll("nav ul li").forEach(function (elem) {
                        elem.classList.remove("menuseleccionado");
                    });

                    this.classList.add("menuseleccionado");
                };
                menu.appendChild(elemento);
            });
        });
    
    cargaDatosTabla("clientes"); // Tabla cargada por defecto al inicio.

    /////////////////////////////////// CLICK EN EL BOTÓN INSERTAR /////////////////////////////////////////////
    document.querySelector("#insertar").onclick = function(){
        document.querySelector("#modal").style.display = "block";
        document.querySelector("#modal").classList.remove("desaparece");
        document.querySelector("#modal").classList.add("aparece");
    };

    document.querySelector("#modal").onclick = function(){
        document.querySelector("#modal").classList.remove("aparece");
        document.querySelector("#modal").classList.add("desaparece");
        setTimeout(function(){
            document.querySelector("#modal").style.display = "none";
        }, 1000);
    };

    document.querySelector("#contienemodal").onclick = function(event){
        event.stopPropagation();
    };
}

/////////////////////////////////// FUNCIÓN PARA CARGAR CONTENIDO DE LA TABLA /////////////////////////////////////////////
function cargarContenidoTabla(tabla) {
    fetch("../../servidor/?o=tabla&tabla=" + tabla)
        .then(response => response.json())
        .then(datos => {
            pueblaTabla(datos, campoclave, tabla);
        })
        .catch(error => console.error("Error al cargar los datos de la tabla:", error));
}

/////////////////////////////////// FUNCIÓN PARA MOSTRAR LA TABLA EN EL HTML /////////////////////////////////////////////
function pueblaTabla(datos, campoclave, tabla){
    let contenidotabla = document.querySelector("section table tbody");
    contenidotabla.innerHTML = ""; // Vacío la tabla
    
    datos.forEach(function(registro){
        let clave_primaria;
        let nuevafila = document.createElement("tr");
        Object.keys(registro).forEach(clave => {
            if (clave == campoclave) {
                clave_primaria = registro[clave];
            }
            let nuevacolumna = document.createElement("td");
            nuevacolumna.textContent = registro[clave];
            nuevacolumna.setAttribute("data-clave", clave);
            nuevacolumna.onclick = function() {
                editarCelda(this, campoclave, clave_primaria, tabla);
            };
            nuevafila.appendChild(nuevacolumna);
        });

        let nuevacolumna = document.createElement("td");
        nuevacolumna.textContent = "🗑️";
        nuevacolumna.setAttribute("claveprimaria", clave_primaria);
        nuevacolumna.onclick = function() {
            let identificador = this.getAttribute("claveprimaria");
            fetch("../../servidor/?o=eliminar&tabla="+tabla+"&id="+identificador)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.parentElement.remove();
                        console.log("Elemento eliminado con éxito.");
                    } else {
                        console.error("Error al eliminar el elemento:", data.error);
                    }
                })
                .catch(error => console.error("Error en la petición de borrado:", error));
        };
        nuevafila.appendChild(nuevacolumna);
        contenidotabla.appendChild(nuevafila);
    });
}

/////////////////////////////////// FUNCIÓN PARA CARGAR TABLA /////////////////////////////////////////////
function cargaDatosTabla(tabla) {
    let campos_busqueda;
    fetch("../../servidor/?o=columnastabla&tabla=" + tabla)
        .then(response => response.json())
        .then(datos => {
            columnas_tabla = [];
            tipos_tabla = [];
            claves_tabla = [];
            campos_busqueda = [];
            let cabeceras_tabla = document.querySelector("table thead tr");
            cabeceras_tabla.innerHTML = "";
            datos.forEach(function(dato){
                let elemento = document.createElement("th");
                columnas_tabla.push(dato['Field']);
                
                elemento.textContent = dato['Field'];
                campos_busqueda.push(document.createElement("input"));
                campos_busqueda[campos_busqueda.length - 1].setAttribute("placeholder", dato['Field']);
                
                claves_tabla.push(dato['Key']);
                
                if (dato['Type'].includes("varchar")) {
                    campos_busqueda[campos_busqueda.length - 1].setAttribute("type", "text");
                    tipos_tabla.push("text");
                } else if (dato['Type'].includes("int")) {
                    campos_busqueda[campos_busqueda.length - 1].setAttribute("type", "number");
                    tipos_tabla.push("number");
                } else if (dato['Type'].includes("date")) {
                    campos_busqueda[campos_busqueda.length - 1].setAttribute("type", "date");
                    tipos_tabla.push("date");
                } else if (dato['Type'].includes("decimal")) {
                    campos_busqueda[campos_busqueda.length - 1].setAttribute("type", "number");
                    tipos_tabla.push("number");
                }
                
                elemento.appendChild(campos_busqueda[campos_busqueda.length - 1]);
                cabeceras_tabla.appendChild(elemento);

                if (dato['Key'] === "PRI") {
                    campoclave = dato['Field'];
                }
            });

            let thAcciones = document.createElement("th");
            thAcciones.textContent = "Acciones";
            cabeceras_tabla.appendChild(thAcciones);

            prepararModalInsercion(tabla, tipos_tabla);
            cargarContenidoTabla(tabla);
        });
}

/////////////////////////////////// FUNCIÓN PARA CONFIGURAR EL MODAL DE INSERCIÓN /////////////////////////////////////////////
function prepararModalInsercion(tabla, tipos_tabla) {
    let coleccioncampos = [];
    let contiene_modal = document.querySelector("#contienemodal");
    contiene_modal.innerHTML = "<h1>Formulario de inserción</h1>";
    let seccion = document.createElement("section");

    columnas_tabla.forEach(function (columna, index) {
        let contenedor = document.createElement("div");
        let texto = document.createElement("p");
        texto.textContent = "Inserta un nuevo elemento";
        contenedor.appendChild(texto);

        if (claves_tabla[index] !== "MUL") {
            let input = document.createElement("input");
            input.setAttribute("type", tipos_tabla[index]); // Aplica el tipo correcto
            input.setAttribute("placeholder", columna);
            coleccioncampos.push(input);

            contenedor.appendChild(input);
            seccion.appendChild(contenedor);
        }
    });

    contiene_modal.appendChild(seccion);

    let boton_enviar = document.createElement("button");
    boton_enviar.textContent = "Enviar";
    boton_enviar.onclick = function () {
        let mensaje = {};
        coleccioncampos.forEach(function (campo) {
            if (campo.getAttribute("placeholder") !== "Identificador") {
                mensaje[campo.getAttribute("placeholder")] = campo.value;
            }
        });

        fetch("../../servidor/?o=insertar&tabla=" + tabla, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mensaje),
        })
            .then(response => response.text())
            .then(datos => {
                console.log("Inserción completada:", datos);
                document.querySelector("#modal").classList.remove("aparece");
                document.querySelector("#modal").classList.add("desaparece");
                setTimeout(() => {
                    document.querySelector("#modal").style.display = "none";
                }, 1000);
            });
    };
    contiene_modal.appendChild(boton_enviar);
}
*/