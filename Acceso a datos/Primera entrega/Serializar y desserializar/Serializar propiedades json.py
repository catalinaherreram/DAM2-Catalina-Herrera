import random
import math
import json

# declaro una clase npc y le pongo tres propiedades: x, y y angulo
class Npc:
    def __init__(self):
        self.x = random.randint(0, 512)  # posición x aleatoria entre 0 y 512
        self.y = random.randint(0, 512)  # posición y aleatoria entre 0 y 512
        self.angulo = random.random() * math.pi * 2  # ángulo aleatorio entre 0 y 2π

# lista vacía para almacenar 50 npcs
npcs = []
numero = 50

# recorro un rango de 50 y añado una instancia de la clase npc a la lista
for i in range(0, numero):
    npcs.append(Npc())

# inicializo una lista vacía llamada cadena para almacenar los datos de cada npc como diccionarios
cadena = []

# recorro la lista de npcs y añado un diccionario con sus propiedades a la lista cadena
for i in range(0, numero):
    cadena.append({"x": npcs[i].x, "y": npcs[i].y, "angulo": npcs[i].angulo})

# convierto la lista cadena en una cadena de texto json formateada
json_formatted_str = json.dumps(cadena, indent=2)
print(json_formatted_str)  # imprimo la cadena json en la consola

# abro un archivo llamado basededatos.json en modo escritura
mibasededatos = open("basededatos.json", 'w')
mibasededatos.write(json_formatted_str)  # escribo la cadena json en el archivo
mibasededatos.close()  # cierro el archivo
