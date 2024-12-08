    <?php
	ini_set('display_errors', 1);               // activa la visualización de errores
ini_set('display_startup_errors', 1);       // activa errores de inicio
error_reporting(E_ALL);                     // muestra todos los errores

include "ConexionDB.php";                   // incluye la clase de conexión

$conexion = new conexionDB();               // crea una nueva instancia de la clase de conexión

echo $conexion->seleccionaTabla("lineaspedido");  // llama al método para seleccionar la tabla y mostrar resultados

?>
