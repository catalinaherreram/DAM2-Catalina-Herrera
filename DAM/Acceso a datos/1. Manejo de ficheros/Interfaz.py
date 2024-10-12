import json
import os
import errno
import tkinter as tk
from tkinter import messagebox

class Cliente:
    # inicializa los datos de un cliente incluyendo sus emails personales y profesionales
    def __init__(self, idcliente, nuevonombre, nuevosapellidos, listapersonal, listaprofesional):
        self.idcliente = idcliente
        self.nombre = nuevonombre
        self.apellidos = nuevosapellidos
        self.emails = {
            "personal": listapersonal,
            "profesional": listaprofesional
        }
    
    # convierte los datos del cliente a un diccionario para su almacenamiento
    def to_dict(self):
        return {
            "nombre": self.nombre,
            "apellidos": self.apellidos,
            "emails": self.emails
        }

class Producto:
    # inicializa los datos de un producto, incluyendo sus dimensiones
    def __init__(self, idproducto, nombre, precio, categoria, dimensiones):
        self.idproducto = idproducto
        self.nombre = nombre
        self.precio = precio
        self.categoria = categoria
        self.dimensiones = dimensiones

    # convierte los datos del producto a un diccionario para su almacenamiento
    def to_dict(self):
        return {
            "idproducto": self.idproducto,
            "nombre": self.nombre,
            "precio": self.precio,
            "categoria": self.categoria,
            "dimensiones": self.dimensiones
        }

### variables globales ###

# define carpeta donde se almacenarán los archivos
carpeta = "basededatos"
clientes = []
productos = []

# crea la carpeta si no existe
try:
    os.makedirs(carpeta)
except OSError as e:
    if e.errno == errno.EEXIST:
        print(f"La carpeta ya existe.")
    elif e.errno == errno.EACCES:
        print("Error de permisos en la carpeta")
    else:
        print(f"Error inesperado: {e}")

# guarda un cliente ingresado en el formulario
def guardaCliente():
    global clientes
    clientes.append(
        Cliente(
            idcliente.get(),
            nombre_cliente.get(),
            apellidos.get(),
            personal.get(),
            profesional.get()
        )
    )
    # limpia los campos del formulario de producto tras guardar lo que escribimos
    idcliente.set("")
    nombre_cliente.set("")
    apellidos.set("")
    personal.set("")
    profesional.set("")

# guarda un producto ingresado en el formulario
def guardaProducto():
    global productos
    dimensiones_values = dimensiones.get().split(",")
    
    # valida las dimensiones ingresadas en el formato correcto para que se guarden bien
    if len(dimensiones_values) == 3:
        try:
            dimensiones_dict = {
                "x": int(dimensiones_values[0].strip()),
                "y": int(dimensiones_values[1].strip()),
                "z": int(dimensiones_values[2].strip())
            }
        except ValueError:
            print("Error: Los valores deben ser enteros.")
            return
    else:
        print("Introduzca las tres dimensiones separadas por comas (x,y,z).")
        return

    productos.append(
        Producto(
            idproducto.get(),
            nombre_producto.get(),
            precio.get(),
            categoria.get(),
            dimensiones_dict
        )
    )

    # limpia los campos del formulario de producto tras guardar lo que escribimos
    idproducto.set("")
    nombre_producto.set("")
    precio.set("")
    categoria.set("")
    dimensiones.set("")

# guarda todos los clientes en archivos json, con sufijo _cliente para identificarlo
def guardaDBClientes():
    for cliente in clientes:
        with open(carpeta + "/" + cliente.idcliente + "_cliente.json", 'w') as archivo:
            json.dump(cliente.to_dict(), archivo, indent=4)

# guarda todos los productos en archivos json, con sufijo _prod para identificarlo
def guardaDBProductos():
    for producto in productos:
        with open(carpeta + "/" + producto.idproducto + "_prod.json", 'w') as archivo:
            json.dump(producto.to_dict(), archivo, indent=4)

# muestra los archivos existentes en la carpeta
def mostrarArchivos():
    lista_archivos.delete(0, tk.END)
    archivos = os.listdir(carpeta)
    for archivo in archivos:
        lista_archivos.insert(tk.END, archivo)

# carga los datos de un archivo seleccionado en el formulario correspondiente
def cargarArchivo(event):
    seleccionado = lista_archivos.get(lista_archivos.curselection())
    ruta_archivo = os.path.join(carpeta, seleccionado)
    
    # abre el archivo y determina si es un cliente o producto
    with open(ruta_archivo, 'r') as archivo:
        datos = json.load(archivo)
    
    # si el archivo corresponde a un cliente (_cliente), llena el formulario de cliente
    if "_cliente" in seleccionado:
        idcliente.set(seleccionado.split("_cliente")[0])
        nombre_cliente.set(datos["nombre"])
        apellidos.set(datos["apellidos"])
        personal.set(datos["emails"]["personal"])
        profesional.set(datos["emails"]["profesional"])
    
    # si el archivo corresponde a un producto (_prod), llena el formulario de producto
    elif "_prod" in seleccionado:
        idproducto.set(seleccionado.split("_prod")[0])
        nombre_producto.set(datos["nombre"])
        precio.set(datos["precio"])
        categoria.set(datos["categoria"])
        dimensiones.set(f"{datos['dimensiones']['x']},{datos['dimensiones']['y']},{datos['dimensiones']['z']}")

# elimina el archivo cuyo nombre se ingresa en el campo correspondiente
def eliminarArchivo():
    nombre_archivo = nombre_archivo_eliminar.get()
    ruta_archivo = os.path.join(carpeta, nombre_archivo)
    
    # verifica si el archivo existe y procede a eliminarlo
    if os.path.exists(ruta_archivo):
        os.remove(ruta_archivo)
        messagebox.showinfo("Eliminado", f"El archivo '{nombre_archivo}' ha sido eliminado.")
        mostrarArchivos()  # actualiza la lista de archivos
        nombre_archivo_eliminar.set("")  # limpia el campo de entrada
    else:
        messagebox.showwarning("No encontrado", f"El archivo '{nombre_archivo}' no existe en la carpeta.")

# creación de la ventana principal
ventana = tk.Tk()

# marco y configuración del formulario para clientes
marco_cliente = tk.Frame(ventana, padx=20, pady=20)
marco_cliente.pack(side="left", padx=20, pady=20)

# marco y configuración del formulario para productos
marco_producto = tk.Frame(ventana, padx=20, pady=20)
marco_producto.pack(side="left", padx=20, pady=20)

# marco para mostrar y gestionar los archivos de la base de datos
marco_archivos = tk.Frame(ventana, padx=20, pady=20)
marco_archivos.pack(side="left", padx=20, pady=20)

# variables para los campos de entrada de cliente
nombre_cliente = tk.StringVar()
apellidos = tk.StringVar()
idcliente = tk.StringVar()
personal = tk.StringVar()
profesional = tk.StringVar()

# variables para los campos de entrada de producto
idproducto = tk.StringVar()
nombre_producto = tk.StringVar()
precio = tk.StringVar()
categoria = tk.StringVar()
dimensiones = tk.StringVar()

# variable para eliminar archivo
nombre_archivo_eliminar = tk.StringVar()

# interfaz para ingreso de datos de cliente
tk.Label(marco_cliente, text="Id de cliente").pack(padx=10, pady=10)
tk.Entry(marco_cliente, textvariable=idcliente).pack(padx=10, pady=10)
tk.Label(marco_cliente, text="Nombre del cliente").pack(padx=10, pady=10)
tk.Entry(marco_cliente, textvariable=nombre_cliente).pack(padx=10, pady=10)
tk.Label(marco_cliente, text="Apellidos").pack(padx=10, pady=10)
tk.Entry(marco_cliente, textvariable=apellidos).pack(padx=10, pady=10)
tk.Label(marco_cliente, text="Email personal").pack(padx=10, pady=10)
tk.Entry(marco_cliente, textvariable=personal).pack(padx=10, pady=10)
tk.Label(marco_cliente, text="Email profesional").pack(padx=10, pady=10)
tk.Entry(marco_cliente, textvariable=profesional).pack(padx=10, pady=10)
tk.Button(marco_cliente, text="Guardar este cliente", command=guardaCliente).pack(padx=10, pady=10)
tk.Button(marco_cliente, text="Guardar todos los clientes en la base de datos", command=guardaDBClientes).pack(padx=10, pady=10)

# interfaz para ingreso de datos de producto
tk.Label(marco_producto, text="Id de producto").pack(padx=10, pady=10)
tk.Entry(marco_producto, textvariable=idproducto).pack(padx=10, pady=10)
tk.Label(marco_producto, text="Nombre del producto").pack(padx=10, pady=10)
tk.Entry(marco_producto, textvariable=nombre_producto).pack(padx=10, pady=10)
tk.Label(marco_producto, text="Precio").pack(padx=10, pady=10)
tk.Entry(marco_producto, textvariable=precio).pack(padx=10, pady=10)
tk.Label(marco_producto, text="Categoría").pack(padx=10, pady=10)
tk.Entry(marco_producto, textvariable=categoria).pack(padx=10, pady=10)
tk.Label(marco_producto, text="Dimensiones (x,y,z)").pack(padx=10, pady=10)
tk.Entry(marco_producto, textvariable=dimensiones).pack(padx=10, pady=10)
tk.Button(marco_producto, text="Guardar este producto", command=guardaProducto).pack(padx=10, pady=10)
tk.Button(marco_producto, text="Guardar todos los productos en la base de datos", command=guardaDBProductos).pack(padx=10, pady=10)

# interfaz para mostrar archivos que hay en la bbdd
tk.Label(marco_archivos, text="Archivos en la base de datos").pack(padx=10, pady=10)
lista_archivos = tk.Listbox(marco_archivos, width=40, height=15)
lista_archivos.pack(padx=10, pady=10)
tk.Button(marco_archivos, text="Actualizar lista de archivos", command=mostrarArchivos).pack(padx=10, pady=10)
lista_archivos.bind("<Double-Button-1>", cargarArchivo)

# interfaz para eliminar archivo específico que escribimos en el entry
tk.Label(marco_archivos, text="Nombre de archivo a eliminar").pack(padx=10, pady=10)
tk.Entry(marco_archivos, textvariable=nombre_archivo_eliminar).pack(padx=10, pady=10)
tk.Button(marco_archivos, text="Eliminar archivo", command=eliminarArchivo).pack(padx=10, pady=10)

# ejecuta la ventana principal
ventana.mainloop()
