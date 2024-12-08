import json
import xml.etree.ElementTree as ET

# define una función que convierte un diccionario en un elemento xml
def dict_to_xml(tag, d):
    elem = ET.Element(tag)  # crea el elemento raíz con el nombre dado en "tag"
    for key, val in d.items():  # recorre cada par clave-valor en el diccionario
        child = ET.SubElement(elem, key)  # crea un subelemento con el nombre de la clave
        child.text = str(val)  # establece el texto del subelemento con el valor convertido a cadena
    return elem  # devuelve el elemento xml construido

# define una función que guarda un diccionario en un archivo xml
def save_dict_to_xml(filename, root_tag, dictionary):
    root = dict_to_xml(root_tag, dictionary)  # convierte el diccionario en un elemento xml
    tree = ET.ElementTree(root)  # crea un árbol xml con el elemento raíz generado
    tree.write(filename, encoding='utf-8', xml_declaration=True)  # guarda el árbol xml en un archivo

# abre el archivo cliente.json en modo lectura y carga su contenido en la variable datos
with open('cliente.json', 'r') as archivo:
    datos = json.load(archivo)

# imprime los datos cargados desde el archivo json
print(datos)

# guarda los datos en formato xml en un archivo llamado cliente.xml, usando "cliente" como etiqueta raíz
save_dict_to_xml('cliente.xml', 'cliente', datos)
