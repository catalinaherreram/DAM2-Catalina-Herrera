<?php

	class conexionDB { // clase para gestionar la conexión y operaciones de la base de datos
		
		// propiedades privadas para almacenar la configuración de la conexión
		private $servidor;
		private $usuario;
		private $contrasena;
		private $basededatos;
		private $conexion;
		
		public function __construct() { // constructor para inicializar la conexión a la bbdd
			$this->servidor = "localhost";  // define el servidor
			$this->usuario = "apex";        // usuario de la bbdd
			$this->contrasena = "apex";     // contraseña
			$this->basededatos = "apex";    // nombre de la bbss
			
			// establece la conexión con la base de datos usando mysqli
			$this->conexion = mysqli_connect(
				$this->servidor, 
				$this->usuario, 
				$this->contrasena, 
				$this->basededatos
			);
		}
		
		// método para seleccionar datos de una tabla específica y gestionar restricciones
		public function seleccionaTabla($tabla) {
			// consulta para obtener restricciones (relaciones) de la tabla
			$query = "SELECT * FROM information_schema.key_column_usage 
					  WHERE table_name = '".$tabla."' 
					  AND REFERENCED_TABLE_NAME IS NOT NULL;";
			$result = mysqli_query($this->conexion, $query); // ejecuta la consulta de restricciones
			$restricciones = []; // array para almacenar restricciones
			
			// recorre los resultados de las restricciones y los almacena en el array
			while ($row = mysqli_fetch_assoc($result)) {
				$restricciones[] = $row;
			}
			
			// consulta para obtener todos los datos de la tabla
			$query = "SELECT * FROM ".$tabla.";";
			$result = mysqli_query($this->conexion, $query); // ejecuta la consulta de selección
			$resultado = []; // array para almacenar los datos de la tabla
			
			// recorre cada fila de la tabla
			while ($row = mysqli_fetch_assoc($result)) {
				$fila = []; // array para cada fila de datos
				
				// recorre cada columna de la fila
				foreach ($row as $clave => $valor) {
					$pasas = true; // variable para verificar si hay una restricción
					
					// verifica si la columna tiene alguna restricción
					foreach ($restricciones as $restriccion) {
						if ($clave == $restriccion["COLUMN_NAME"]) {
							
							// si hay restricción, consulta la tabla referenciada
							$query2 = "SELECT * FROM ".$restriccion["REFERENCED_TABLE_NAME"].";";
							$result2 = mysqli_query($this->conexion, $query2);
							$cadena = ""; // cadena para almacenar valores de la tabla referenciada
							
							// recorre los resultados de la tabla referenciada
							while ($row2 = mysqli_fetch_assoc($result2)) {
								foreach ($row2 as $campo) {
									$cadena .= $campo."-";
								}
							}
							
							$fila[$clave] = $cadena; // asigna la cadena como valor de la celda
							$pasas = false; // marca que hay restricción
						}
					}
					// si no hay restricción, asigna el valor real de la columna
					if ($pasas == true) {
						$fila[$clave] = $valor;
					}
				}
				$resultado[] = $fila; // añade la fila procesada al array resultado
			}
			
			$json = json_encode($resultado, JSON_PRETTY_PRINT); // convierte el resultado a JSON
			return $json; // devuelve el JSON
		}
		
		// método para listar todas las tablas de la base de datos
		public function listadoTablas() {
			$query = "SHOW TABLES;"; // consulta para obtener las tablas
			$result = mysqli_query($this->conexion, $query); // ejecuta la consulta
			$resultado = []; // array para almacenar las tablas
			
			// recorre los resultados y almacena cada tabla en el array
			while ($row = mysqli_fetch_assoc($result)) {
				$fila = [];
				foreach ($row as $clave => $valor) {
					$fila[$clave] = $valor;
				}
				$resultado[] = $fila;
			}
			
			$json = json_encode($resultado, JSON_PRETTY_PRINT); // convierte el resultado a JSON
			return $json; // devuelve el JSON
		}
		
		// método para insertar un nuevo registro en una tabla
		public function insertaTabla($tabla, $valores) {
			$campos = ""; // string para los nombres de las columnas
			$datos = "";  // string para los valores a insertar
			
			// recorre cada par clave-valor y construye las cadenas de campos y datos
			foreach ($valores as $clave => $valor) {
				$campos .= $clave.",";
				$datos .= "'".$valor."',";
			}
			
			// elimina la última coma de cada cadena
			$campos = substr($campos, 0, -1);
			$datos = substr($datos, 0, -1);
			
			// consulta de inserción
			$query = "INSERT INTO ".$tabla." (".$campos.") VALUES (".$datos.");";
			$result = mysqli_query($this->conexion, $query); // ejecuta la consulta de inserción
			return 0; // devuelve 0 para indicar éxito
		}
		
		// método para actualizar un registro en una tabla
		public function actualizaTabla($tabla, $valores, $id) {
			$query = "UPDATE ".$tabla." SET "; // inicia la consulta de actualización
			
			// recorre los valores y construye la parte de la consulta con columna = valor
			foreach ($valores as $clave => $valor) {
				$query .= $clave."='".$valor."', ";
			}
			
			// elimina la última coma y espacio extra
			$query = substr($query, 0, -2);
			
			// añade la condición para actualizar el registro con el ID dado
			$query .= " WHERE Identificador = ".$id.";";
			$result = mysqli_query($this->conexion, $query); // ejecuta la consulta de actualización
			return ""; // devuelve cadena vacía indicando éxito
		}
		
		// método para eliminar un registro en una tabla
		public function eliminaTabla($tabla, $id) {
			$query = "DELETE FROM ".$tabla." WHERE Identificador = ".$id.";"; // consulta de eliminación
			$result = mysqli_query($this->conexion, $query); // ejecuta la consulta de eliminación
		}
		
		// método privado para codificar una entrada en base64
		private function codifica($entrada) {
			return base64_encode($entrada);
		}
		
		// método privado para decodificar una entrada de base64
		private function decodifica($entrada) {
			return base64_decode($entrada);
		}
	}

?>
