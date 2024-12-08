window.onload = function() {
    console.log("JavaScript cargado");
    document.querySelector("#login").onclick = function() {
        console.log("Has pulsado el botón");
        let usuario = document.querySelector("#usuario").value;
        let contrasena = document.querySelector("#contrasena").value;
        console.log(usuario, contrasena);

        let mensaje = { "usuario": usuario, "contrasena": contrasena };
        
        fetch("../servidor/?o=buscar&tabla=usuarios", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mensaje),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) { // Verifica el campo `success`
                console.log("Entras correctamente");
                localStorage.setItem('apex_usuario', data.usuario);
                document.querySelector("#feedback").style.color = "green";
                document.querySelector("#feedback").innerHTML = "Acceso correcto. Redirigiendo en 5 segundos...";
                setTimeout(function() {
                    window.location = "escritorio/index.html";
                }, 5000);
            } else {
                console.log("Error al entrar");
                document.querySelector("#feedback").style.color = "red";
                document.querySelector("#feedback").innerHTML = data.message || "Usuario incorrecto. Redirigiendo en 5 segundos...";
                setTimeout(function() {
                    window.location = window.location;
                }, 5000);
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            document.querySelector("#feedback").style.color = "red";
            document.querySelector("#feedback").innerHTML = "Ocurrió un error en la solicitud.";
        });
    };
}
