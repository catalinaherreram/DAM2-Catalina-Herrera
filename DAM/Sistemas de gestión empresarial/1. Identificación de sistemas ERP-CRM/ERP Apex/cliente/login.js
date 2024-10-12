-window.onload = function() {
    console.log("Javascript cargado");
    document.querySelector("#login").onclick = function() {
        console.log("Has pulsado el boton");
        let usuario = document.querySelector("#usuario").value;
        let contrasena = document.querySelector("#contrasena").value;
        let contrasena = document.querySelector("#userId").value;
        console.log(usuario, contrasena);

        // Crear objeto de envío
        let envio = { "usuario": usuario, "contrasena": contrasena };
        console.log(envio);

        // Enviar datos en POST
        fetch("../servidor/loginusuario.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(envio)
        })
        .then(response => {
            // Asegúrate de que la respuesta sea OK
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convertir a JSON
        })
        .then(data => {
            console.log('Success:', data); 
            if (data.resultado === 'ok') { 
                console.log("Entras correctamente");
                document.querySelector("#feedback").style.color = "green"; // #feedback es el id de un div que creamos en index.html y...
                document.querySelector("#feedback").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos..."; // ...con innerHTML le asignamos texto
                setTimeout(function() {
                    window.location = data.redirect; // Redirigir usando la URL con userId
                }, 5000);
            } else {
                console.log("Error al entrar");
                document.querySelector("#feedback").style.color = "red"; 
                document.querySelector("#feedback").innerHTML = "Usuario incorrecto. Redirigiendo en 5 segundos...";
                setTimeout(function() {
                    window.location = window.location;
                }, 5000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector("#feedback").style.color = "red"; 
            document.querySelector("#feedback").innerHTML = "Error en la comunicación con el servidor.";
        });
    }
}
