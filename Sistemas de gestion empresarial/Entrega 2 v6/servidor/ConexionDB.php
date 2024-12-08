<?php

	class conexionDB{ // defino la clase conexión a la base de datos
		
			private $servidor; // propiedades privadas para los datos de conexión
			private $usuario; 
			private $contrasena; 
			private $basededatos; 
			private $conexion; 
			
			public function __construct() { // constructor que inicializa la conexión
				  $this->servidor = "localhost"; 
				  $this->usuario = "apex"; 
				  $this->contrasena = "apex"; 
				  $this->basededatos = "apex"; 
				  
				  $this->conexion = mysqli_connect(
							$this->servidor, 
							$this->usuario, 
							$this->contrasena, 
							$this->basededatos
						); // establece la conexión con la base de datos
			 }
			 
			public function buscar($tabla, $datos){ // busca registros exactos en la tabla
				$peticion = "SELECT * FROM ".$tabla." WHERE ";
				foreach($datos as $clave => $valor){
					$peticion .= $clave."='".$valor."' AND "; 
				}
				$peticion .= " 1;";
				
				$resultado = mysqli_query($this->conexion , $peticion);
				$retorno = [];
				while ($fila = mysqli_fetch_assoc($resultado)) { // guarda los resultados en un array
					$retorno[] = $fila;
				}
				return json_encode($retorno, JSON_PRETTY_PRINT); // devuelve los datos en formato json
			}
			
			public function buscarSimilar($tabla, $datos){ // busca registros similares (LIKE)
				$peticion = "SELECT * FROM ".$tabla." WHERE ";
				foreach($datos as $clave => $valor){
					$peticion .= $clave." LIKE '%".$valor."%' AND "; 
				}
				$peticion .= " 1;";
				
				$resultado = mysqli_query($this->conexion , $peticion);
				$retorno = [];
				while ($fila = mysqli_fetch_assoc($resultado)) {
					$retorno[] = $fila;
				}
				return json_encode($retorno, JSON_PRETTY_PRINT); 
			}
			
			public function seleccionaTabla($tabla){ // selecciona y analiza una tabla con restricciones
				$query = "SELECT * FROM information_schema.key_column_usage WHERE table_name = '".$tabla."' AND REFERENCED_TABLE_NAME IS NOT NULL;";
				$result = mysqli_query($this->conexion , $query); 
				$restricciones = []; 
				while ($row = mysqli_fetch_assoc($result)) {
					$restricciones[] = $row; 
				}
				
				$query = "SELECT * FROM ".$tabla.";";
				$result = mysqli_query($this->conexion , $query); 
				$resultado = [];
				while ($row = mysqli_fetch_assoc($result)) {
						$fila = []; 
						foreach($row as $clave => $valor){ 
							$pasas = true; 
							foreach($restricciones as $restriccion){ 
								if($clave == $restriccion["COLUMN_NAME"]){ 
									$query2 = "SELECT * FROM ".$restriccion["REFERENCED_TABLE_NAME"]." WHERE Identificador = ".$valor.";";
									$result2 = mysqli_query($this->conexion , $query2);
									$cadena = "";
									while ($row2 = mysqli_fetch_assoc($result2)) {
										foreach($row2 as $campo){
											$cadena .= $campo."-";
										}
									}
									$fila[$clave] = $cadena;
									$pasas = false; 
								}
							}
							if($pasas) {
								$fila[$clave] = $valor; 
							}
						}
						$resultado[] = $fila;		
				}
				return json_encode($resultado, JSON_PRETTY_PRINT); 
			}
			
			public function listadoTablas(){ // lista las tablas de la base de datos
				$query = "SELECT table_name AS 'Tables_in_".$this->basededatos."', table_comment AS 'Comentario' FROM information_schema.tables WHERE table_schema = '".$this->basededatos."';";
				$result = mysqli_query($this->conexion , $query);
				$resultado = [];
				while ($row = mysqli_fetch_assoc($result)) {
					$resultado[] = $row;
				}
				return json_encode($resultado, JSON_PRETTY_PRINT);
			}
			
			public function columnasTabla($tabla){ // lista las columnas de una tabla
				$query = "SHOW COLUMNS FROM ".$tabla.";";
				$result = mysqli_query($this->conexion , $query);
				$resultado = [];
				while ($row = mysqli_fetch_assoc($result)) {
					$resultado[] = $row;
				}
				return json_encode($resultado, JSON_PRETTY_PRINT);
			}
			
		  public function insertaTabla($tabla, $valores) { // inserta un registro en la tabla
		    $campos = "";
		    $parametros = "";
		    $tipos = "";
		    $datos = [];

		    foreach ($valores as $clave => $valor) {
		        $campos .= $clave . ",";
		        $parametros .= "?,";
		        $tipos .= "s"; 
		        $datos[] = $valor;
		    }

		    $campos = rtrim($campos, ",");
		    $parametros = rtrim($parametros, ",");

		    $query = "INSERT INTO $tabla ($campos) VALUES ($parametros)";
		    $stmt = $this->conexion->prepare($query);

		    $stmt->bind_param($tipos, ...$datos);
		    if ($stmt->execute()) {
		        echo "Inserción exitosa.";
		    } else {
		        echo "Error al insertar: " . $stmt->error;
		    }

		    $stmt->close();
			}

			public function actualizaTabla($tabla, $valores, $id){ // actualiza registros de la tabla
					$query = "UPDATE ".$tabla." SET ";
					foreach($valores as $clave => $valor){
						$query .= $clave."='".$valor."', ";
					}
					$query = substr($query, 0, -2);
					$query .= " WHERE Identificador = ".$id.";";
					mysqli_query($this->conexion , $query); 
			}
			
			public function actualizar($datos){ // actualiza un único campo
					$query = "UPDATE ".$datos['tabla']." SET ".$datos['columna']." = '".$datos['valor']."' WHERE Identificador = ".$datos['Identificador'].";";
					mysqli_query($this->conexion , $query); 
					return '{"mensaje":"ok"}';
			}
			
			public function eliminaTabla($tabla, $id){ // elimina un registro
				$query = "DELETE FROM ".$tabla." WHERE Identificador = ".$id.";";
				mysqli_query($this->conexion , $query);
			}
			
			private function codifica($entrada){ // codifica un valor en base64
				return base64_encode($entrada);
			}
			
			private function decodifica($entrada){ // decodifica un valor de base64
				return base64_decode($entrada);
			}
	}

?>
