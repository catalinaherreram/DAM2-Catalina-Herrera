from pymongo import MongoClient

cliente = MongoClient("mongodb://localhost:27017/")     # Cambia la URL si tu MongoDB está en otra ubicación
basededatos = cliente["Empresa"]                        # Reemplaza con el nombre de tu base de datos
coleccion = basededatos["clientes"]                     # Reemplaza con el nombre de tu colección

cliente = {"nombre":"Marta","apellidos":"Gimenez","edad": 22,"correo":"marta@correo.com"}

resultado = coleccion.insert_one(cliente)     

if resultado:
    print("Resultado:", resultado)
else:
    print("")
