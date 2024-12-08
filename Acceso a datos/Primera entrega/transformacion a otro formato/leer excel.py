import pandas as pd

# lee el archivo clientes.ods usando el motor 'odf' para archivos en formato ods y lo carga en un dataframe
df = pd.read_excel('clientes.ods', engine='odf')

# muestra las primeras cinco filas del dataframe para verificar que los datos se hayan cargado correctamente
print(df.head())

# define la ruta donde se guardará el archivo json
ruta = 'clientesdesdeexcel.json'

# convierte el dataframe a formato json, orientado por registros y con cada registro en una nueva línea
df.to_json(ruta, orient='records', lines=True)
