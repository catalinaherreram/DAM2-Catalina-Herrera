import imaplib
import email
from email.header import decode_header
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Configuración de la cuenta
username = "contacto@codecath.eu"  
password = "CICLODAM2$"
imap_server = "imap.ionos.es"
smtp_server = "smtp.ionos.es"
smtp_port = 587  

def enviar(desde, para, asunto, mensaje):
    """Función para enviar correos electrónicos."""
    msg = MIMEMultipart()
    msg['From'] = desde
    msg['To'] = para
    msg['Subject'] = asunto
    msg.attach(MIMEText(mensaje, "plain"))

    try:
        # Conectar al servidor SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Iniciar conexión segura
        server.login(username, password)
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        return {"mensaje": "Correo enviado correctamente"}
    except Exception as e:
        return {"mensaje": f"Error: {e}"}
    finally:
        server.quit()  # Cerrar la conexión
        
def eliminar_recibido(mail_id):
    """Función para eliminar un correo recibido."""
    try:
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)
        mail.select("inbox")

        # Eliminar el correo con el ID proporcionado
        mail.store(mail_id, "+FLAGS", "\\Deleted")
        mail.expunge()
        mail.close()
        mail.logout()

        return {"mensaje": "Correo eliminado correctamente"}
    except Exception as e:
        return {"error": f"Error al eliminar correo: {e}"}


def recibir():
    """Función para recibir correos electrónicos."""
    try:
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)
        mail.select("inbox")

        status, messages = mail.search(None, "ALL")
        mail_ids = messages[0].split()
        mensajes = []

        for mail_id in mail_ids:
            status, msg_data = mail.fetch(mail_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    mensaje = {}
                    msg = email.message_from_bytes(response_part[1])

                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else "utf-8")
                    mensaje["Asunto"] = subject
                    mensaje["De"] = msg.get("From")
                    mensaje["Fecha"] = msg.get("Date")

                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            if content_type == "text/plain":
                                body = part.get_payload(decode=True).decode("utf-8")
                                mensaje["Cuerpo"] = body
                    else:
                        mensaje["Cuerpo"] = msg.get_payload(decode=True).decode("utf-8")

                    mensajes.append(mensaje)

        mail.close()
        mail.logout()
        return mensajes

    except imaplib.IMAP4.error as e:
        return {"error": f"Error de autenticación: {e}"}
    except Exception as e:
        return {"error": f"Error desconocido: {e}"}

def recibir_por_fecha(fecha_objetivo):
    """Función para recibir correos por fecha específica."""
    try:
        mail = imaplib.IMAP4_SSL(imap_server)
        mail.login(username, password)
        mail.select("inbox")

        status, messages = mail.search(None, "ALL")
        mail_ids = messages[0].split()

        for mail_id in mail_ids:
            status, msg_data = mail.fetch(mail_id, "(RFC822)")
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    mensaje = {}
                    msg = email.message_from_bytes(response_part[1])
                    date = msg.get("Date")

                    if date == fecha_objetivo:
                        subject, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subject, bytes):
                            subject = subject.decode(encoding if encoding else "utf-8")
                        mensaje["Asunto"] = subject
                        mensaje["De"] = msg.get("From")
                        mensaje["Fecha"] = date

                        if msg.is_multipart():
                            for part in msg.walk():
                                content_type = part.get_content_type()
                                if content_type == "text/plain":
                                    body = part.get_payload(decode=True).decode("utf-8")
                                    mensaje["Cuerpo"] = body
                        else:
                            mensaje["Cuerpo"] = msg.get_payload(decode=True).decode("utf-8")

                        mail.close()
                        mail.logout()
                        return mensaje

        mail.close()
        mail.logout()
        return {"mensaje": "Correo no encontrado para la fecha especificada"}

    except imaplib.IMAP4.error as e:
        return {"error": f"Error de autenticación: {e}"}
    except Exception as e:
        return {"error": f"Error desconocido: {e}"}
