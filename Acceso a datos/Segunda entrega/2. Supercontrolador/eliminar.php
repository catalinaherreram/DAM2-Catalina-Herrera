<?php
	ini_set('display_errors', 1);  // activa visualización de errores
	ini_set('display_startup_errors', 1);  // activa errores de inicio
	error_reporting(E_ALL);  // muestra todos los errores
	
	class conexionDB {  // clase para manejar la conexión y operaciones de la base de datos
		
		// propiedades para los datos de conexión
		private $servidor;
		private $usuario;
		private $contrasena;
		private $basededatos;
		private $conexion;
		
		public function __construct() {  // constructor que establece los datos de conexión y conecta a la base de datos
			$this->servidor = "localhost";  
			$this->usuario = "accesoadatos";  
			$this->contrasena = "accesoadatos";  
			$this->basededatos = "accesoadatos";  
			
			// establece la conexión usando mysqli_connect
			$this->conexion = mysqli_connect($this->servidor, $this->usuario, $this->contrasena, $this->basededatos);  
		}
		
		// método para seleccionar datos de una tabla y devolverlos en formato JSON
		public function seleccionaTabla($tabla) {
			$query = "SELECT * FROM ".$tabla.";";  // consulta para seleccionar todos los datos de la tabla
			$result = mysqli_query($this->conexion, $query);  // ejecuta la consulta
			$resultado = [];  // array para almacenar resultados
			
			// recorre los resultados y los añade al array
			while ($row = mysqli_fetch_assoc($result)) {
				$fila = [];
				foreach ($row as $clave => $valor) {
					$fila[$clave] = $valor;
				}
				$resultado[] = $fila;
			}
			
			return json_encode($resultado, JSON_PRETTY_PRINT);  // devuelve el resultado en JSON
		}
		
		// método para listar todas las tablas de la base de datos y devolverlas en JSON
		public function listadoTablas() {
			$query = "SHOW TABLES;";  // consulta para obtener todas las tablas
			$result = mysqli_query($this->conexion, $query);
			$resultado = [];  // array para almacenar los nombres de tablas
			
			// recorre los resultados y los añade al array
			while ($row = mysqli_fetch_assoc($result)) {
				$fila = [];
				foreach ($row as $clave => $valor) {
					$fila[$clave] = $valor;
				}
				$resultado[] = $fila;
			}
			
			return json_encode($resultado, JSON_PRETTY_PRINT);  // devuelve el resultado en JSON
		}
		
		// método para insertar un nuevo registro en una tabla
		public function insertaTabla($tabla, $valores) {
			$campos = "";  // almacena nombres de columnas
			$datos = "";   // almacena los valores a insertar
			
			// construye las cadenas de campos y valores
			foreach ($valores as $clave => $valor) {
				$campos .= $clave.",";
				$datos .= "'".$valor."',";
			}
			
			// elimina la última coma de las cadenas
			$campos = substr($campos, 0, -1);
			$datos = substr($datos, 0, -1);
			
			// construye y ejecuta la consulta de inserción
			$query = "INSERT INTO ".$tabla." (".$campos.") VALUES (".$datos.");";
			mysqli_query($this->conexion, $query);
			return 0;
		}
		
		// método para actualizar un registro en una tabla
		public function actualizaTabla($tabla, $valores, $id) {
			$query = "UPDATE ".$tabla." SET ";  // inicia la consulta de actualización
			
			// añade cada columna y valor a la consulta
			foreach ($valores as $clave => $valor) {
				$query .= $clave."='".$valor."', ";
			}
			
			$query = substr($query, 0, -2);  // elimina la última coma y espacio
			$query .= " WHERE Identificador = ".$id.";";  // añade la condición de ID
			
			echo $query;  // muestra la consulta para depuración
			mysqli_query($this->conexion, $query);  // ejecuta la consulta
			return "";  // devuelve confirmación de éxito
		}
		
		// método para eliminar un registro en una tabla
		public function eliminaTabla($tabla, $id) {
			$query = "DELETE FROM ".$tabla." WHERE Identificador = ".$id.";";  // consulta de eliminación
			mysqli_query($this->conexion, $query);  // ejecuta la consulta
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
	
	$conexion = new conexionDB();  // instancia de la clase de conexión
	
	// elimina el registro con ID '2' en la tabla 'clientes'
	echo $conexion->eliminaTabla("clientes", '1');
	
?>
