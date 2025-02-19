import os
import ast
import tkinter as tk
from tkinter import filedialog, messagebox

class CodeAnalyzer:
    def __init__(self, project_path, output_file="DOCUMENTATION.md"):
        self.project_path = project_path
        self.output_file = os.path.join(self.project_path, output_file)
        self.documentation = []

    def analyze_file(self, file_path):
        """Analiza un archivo Python y extrae información relevante."""
        with open(file_path, "r", encoding="utf-8") as file:
            tree = ast.parse(file.read(), filename=file_path)

        self.documentation.append(f"# {os.path.basename(file_path)}\n")
        self.documentation.append("## Información del archivo\n")

        # Contar clases y funciones
        class_count = sum(isinstance(node, ast.ClassDef) for node in ast.walk(tree))
        function_count = sum(isinstance(node, ast.FunctionDef) for node in ast.walk(tree))
        variable_count = sum(isinstance(node, ast.Assign) for node in ast.walk(tree))

        self.documentation.append(f"- **Clases:** {class_count}")
        self.documentation.append(f"- **Funciones:** {function_count}")
        self.documentation.append(f"- **Variables declaradas:** {variable_count}\n")

        # Listar clases y funciones
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                self.documentation.append(f"### ️Clase: `{node.name}`")
            elif isinstance(node, ast.FunctionDef):
                params = [arg.arg for arg in node.args.args]
                param_list = ", ".join(params) if params else "Sin parámetros"
                self.documentation.append(f"### Función: `{node.name}({param_list})`")

    def generate(self):
        """Escanea los archivos Python y genera un informe en Markdown."""
        self.documentation.append("# Reporte de Análisis del Proyecto\n")

        for root, _, files in os.walk(self.project_path):
            for file in files:
                if file.endswith(".py"):
                    file_path = os.path.join(root, file)
                    self.analyze_file(file_path)

        with open(self.output_file, "w", encoding="utf-8") as doc_file:
            doc_file.write("\n".join(self.documentation))

        return self.output_file


class DocApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Analizador de Código Python")
        self.root.geometry("500x300")
        self.root.resizable(False, False)

        # Etiqueta de título
        self.label = tk.Label(root, text="Selecciona un proyecto para analizar", font=("Arial", 12))
        self.label.pack(pady=10)

        # Botón para seleccionar carpeta
        self.select_button = tk.Button(root, text="Seleccionar Carpeta", command=self.select_folder, font=("Arial", 10))
        self.select_button.pack(pady=5)

        # Etiqueta para mostrar la carpeta seleccionada
        self.folder_label = tk.Label(root, text=" Ninguna carpeta seleccionada", font=("Arial", 10), fg="gray")
        self.folder_label.pack(pady=5)

        # Botón para generar documentación
        self.generate_button = tk.Button(root, text="Generar Reporte", command=self.generate_docs, state=tk.DISABLED, font=("Arial", 10), bg="blue", fg="white")
        self.generate_button.pack(pady=20)

        # Etiqueta de estado
        self.status_label = tk.Label(root, text="", font=("Arial", 10), fg="blue")
        self.status_label.pack(pady=5)

    def select_folder(self):
        """Abre un cuadro de diálogo para seleccionar la carpeta del proyecto."""
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.project_path = folder_selected
            self.folder_label.config(text=f" {self.project_path}", fg="black")
            self.generate_button.config(state=tk.NORMAL)

    def generate_docs(self):
        """Genera el reporte usando CodeAnalyzer y muestra el resultado."""
        self.status_label.config(text=" Analizando código...")
        self.root.update_idletasks()

        analyzer = CodeAnalyzer(self.project_path)
        output_file = analyzer.generate()

        self.status_label.config(text=" Reporte generado con éxito!")
        messagebox.showinfo("Completado", f"Reporte generado:\n{output_file}")


# Ejecutar la aplicación
if __name__ == "__main__":
    root = tk.Tk()
    app = DocApp(root)
    root.mainloop()
