from flask import Flask, request, jsonify
from flask_cors import CORS

# lista global para almacenar mensajes
mensajes = []  # lista de mensajes inicial vacía

app = Flask(__name__)  # crear la aplicación flask
CORS(app)

@app.route('/')  # ruta raíz del servidor
def inicio():
    return "Hola mundo"

@app.route('/dame')  # ruta para obtener los mensajes actuales
def dame():
    # devuelve la lista de mensajes en formato json
    # utiliza la lista global de mensajes
    return jsonify(mensajes)  # convierte la lista en json y la devuelve

@app.route('/toma')  # ruta para enviar un nuevo mensaje
def toma():
    # recibe un mensaje y el nombre del usuario a través de parámetros de la url
    # captura los parámetros de la url
    mensaje = request.args.get('mensaje')  # captura el valor de 'mensaje'
    usuario = request.args.get('usuario')  # captura el valor de 'usuario'
    # agrega el mensaje a la lista global con formato de diccionario
    mensajes.append({'mensaje': mensaje, 'usuario': usuario})
    # devuelve una confirmación al cliente en formato json
    return jsonify({"mensaje": "ok"})

@app.route('/limpiar', methods=['POST'])  # ruta para limpiar el chat
def limpiar():
    # vacía la lista de mensajes en el servidor
    global mensajes
    mensajes = []  # se borra el contenido de la lista global
    # devuelve una confirmación al cliente en formato json
    return jsonify({"mensaje": "ok"})

if __name__ == '__main__':  # punto de entrada principal
    # inicia el servidor flask, 'host': dirección de sv localhost
    app.run(debug=True, host='127.0.0.1')
