/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

var columnas_tabla = [] // creo una variable global para almacenar las columnas

/////////////////////////////////// VARIABLES GLOBALES DEL PROGRAMA /////////////////////////////////////////////

window.onload = function(){
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
    
    fetch("../../servidor/?o=listatablas") // llamo a un microservicio que me da la lista de tablas
        .then(response => {
          return response.json(); // quiero que el servidor me devuelva un json
        })
        .then(datos => {
        		poblarMenuNavegacion(datos); // llamo a una función para poblar el menú de navegación con los datos recibidos
        })
    
    /////////////////////////////////// LISTADO DE TABLAS /////////////////////////////////////////////
     
    cargaDatosTabla("clientes") // cuando arranca el programa, cargo una tabla por defecto
    
    /////////////////////////////////// CLICK VENTANA MODAL PARA INSERTAR /////////////////////////////////////////////
    
    document.querySelector("#insertar").onclick = function(){ 
        document.querySelector("#modal").style.display = "block" // muestro la ventana modal
        document.querySelector("#modal").classList.remove("desaparece") // quito la clase para ocultar
        document.querySelector("#modal").classList.add("aparece") // añado la clase para mostrar
    }
    document.querySelector("#modal").onclick = function(){
        document.querySelector("#modal").classList.remove("aparece") // quito la clase para mostrar
        document.querySelector("#modal").classList.add("desaparece") // añado la clase para ocultar
        setTimeout(function(){
            document.querySelector("#modal").style.display = "none" // oculto la ventana modal después de un segundo
        }, 1000)
    }
    document.querySelector("#contienemodal").onclick = function(event){
        event.stopPropagation() // evito que el clic en el contenido de la modal cierre la ventana
    }
}
