import cv2  # librería para manejo de video e imágenes
import mediapipe as mp  # librería para detección y procesamiento de landmarks como caras, manos, etc.

# inicialización de mediapipe para detección facial
mp_face_detection = mp.solutions.face_detection  # módulo de detección facial de mediapipe
mp_drawing = mp.solutions.drawing_utils  # utilidades para dibujar en las imágenes

# inicialización de la cámara
cap = cv2.VideoCapture(0)  # abre la cámara por defecto

# configuración del detector facial con confianza mínima de detección de 0.2
with mp_face_detection.FaceDetection(min_detection_confidence=0.2) as face_detection:
    while cap.isOpened():  # bucle mientras la cámara esté activa
        success, image = cap.read()  # lee un fotograma de la cámara
        if not success:  # si no se obtiene un fotograma válido, continúa
            print("ignoring empty camera frame.")
            continue

        # convierte la imagen de formato bgr (usado por opencv) a rgb (usado por mediapipe)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # procesa la imagen para detectar caras
        results = face_detection.process(image_rgb)

        if results.detections:  # si se detectan caras
            for detection in results.detections:  # iterar sobre las detecciones
                # dibuja un cuadro y marcas sobre cada rostro detectado
                mp_drawing.draw_detection(image, detection)

        # muestra la imagen con las detecciones en una ventana
        cv2.imshow('mediapipe face detection', image)

        # si se presiona la tecla 'esc', sale del bucle
        if cv2.waitKey(5) & 0xFF == 27:
            break

# libera la cámara y cierra todas las ventanas abiertas
cap.release()
cv2.destroyAllWindows()
