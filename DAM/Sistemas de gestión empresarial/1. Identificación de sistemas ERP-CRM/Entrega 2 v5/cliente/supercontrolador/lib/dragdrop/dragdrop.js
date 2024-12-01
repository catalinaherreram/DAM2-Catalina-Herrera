const dragDrop = {
    init: function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error("Contenedor no encontrado:", containerId);
            return;
        }

        // Configurar eventos en los elementos arrastrables y columnas
        const items = container.querySelectorAll(".draggable");
        const columns = container.querySelectorAll(".dropzone");

        items.forEach((item) => {
            item.setAttribute("draggable", "true");
            item.addEventListener("dragstart", this.handleDragStart);
            item.addEventListener("dragend", this.handleDragEnd);
        });

        columns.forEach((column) => {
            column.addEventListener("dragover", this.handleDragOver);
            column.addEventListener("drop", this.handleDrop);
        });
    },

    handleDragStart: function (event) {
        event.dataTransfer.setData("text/plain", event.target.id);
        event.target.classList.add("dragging");
    },

    handleDragEnd: function (event) {
        event.target.classList.remove("dragging");
    },

    handleDragOver: function (event) {
        event.preventDefault(); // Necesario para permitir el drop
        event.target.classList.add("drag-over");
    },

    handleDrop: function (event) {
        event.preventDefault();
        const id = event.dataTransfer.getData("text/plain");
        const draggableElement = document.getElementById(id);

        if (event.target.classList.contains("dropzone")) {
            event.target.appendChild(draggableElement);
        }

        event.target.classList.remove("drag-over");
    },
};