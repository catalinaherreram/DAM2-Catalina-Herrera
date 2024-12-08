function convierteTipoDato(tipo) {
    let tipodevuelto;

    if (tipo.includes("varchar")) { // si el tipo de dato incluye "varchar"
        tipodevuelto = "text"; // lo convierto en "text"
    } else if (tipo.includes("int")) { // si el tipo de dato incluye "int"
        tipodevuelto = "number"; // lo convierto en "number"
    } else if (tipo.includes("date")) { // si el tipo de dato incluye "date"
        tipodevuelto = "date"; // lo convierto en "date"
    } else if (tipo.includes("decimal")) { // si el tipo de dato incluye "decimal"
        tipodevuelto = "number"; // lo convierto en "number"
    } else if (tipo.includes("time")) { // si el tipo de dato incluye "time"
        tipodevuelto = "time"; // lo convierto en "time"
    } else if (tipo.includes("blob")) { // si el tipo de dato incluye "blob"
        tipodevuelto = "file"; // lo convierto en "file"
    }

    return tipodevuelto; // devuelvo el tipo de dato convertido
}
