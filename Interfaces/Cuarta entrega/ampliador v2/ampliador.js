let tamanio = 1; // tamaño inicial de la fuente
let cantidadcontraste = 1; // nivel inicial de contraste
let invertido = false; // estado inicial del filtro de inversión
let fuentes = ['Sans-serif', 'serif', 'personalizada', 'monospace']; // lista de fuentes disponibles
let contador = 0; // índice de la fuente actual
let nivelContraste = 0; // índice del nivel de contraste

// Contenedor principal
let contenedor = document.createElement("div");
contenedor.classList.add("ampliador");

// Botón principal que despliega las opciones
let botonPrincipal = document.createElement("button");
botonPrincipal.setAttribute("aria-label", "Opciones de accesibilidad");
botonPrincipal.setAttribute("title", "Opciones de accesibilidad");

// Imagen para el botón principal
let imagen = document.createElement("img");
imagen.src = "./img/configuraciones.png"; 
imagen.alt = "Opciones de accesibilidad";
imagen.style.width = "30px"; 
imagen.style.height = "30px";

botonPrincipal.appendChild(imagen);
contenedor.appendChild(botonPrincipal);

// Contenedor para las opciones desplegables
let opciones = document.createElement("div");
opciones.classList.add("opciones");
opciones.style.display = "none"; // Oculto por defecto
contenedor.appendChild(opciones);

// Toggle de las opciones al hacer clic en el botón principal
botonPrincipal.onclick = function () {
    opciones.style.display = opciones.style.display === "none" ? "flex" : "none";
};

// Botón para aumentar el tamaño de la fuente
let aumentar = document.createElement("button");
aumentar.textContent = "+";
aumentar.setAttribute("aria-label", "Ampliar");
aumentar.onclick = function () {
    tamanio *= 1.1;
    document.querySelector("body").style.fontSize = tamanio + "em";
};
opciones.appendChild(aumentar);

// Botón para disminuir el tamaño de la fuente
let disminuir = document.createElement("button");
disminuir.textContent = "-";
disminuir.setAttribute("aria-label", "Disminuir");
disminuir.onclick = function () {
    tamanio *= 0.9;
    document.querySelector("body").style.fontSize = tamanio + "em";
};
opciones.appendChild(disminuir);

// Botón para alternar niveles de contraste
let contraste = document.createElement("button");
contraste.textContent = "◑";
contraste.setAttribute("aria-label", "Contraste");
contraste.onclick = function () {
    nivelContraste = (nivelContraste + 1) % 3; // Cicla entre 0, 1, y 2
    switch (nivelContraste) {
        case 0:
            document.querySelector("body").style.filter = "contrast(1)";
            break;
        case 1:
            document.querySelector("body").style.filter = "contrast(1.5)";
            break;
        case 2:
            document.querySelector("body").style.filter = "contrast(2)";
            break;
    }
};
opciones.appendChild(contraste);

// Botón para invertir colores
let invertir = document.createElement("button");
invertir.textContent = "☾";
invertir.setAttribute("aria-label", "Invertir");
invertir.onclick = function () {
    if (!invertido) {
        document.querySelector("body").style.filter = "invert(1) hue-rotate(180deg)";
        invertido = true;
    } else {
        document.querySelector("body").style.filter = "invert(0) hue-rotate(0deg)";
        invertido = false;
    }
};
opciones.appendChild(invertir);

// Botón para cambiar la fuente
let fuente = document.createElement("button");
fuente.textContent = "𝔉";
fuente.setAttribute("aria-label", "Cambiar la fuente");
fuente.onclick = function () {
    document.querySelector("body").style.fontFamily = fuentes[contador];
    contador = (contador + 1) % fuentes.length;
};
opciones.appendChild(fuente);

document.querySelector("body").appendChild(contenedor);
