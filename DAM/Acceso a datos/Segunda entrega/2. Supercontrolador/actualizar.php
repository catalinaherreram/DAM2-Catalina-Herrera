<?php
	ini_set('display_errors', 1);  // activa errores de ejecución
	ini_set('display_startup_errors', 1);  // activa errores de inicio de PHP
	error_reporting(E_ALL);  // muestra todos los errores
	
	class conexionDB {  // clase para gestionar la conexión y operaciones de la base de datos
		
		// propiedades para los datos de conexión
		private $servidor;
		private $usuario;
		private $contrasena;
		private $basededatos;
		private $conexion;
		
		public function __construct() {  // constructor que establece la conexión con los datos de acceso
			$this->servidor = "localhost";  
			$this->usuario = "accesoadatos";  
			$this->contrasena = "accesoadatos";  
			$this->basededatos = "accesoadatos";  
			
			$this->conexion = mysqli_connect($this->servidor, $this->usuario, $this->contrasena, $this->basededatos);  // conecta a la base de datos
		}
		
		// método para seleccionar datos de una tabla y devolverlos en JSON
		public function seleccionaTabla($tabla) {
			$query = "SELECT * FROM ".$tabla.";";  // consulta para seleccionar todos los registros de la tabla
			$result = mysqli_query($this->conexion, $query);  // ejecuta la consulta
			$resultado = [];  // array para almacenar los resultados
			
			// recorre cada fila y la añade al array
			while ($row = mysqli_fetch_assoc($result)) {
				$fila = [];
				foreach ($row as $clave => $valor) {
					$fila[$clave] = $valor;
				}
				$resultado[] = $fila;
			}
			
			return json_encode($resultado, JSON_PRETTY_PRINT);  // devuelve el resultado en JSON
		}
		
		// método para obtener el listado de todas las tablas en JSON
		public function listadoTablas() {
			$query = "SHOW TABLES;";  // consulta para mostrar las tablas
			$result = mysqli_query($this->conexion, $query);
			$resultado = [];  // array para almacenar las tablas
			
			// recorre los resultados y los añade al array
			while ($row = mysqli_fetch_assoc($result)) {
				$fila = [];
				foreach ($row as $clave => $valor) {
					$fila[$clave] = $valor;
				}
				$resultado[] = $fila;
			}
			
			return json_encode($resultado, JSON_PRETTY_PRINT);  // devuelve el listado de tablas en JSON
		}
		
		// método para insertar un nuevo registro en una tabla
		public function insertaTabla($tabla, $valores) {
			$campos = implode(",", array_keys($valores));  // crea una cadena de nombres de campos
			$datos = implode("','", array_values($valores));  // crea una cadena de valores
			
			// consulta de inserción con los campos y valores
			$query = "INSERT INTO ".$tabla." (".$campos.") VALUES ('".$datos."');";
			mysqli_query($this->conexion, $query);  // ejecuta la consulta
			return 0;  // indica que se completó con éxito
		}
		
		// método para actualizar un registro específico en una tabla
		public function actualizaTabla($tabla, $valores, $id) {
			$campos = [];
			foreach ($valores as $clave => $valor) {
				$campos[] = $clave."='".$valor."'";
			}
			$campos_str = implode(", ", $campos);  // convierte los campos en una cadena

			// consulta de actualización para el registro con el ID dado
			$query = "UPDATE ".$tabla." SET ".$campos_str." WHERE Identificador = ".$id.";";
			echo $query;  // muestra la consulta para depuración
			mysqli_query($this->conexion, $query);  // ejecuta la consulta
			return "";  // devuelve confirmación de éxito
		}
		
		// método vacío para eliminar un registro (por completar)
		public function eliminaTabla($tabla, $id) {
			// código de eliminación aún no implementado
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
	
	// actualiza un registro en la tabla 'clientes'
	echo $conexion->actualizaTabla("clientes", ["nombre"=>'Catalina',"apellidos"=>'Herrera'], '1');
	
?>
