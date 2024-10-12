import os

# Directorio de origen y destino
origen = "fotos"
destino = "destino"

# Crea la carpeta destino si no existe
os.makedirs(destino, exist_ok=True)

# Lista los archivos en el directorio de origen
lista = os.listdir(origen)

for archivo in lista:
    print(archivo)
    
    # Formatea el nombre del archivo, reemplazando puntos y espacios
    cadena = archivo.replace(".", "-").replace(" ", "_")
    print(cadena)
    
    # Renombra y mueve el archivo al directorio de destino
    os.rename(os.path.join(origen, archivo), os.path.join(destino, cadena + ".jpg"))
