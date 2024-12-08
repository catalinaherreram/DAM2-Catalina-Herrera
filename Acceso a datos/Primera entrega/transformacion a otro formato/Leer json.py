import json
import xml

# abre el archivo cliente.json en modo lectura
with open('cliente.json', 'r') as archivo:
    datos = json.load(archivo)  # carga el contenido del archivo json en la variable datos

# imprime los datos cargados en la consola
print(datos)
