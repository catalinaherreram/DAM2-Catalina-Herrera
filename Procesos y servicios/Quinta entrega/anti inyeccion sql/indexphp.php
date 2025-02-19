<?php
	function sanear($elemento){
		$coleccion = ['DELETE', 'DROP', 'TRUNCATE'];
		$entradas = $elemento;
		foreach ($entradas as $clave=>$valor) {
			 
			$entrada = $clave;
			if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)) {
				 die("No permitido");
			} 
			$entrada = $valor;
			if (array_filter($coleccion, fn($elemento) => strpos($entrada, $elemento) !== false)) {
				 die("No permitido");
			} 
			 
		}
	}
	sanear($_REQUEST);
?>
