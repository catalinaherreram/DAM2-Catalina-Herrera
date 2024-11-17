# instalar las librerías necesarias con:
# pip install speechrecognition
# pip install pyaudio

import speech_recognition as sr  # librería para reconocimiento de voz

# creamos una instancia del objeto reconocedor de voz
reconocimiento = sr.Recognizer()

# definimos una función para manejar el reconocimiento de voz
def reconocer():
    with sr.Microphone() as origen:  # usamos el micrófono como fuente de audio
        print("ajustando ruido de fondo")  
        # ajusta el reconocimiento al nivel de ruido ambiental durante 1 segundo
        reconocimiento.adjust_for_ambient_noise(origen, duration=1)
        print("tus opciones:")
        print("1.-insertar un nuevo registro")
        print("2.-listar registros")
        print("3.-actualizar un registro")
        print("4.-eliminar un registro")
        print("escuchamos...")  
        
        # escucha el audio del micrófono
        audio = reconocimiento.listen(origen)

        try:  # intentamos reconocer el audio
            print("reconociendo...")  
            # utilizamos el servicio de google para transcribir el audio (en español)
            text = reconocimiento.recognize_google(audio, language="es-ES")
            print(f"reconocido: {text}")  
            
            # verificamos qué palabra clave está presente en el texto reconocido
            if "insertar" in text:
                print("operación de insertar reconocida, vamos a insertar un nuevo registro")
            elif "listar" in text:
                print("operación de listar reconocida, vamos a por la lista de clientes")
            elif "actualizar" in text:
                print("operación de actualizar reconocida, vamos a actualizar un cliente")
            elif "eliminar" in text:
                print("operación de eliminar reconocida, vamos a eliminar un cliente")
            else:
                print("lo que has dictado no ha sido reconocido")
        
        # manejamos posibles errores del reconocimiento de voz
        except sr.RequestError:
            # error al hacer una solicitud al servicio de reconocimiento de google
            print("error 1: problema con la conexión al servicio de google")
        except sr.UnknownValueError:
            # error al no entender el audio
            print("error 2: no se pudo reconocer el audio")
        
        # llamamos de nuevo a la función para reiniciar el proceso
        reconocer()

# ejecuta la función de reconocimiento
reconocer()
