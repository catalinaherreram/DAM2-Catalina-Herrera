import tkinter as tk
from tkinter import filedialog, messagebox
import json
import xml.etree.ElementTree as ET
import pandas as pd

# Función para convertir JSON a XML
def json_a_xml():
    archivo_json = filedialog.askopenfilename(filetypes=[("Archivos JSON", "*.json")])
    if not archivo_json:
        return
    try:
        with open(archivo_json, 'r') as archivo:
            datos = json.load(archivo)

        archivo_xml = filedialog.asksaveasfilename(defaultextension=".xml", filetypes=[("Archivos XML", "*.xml")])
        if not archivo_xml:
            return

        def dict_to_xml(tag, d):
            elem = ET.Element(tag)
            for key, val in d.items():
                child = ET.SubElement(elem, key)
                child.text = str(val)
            return elem

        root = dict_to_xml("root", datos)
        tree = ET.ElementTree(root)
        tree.write(archivo_xml, encoding='utf-8', xml_declaration=True)
        messagebox.showinfo("Éxito", f"Archivo XML guardado en: {archivo_xml}")
    except Exception as e:
        messagebox.showerror("Error", str(e))

# Función para leer Excel y convertirlo a JSON
def excel_a_json():
    archivo_excel = filedialog.askopenfilename(filetypes=[("Archivos Excel", "*.ods")])
    if not archivo_excel:
        return
    try:
        df = pd.read_excel(archivo_excel, engine='odf')
        archivo_json = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("Archivos JSON", "*.json")])
        if not archivo_json:
            return
        df.to_json(archivo_json, orient='records', lines=True)
        messagebox.showinfo("Éxito", f"Archivo JSON guardado en: {archivo_json}")
    except Exception as e:
        messagebox.showerror("Error", str(e))

# Función para leer JSON y mostrar contenido
def leer_json():
    archivo_json = filedialog.askopenfilename(filetypes=[("Archivos JSON", "*.json")])
    if not archivo_json:
        return
    try:
        with open(archivo_json, 'r') as archivo:
            datos = json.load(archivo)
        contenido = json.dumps(datos, indent=4)
        ventana = tk.Toplevel(app)
        ventana.title("Contenido del JSON")
        text_area = tk.Text(ventana, wrap=tk.WORD)
        text_area.insert(tk.END, contenido)
        text_area.pack(expand=True, fill=tk.BOTH)
    except Exception as e:
        messagebox.showerror("Error", str(e))

# Configuración de la ventana principal
app = tk.Tk()
app.title("Conversión de archivos")
app.geometry("400x300")

tk.Label(app, text="Seleccione una acción", font=("Arial", 14)).pack(pady=20)

tk.Button(app, text="Convertir JSON a XML", command=json_a_xml, width=30).pack(pady=10)
tk.Button(app, text="Leer Excel y convertir a JSON", command=excel_a_json, width=30).pack(pady=10)
tk.Button(app, text="Leer y visualizar JSON", command=leer_json, width=30).pack(pady=10)

app.mainloop()
