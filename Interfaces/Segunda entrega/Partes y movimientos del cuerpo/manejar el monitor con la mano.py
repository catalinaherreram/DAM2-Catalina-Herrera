import cv2  # opencv es una librería para manejar imágenes y video
import mediapipe as mp  # mediapipe se usa para detectar y procesar landmarks como manos, cara o cuerpo
mp_drawing = mp.solutions.drawing_utils  # utilidades para dibujar en las imágenes
mp_drawing_styles = mp.solutions.drawing_styles  # estilos para dibujar landmarks
mp_hands = mp.solutions.hands  # cargamos el módulo de detección de manos
import math  # librería matemática para calcular distancias
import pyautogui  # librería para interactuar con la pantalla, como mover el mouse o hacer clics

# función que calcula la distancia euclidiana entre dos puntos en 3d
def distance_between_points(point1, point2):
    return math.sqrt((point2[0] - point1[0])**2 + 
                     (point2[1] - point1[1])**2 + 
                     (point2[2] - point1[2])**2)

# mueve el puntero del mouse a la esquina superior izquierda al inicio
pyautogui.moveTo(10, 10)

# resolución de pantalla
anchura = 1920
altura = 1080

# factores para escalar las coordenadas de la cámara (640x480) a la pantalla (1920x1080)
factorx = 1920 / 640
factory = 1080 / 480

# procesamiento de imágenes estáticas
image_files = []
with mp_hands.Hands(
    static_image_mode=True,  # modo para procesar imágenes estáticas
    max_num_hands=1,  # se detecta un máximo de una mano
    min_detection_confidence=0.5) as hands:  # confianza mínima para considerar una mano válida
  for idx, file in enumerate(image_files):  # iterar sobre imágenes
    image = cv2.flip(cv2.imread(file), 1)  # carga y voltea la imagen como espejo
    results = hands.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))  # convierte la imagen a rgb para procesarla

    print('handedness:', results.multi_handedness)  # imprime si es mano izquierda o derecha
    if not results.multi_hand_landmarks:  # si no detecta manos, pasa a la siguiente imagen
      continue
    image_height, image_width, _ = image.shape  # obtiene las dimensiones de la imagen
    annotated_image = image.copy()  # crea una copia para dibujar encima
    for hand_landmarks in results.multi_hand_landmarks:
      mp_drawing.draw_landmarks(
          annotated_image,
          hand_landmarks,
          mp_hands.HAND_CONNECTIONS,  # Corrección aquí
          mp_drawing_styles.get_default_hand_landmarks_style(),
          mp_drawing_styles.get_default_hand_connections_style())
    cv2.imwrite('/tmp/annotated_image' + str(idx) + '.png', cv2.flip(annotated_image, 1))  # guarda la imagen procesada

# procesamiento en tiempo real desde la webcam
cap = cv2.VideoCapture(0)  # abre la cámara
contador = 0  # contador para controlar la frecuencia de acciones
with mp_hands.Hands(
    model_complexity=0,  # reduce la complejidad para mejorar el rendimiento
    min_detection_confidence=0.5,  # confianza mínima para detección de manos
    min_tracking_confidence=0.5) as hands:  # confianza mínima para el seguimiento de movimientos
  while cap.isOpened():  # bucle mientras la cámara esté activa
    contador += 1
    success, image = cap.read()  # lee un fotograma de la cámara
    if not success:  # si no se puede leer el fotograma, continúa
      print("ignoring empty camera frame.")
      continue

    image.flags.writeable = False  # mejora el rendimiento marcando la imagen como no modificable
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # convierte a rgb para procesar
    results = hands.process(image)  # procesa la imagen para detectar manos

    image.flags.writeable = True  # vuelve a permitir modificaciones en la imagen
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # convierte de nuevo a bgr para mostrar

    if results.multi_hand_landmarks:  # si detecta manos
      for hand_landmarks in results.multi_hand_landmarks:
        mp_drawing.draw_landmarks(  # dibuja los landmarks en la imagen
            image,
            hand_landmarks,
            mp_hands.HAND_CONNECTIONS,  # Corrección aquí
            mp_drawing_styles.get_default_hand_landmarks_style(),
            mp_drawing_styles.get_default_hand_connections_style())

        # obtiene las coordenadas de los puntos del pulgar y el índice
        thumb_tip = hand_landmarks.landmark[mp_hands.HandLandmark.THUMB_TIP]
        index_finger_tip = hand_landmarks.landmark[mp_hands.HandLandmark.INDEX_FINGER_TIP]

        # convierte las coordenadas normalizadas (0 a 1) a píxeles
        image_height, image_width, _ = image.shape
        x_pixel = int(index_finger_tip.x * image_width)
        y_pixel = int(index_finger_tip.y * image_height)

        # calcula la distancia entre el pulgar y el índice
        distance = distance_between_points(
            (thumb_tip.x, thumb_tip.y, thumb_tip.z),
            (index_finger_tip.x, index_finger_tip.y, index_finger_tip.z)
        )

        # mueve el mouse en intervalos de 10 frames
        if contador % 10 == 0:
            pyautogui.moveTo(1920 - x_pixel * factorx, y_pixel * factory)

        # realiza clic si la distancia es menor a un umbral
        if distance < 0.1:
            if contador % 2 == 0:
                pyautogui.click()
                print("click")

    # muestra la imagen procesada en la pantalla, volteada como espejo
    cv2.imshow('mediapipe hands', cv2.flip(image, 1))
    if cv2.waitKey(5) & 0xFF == 27:  # presionar 'esc' para salir
      break
cap.release()  # cierra la cámara
