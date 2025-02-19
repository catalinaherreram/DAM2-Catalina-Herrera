import os
import zipfile
import tkinter as tk
from tkinter import filedialog, messagebox

class ZipPackerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        
        self.title("Empaquetador de Aplicaciones")
        self.geometry("500x250")
        self.resizable(False, False)
        
        # Variables
        self.folder_path = tk.StringVar()
        self.zip_path = tk.StringVar()

        # Etiqueta y botón para seleccionar carpeta
        tk.Label(self, text="Selecciona la carpeta a empaquetar:").pack(pady=5)
        tk.Entry(self, textvariable=self.folder_path, width=50).pack(pady=5)
        tk.Button(self, text="Buscar Carpeta", command=self.select_folder).pack(pady=5)

        # Etiqueta y botón para seleccionar destino ZIP
        tk.Label(self, text="Selecciona el destino del ZIP:").pack(pady=5)
        tk.Entry(self, textvariable=self.zip_path, width=50).pack(pady=5)
        tk.Button(self, text="Guardar ZIP", command=self.select_zip_destination).pack(pady=5)

        # Botón de empaquetado
        tk.Button(self, text="Empaquetar", command=self.create_zip, bg="green", fg="white").pack(pady=10)

    def select_folder(self):
        """Selecciona la carpeta a empaquetar"""
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.folder_path.set(folder_selected)

    def select_zip_destination(self):
        """Selecciona dónde guardar el archivo ZIP"""
        file_selected = filedialog.asksaveasfilename(
            defaultextension=".zip",
            filetypes=[("Archivo ZIP", "*.zip")],
            title="Guardar como"
        )
        if file_selected:
            self.zip_path.set(file_selected)

    def create_zip(self):
        """Crea el archivo ZIP con los archivos de la carpeta seleccionada"""
        folder = self.folder_path.get()
        zip_file = self.zip_path.get()

        if not folder:
            messagebox.showerror("Error", "Selecciona una carpeta para empaquetar.")
            return

        if not zip_file:
            messagebox.showerror("Error", "Selecciona un destino para guardar el ZIP.")
            return

        try:
            with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as zipf:
                for root, dirs, files in os.walk(folder):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arcname = os.path.relpath(file_path, start=folder)  # Mantiene la estructura de carpetas
                        zipf.write(file_path, arcname)

            messagebox.showinfo("Éxito", f"Archivo ZIP creado correctamente en:\n{zip_file}")
        except Exception as e:
            messagebox.showerror("Error", f"Hubo un problema al empaquetar:\n{str(e)}")

if __name__ == "__main__":
    app = ZipPackerApp()
    app.mainloop()
