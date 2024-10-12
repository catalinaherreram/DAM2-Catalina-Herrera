onmessage = function (evento) {
  const { data, filtro } = evento.data;
  const imgData = data;
  const pixeles = imgData.data;

  let pixelesModificados = 0; // Contador de píxeles modificados

  for (let i = 0; i < pixeles.length; i += 4) {
    let r = pixeles[i];
    let g = pixeles[i + 1];
    let b = pixeles[i + 2];

    switch (filtro) {
      case "Grises":
        const gris = (r + g + b) / 3;
        if (pixeles[i] !== gris || pixeles[i + 1] !== gris || pixeles[i + 2] !== gris) {
          pixelesModificados++;
        }
        pixeles[i] = pixeles[i + 1] = pixeles[i + 2] = gris;
        break;
      case "Negativo":
        if (pixeles[i] !== 255 - r || pixeles[i + 1] !== 255 - g || pixeles[i + 2] !== 255 - b) {
          pixelesModificados++;
        }
        pixeles[i] = 255 - r;
        pixeles[i + 1] = 255 - g;
        pixeles[i + 2] = 255 - b;
        break;
      case "Umbral":
        const promedio = (r + g + b) / 3;
        const valor = promedio < 128 ? 0 : 255;
        if (pixeles[i] !== valor || pixeles[i + 1] !== valor || pixeles[i + 2] !== valor) {
          pixelesModificados++;
        }
        pixeles[i] = pixeles[i + 1] = pixeles[i + 2] = valor;
        break;
      case "Rojos":
        if (pixeles[i + 1] !== 0 || pixeles[i + 2] !== 0) {
          pixelesModificados++;
        }
        pixeles[i] = r;
        pixeles[i + 1] = 0;
        pixeles[i + 2] = 0;
        break;
      case "Verdes":
        if (pixeles[i] !== 0 || pixeles[i + 2] !== 0) {
          pixelesModificados++;
        }
        pixeles[i] = 0;
        pixeles[i + 1] = g;
        pixeles[i + 2] = 0;
        break;
      case "Azules":
        if (pixeles[i] !== 0 || pixeles[i + 1] !== 0) {
          pixelesModificados++;
        }
        pixeles[i] = 0;
        pixeles[i + 1] = 0;
        pixeles[i + 2] = b;
        break;
      case "Sepia":
        const nuevoR = r * 0.393 + g * 0.769 + b * 0.189;
        const nuevoG = r * 0.349 + g * 0.686 + b * 0.168;
        const nuevoB = r * 0.272 + g * 0.534 + b * 0.131;
        
        if (pixeles[i] !== nuevoR || pixeles[i + 1] !== nuevoG || pixeles[i + 2] !== nuevoB) {
          pixelesModificados++;
        }
        pixeles[i] = nuevoR;
        pixeles[i + 1] = nuevoG;
        pixeles[i + 2] = nuevoB;
        break;
    }
  }

  // Envía los datos de imagen procesados y el contador de píxeles modificados
  postMessage({ imgData, pixelesModificados });
};
