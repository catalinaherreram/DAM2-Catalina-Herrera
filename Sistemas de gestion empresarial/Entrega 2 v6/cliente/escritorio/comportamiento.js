window.onload = function () {
  fetch("../../servidor/?o=tabla&tabla=aplicaciones") // hago una petición para obtener los datos de la tabla "aplicaciones"
    .then((response) => response.json()) // transformo la respuesta en JSON
    .then((data) => {
      const plantilla = document.getElementById("plantilla_aplicacion"); // selecciono la plantilla para las aplicaciones
      const contenedorAplicaciones = document.getElementById("aplicaciones"); // selecciono el contenedor de las aplicaciones

      console.log(data); // muestro los datos obtenidos en la consola

      data.forEach(function (elemento) { // recorro los datos de las aplicaciones
        console.log(elemento); // muestro cada elemento en la consola

        // clono la plantilla
        const instancia = plantilla.content.cloneNode(true);

        // configuro el nombre de la aplicación
        const nombre = instancia.querySelector("p");
        nombre.innerHTML = elemento.nombre; // añado el nombre de la aplicación

        // configuro el icono de la aplicación
        const icono = instancia.querySelector(".icono");
        icono.textContent = elemento.nombre[0].toUpperCase(); // utilizo la primera letra del nombre en mayúscula como icono

        // añado la instancia al contenedor de aplicaciones
        contenedorAplicaciones.appendChild(instancia);
      });

      // añado funcionalidad de clic a cada aplicación
      let aplicaciones = document.querySelectorAll("#aplicaciones .aplicacion"); // selecciono todas las aplicaciones creadas
      aplicaciones.forEach(function (aplicacion) { // para cada aplicación
        aplicacion.onclick = function () {
          window.location = "../supercontrolador/"; // redirijo al usuario al controlador al hacer clic
        };
      });
    })
    .catch((error) => { // manejo errores en la petición
      console.error("Error al cargar las aplicaciones:", error);
    });
};
