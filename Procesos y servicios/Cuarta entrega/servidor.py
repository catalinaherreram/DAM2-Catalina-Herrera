import json
from funcionescorreo import *
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

correos_enviados = []  # Lista para almacenar los correos enviados

@app.route("/")
def index():
    return render_template("index.html")  

@app.route("/recibir")
def recibir_email():
    return recibir()  # Llama a la función recibir() de funcionescorreo
    
@app.route("/enviar", methods=["POST"])
def enviar_email():
    try:
        data = request.get_json()
        asunto = data.get("asunto")
        para = data.get("para")
        mensaje = data.get("mensaje")

        print(f"Enviando correo a: {para}, Asunto: {asunto}")  # Verificar si Flask recibe los datos

        # Guardar en la lista local (solo para visualización)
        correo = {"Asunto": asunto, "Para": para, "Cuerpo": mensaje}
        correos_enviados.append(correo)

        # Enviar correo
        respuesta = enviar("contacto@codecath.eu", para, asunto, mensaje)

        return jsonify({"": "ok", "message": "Correo enviado correctamente", "respuesta": respuesta}), 200
    except Exception as e:
        print("Error al enviar correo:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/eliminar_recibido", methods=["POST"])
def eliminar_recibido_api():
    try:
        data = request.get_json()
        mail_id = data.get("mail_id")

        if not mail_id:
            return jsonify({"error": "Falta el ID del correo"}), 400

        resultado = eliminar_recibido(mail_id)
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/eliminar_enviado", methods=["POST"])  # Ahora está bien indentado
def eliminar_enviado():
    try:
        data = request.get_json()
        asunto = data.get("asunto")

        global correos_enviados
        correos_enviados = [correo for correo in correos_enviados if correo["Asunto"] != asunto]

        return jsonify({"mensaje": "Correo enviado eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/enviados", methods=["GET"])
def obtener_enviados():
    return jsonify(correos_enviados)

if __name__ == "__main__":
    app.run(debug=True)
