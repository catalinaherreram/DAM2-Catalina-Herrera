function generarPDF(tableId, filename = "reporte.pdf") {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tableElement = document.getElementById(tableId);

  if (!tableElement) {
    console.error("Tabla no encontrada con el ID:", tableId);
    return;
  }

  // Generar el PDF a partir de la tabla
  doc.html(tableElement, {
    callback: function (doc) {
      doc.save(filename); // Descargar el archivo
    },
    x: 10,
    y: 10,
  });
}
