<?php
	ini_set('display_errors', 1);																								// Activo errores
	ini_set('display_startup_errors', 1);																				// Activo errores de inicio
	error_reporting(E_ALL);																											// 
	
	include "ConexionDB.php";																										// incluyo el archivo en el cual se encuentra la clase
	
	$conexion = new conexionDB();																								// Creo una nueva instancia de la clase
	if(isset($_GET['o'])){
		switch($_GET['o']){
			case "listatablas":
				echo $conexion->listadoTablas();																						// Llamo a un metodo
				break;
            case "tabla":
				echo $conexion->seleccionaTabla($_GET['tabla']);
				break;
            case "columnastabla":
            echo $conexion->columnasTabla($_GET['tabla']);
            break; 
            case "buscar":
            $json = file_get_contents('php://input');
            $datos = json_decode($json, true);
            echo $conexion->buscar($_GET['tabla'],$datos);
            break;
            case "buscarSimilar":
            $json = file_get_contents('php://input');
            $datos = json_decode($json, true);
            echo $conexion->buscarSimilar($_GET['tabla'],$datos);
            break;
            case "editarCelda":
            $json = file_get_contents('php://input'); // Lee los datos enviados en formato JSON
            $datos = json_decode($json, true); // Decodifica el JSON a un arreglo PHP
            echo $conexion->editarCelda();
            break;
            case "insertar":
            $json = file_get_contents('php://input');
            $datos = json_decode($json, true);
            echo $conexion->insertaTabla($_GET['tabla'],$datos);
            break;
            case "eliminar":
            echo $conexion->eliminaTabla($_GET['tabla'], $_GET['id']);
            break;
            case "actualizaTabla":
            $json = file_get_contents('php://input');
            $data = json_decode($json, true);
            echo $conexion->actualizaTabla($data['tabla'], $data['valor'], $data['id']);
            break;
        
		}
	}
	
	
?>
