import tkinter as tk
from tkinter import messagebox
import speech_recognition as sr

# crear una instancia del reconocedor de voz
reconocimiento = sr.Recognizer()

# función para reconocer voz y mostrarla como texto
def dictar_nota():
    try:
        with sr.Microphone() as origen:
            resultado_label.config(text="Ajustando ruido de fondo...")
            reconocimiento.adjust_for_ambient_noise(origen, duration=1)
            resultado_label.config(text="Escuchando...")
            
            # escuchar el audio
            audio = reconocimiento.listen(origen)
            resultado_label.config(text="Reconociendo...")
            
            # reconocer el audio usando Google
            texto = reconocimiento.recognize_google(audio, language="es-ES")
            texto_box.insert(tk.END, texto + "\n")
            resultado_label.config(text="Nota agregada correctamente")
    except sr.RequestError:
        messagebox.showerror("Error", "Problema de conexión con el servicio de Google")
    except sr.UnknownValueError:
        resultado_label.config(text="No se pudo reconocer el audio. Inténtalo de nuevo.")
    except Exception as e:
        messagebox.showerror("Error", f"Ocurrió un error: {e}")

# función para guardar notas en un archivo
def guardar_notas():
    try:
        with open("notas_por_voz.txt", "w") as archivo:
            archivo.write(texto_box.get("1.0", tk.END))
        messagebox.showinfo("Éxito", "Notas guardadas en 'notas_por_voz.txt'")
    except Exception as e:
        messagebox.showerror("Error", f"Ocurrió un error al guardar: {e}")

# crear la interfaz gráfica con tkinter
ventana = tk.Tk()
ventana.title("Notas por Voz")
ventana.geometry("400x400")

# etiqueta de título
titulo_label = tk.Label(ventana, text="Notas por voz", font=("Arial", 16))
titulo_label.pack(pady=10)

# botón para dictar nota
dictar_boton = tk.Button(ventana, text="Dictar nota", font=("Arial", 12), command=dictar_nota)
dictar_boton.pack(pady=10)

# cuadro de texto para mostrar notas
texto_box = tk.Text(ventana, height=10, width=40, font=("Arial", 12))
texto_box.pack(pady=10)

# botón para guardar notas
guardar_boton = tk.Button(ventana, text="Guardar nota", font=("Arial", 12), command=guardar_notas)
guardar_boton.pack(pady=10)

# etiqueta para mostrar resultados
resultado_label = tk.Label(ventana, text="", font=("Arial", 12), fg="blue")
resultado_label.pack(pady=10)

# ejecutar la aplicación
ventana.mainloop()
5
