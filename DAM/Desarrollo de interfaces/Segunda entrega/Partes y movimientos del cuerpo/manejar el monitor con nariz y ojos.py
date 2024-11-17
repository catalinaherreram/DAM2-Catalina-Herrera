import cv2  # librería para manejo de video e imágenes
import mediapipe as mp  # librería para detección y procesamiento de landmarks como cara, manos, etc.
import pyautogui  # librería para interactuar con la pantalla (mover el mouse, hacer clics)
import numpy as np  # librería para operaciones matemáticas y manejo de arrays

# inicialización de mediapipe para dibujar y manejar mallas faciales
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh

# resolución de la pantalla y de la cámara
anchura = 1920
altura = 1080
centropantallax = round(anchura / 2)  # centro horizontal de la pantalla
centropantallay = round(altura / 2)  # centro vertical de la pantalla
resolucion_video_x = 640
resolucion_video_y = 480
centrovideox = round(resolucion_video_x / 2)  # centro horizontal del video
centrovideoy = round(resolucion_video_y / 2)  # centro vertical del video
sensibilidad = 12.5  # factor de sensibilidad para el movimiento del mouse

# índices para landmarks del ojo derecho para mayor precisión
eye_right_indices = [33, 160, 158, 133, 153, 144]
ear_umbral = 0.15  # umbral para detectar si el ojo está cerrado
consecutivo_parpaderos = 3  # número de frames necesarios para confirmar un parpadeo
contador_parpadeo = 0  # contador para registrar frames con el ojo cerrado

# función para calcular el eye aspect ratio (ear) del ojo
def calcular_ear(ojo):
    # calcula las distancias entre puntos específicos del ojo
    a = np.linalg.norm(np.array([ojo[1].x, ojo[1].y]) - np.array([ojo[5].x, ojo[5].y]))
    b = np.linalg.norm(np.array([ojo[2].x, ojo[2].y]) - np.array([ojo[4].x, ojo[4].y]))
    c = np.linalg.norm(np.array([ojo[0].x, ojo[0].y]) - np.array([ojo[3].x, ojo[3].y]))
    ear = (a + b) / (2.0 * c)  # fórmula para calcular el ear
    return ear

# inicialización de la cámara
cap = cv2.VideoCapture(0)
with mp_face_mesh.FaceMesh(
    max_num_faces=1,  # máximo un rostro a detectar
    refine_landmarks=True,  # landmarks más precisos
    min_detection_confidence=0.5,  # confianza mínima para detectar un rostro
    min_tracking_confidence=0.5) as face_mesh:
    
    while cap.isOpened():
        success, image = cap.read()  # lee un fotograma de la cámara
        if not success:  # si no se obtiene un fotograma válido, continúa
            print("ignoring empty camera frame.")
            continue

        # convierte la imagen a formato rgb para que mediapipe pueda procesarla
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(image)

        # vuelve la imagen modificable y la regresa a formato bgr para mostrarla
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        if results.multi_face_landmarks:  # si se detecta un rostro
            for face_landmarks in results.multi_face_landmarks:
                # obtiene las coordenadas de la nariz como referencia
                nose_landmark = face_landmarks.landmark[1]
                h, w, _ = image.shape
                
                x_nose = int(nose_landmark.x * w)  # posición x de la nariz en píxeles
                y_nose = int(nose_landmark.y * h)  # posición y de la nariz en píxeles
                
                # calcula el desplazamiento de la nariz respecto al centro del video
                desplazamiento_x = x_nose - centrovideox
                desplazamiento_y = y_nose - centrovideoy
                
                # ajusta la posición del mouse en función del desplazamiento y la sensibilidad
                movimiento_x = centropantallax + (desplazamiento_x * sensibilidad)
                movimiento_y = centropantallay + (desplazamiento_y * sensibilidad)

                # asegura que las coordenadas estén dentro de la pantalla
                movimiento_x = max(0, min(anchura, movimiento_x))
                movimiento_y = max(0, min(altura, movimiento_y))

                # mueve el mouse a la posición calculada
                pyautogui.moveTo(1920 - movimiento_x, movimiento_y)

                # dibuja un círculo verde en la posición de la nariz para referencia
                cv2.circle(image, (x_nose, y_nose), 5, (0, 255, 0), -1)

                # calcula el ear del ojo derecho
                ojo_derecho = [face_landmarks.landmark[i] for i in eye_right_indices]
                ear_derecho = calcular_ear(ojo_derecho)

                # muestra el valor del ear en consola para depuración
                print(f"ear del ojo derecho: {ear_derecho}")
                
                if ear_derecho < ear_umbral:  # si el ear está por debajo del umbral
                    contador_parpadeo += 1
                    print(f"ojo cerrado. contador de parpadeo: {contador_parpadeo}")
                else:  # si el ojo se vuelve a abrir
                    if contador_parpadeo >= consecutivo_parpaderos:  # si hubo suficientes frames cerrados
                        print("¡parpadeo detectado! realizando clic.")
                        pyautogui.click()  # realiza un clic con el mouse
                    contador_parpadeo = 0  # reinicia el contador de parpadeo
                    print("ojo abierto. contador de parpadeo reiniciado.")
                
                # dibuja los landmarks y conexiones del rostro en la imagen
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())
                
        # muestra la imagen con los landmarks en una ventana, volteada horizontalmente
        cv2.imshow('mediapipe face mesh', cv2.flip(image, 1))
        if cv2.waitKey(5) & 0xFF == 27:  # si se presiona la tecla 'esc', sale del bucle
            break
            
# libera la cámara y cierra todas las ventanas abiertas
cap.release()
cv2.destroyAllWindows()
