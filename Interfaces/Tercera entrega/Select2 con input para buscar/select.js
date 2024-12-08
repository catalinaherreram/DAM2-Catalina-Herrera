window.onload = function(){
    let contenedores = [] // arreglo para almacenar los contenedores creados
    let selectores = document.querySelectorAll(".select"); // selecciona todos los selectores con la clase "select"
    selectores.forEach(function(selector){ // recorre cada uno de los selectores
        contenedores.push(document.createElement("div")) // crea un nuevo div y lo añade al arreglo de contenedores
        contenedores[contenedores.length-1].classList.add("select") // agrega la clase "select" al contenedor creado

        contenedores[contenedores.length-1].onclick = function(e){
            e.stopPropagation() // previene la propagación del evento de clic
        }

        selector.replaceWith(contenedores[contenedores.length-1]) // reemplaza el selector original con el contenedor
        let caja = document.createElement("div") // crea un elemento div para la caja
        caja.classList.add("caja") // añade la clase "caja" al div
        caja.textContent = "Click para desplegar"; // establece un texto genérico en la caja por defecto
        contenedores[contenedores.length-1].appendChild(caja) // añade la caja al contenedor
        contenedores[contenedores.length-1].appendChild(selector) // añade el selector original al contenedor

        caja.onclick = function(e){ // evento al hacer clic en la caja
            e.stopPropagation() // previene la propagación del evento de clic
            caja.classList.add("radio2") // añade la clase "radio2" a la caja
            let resultados = document.createElement("div") // crea un div para mostrar los resultados
            resultados.classList.add("resultados") // añade la clase "resultados" al div
            this.appendChild(resultados) // añade el div de resultados al contenedor

            let buscador = document.createElement("input") // crea un campo input para búsqueda
            buscador.setAttribute("type", "search") // establece el tipo del input como "search"
            buscador.setAttribute("placeholder", "Buscar") // establece el texto placeholder del buscador
            resultados.appendChild(buscador) // añade el buscador al div de resultados

            buscador.onclick = function(e){
                e.stopPropagation() // previene la propagación del evento de clic
            }

            buscador.onkeyup = function(e){ // evento al escribir en el buscador
                let busca = this.value // obtiene el texto ingresado en el buscador
                contieneresultados.innerHTML = "" // limpia los resultados previos
                opciones.forEach(function(opcion){ // recorre cada opción del selector
                    if(opcion.textContent.toLowerCase().includes(busca.toLowerCase())){ // filtra opciones que coincidan con el texto buscado
                        let texto = document.createElement("p") // crea un elemento p para la opción
                        texto.textContent = opcion.textContent // establece el texto de la opción
                        contieneresultados.appendChild(texto) // añade el elemento p al contenedor de resultados
                        texto.onclick = function(){ // evento al hacer clic en una opción
                            console.log("Has hecho click en la opcion: ", texto.textContent) // mensaje de depuración
                            resultados.remove() // elimina el div de resultados
                            caja.textContent = texto.textContent // actualiza el texto de la caja
                            let opciones2 = selector.querySelectorAll("option") // selecciona todas las opciones del selector
                            opciones2.forEach(function(opcion2){ // recorre todas las opciones
                                if(opcion2.textContent == texto.textContent){
                                    opcion2.setAttribute("selected", true) // selecciona la opción correspondiente
                                }else{
                                    opcion2.removeAttribute("selected") // deselecciona las demás opciones
                                }
                            })
                        }
                    }
                })
            }

            let contieneresultados = document.createElement("div") // crea un contenedor intermedio para las opciones
            contieneresultados.onclick = function(e){
                e.stopPropagation() // previene la propagación del evento de clic
            }

            let opciones = selector.querySelectorAll("option") // selecciona todas las opciones del selector
            opciones.forEach(function(opcion){ // recorre cada opción del selector
                let texto = document.createElement("p") // crea un elemento p para la opción
                texto.textContent = opcion.textContent // establece el texto de la opción
                contieneresultados.appendChild(texto) // añade el elemento p al contenedor de resultados
                texto.onclick = function(){ // evento al hacer clic en una opción
                    console.log("has hecho click en una opcion: ", texto.textContent) // mensaje de depuración
                    resultados.remove() // elimina el div de resultados
                    caja.textContent = texto.textContent // actualiza el texto de la caja
                    let opciones2 = selector.querySelectorAll("option") // selecciona todas las opciones del selector
                    opciones2.forEach(function(opcion2){ // recorre todas las opciones
                        if(opcion2.textContent == texto.textContent){
                            opcion2.setAttribute("selected", true) // selecciona la opción correspondiente
                        }else{
                            opcion2.removeAttribute("selected") // deselecciona las demás opciones
                        }
                    })
                }
            })

            resultados.appendChild(contieneresultados) // añade el contenedor intermedio al div de resultados
            resultados.onclick = function(e){
                e.stopPropagation() // previene la propagación del evento de clic
            }
        }
    })

    document.onclick = function(){ // evento al hacer clic en el documento
        contenedores.forEach(function(contenedor){ // recorre todos los contenedores
            console.log(contenedor) // mensaje de depuración
            try{
                contenedor.querySelector(".resultados").remove() // elimina el div de resultados si existe
                contenedor.querySelector(".caja").classList.remove("radio2") // elimina la clase "radio2" de la caja
            }catch(error){
                console.log("Algo no ha salido bien") // maneja posibles errores
            }
        })
    } 
}
