import xml.etree.ElementTree as ET  # importa el módulo para trabajar con xml
import tkinter as tk  # importa tkinter para crear interfaces gráficas

# crea la ventana principal
ventana = tk.Tk()
ventana.title("Interfaz gráfica con Tkinter")

# parsear y obtener el elemento raíz del archivo xml
arbol = ET.parse('interfazgrafica.xml')
raiz = arbol.getroot()

# función para la acción del botón
def boton_accion():
    print("Has presionado el botón")

# agregar un frame
frame = tk.Frame(ventana, padx=10, pady=10)
frame.pack(pady=20)

# itera sobre todos los elementos en el xml y crea los componentes de interfaz
for elemento in raiz:
    if elemento.tag == "boton":
        # crea un botón
        tk.Button(frame, text=elemento.text, command=boton_accion).pack(padx=10, pady=10)
    elif elemento.tag == "texto":
        # crea un label
        tk.Label(frame, text=elemento.text, font=("Arial", 12)).pack(padx=10, pady=5)
    elif elemento.tag == "entrada":
        # crea un input
        tk.Entry(frame, width=30).pack(padx=10, pady=5)
    elif elemento.tag == "texto_selecciona_opciones":
        # etiqueta para checkbuttons
        tk.Label(frame, text=elemento.text, font=("Arial", 10, "bold")).pack(pady=(10, 0))
    elif elemento.tag == "opcion_check1":
        # primer checkbutton
        chk_var1 = tk.IntVar()
        tk.Checkbutton(frame, text=elemento.text, variable=chk_var1).pack(anchor='w')
    elif elemento.tag == "opcion_check2":
        # segundo checkbutton
        chk_var2 = tk.IntVar()
        tk.Checkbutton(frame, text=elemento.text, variable=chk_var2).pack(anchor='w')
    elif elemento.tag == "texto_selecciona_radio":
        # etiqueta para radiobuttons
        tk.Label(frame, text=elemento.text, font=("Arial", 10, "bold")).pack(pady=(10, 0))
    elif elemento.tag == "radio_opcion_a":
        # primer radiobutton
        radio_var = tk.StringVar()
        radio_var.set(elemento.text)  # valor predeterminado
        tk.Radiobutton(frame, text=elemento.text, variable=radio_var, value="A").pack(anchor='w')
    elif elemento.tag == "radio_opcion_b":
        # segundo radiobutton
        tk.Radiobutton(frame, text=elemento.text, variable=radio_var, value="B").pack(anchor='w')
    elif elemento.tag == "texto_desliza":
        # etiqueta para el scale
        tk.Label(frame, text=elemento.text, font=("Arial", 10, "bold")).pack(pady=(10, 0))
        tk.Scale(frame, from_=0, to=100, orient="horizontal").pack(fill='x', padx=20, pady=5)

# inicia el bucle principal de la ventana
ventana.mainloop()
