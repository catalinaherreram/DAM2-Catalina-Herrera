<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>deCode</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            text-align: center;
        }
        form {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            display: inline-block;
        }
        textarea {
            width: 100%;
            height: 80px;
        }
        button {
            padding: 10px;
            margin: 5px;
            border: none;
            cursor: pointer;
        }
        .btn-codificar { background: #28a745; color: white; }
        .btn-decodificar { background: #dc3545; color: white; }
    </style>
</head>
<body>

    <h2>deCode</h2>
    
    <form method="POST">
        <textarea name="texto" placeholder="Escribe tu texto aquí..."><?php echo isset($_POST['texto']) ? htmlspecialchars($_POST['texto']) : ''; ?></textarea><br>
        <button type="submit" name="accion" value="codificar" class="btn-codificar">Codificar</button>
        <button type="submit" name="accion" value="decodificar" class="btn-decodificar">Decodificar</button>
    </form>

    <h3>Resultado:</h3>
    <p>
        <?php
        class Codificador {
            public function codifica($entrada) {
                $salida = '';
                for ($i = 0; $i < mb_strlen($entrada, 'UTF-8'); $i++) {
                    $salida .= mb_chr(mb_ord(mb_substr($entrada, $i, 1, 'UTF-8')) + 5, 'UTF-8');
                }
                return base64_encode(base64_encode(base64_encode($salida)));
            }

            public function descodifica($entrada) {
                $entrada = base64_decode(base64_decode(base64_decode($entrada)));
                $salida = '';
                for ($i = 0; $i < mb_strlen($entrada, 'UTF-8'); $i++) {
                    $salida .= mb_chr(mb_ord(mb_substr($entrada, $i, 1, 'UTF-8')) - 5, 'UTF-8');
                }
                return $salida;
            }
        }

        if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['accion']) && isset($_POST['texto'])) {
            $codificador = new Codificador();
            $texto = $_POST['texto'];
            if ($_POST['accion'] === 'codificar') {
                echo "Texto codificado: " . htmlspecialchars($codificador->codifica($texto));
            } elseif ($_POST['accion'] === 'decodificar') {
                echo "Texto decodificado: " . htmlspecialchars($codificador->descodifica($texto));
            }
        }
        ?>
    </p>

</body>
</html>
