const WebSocket = require('ws');

const servidor = new WebSocket.Server({ host: '0.0.0.0', port: 3000 });

servidor.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Cuando el cliente envía un mensaje
    socket.on('message', (data) => {
        console.log("Mensaje recibido del cliente:", data);

        // Verificar que sea un JSON válido antes de reenviar
        try {
            const parsedData = JSON.parse(data);

            // Reenviar el mensaje a todos los clientes, excepto al remitente
            servidor.clients.forEach(client => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedData));
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
