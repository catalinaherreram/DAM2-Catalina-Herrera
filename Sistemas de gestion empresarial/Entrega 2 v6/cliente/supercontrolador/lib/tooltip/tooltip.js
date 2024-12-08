let tooltip = document.createElement("div"); // creo un div para usar como tooltip
tooltip.classList.add("tooltip"); // añado una clase al div

document.querySelector("body").appendChild(tooltip); // añado el tooltip al cuerpo del documento

document.onmousemove = function(e) { // detecto el movimiento del ratón
    tooltip.style.left = e.pageX + "px";
    tooltip.style.top = e.pageY + "px";
};

document.onmouseover = function(event) { // detecto cuándo el ratón pasa sobre un elemento
    const element = event.target; // obtengo el elemento que está bajo el puntero
    if (element.hasAttribute("tooltip") != "") { // verifico si el elemento tiene el atributo "tooltip"
        tooltip.style.display = "block"; // muestro el tooltip
        tooltip.textContent = element.getAttribute("tooltip"); // establezco el texto del tooltip
    } else { // si no tiene el atributo
        tooltip.style.display = "none"; // oculto el tooltip
    }
};
