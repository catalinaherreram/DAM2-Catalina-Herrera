import cv2  # librería para manejo de video e imágenes
import mediapipe as mp  # librería para detección y procesamiento de landmarks como poses, caras, etc.

# inicialización de mediapipe para detección de poses
mp_pose = mp.solutions.pose  # módulo para detección de poses corporales
mp_drawing = mp.solutions.drawing_utils  # utilidades para dibujar landmarks y conexiones en las imágenes

# inicialización de la cámara
cap = cv2.VideoCapture(0)  # abre la cámara por defecto

# configuración del detector de poses con confianza mínima para detección y seguimiento
with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
    while cap.isOpened():  # bucle mientras la cámara esté activa
        success, image = cap.read()  # lee un fotograma de la cámara
        if not success:  # si no se obtiene un fotograma válido, continúa
            print("ignoring empty camera frame.")
            continue

        # convierte la imagen de formato bgr (usado por opencv) a rgb (usado por mediapipe)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # procesa la imagen para detectar la pose corporal
        results = pose.process(image_rgb)

        # si se detectan landmarks de la pose
        if results.pose_landmarks:
            # dibuja los landmarks y las conexiones en la imagen
            mp_drawing.draw_landmarks(
                image,  # imagen original donde se dibujarán los landmarks
                results.pose_landmarks,  # landmarks detectados
                mp_pose.POSE_CONNECTIONS  # conexiones entre landmarks
            )

        # muestra la imagen con los landmarks dibujados en una ventana
        cv2.imshow('mediapipe pose detection', image)

        # si se presiona la tecla 'esc', sale del bucle
        if cv2.waitKey(5) & 0xFF == 27:
            break

# libera la cámara y cierra todas las ventanas abiertas
cap.release()
cv2.destroyAllWindows()
