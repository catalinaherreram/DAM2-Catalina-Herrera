import random
import math
import json

# declaro una clase npc y le pongo tres propiedades: x, y y angulo
class Npc:
    def __init__(self, nuevax, nuevay, nuevoangulo):
        self.x = nuevax  # asigna el valor de x recibido al atributo x de la instancia
        self.y = nuevay  # asigna el valor de y recibido al atributo y de la instancia
        self.angulo = nuevoangulo  # asigna el valor de angulo recibido al atributo angulo de la instancia

# creo una lista vacía para almacenar los npcs
npcs = []

# abro el archivo basededatos.json y leo los datos en formato json
with open('basededatos.json', 'r') as archivo:
    datos = json.load(archivo)  # carga los datos del json en una variable llamada datos

# convierto cada diccionario de datos en una instancia de la clase npc
for elemento in datos:
    npcs.append(Npc(elemento['x'], elemento['y'], elemento['angulo']))

# recorro la lista de npcs e imprimo los valores de x, y y angulo de cada instancia
for npc in npcs:
    print(npc.x, npc.y, npc.angulo)
