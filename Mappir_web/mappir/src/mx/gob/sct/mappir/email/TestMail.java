package mx.gob.sct.mappir.email;

import java.net.MalformedURLException;
import java.rmi.RemoteException;
import java.util.Date;

import javax.xml.rpc.ServiceException;

import mx.gob.sct.mappir.util.MappirException;

public class TestMail {

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		System.out.println("Iniciando: " + new Date());

		String mensaje = "Mensaje enviado al cuerpo del correo electronico.";
		String ruta = "?ruta=eyJ1c3IiOiJzY3QiLCJrZXkiOiJzY3QiLCJvcmlnZW4iOnsiaWRDYXRlZ29yaWEiOiJBLTIiLCJkZXNjIjoiVG9sdWNhLCBN6XhpY28iLCJpZFRyYW1vIjotMSwic291cmNlIjotMSwidGFyZ2V0IjotMSwieCI6LTk5LjY1NjIxODc1LCJ5IjoxOS4yOTM4MDY1NH0sImRlc3Rpbm9zIjpbeyJpZENhdGVnb3JpYSI6IkEtMiIsImRlc2MiOiJRdWVy6XRhcm8sIFF1ZXLpdGFybyIsImlkVHJhbW8iOjE1NzcxMSwic291cmNlIjoxNTU0MjUxLCJ0YXJnZXQiOjE1NTQyNTIsIngiOi0xMDAuMzg4NjA0NiwieSI6MjAuNTg5MjgwMzl9XSwib3BjaW9uZXMiOnsiY2FzZXRhcyI6dHJ1ZSwiYWxlcnRhcyI6dHJ1ZX0sInZlaGljdWxvIjp7InRpcG8iOjEsInN1YnRpcG8iOjEsInJlbmRpbWllbnRvIjoxNiwiY29tYnVzdGlibGUiOjEsImNvc3RvbHRnYXMiOiIxMi42MCIsImV4Y2VkZW50ZSI6IjAifSwicnV0YSI6MX0=";
		String titulo = "De Toluca, México a Querétaro, Querétaro";

		TestMail correo = new TestMail();

		EmailVO emailVO = new EmailVO();
		emailVO.setPara("rortizsan@gmail.com, roman_ortiz@hotmail.com");
		// emailVO.setPara("roman_ortiz@hotmail.com");
		emailVO.setAsunto("Asunto prueba:" + new Date());
		// emailVO.setCuerpo("Cuerpo o contenido del correo, enviado a las: "
		// + new Date());

		StringBuilder sb = new StringBuilder(
				"<img src='http://ttr.sct.gob.mx/mappir/images/logo.jpg' /><br><br>Mensaje: <br>");
		sb.append(mensaje);
		sb.append("<br /><br />Ruta: <a href=\"");
		sb.append("http://ttr.sct.gob.mx/mappir/");
		sb.append("?ruta=");
		sb.append(ruta);
		sb.append("\">");
		sb.append(titulo);
		sb.append("</a><br /><br /><br /><hr>");
		sb.append("<table style='undefined;table-layout: fixed;background-color:#FFFFFF;background-attachment:fixed;font-family:'Arial';font-size:1em;height:100%;margin:0px;padding:0px;'>");
		sb.append("<tr><th>AVISO IMPORTANTE:</th></tr>");
		
		sb.append("<tr><td align='justify'>");
		sb.append("Este correo electrónico y/o material adjunto es/son para uso exclusivo de la persona o la entidad a la que expresamente se le ha enviado, y puede contener información CONFIDENCIAL o RESERVADA, clasificada así por la legislación aplicable. Si usted no es el destinatario legitimo del mismo, por favor repórtelo inmediatamente al originador del correo y bórrelo. Considérese notificado que cualquier revisión, retransmisión, difusión o cualquier otro uso de este correo, por personas o entidades distintas a las del destinatario legitimo, queda expresamente prohibido.");
		sb.append("</td></tr>");
		
		sb.append("<tr><td align='justify'>");
		sb.append("This e-mail and/or its attachments is/are intended only for the person or entity to which it is addressed and may contain confidential information and/or privileged material, thus classified by the applicable legislation. If you are not intended recipient, please notify it to the sender and delete immediately. You are hereby notified that any review, retransmission, dissemination or other use of this e-mail by persons or entities other than the intended recipient is prohibited.");
		sb.append("</td></tr></table>");







		
		
//		sb.append("<tr><td><p>Este correo electrónico y/o material adjunto es/son para uso exclusivo de la persona o la entidad a la que expresamente se le ha enviado, y puede contener información CONFIDENCIAL o RESERVADA, clasificada así por la legislación aplicable. Si usted no es el destinatario legitimo del mismo, por favor repórtelo inmediatamente al originador del correo y bórrelo. Considérese notificado que cualquier revisión, retransmisión, difusión o cualquier otro uso de este correo, por personas o entidades distintas a las del destinatario legitimo, queda expresamente prohibido.<br /><br />");
//		sb.append("This e-mail and/or its attachments is/are intended only for the person or entity to which it is addressed and may contain confidential information and/or privileged material, thus classified by the applicable legislation. If you are not intended recipient, please notify it to the sender and delete immediately. You are hereby notified that any review, retransmission, dissemination or other use of this e-mail by persons or entities other than the intended recipient is prohibited.</td></tr></table>");

		emailVO.setCuerpo(sb.toString());

		correo.enviarCorreo(emailVO);
		System.out.println("Termino, correo.enviarCorreo(emailVO);: "
				+ new Date());

		// correo.enviarCorreoProxy(emailVO);
		// System.out.println("Termino, correo.enviarCorreoProxy(emailVO);: "+new
		// Date());

		System.out.println("Termino: " + new Date());

	}

	public String test() {
		EmailVO emailVO = new EmailVO();
		emailVO.setPara("rortizsan@gmail.com");
		emailVO.setAsunto("Asunto prueba.");
		emailVO.setCuerpo("Cuerpo o contenido del correo, enviado a las: "
				+ new Date());

		System.out.println("Iniciando...");
		try {
			EmailServiceServiceLocator wsEmailSL = new EmailServiceServiceLocator();
			System.out.println("Se instancio, wsEmailSL=" + wsEmailSL);
			EmailService wsEmail = wsEmailSL
					.getEmailServiceSoapPort(new java.net.URL(EmailVO.EMWSPort));
			wsEmail.sendEMail(emailVO.getPara(), emailVO.getAsunto(),
					emailVO.getCuerpo(), EmailVO.EMQWERTY, EmailVO.EMASDFG);
			System.out.println("Termino...");
		} catch (MalformedURLException e) {
			MappirException.imprimirLog(this.getClass(), e);
		} catch (RemoteException e) {
			MappirException.imprimirLog(this.getClass(), e);
		} catch (ServiceException e) {
			MappirException.imprimirLog(this.getClass(), e);
		} catch (Exception e) {
			MappirException.imprimirLog(this.getClass(), e);
		}
		return "termino";
	}

	public String enviarCorreo(EmailVO emailVO) {
		String res = null;
		try {
			EmailServiceServiceLocator wsEmailSL = new EmailServiceServiceLocator();
			// System.out.println("Se instancio, wsEmailSL=" + wsEmailSL);
			EmailService wsEmail = wsEmailSL
					.getEmailServiceSoapPort(new java.net.URL(EmailVO.EMWSPort));
			wsEmail.sendEMail(emailVO.getPara(), emailVO.getAsunto(),
					emailVO.getCuerpo(), EmailVO.EMQWERTY, EmailVO.EMASDFG);
			res = "ok";
		} catch (MalformedURLException e) {
			MappirException.imprimirLog(this.getClass(), e);
		} catch (RemoteException e) {
			MappirException.imprimirLog(this.getClass(), e);
		} catch (ServiceException e) {
			MappirException.imprimirLog(this.getClass(), e);
		} catch (Exception e) {
			MappirException.imprimirLog(this.getClass(), e);
		}
		return res;
	}

}
