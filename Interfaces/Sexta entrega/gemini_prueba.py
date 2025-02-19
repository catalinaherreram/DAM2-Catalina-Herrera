import tkinter as tk
from tkinter import scrolledtext
import google.generativeai as genai
import os

# Configurar la API de Google Gemini (asegúrate de poner tu API KEY)
os.environ["GOOGLE_API_KEY"] = "AIzaSyC0KfvyXXJAzepIaZhN8LAHot0nZzthqJE"
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Inicializar el modelo Gemini
model = genai.GenerativeModel("gemini-pro")

# Función para enviar el mensaje a la IA y obtener respuesta
def enviar_mensaje():
    user_input = entrada.get()
    if not user_input.strip():
        return  # No enviar mensajes vacíos
    
    # Mostrar el mensaje del usuario en la caja de chat
    chat_box.insert(tk.END, "Tú: " + user_input + "\n", "user")
    entrada.delete(0, tk.END)  # Limpiar la entrada
    
    # Obtener respuesta de Gemini
    try:
        response = model.generate_content(user_input)
        respuesta_ai = response.text
    except Exception as e:
        respuesta_ai = "Error al conectar con la IA. Verifica tu API Key."
    
    # Mostrar la respuesta en la caja de chat
    chat_box.insert(tk.END, "Gemini: " + respuesta_ai + "\n", "ai")
    chat_box.yview(tk.END)  # Desplazar hacia abajo

# Crear la ventana principal
ventana = tk.Tk()
ventana.title("Chat con Gemini")
ventana.geometry("500x600")

# Caja de chat (con desplazamiento)
chat_box = scrolledtext.ScrolledText(ventana, wrap=tk.WORD, width=60, height=20, font=("Arial", 12))
chat_box.pack(pady=10, padx=10)
chat_box.tag_config("user", foreground="blue")  # Estilo para el usuario
chat_box.tag_config("ai", foreground="green")   # Estilo para la IA

# Entrada de texto
entrada = tk.Entry(ventana, width=50, font=("Arial", 12))
entrada.pack(pady=5)

# Botón para enviar
boton_enviar = tk.Button(ventana, text="Enviar", command=enviar_mensaje, font=("Arial", 12))
boton_enviar.pack()

# Iniciar la ventana
ventana.mainloop()

