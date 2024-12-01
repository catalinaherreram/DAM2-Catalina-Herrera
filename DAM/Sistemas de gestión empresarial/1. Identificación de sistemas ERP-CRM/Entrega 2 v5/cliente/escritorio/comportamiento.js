window.onload = function () {
  fetch("../../servidor/?o=tabla&tabla=aplicaciones")
    .then((response) => response.json())
    .then((data) => {
      const plantilla = document.getElementById("plantilla_aplicacion");
      const contenedorAplicaciones = document.getElementById("aplicaciones"); // Aseguramos que las apps vayan aquí

      console.log(data);

      data.forEach(function (elemento) {
        console.log(elemento);

        // Clonamos la plantilla
        const instancia = plantilla.content.cloneNode(true);

        // Configuramos el nombre y el icono
        const nombre = instancia.querySelector("p");
        nombre.innerHTML = elemento.nombre;

        const icono = instancia.querySelector(".icono");
        icono.textContent = elemento.nombre[0].toUpperCase();

        // Añadimos la instancia al contenedor de aplicaciones
        contenedorAplicaciones.appendChild(instancia);
      });

      // Añadimos funcionalidad de clic a cada aplicación
      let aplicaciones = document.querySelectorAll("#aplicaciones .aplicacion");
      aplicaciones.forEach(function (aplicacion) {
        aplicacion.onclick = function () {
          window.location = "../supercontrolador/";
        };
      });
    })
    .catch((error) => {
      console.error("Error al cargar las aplicaciones:", error);
    });
};