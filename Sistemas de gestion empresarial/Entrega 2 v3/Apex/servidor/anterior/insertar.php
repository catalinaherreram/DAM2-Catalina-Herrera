<?php
$mysqli = mysqli_connect("localhost", "apex", "apex", "apex");
$peticion = "INSERT INTO clientes VALUES(NULL,";

$json = file_get_contents('php://input');

$data = json_decode($json, true);

    foreach($data as $clave=>$valor){
    if($clave != "Identificador"){ 
        $peticion .= "'".$valor."',";
        }
    }
$peticion = substr($peticion, 0, -1);

    $peticion .= ");";
    echo $peticion;
    $result = mysqli_query($mysqli, $peticion);
?>