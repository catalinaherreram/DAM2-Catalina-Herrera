	let tamanio = 1; // tamaño inicial de la fuente
	let cantidadcontraste = 1; // nivel inicial de contraste
	let contenedor = document.createElement("div"); // creo un contenedor para los botones
	contenedor.classList.add("ampliador"); // añado una clase al contenedor
	let invertido = false; // estado inicial del filtro de inversión

	////////////////// AUMENTAR /////////////////

	let aumentar = document.createElement("button"); // botón para aumentar el tamaño de la fuente
	aumentar.textContent = "+"; 
	aumentar.setAttribute("aria-label", "Ampliar"); // etiqueta de accesibilidad
	aumentar.setAttribute("title", "Ampliar el tamaño de la letra"); // tooltip

	contenedor.appendChild(aumentar); // añado el botón al contenedor
	aumentar.onclick = function() {
		tamanio *= 1.1; // incremento el tamaño de la fuente en un 10%
		document.querySelector("body").style.fontSize = tamanio + "em"; // aplico el nuevo tamaño
	};

	////////////////// CONTRASTE /////////////////

	let contraste = document.createElement("button"); // botón para aumentar el contraste
	contraste.textContent = "◑";
	contraste.setAttribute("aria-label", "Contraste");

	contenedor.appendChild(contraste); // añado el botón al contenedor
	contraste.onclick = function() {
		cantidadcontraste = 30; // establezco un valor alto de contraste
		document.querySelector("body").style.filter = "contrast(" + cantidadcontraste + ")"; // aplico el contraste
	};

	////////////////// INVERTIR /////////////////

	let invertir = document.createElement("button"); // botón para invertir los colores
	invertir.textContent = "☾"; // texto del botón
	invertir.setAttribute("aria-label", "Invertir"); // etiqueta de accesibilidad

	contenedor.appendChild(invertir); // añado el botón al contenedor
	invertir.onclick = function() {
		if (!invertido) { // si los colores no están invertidos
			document.querySelector("body").style.filter = "invert(1) hue-rotate(180deg)"; // invierto los colores
			invertido = true; // actualizo el estado
		} else { // si los colores ya están invertidos
			document.querySelector("body").style.filter = "invert(0) hue-rotate(0deg)"; // restablezco los colores
			invertido = false; // actualizo el estado
		}
	};

	////////////////// FUENTE /////////////////

	let fuentes = ['Sans-serif', 'serif', 'personalizada', 'monospace']; // lista de fuentes disponibles
	let contador = 0; // índice de la fuente actual

	let fuente = document.createElement("button"); 
	fuente.textContent = "𝔉"; 
	fuente.setAttribute("aria-label", "Cambiar la fuente"); 

	contenedor.appendChild(fuente);
	fuente.onclick = function() {
		document.querySelector("body").style.fontFamily = fuentes[contador]; // cambio la fuente
		contador++; // paso a la siguiente fuente
		if (contador == fuentes.length) { contador = 0; } // reinicio el índice si llega al final
	};

	////////////////// DISMINUIR /////////////////

	let disminuir = document.createElement("button"); // botón para disminuir el tamaño de la fuente
	disminuir.textContent = "-"; 
	disminuir.setAttribute("aria-label", "Disminuir el tamaño de la fuente");

	contenedor.appendChild(disminuir); 
	disminuir.onclick = function() {
		tamanio *= 0.9; // reduzco el tamaño de la fuente en un 10%
		document.querySelector("body").style.fontSize = tamanio + "em"; // aplico el nuevo tamaño
	};

	document.querySelector("body").appendChild(contenedor); // añado el contenedor al cuerpo del documento
