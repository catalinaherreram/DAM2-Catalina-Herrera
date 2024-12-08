// crea un elemento div que actuará como el tooltip
let tooltip = document.createElement("div");
// añade la clase "tooltip" al div recién creado
tooltip.classList.add("tooltip");

// añade el tooltip al cuerpo del documento
document.querySelector("body").appendChild(tooltip);

// evento que se ejecuta cuando el mouse se mueve
document.onmousemove = function (e) {
    // actualiza la posición del tooltip para que siga el cursor
    tooltip.style.left = e.pageX + "px"; // ajusta la posición horizontal
    tooltip.style.top = e.pageY + "px"; // ajusta la posición vertical
};

// cuando el mouse pasa sobre un elemento
document.onmouseover = function (event) {
    const element = event.target; // obtiene el elemento bajo el puntero del mouse
    // si el elemento tiene el atributo "tooltip"
    if (element.hasAttribute("tooltip") != "") {
        tooltip.style.display = "block"; // muestra el tooltip
        tooltip.textContent = element.getAttribute("tooltip"); // establece el texto del tooltip
    } else {
        tooltip.style.display = "none"; // oculta el tooltip si no tiene el atributo
    }
};

