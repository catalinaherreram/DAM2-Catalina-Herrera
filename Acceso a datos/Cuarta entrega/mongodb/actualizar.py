from pymongo import MongoClient

# Conectar a la base de datos
cliente = MongoClient("mongodb://localhost:27017/")  
basededatos = cliente["Empresa"]                        
coleccion = basededatos["clientes"]                     

# Criterio de búsqueda
criterio = {"nombre": "Marcos"}

# Datos a actualizar
nuevos_datos = {"$set": {"nombre": "Marcos", "apellidos": "Perez", "correos": "marcos@ejemplo.com"}}

# Ejecutar la actualización
resultado = coleccion.update_one(criterio, nuevos_datos)

if resultado.modified_count > 0:
    print("Documento actualizado correctamente.")
else:
    print("No se encontró ningún documento que coincida con el criterio o los datos ya estaban actualizados.")
