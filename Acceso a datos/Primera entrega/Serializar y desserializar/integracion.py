import tkinter as tk
from tkinter import filedialog, messagebox
import random
import math
import json

# Clase Npc con propiedades x, y, y ángulo
class Npc:
    def __init__(self, x=None, y=None, angulo=None):
        if x is None and y is None and angulo is None:
            self.x = random.randint(0, 512)
            self.y = random.randint(0, 512)
            self.angulo = random.random() * math.pi * 2
        else:
            self.x = float(x)
            self.y = float(y)
            self.angulo = float(angulo)

# Serializar a JSON
def serializar_a_json():
    npcs = [Npc() for _ in range(50)]
    datos = [{"x": npc.x, "y": npc.y, "angulo": npc.angulo} for npc in npcs]
    
    archivo = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("Archivos JSON", "*.json")])
    if archivo:
        try:
            with open(archivo, 'w') as f:
                json.dump(datos, f, indent=2)
            messagebox.showinfo("Éxito", f"Archivo guardado en {archivo}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

# Serializar a Texto
def serializar_a_texto():
    npcs = [Npc() for _ in range(50)]
    cadena = "|".join(f"{npc.x},{npc.y},{npc.angulo}" for npc in npcs)
    
    archivo = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Archivos de Texto", "*.txt")])
    if archivo:
        try:
            with open(archivo, 'w') as f:
                f.write(cadena)
            messagebox.showinfo("Éxito", f"Archivo guardado en {archivo}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

# Deserializar desde JSON
def desserializar_desde_json():
    archivo = filedialog.askopenfilename(filetypes=[("Archivos JSON", "*.json")])
    if archivo:
        try:
            with open(archivo, 'r') as f:
                datos = json.load(f)
            npcs = [Npc(dato["x"], dato["y"], dato["angulo"]) for dato in datos]
            mostrar_npcs(npcs)
        except Exception as e:
            messagebox.showerror("Error", str(e))

# Deserializar desde Texto
def desserializar_desde_texto():
    archivo = filedialog.askopenfilename(filetypes=[("Archivos de texto", "*.txt")])
    if archivo:
        try:
            with open(archivo, 'r') as f:
                contenido = f.read()
            objetos = contenido.split("|")
            npcs = []
            for objeto in objetos:
                if objeto.strip():
                    x, y, angulo = objeto.split(",")
                    npcs.append(Npc(x, y, angulo))
            mostrar_npcs(npcs)
        except Exception as e:
            messagebox.showerror("Error", str(e))

# Mostrar NPCs en una ventana
def mostrar_npcs(npcs):
    ventana = tk.Toplevel(app)
    ventana.title("NPCs")
    text_area = tk.Text(ventana, wrap=tk.WORD)
    for npc in npcs:
        text_area.insert(tk.END, f"x: {npc.x}, y: {npc.y}, ángulo: {npc.angulo}\n")
    text_area.pack(expand=True, fill=tk.BOTH)

# Configuración de la ventana principal
app = tk.Tk()
app.title("Serialización y desserialización")
app.geometry("400x300")

tk.Label(app, text="Seleccione una acción", font=("Arial", 14)).pack(pady=20)

tk.Button(app, text="Serializar a JSON", command=serializar_a_json, width=30).pack(pady=5)
tk.Button(app, text="Serializar a Texto", command=serializar_a_texto, width=30).pack(pady=5)
tk.Button(app, text="Deserializar desde JSON", command=desserializar_desde_json, width=30).pack(pady=5)
tk.Button(app, text="Deserializar desde Texto", command=desserializar_desde_texto, width=30).pack(pady=5)

app.mainloop()
