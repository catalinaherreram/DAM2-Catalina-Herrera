<?php

	ini_set('display_errors', 1);	// activo la visualización de errores en tiempo de ejecución
	ini_set('display_startup_errors', 1);	// activo la visualización de errores de inicio
	error_reporting(E_ALL);	// establezco que se muestren todos los tipos de errores

	include "ConexionDB.php";	// incluyo el archivo que contiene la clase conexión a la base de datos

	$conexion = new conexionDB();	// creo una nueva instancia de la clase conexión a la base de datos
	if(isset($_GET['o'])){	// verifico si se ha recibido un parámetro 'o' a través del método get
		switch($_GET['o']){	// evaluo el valor de 'o' para ejecutar diferentes casos
			case "listatablas":
				echo $conexion->listadoTablas();	// llamo al método para listar las tablas y lo muestro como respuesta
				break;
			case "tabla":
				echo $conexion->seleccionaTabla($_GET['tabla']);	// llamo al método para seleccionar una tabla específica y lo muestro como respuesta
				break;
			case "columnastabla":
				echo $conexion->columnasTabla($_GET['tabla']);	// llamo al método para obtener las columnas de una tabla y lo muestro como respuesta
				break;
			case "eliminar":
				echo $conexion->eliminaTabla($_GET['tabla'],$_GET['id']);	// llamo al método para eliminar un registro de una tabla específica
				break;
			case "buscar":
				$json = file_get_contents('php://input');	// recojo los datos enviados en formato json desde la petición del cliente
        		$datos = json_decode($json, true); // decodifico el json a un formato que php pueda interpretar
				echo $conexion->buscar($_GET['tabla'],$datos); // llamo al método para actualizar un registro y lo muestro como respuesta
				break;
			case "actualizar":
				$json = file_get_contents('php://input');	
        		$datos = json_decode($json, true);
				echo $conexion->actualizar($datos);
				break;
			case "buscarSimilar":
				$json = file_get_contents('php://input');
        		$datos = json_decode($json, true);
				echo $conexion->buscarSimilar($_GET['tabla'],$datos);
				break;
			case "insertar":
				$json = file_get_contents('php://input');	
        $datos = json_decode($json, true);	
				echo $conexion->insertaTabla($_GET['tabla'],$datos);	
				break;
		}
	}
	
	
?>
