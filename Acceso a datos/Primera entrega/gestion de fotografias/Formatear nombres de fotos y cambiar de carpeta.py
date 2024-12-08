import os
import tkinter as tk
from tkinter import filedialog, messagebox

def formatear_nombres():
    origen = origen_var.get()
    destino = destino_var.get()

    if not origen or not destino:
        messagebox.showerror("Error", "Debe seleccionar ambas carpetas.")
        return

    try:
        os.makedirs(destino, exist_ok=True)
        lista = os.listdir(origen)

        for archivo in lista:
            cadena = archivo.replace(".", "-").replace(" ", "_")
            os.rename(os.path.join(origen, archivo), os.path.join(destino, cadena + ".jpg"))
        messagebox.showinfo("Éxito", "Archivos formateados y movidos correctamente.")
    except Exception as e:
        messagebox.showerror("Error", str(e))

app = tk.Tk()
app.title("Formatear nombres y mover archivos")

origen_var = tk.StringVar()
destino_var = tk.StringVar()

tk.Label(app, text="Carpeta de origen").pack(pady=5)
tk.Entry(app, textvariable=origen_var, width=50).pack(pady=5)
tk.Button(app, text="Seleccionar", command=lambda: origen_var.set(filedialog.askdirectory())).pack(pady=5)

tk.Label(app, text="Carpeta de destino").pack(pady=5)
tk.Entry(app, textvariable=destino_var, width=50).pack(pady=5)
tk.Button(app, text="Seleccionar", command=lambda: destino_var.set(filedialog.askdirectory())).pack(pady=5)

tk.Button(app, text="Formatear y mover", command=formatear_nombres).pack(pady=20)

app.mainloop()
