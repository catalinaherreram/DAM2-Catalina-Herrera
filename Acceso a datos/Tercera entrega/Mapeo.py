import mysql.connector
import tkinter as tk
from tkinter import messagebox

###################################### CLASE MODELO #########################################
class Producto:
    def __init__(self, nombre=None, descripcion=None, precio=None, categorias=None):
        self.nombre = nombre
        self.descripcion = descripcion
        self.precio = precio
        self.categorias = categorias if categorias is not None else []

###################################### CONFIGURACIÓN BASE DE DATOS ############################################
def conectar_bd():
    return mysql.connector.connect(
        host='localhost',
        database='accesoadatos',
        user='accesoadatos',
        password='accesoadatos'
    )

def crear_tablas():
    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("DROP TABLE IF EXISTS Producto")
    cursor.execute("DROP TABLE IF EXISTS categorias")

    cursor.execute("""
        CREATE TABLE Producto (
            Identificador INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            descripcion VARCHAR(255) NOT NULL,
            precio VARCHAR(255) NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE categorias (
            Identificador INT AUTO_INCREMENT PRIMARY KEY,
            FK INT,
            categoria VARCHAR(255),
            FOREIGN KEY (FK) REFERENCES Producto(Identificador)
        )
    """)
    conexion.commit()
    conexion.close()

###################################### FUNCIONES DE PERSISTENCIA EN ARCHIVO ###########################################
# función para guardar un producto en un archivo de texto
def guardar_en_archivo(producto_id, nombre, descripcion, precio, categorias):
    with open("productos.txt", "a") as archivo:  # modo append para no sobrescribir
        archivo.write(f"ID: {producto_id}\n")
        archivo.write(f"Nombre: {nombre}\n")
        archivo.write(f"Descripción: {descripcion}\n")
        archivo.write(f"Precio: {precio}\n")
        archivo.write(f"Categorías: {', '.join(categorias)}\n")
        archivo.write("-" * 30 + "\n")  # separador visual

###################################### FUNCIONES DE LA INTERFAZ ############################################
def insertar_producto():
    nombre = entry_nombre.get()
    descripcion = entry_descripcion.get()
    precio = entry_precio.get()
    categorias = entry_categorias.get().split(",")

    if not nombre or not descripcion or not precio:
        messagebox.showerror("Error", "Todos los campos son obligatorios")
        return

    conexion = conectar_bd()
    cursor = conexion.cursor()
    cursor.execute("INSERT INTO Producto (nombre, descripcion, precio) VALUES (%s, %s, %s)", 
                   (nombre, descripcion, precio))
    producto_id = cursor.lastrowid

    for categoria in categorias:
        cursor.execute("INSERT INTO categorias (FK, categoria) VALUES (%s, %s)", (producto_id, categoria.strip()))
    
    conexion.commit()
    conexion.close()
    
    # guardar en archivo después de insertar en la base de datos
    guardar_en_archivo(producto_id, nombre, descripcion, precio, categorias)
    
    messagebox.showinfo("Éxito", "Producto insertado correctamente")
    limpiar_campos()

def recuperar_productos():
    conexion = conectar_bd()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Producto")
    productos = cursor.fetchall()

    text_resultado.delete("1.0", tk.END)
    with open("productos.txt", "w") as archivo:  # limpia el archivo antes de escribir
        for producto in productos:
            cursor.execute("SELECT categoria FROM categorias WHERE FK = %s", (producto['Identificador'],))
            categorias = [fila['categoria'] for fila in cursor.fetchall()]
            resultado = (f"ID: {producto['Identificador']}\n"
                         f"Nombre: {producto['nombre']}\n"
                         f"Descripción: {producto['descripcion']}\n"
                         f"Precio: {producto['precio']}\n"
                         f"Categorías: {', '.join(categorias)}\n\n")
            text_resultado.insert(tk.END, resultado)
            
            # guardar en el archivo
            archivo.write(resultado + "-" * 30 + "\n")

    conexion.close()

def limpiar_campos():
    entry_nombre.delete(0, tk.END)
    entry_descripcion.delete(0, tk.END)
    entry_precio.delete(0, tk.END)
    entry_categorias.delete(0, tk.END)

###################################### INTERFAZ GRÁFICA ###################################
ventana = tk.Tk()
ventana.title("Interfaz de mapeo")
ventana.geometry("500x600")

tk.Label(ventana, text="Nombre del producto").pack()
entry_nombre = tk.Entry(ventana, width=50)
entry_nombre.pack()

tk.Label(ventana, text="Descripción del producto").pack()
entry_descripcion = tk.Entry(ventana, width=50)
entry_descripcion.pack()

tk.Label(ventana, text="Precio del producto").pack()
entry_precio = tk.Entry(ventana, width=50)
entry_precio.pack()

tk.Label(ventana, text="Categorías (separadas por coma)").pack()
entry_categorias = tk.Entry(ventana, width=50)
entry_categorias.pack()

tk.Button(ventana, text="Insertar producto", command=insertar_producto).pack(pady=10)
tk.Button(ventana, text="Recuperar productos", command=recuperar_productos).pack(pady=10)

tk.Label(ventana, text="Resultados:").pack()
text_resultado = tk.Text(ventana, width=60, height=20)
text_resultado.pack()

crear_tablas()
ventana.mainloop()
