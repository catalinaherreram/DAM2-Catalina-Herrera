from pymongo import MongoClient

# Conectar a la base de datos
cliente = MongoClient("mongodb://localhost:27017/")  
basededatos = cliente["Empresa"]                        
coleccion = basededatos["clientes"]                     

# Criterio de búsqueda
criterio = {"nombre": "Catalina"}

# Ejecutar la eliminación
resultado = coleccion.delete_one(criterio)

if resultado.deleted_count > 0:
    print("Documento eliminado correctamente.")
else:
    print("No se encontró ningún documento que coincida con el criterio.")
