import random
import math

# declaro una clase npc con propiedades x, y y angulo
class Npc:
    def __init__(self, nuevax, nuevay, nuevoangulo):
        self.x = nuevax
        self.y = nuevay
        self.angulo = nuevoangulo

# creo una lista vacía para almacenar los npcs
npcs = []

# leo el contenido del archivo "basededatos.txt"
archivo = open("basededatos.txt", 'r')
contenido = archivo.read()
print(contenido)

# divido el contenido en una lista de objetos separados por "|"
objetos = contenido.split("|")

# para cada objeto en la lista de objetos
for objeto in objetos:
    try:
        # divido cada objeto en propiedades separadas por ","
        propiedades = objeto.split(",")
        print(propiedades)
        # nueva instancia de npc a la lista npcs con las propiedades leídas
        npcs.append(Npc(propiedades[0], propiedades[1], propiedades[2]))
    except:
        # si ocurre un error, imprimo un mensaje y continúo
        print("ha ocurrido un error que no afectará la ejecución")

# recorro la lista de npcs e imprimo las propiedades de cada npc
for npc in npcs:
    print(npc.x, npc.y, npc.angulo)
