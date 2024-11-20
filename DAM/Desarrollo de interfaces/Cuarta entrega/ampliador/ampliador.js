let tamanio = 1; // tamaño inicial de la fuente
let cantidadcontraste = 1; // valor inicial del contraste
let contenedor = document.createElement("div"); // crea un contenedor para los botones
contenedor.classList.add("ampliador"); // añade la clase 'ampliador' al contenedor
let invertido = false; // estado inicial del filtro invertido

////////////////// AUMENTAR /////////////////

let aumentar = document.createElement("button"); // crea un botón para aumentar el tamaño
aumentar.textContent = "+"; // texto del botón
aumentar.setAttribute("aria-label", "ampliar"); // etiqueta de accesibilidad
aumentar.setAttribute("title", "ampliar el tamaño de la letra"); // tooltip

contenedor.appendChild(aumentar); // añade el botón al contenedor
aumentar.onclick = function () {
    tamanio *= 1.1; // incrementa el tamaño en un 10%
    document.querySelector("body").style.fontSize = tamanio + "em"; // aplica el tamaño al cuerpo
};

////////////////// CONTRASTE /////////////////

let contraste = document.createElement("button"); // crea un botón para el contraste
contraste.textContent = "C"; // texto del botón
contraste.setAttribute("aria-label", "contraste"); // etiqueta de accesibilidad

contenedor.appendChild(contraste); // añade el botón al contenedor
contraste.onclick = function () {
    cantidadcontraste = cantidadcontraste === 1 ? 3 : 1; // alterna entre dos valores de contraste
    document.querySelector("body").style.filter = `contrast(${cantidadcontraste})`; // aplica el filtro de contraste
};

////////////////// INVERTIR /////////////////

let invertir = document.createElement("button"); // crea un botón para invertir colores
invertir.textContent = "I"; // texto del botón
invertir.setAttribute("aria-label", "invertir"); // etiqueta de accesibilidad

contenedor.appendChild(invertir); // añade el botón al contenedor
invertir.onclick = function () {
    if (invertido == false) {
        document.querySelector("body").style.filter = "invert(1) hue-rotate(180deg)"; // invierte los colores
        invertido = true; // actualiza el estado
    } else {
        document.querySelector("body").style.filter = "invert(0) hue-rotate(0deg)"; // revierte los colores
        invertido = false; // actualiza el estado
    }
};

////////////////// FUENTE /////////////////

let fuentes = ["sans-serif", "serif", "personalizada", "monospace"]; // lista de fuentes
let contador = 0; // índice inicial

let fuente = document.createElement("button"); // crea un botón para cambiar la fuente
fuente.textContent = "F"; // texto del botón
fuente.setAttribute("aria-label", "cambiar la fuente"); // etiqueta de accesibilidad

contenedor.appendChild(fuente); // añade el botón al contenedor
fuente.onclick = function () {
    document.querySelector("body").style.fontFamily = fuentes[contador]; // cambia la fuente
    contador++; // avanza al siguiente índice
    if (contador == fuentes.length) contador = 0; // reinicia el contador
};

////////////////// DISMINUIR /////////////////

let disminuir = document.createElement("button"); // crea un botón para disminuir el tamaño
disminuir.textContent = "-"; // texto del botón
disminuir.setAttribute("aria-label", "disminuir el tamaño de la fuente"); // etiqueta de accesibilidad
contenedor.appendChild(disminuir); // añade el botón al contenedor

disminuir.onclick = function () {
    tamanio *= 0.9; // reduce el tamaño en un 10%
    document.querySelector("body").style.fontSize = tamanio + "em"; // aplica el tamaño al cuerpo
};

// añade el contenedor al cuerpo del documento
document.querySelector("body").appendChild(contenedor);
