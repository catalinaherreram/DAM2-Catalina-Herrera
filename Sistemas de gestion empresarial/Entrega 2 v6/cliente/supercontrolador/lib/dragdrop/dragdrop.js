const dragDrop = {
    init: function (containerId) { // inicializa el sistema
        const container = document.getElementById(containerId); // obtiene el contenedor principal
        if (!container) {
            console.error("Contenedor no encontrado:", containerId); 
            return; 
        }

        // configura eventos en los elementos arrastrables y las zonas de drop
        const items = container.querySelectorAll(".draggable"); // selecciona los elementos arrastrables
        const columns = container.querySelectorAll(".dropzone"); // selecciona las zonas de drop

        items.forEach((item) => { // para cada elemento arrastrable
            item.setAttribute("draggable", "true"); // habilita el arrastre
            item.addEventListener("dragstart", this.handleDragStart); // asocia el evento dragstart
            item.addEventListener("dragend", this.handleDragEnd); // asocia el evento dragend
        });

        columns.forEach((column) => { // para cada zona de drop
            column.addEventListener("dragover", this.handleDragOver); // asocia el evento dragover
            column.addEventListener("drop", this.handleDrop); // asocia el evento drop
        });
    },

    handleDragStart: function (event) { // manejador para el inicio del arrastre
        event.dataTransfer.setData("text/plain", event.target.id); // guarda el id del elemento arrastrado
        event.target.classList.add("dragging"); // añade una clase para indicar que está siendo arrastrado
    },

    handleDragEnd: function (event) { // manejador para el fin del arrastre
        event.target.classList.remove("dragging"); // elimina la clase de arrastrado
    },

    handleDragOver: function (event) { // manejador para el evento dragover
        event.preventDefault(); // necesario para permitir el drop
        event.target.classList.add("drag-over"); // añade una clase para indicar que está sobre la zona de drop
    },

    handleDrop: function (event) { // manejador para el evento drop
        event.preventDefault(); // evita el comportamiento predeterminado
        const id = event.dataTransfer.getData("text/plain"); // obtiene el id del elemento arrastrado
        const draggableElement = document.getElementById(id); // encuentra el elemento arrastrado por su id

        if (event.target.classList.contains("dropzone")) { // si el drop se realiza en una zona válida
            event.target.appendChild(draggableElement); // añade el elemento arrastrado a la zona
        }

        event.target.classList.remove("drag-over"); // elimina la clase de indicación de drop
    },
};
