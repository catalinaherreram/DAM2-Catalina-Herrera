const WebSocket = require('ws');

const servidor = new WebSocket.Server({ host: '0.0.0.0', port: 3000 });

servidor.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Cuando el cliente envía un mensaje
    socket.on('message', (data) => {
        console.log("Mensaje recibido del cliente:", data); // Ver qué datos llegan desde el cliente

        // Verificar que realmente sea JSON antes de enviarlo
        try {
            JSON.parse(data); // Si no es un JSON válido, se detendrá aquí
            servidor.clients.forEach(client => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    console.log("Enviando datos a otro cliente...");
                    client.send(data);
                }
            });
        } catch (error) {
            console.error("Error: Mensaje recibido no es un JSON válido:", data);
        }
    });

    // Cuando el cliente se desconecta
    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket corriendo en ws://localhost:3000');
