onmessage = function (evento) {
  // obtenemos los datos enviados al worker: la imagen, el filtro seleccionado y el número de buckets
  const { data, filtro, numBuckets } = evento.data;
  const imgData = data;
  const pixeles = imgData.data;

  let pixelesModificados = 0; // contador de píxeles modificados para depuración

  // calculamos el tamaño de cada bucket según el número especificado
  // si no se especifican buckets (numBuckets = 0), el tamaño es 256 (sin agrupación)
  const bucketSize = numBuckets ? 256 / numBuckets : 256;

  // recorremos todos los píxeles de la imagen
  // cada píxel está representado por 4 valores consecutivos: r (rojo), g (verde), b (azul) y a (alfa)
  for (let i = 0; i < pixeles.length; i += 4) {
    let r = pixeles[i];     // valor del canal rojo
    let g = pixeles[i + 1]; // valor del canal verde
    let b = pixeles[i + 2]; // valor del canal azul

    // aplicamos el filtro seleccionado
    switch (filtro) {
      case "Grises":
        // convertimos el píxel a escala de grises calculando el promedio de r, g y b
        const gris = (r + g + b) / 3;
        pixeles[i] = pixeles[i + 1] = pixeles[i + 2] = gris;
        break;
      case "Negativo":
        // calculamos el negativo de cada canal (255 menos el valor actual)
        pixeles[i] = 255 - r;
        pixeles[i + 1] = 255 - g;
        pixeles[i + 2] = 255 - b;
        break;
      case "Umbral":
        // convertimos el píxel a blanco o negro según un umbral
        const promedio = (r + g + b) / 3;
        const valor = promedio < 128 ? 0 : 255;
        pixeles[i] = pixeles[i + 1] = pixeles[i + 2] = valor;
        break;
      case "Rojos":
        // eliminamos los canales verde y azul, dejando solo el rojo
        pixeles[i + 1] = 0;
        pixeles[i + 2] = 0;
        break;
      case "Verdes":
        // eliminamos los canales rojo y azul, dejando solo el verde
        pixeles[i] = 0;
        pixeles[i + 2] = 0;
        break;
      case "Azules":
        // eliminamos los canales rojo y verde, dejando solo el azul
        pixeles[i] = 0;
        pixeles[i + 1] = 0;
        break;
      case "Sepia":
        // aplicamos el efecto sepia transformando cada canal con una fórmula específica
        const nuevoR = r * 0.393 + g * 0.769 + b * 0.189;
        const nuevoG = r * 0.349 + g * 0.686 + b * 0.168;
        const nuevoB = r * 0.272 + g * 0.534 + b * 0.131;
        pixeles[i] = nuevoR;
        pixeles[i + 1] = nuevoG;
        pixeles[i + 2] = nuevoB;
        break;
    }

    // si se especificaron buckets, agrupamos los valores en rangos predefinidos
    if (numBuckets) {
      pixeles[i] = Math.floor(pixeles[i] / bucketSize) * bucketSize; // ajustamos el rojo
      pixeles[i + 1] = Math.floor(pixeles[i + 1] / bucketSize) * bucketSize; // ajustamos el verde
      pixeles[i + 2] = Math.floor(pixeles[i + 2] / bucketSize) * bucketSize; // ajustamos el azul
    }

    // incrementamos el contador de píxeles modificados (para fines de depuración)
    pixelesModificados++;
  }

  // enviamos los datos procesados al hilo principal, junto con el número de píxeles modificados
  postMessage({ imgData, pixelesModificados });
};
