import cv2
import mediapipe as mp
import pyautogui
import numpy as np
import threading
import tkinter as tk
from PIL import Image, ImageTk

class FaceMeshApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Detección Facial y Control del Mouse")
        self.running = False
        self.cap = None

        # MediaPipe inicialización
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5)

        # Configuración de pantalla y cámara
        self.anchura = 1920
        self.altura = 1080
        self.centropantallax = self.anchura // 2
        self.centropantallay = self.altura // 2
        self.resolucion_video_x = 640
        self.resolucion_video_y = 480
        self.centrovideox = self.resolucion_video_x // 2
        self.centrovideoy = self.resolucion_video_y // 2
        self.sensibilidad = 12.5
        self.eye_right_indices = [33, 160, 158, 133, 153, 144]
        self.ear_umbral = 0.15
        self.consecutivo_parpaderos = 3
        self.contador_parpadeo = 0

        # Interfaz de usuario
        self.video_label = tk.Label(root)
        self.video_label.pack()

        self.start_button = tk.Button(root, text="Iniciar", command=self.start, font=("Arial", 14), width=15, height=2)
        self.start_button.pack(side=tk.LEFT, padx=20, pady=10)

        self.stop_button = tk.Button(root, text="Detener", command=self.stop, state=tk.DISABLED, font=("Arial", 14), width=15, height=2)
        self.stop_button.pack(side=tk.RIGHT, padx=20, pady=10)

    def calcular_ear(self, ojo):
        a = np.linalg.norm(np.array([ojo[1].x, ojo[1].y]) - np.array([ojo[5].x, ojo[5].y]))
        b = np.linalg.norm(np.array([ojo[2].x, ojo[2].y]) - np.array([ojo[4].x, ojo[4].y]))
        c = np.linalg.norm(np.array([ojo[0].x, ojo[0].y]) - np.array([ojo[3].x, ojo[3].y]))
        ear = (a + b) / (2.0 * c)
        return ear

    def process_frame(self):
        success, image = self.cap.read()
        if not success:
            print("No se pudo leer el marco de la cámara.")
            return

        # Procesar la imagen para detección facial
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(image)

        # Dibujar resultados y realizar acciones
        image.flags.writeable = True
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                nose_landmark = face_landmarks.landmark[1]
                h, w, _ = image.shape
                x_nose = int(nose_landmark.x * w)
                y_nose = int(nose_landmark.y * h)

                desplazamiento_x = x_nose - self.centrovideox
                desplazamiento_y = y_nose - self.centrovideoy

                movimiento_x = self.centropantallax + (desplazamiento_x * self.sensibilidad)
                movimiento_y = self.centropantallay + (desplazamiento_y * self.sensibilidad)
                movimiento_x = max(0, min(self.anchura, movimiento_x))
                movimiento_y = max(0, min(self.altura, movimiento_y))
                pyautogui.moveTo(1920 - movimiento_x, movimiento_y)

                cv2.circle(image, (x_nose, y_nose), 5, (0, 255, 0), -1)

                ojo_derecho = [face_landmarks.landmark[i] for i in self.eye_right_indices]
                ear_derecho = self.calcular_ear(ojo_derecho)

                if ear_derecho < self.ear_umbral:
                    self.contador_parpadeo += 1
                else:
                    if self.contador_parpadeo >= self.consecutivo_parpaderos:
                        pyautogui.click()
                    self.contador_parpadeo = 0

                self.mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=self.mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=self.mp_drawing_styles.get_default_face_mesh_tesselation_style())

        # Convertir la imagen para tkinter
        image = cv2.flip(image, 1)
        img = Image.fromarray(image)
        imgtk = ImageTk.PhotoImage(image=img)

        self.video_label.imgtk = imgtk
        self.video_label.configure(image=imgtk)

        if self.running:
            self.root.after(10, self.process_frame)

    def start(self):
        if not self.running:
            self.running = True
            self.cap = cv2.VideoCapture(0)
            self.start_button.config(state=tk.DISABLED)
            self.stop_button.config(state=tk.NORMAL)
            self.process_frame()

    def stop(self):
        if self.running:
            self.running = False
            self.cap.release()
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)
            self.video_label.imgtk = None  # Limpia el último fotograma

    def on_close(self):
        self.stop()
        self.face_mesh.close()
        self.root.destroy()

root = tk.Tk()
app = FaceMeshApp(root)
root.protocol("WM_DELETE_WINDOW", app.on_close)
root.mainloop()
