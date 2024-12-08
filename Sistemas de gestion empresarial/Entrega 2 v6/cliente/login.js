window.onload = function(){
    console.log("Javascript cargado"); // confirmo que el archivo JavaScript se ha cargado correctamente

    document.querySelector("#login").onclick = function(){ 
        login(); // asocio el clic del botón de login con la función login
    }

    document.onkeypress = function(e){ // detecto cuando se presiona una tecla
        console.log("Has pulsado una tecla"); 
        if(e.code == "Enter"){ // si la tecla presionada es "Enter"
            console.log("Y la tecla es enter");
            login(); // ejecuto la función login
        }
    }
}

function login(){
    console.log("Has pulsado el botón");
    let usuario = document.querySelector("#usuario").value; // obtengo el valor del campo usuario
    let contrasena = document.querySelector("#contrasena").value; // obtengo el valor del campo contrasena
    console.log(usuario, contrasena); // muestro los valores en la consola para verificación

    let mensaje = {"usuario": usuario, "contrasena": contrasena}; // creo un objeto JSON con los datos del usuario

    fetch("../servidor/?o=buscar&tabla=usuarios", { 
        method: 'POST', // método POST para enviar datos
        headers: {
            'Content-Type': 'application/json', // especifico que el contenido es JSON
        },
        body: JSON.stringify(mensaje), // envío el JSON como cuerpo de la petición
    })
    .then(response => {
        return response.json(); // transformo la respuesta en formato JSON
    })
    .then(data => {
        console.log(data); // muestro el JSON recibido en la consola para verificar comunicación

        if(data.length > 0){ // si el login es exitoso (la respuesta tiene datos)
            console.log("Entras correctamente");
            localStorage.setItem('apex_usuario', data[0].usuario); // guardo el usuario en localStorage
            document.querySelector("#feedback").style.color = "green"; // cambio el mensaje de feedback a color verde
            document.querySelector("#feedback").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos..."; // muestro mensaje de éxito
            setTimeout(function(){
                window.location = "escritorio/index.html"; // redirijo al usuario al escritorio
            }, 5000);
        } else { // si el login falla
            console.log("Error al entrar");
            document.querySelector("#feedback").style.color = "red"; // cambio el mensaje de feedback a color rojo
            document.querySelector("#feedback").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos..."; // muestro mensaje de error
            setTimeout(function(){
                window.location = window.location; // recargo la página actual
            }, 5000);
        }
    });
}
