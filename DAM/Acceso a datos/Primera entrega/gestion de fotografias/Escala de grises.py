import os
from PIL import Image, ImageOps 

lista = os.listdir("destino")

for archivo in lista:
    print(archivo +" convertido a escala de grises")
    imagen = Image.open(r"destino/"+archivo) 
    imagen2 = ImageOps.grayscale(imagen)
    imagen.close()
    imagen2.save('destino/'+archivo)
    imagen2.close()
