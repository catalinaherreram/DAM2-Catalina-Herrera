import random
import math

# declaro una clase npc y le pongo tres propiedades: x, y, y angulo
class Npc:
    def __init__(self):
        self.x = random.randint(0, 512)  # posición x aleatoria entre 0 y 512
        self.y = random.randint(0, 512)  # posición y aleatoria entre 0 y 512
        self.angulo = random.random() * math.pi * 2  # ángulo aleatorio entre 0 y 2π

# creo una lista vacía para almacenar 50 npcs
npcs = []
numero = 50

# recorro un rango de 50 y añado una instancia de la clase npc a la lista
for i in range(0, numero):
    npcs.append(Npc())

# inicializo una cadena vacía para almacenar la información de cada npc
cadena = ""

# recorro la lista de npcs para construir la cadena con sus propiedades
for i in range(0, numero):
    cadena += str(npcs[i].x) + "," + str(npcs[i].y) + "," + str(npcs[i].angulo) + "|"

# imprimo la cadena resultante en la consola
print(cadena)

# abro un archivo de texto en modo escritura para guardar la cadena
mibasededatos = open("basededatos.txt", 'w')
mibasededatos.write(cadena)  # escribo la cadena en el archivo
mibasededatos.close()  # cierro el archivo
