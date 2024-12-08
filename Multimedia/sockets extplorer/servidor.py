import asyncio
import ssl
import websockets

connected_clients = set()

# Manejador de clientes
async def handle_client(websocket, path):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        connected_clients.remove(websocket)

# Configuración principal del servidor
async def main():
    # Configuración SSL
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(
        certfile="./codecath.eu_ssl_certificate.cer",
        keyfile="./_.codecath.eu_private_key.key"

    )

    # Crear el servidor WebSocket seguro
    start_server = await websockets.serve(handle_client, "0.0.0.0", 3000, ssl=ssl_context)
    print("WebSocket server running on wss://codecath.eu:3000")
    await asyncio.Future()  # Mantiene el servidor corriendo para siempre

# Ejecutar el servidor
asyncio.run(main())
