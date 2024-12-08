import os
from PIL import Image, ImageOps
import tkinter as tk
from tkinter import filedialog, messagebox

def convertir_a_grises():
    archivos = archivos_var.get().split(";")

    if not archivos or archivos[0] == "":
        messagebox.showerror("Error", "Debe seleccionar al menos un archivo.")
        return

    try:
        for archivo in archivos:
            if archivo.endswith((".jpg", ".png", ".jpeg")):  # Procesa solo imágenes
                imagen = Image.open(archivo)
                imagen_gris = ImageOps.grayscale(imagen)
                imagen_gris.save(archivo)  # Sobrescribe el archivo original
                imagen.close()
                imagen_gris.close()
        messagebox.showinfo("Éxito", "Imágenes convertidas a escala de grises.")
    except Exception as e:
        messagebox.showerror("Error", str(e))

app = tk.Tk()
app.title("Convertir a escala de grises")

archivos_var = tk.StringVar()

tk.Label(app, text="Archivos de imágenes").pack(pady=5)
tk.Entry(app, textvariable=archivos_var, width=50).pack(pady=5)
tk.Button(app, text="Seleccionar archivos", command=lambda: archivos_var.set(";".join(filedialog.askopenfilenames(filetypes=[("Imágenes", "*.jpg;*.png;*.jpeg")])))).pack(pady=5)

tk.Button(app, text="Convertir", command=convertir_a_grises).pack(pady=20)

app.mainloop()
