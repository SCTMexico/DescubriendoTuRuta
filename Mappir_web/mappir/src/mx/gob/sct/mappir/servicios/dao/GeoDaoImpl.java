package mx.gob.sct.mappir.servicios.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Date;
import java.util.List;

import javax.naming.InitialContext;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import mx.gob.sct.mappir.email.EmailVO;
import mx.gob.sct.mappir.email.TestMail;
import mx.gob.sct.mappir.persitencia.EntityManager;
import mx.gob.sct.mappir.util.Config;
import mx.gob.sct.mappir.util.Constantes;
import mx.gob.sct.mappir.util.MappirException;
import mx.gob.sct.mappir.util.Utils;
import mx.gob.sct.mappir.util.sql.JsonQuery;
import nl.captcha.Captcha;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class GeoDaoImpl implements GeoDao {

	private JsonQuery jsonQuery = null;

	@SuppressWarnings("unchecked")
	@Override
	public String index() {

		try {
			JSONObject resultObject = new JSONObject();
			resultObject.put("error", new Boolean(false));
			resultObject.put("message", "");
			JSONArray data = new JSONArray();
			resultObject.put("data", data);
			JSONObject row = new JSONObject();
			row.put("obtenerVehiculos", "Devuelve el catalogo de vehiculos");
			row.put("obtenerCombustibles",
					"Devuelve el catalogo de combustibles y sus costos");
			row.put("obtenerTiposDeMarcadores",
					"Devuelve los tipos de marcadores");
			row.put("obtenerContenidos",
					"Devuelve los contenidos dinámicos del sitio");
			row.put("obtenerListaDeAdvertencias",
					"Devuelve los tipos de incidentes");
			row.put("obtenerMarcadores",
					" Devuelve los marcadores contendios entre los limites solicitados\n"
							+ "x1: longitud menor\n"
							+ "x2: longitud mayor\n"
							+ "x1: latitud menor\n"
							+ "x2: latitud mayor\n"
							+ "tipos[]: opcional, arreglo de los codigos de los tipos de marcadores");
			row.put("enviarCorreo",
					"Envia la ruta por correo electronico.\n"
							+ "para: Destinatario del mensaje\n"
							+ "de: Remitente del mensaje\n"
							+ "mensaje: Mensaje, menor a 300 caracteres\n"
							+ "respuesta: Respuesta del çodigo captcha\n"
							+ "ruta: Ruta codificada en base64\n"
							+ "callback: Funcion de javascript en la que se envuelve la respuesta");
			row.put("contacto",
					"Envia una solicitud de contacto.\n"
							+ "de: Remitente del mensaje\n"
							+ "mensaje: Mensaje, menor a 300 caracteres\n"
							+ "respuesta: Respuesta del çodigo captcha\n"
							+ "callback: Funcion de javascript en la que se envuelve la respuesta");
			row.put("repotarIncidente",
					"Crea un registro de reporte de incidente.\n"
							+ "nombre: Nombre de quien reporta\n"
							+ "correo: Correo de quien reporta\n"
							+ "telefono: Teléfono de quien reporta\n"
							+ "tipo: tipo de incidente\n"
							+ "descripcion: Descripcion del incidente\n"
							+ "x: longitud del incidente\n"
							+ "y: latitud del incidente\n"
							+ "respuesta: Respuesta del çodigo captcha\n"
							+ "callback: Funcion de javascript en la que se envuelve la respuesta");

			data.add(row);

			return resultObject.toJSONString();
		} catch (Exception e) {
			return returnError(e);
		}

	}

	@Override
	public String obtenerVehiculos() {
		try {
			return this.getJsonQuery().execute(
					DaoSQL.OBTENER_VEHICULOS,
					new String[] { "id", "categoria_id", "categoria", "nombre",
							"rendimiento" });
		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	public String obtenerCombustibles() {
		try {
			return this.getJsonQuery().execute(DaoSQL.OBTENER_COMBUSTIBLES,
					new String[] { "id", "nombre", "icono", "costo" });
		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	public String obtenerTiposDeMarcadores() {
		try {
			return this.getJsonQuery().execute(
					DaoSQL.OBTENER_TIPOS_DE_MARCADORES,
					new String[] { "id", "tipo", "icono_url", "codigo" });
		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	public String obtenerMarcadores(double x1, double x2, double y1, double y2,
			List<String> tipos) {
		try {

			if (x1 > x2) {
				double tmpX = x1;
				x1 = x2;
				x2 = tmpX;
			}

			if (y1 > y2) {
				double tmpY = y1;
				y1 = y2;
				y2 = tmpY;
			}

			if (x1 > -82.79699514269977 || x1 < -122.22668264269629) {
				return returnError("Fuera de limites");
			}

			if (y2 > 32.62609468043446 || y2 < 10.321022134436552) {
				return returnError("Fuera de limites");
			}

			String res = null;

			// if (tipos != null && tipos.size() > 0) {
			res = this.getJsonQuery().execute(
					DaoSQL.obtenerMarcadoresQuery(x1, x2, y1, y2, tipos),
					new String[] { "id", "tipo", "nombre", "info", "x", "y",
							"categoria", "icono_url" });
			// }

			return res;

		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	/** enviarRutaPorCorreo */
	public String enviarCorreo(HttpServletRequest request, String respuesta,
			String titulo, String para, String de, String mensaje,
			String callback, String ruta) {

		try {

			HttpSession session = request.getSession();
			Captcha captcha = (Captcha) session.getAttribute(Captcha.NAME);

			if (null == captcha) {
				return returnError(callback,
						"No has solicitado aún el captcha", true);
			}

			para = para.trim();
			if (!para.matches(Constantes.PATTERN_CORREO)
					|| !Utils.validaContenido(para)) {
				return returnError(callback, "El correo no parece  válido",
						true);
			}

			de = de.trim();
			if (de.length() == 0) {
				return returnError(callback,
						"Por favor específica quién manda el correo", true);
			} else if (de.length() > 30) {
				return returnError(callback, "El nombre '" + de
						+ "' es demasiado largo, usa menos de 30 carácteres",
						true);
			} else if (!Utils.validaContenido(de)) {
				return returnError(callback,
						"Error en el nombre, contenido no válido", true);
			}

			titulo = titulo.trim();
			if (titulo.length() == 0) {
				return returnError(callback,
						"No se proporcionó el título de la ruta", true);
			} else if (!Utils.validaContenido(titulo)) {
				return returnError(callback,
						"Error en el título, contenido no válido", true);
			}

			mensaje = mensaje.trim();
			if (mensaje.length() > 300) {
				return returnError(
						callback,
						"El mensaje es demasiado largo, usa menos de 300 carácteres",
						true);
			} else if (!Utils.validaContenido(mensaje)) {
				return returnError(callback,
						"Error en el mensaje, contenido no válido", true);
			}

			ruta = ruta.trim();
			if (ruta.length() == 0) {
				return returnError(callback, "La ruta no es válida", true);
			} else if (!Utils.validaContenido(ruta, "=")) {
				return returnError(callback,
						"Error en la ruta, contenido no válido", true);
			}

			respuesta = respuesta.trim();
			if (respuesta.length() == 0) {
				return returnError(callback,
						"Debe escribir el código de seguridad (captcha)", true);
			} else if (!Utils.validaContenido(respuesta)) {
				return returnError(
						callback,
						"Error en el código de seguridad (captcha), contenido no válido",
						true);
			}
			if (captcha.isCorrect(respuesta)) {

				// Roman, Se modifico el proceso anterior por este otro
				EmailVO emailVO = new EmailVO();

				emailVO.setPara(para);
				emailVO.setAsunto("Haz recibido una ruta de: " + de);
				emailVO.setCuerpo("Mensaje: " + mensaje
						+ "<br /><br />Ruta: <a href=\""
						+ Config.getVariable(Constantes.GENERAL_UNSECURE_URL)
						+ "?ruta=" + ruta + "\">" + titulo
						+ "</a><br /><br /><br />");
				
				
				StringBuilder sb = new StringBuilder(
						"<img src='http://ttr.sct.gob.mx/mappir/images/logo.jpg' /><br><br>Mensaje: <br><pre>");
				sb.append(mensaje);
				sb.append("</pre><br /><br />Ruta: <a href=\"");
				sb.append(Config.getVariable(Constantes.GENERAL_UNSECURE_URL));
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

				emailVO.setCuerpo(sb.toString());

				// Enviar el correo
				String res = null;
				try {
					res = new TestMail().enviarCorreo(emailVO);
				} catch (Exception e) {
					MappirException.imprimirLog(getClass(), e);
				}

				session.removeAttribute(Captcha.NAME);
				if (res != null) {
					return returnSuccess(callback, "Su ruta ha sido enviada correctamente");
				} else {
					return returnError(
							callback,
							"Error en el envío, el servicio no esta disponible por el momento,\nPor favor intente más tarde",
							true);
				}
			} else {
				return returnError(callback,
						"El código de seguridad (captcha) es incorrecto", true);
			}
		} catch (Exception e) {
			return returnError(e);
		}

	}

	@Override
	/** contacto, ayudanos a mejorar */
	public String contacto(HttpServletRequest request, String respuesta,
			String de, String mensaje, String callback) {
		try {

			HttpSession session = request.getSession();
			Captcha captcha = (Captcha) session.getAttribute(Captcha.NAME);

			if (!respuesta.equals("movil") && null == captcha) {
				return returnError(callback,
						"No has solicitado aún el captcha", true);
			}

			de = de.trim();
			if (!de.matches(Constantes.PATTERN_CORREO)
					|| !Utils.validaContenido(de)) {
				return returnError(callback, "El correo no parece válido", true);
			}

			mensaje = mensaje.trim();
			if (mensaje.length() > 300) {
				return returnError(
						callback,
						"El mensaje es demasiado largo, usa menos de 300 carácteres",
						true);
			} else if (!Utils.validaContenido(mensaje)) {
				return returnError(
						callback,
						"Error en el contenido del mensaje, contenido no válido",
						true);
			}

			respuesta = respuesta.trim();
			if (!Utils.validaContenido(respuesta)) {
				return returnError(
						callback,
						"Error en el código de seguridad (captcha), contenido no válido",
						true);
			}
			if (respuesta.equals("movil") || captcha.isCorrect(respuesta)) {

				// Roman, Se modifico el proceso anterior por este otro
				EmailVO emailVO = new EmailVO();

				emailVO.setPara(Config.getVariable(Constantes.CORREO_CONTACTO));
				emailVO.setAsunto("Haz recibido mensaje de: " + de);

				StringBuilder sb = new StringBuilder(
						"<img src='http://ttr.sct.gob.mx/mappir/images/logo.jpg' /><br><br>Mensaje: <br><pre>");
				sb.append(mensaje);
				sb.append("</pre><br><br><br><div><p></p><hr>");
				sb.append("<table style='undefined;table-layout: fixed;background-color:#FFFFFF;background-attachment:fixed;font-family:'Arial';font-size:1em;height:100%;margin:0px;padding:0px;'>");
				sb.append("<tr><th>AVISO IMPORTANTE:</th></tr>");
				
				sb.append("<tr><td align='justify'>");
				sb.append("Este correo electrónico y/o material adjunto es/son para uso exclusivo de la persona o la entidad a la que expresamente se le ha enviado, y puede contener información CONFIDENCIAL o RESERVADA, clasificada así por la legislación aplicable. Si usted no es el destinatario legitimo del mismo, por favor repórtelo inmediatamente al originador del correo y bórrelo. Considérese notificado que cualquier revisión, retransmisión, difusión o cualquier otro uso de este correo, por personas o entidades distintas a las del destinatario legitimo, queda expresamente prohibido.");
				sb.append("</td></tr>");
				
				sb.append("<tr><td align='justify'>");
				sb.append("This e-mail and/or its attachments is/are intended only for the person or entity to which it is addressed and may contain confidential information and/or privileged material, thus classified by the applicable legislation. If you are not intended recipient, please notify it to the sender and delete immediately. You are hereby notified that any review, retransmission, dissemination or other use of this e-mail by persons or entities other than the intended recipient is prohibited.");
				sb.append("</td></tr></table>");
				
				emailVO.setCuerpo(sb.toString());

				// Enviar el correo
				String res = null;
				try {
					res = new TestMail().enviarCorreo(emailVO);
				} catch (Exception e) {
					MappirException.imprimirLog(getClass(), e);
				}

				if (!respuesta.equals("movil")) {
					session.removeAttribute(Captcha.NAME);
				}
				if (res != null) {
					return returnSuccess(callback, "Gracias por tu apoyo, procesaremos tu información a la brevedad.");
				} else {
					return returnError(
							callback,
							"Error en el envío, el servicio no esta disponible por el momento,\nPor favor intente más tarde",
							true);
				}
			} else {
				return returnError(callback,
						"El código de seguridad (captcha) es incorrecto", true);
			}
		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	public String obtenerContenidos() {
		try {
			return this.getJsonQuery().execute(DaoSQL.OBTENER_CONTENIDOS,
					new String[] { "titulo", "contenido" });
		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	public String obtenerListaDeAdvertencias() {
		try {
			return this.getJsonQuery().execute(
					DaoSQL.OBTENER_LISTA_DE_ADVERTENCIAS,
					new String[] { "name", "code" });
		} catch (Exception e) {
			return returnError(e);
		}
	}

	@Override
	public String repotarIncidente(HttpServletRequest request, String titulo,
			String nombre, String correo, String telefono, String tipo,
			String descripcion, String respuesta, String coord_x,
			String coord_y, String callback) {
		try {

			HttpSession session = request.getSession();
			Captcha captcha = (Captcha) session.getAttribute(Captcha.NAME);

			if (!respuesta.equals("movil") && null == captcha) {
				return returnError(callback,
						"No has solicitado aún el captcha", true);
			}

			nombre = nombre.trim();
			// if (nombre.length() == 0) {
			// return returnError(callback, "Por favor escriba su nombre");
			// } else
			if (nombre.length() > 30) {
				return returnError(
						callback,
						"El nombre \\\""
								+ nombre
								+ "\\\" es demasiado largo, usa menos de 30 carácteres",
						true);
			}

			correo = correo.trim();
			if (!correo.isEmpty()) {
				// se valida unicamente si se captura algo
				if (!correo.matches(Constantes.PATTERN_CORREO)) {
					return returnError(callback, "El correo no parece válido",
							true);
				}
			}

			telefono = telefono.trim();
			if (!telefono.isEmpty()) {
				// se valida unicamente si se captura algo
				if (!telefono.matches(Constantes.PATTERN_TELFONO)
						|| telefono.length() > 14) {
					return returnError(callback,
							"El teléfono no parece válido", true);
				}
			}

			if (!tipo.equals("INC") && !tipo.equals("EVN")) {
				return returnError(callback,
						"Se desconoce el tipo de incidente", true);
			}

			int tipoId = tipo.equals("INC") ? 1 : 2;

			descripcion = descripcion.trim();
			if (descripcion.length() == 0) {
				return returnError(callback,
						"Por favor escribe la descripción del incidente", true);
			} else if (descripcion.length() > 255) {
				return returnError(
						callback,
						"La decripción es demasiado larga, usa menos de 255 carácteres",
						true);
			} else if (Utils.validaContenido(descripcion)) {
				return returnError(
						callback,
						"Error en el contenido de la decripción, contenido no válido",
						true);
			}

			respuesta = respuesta.trim();
			if (Utils.validaContenido(respuesta)) {
				return returnError(
						callback,
						"Error en el código de seguridad (captcha), contenido no válido",
						true);
			}
			if (respuesta.equals("movil") || captcha.isCorrect(respuesta)) {
				Connection jndiConnection = null;
				PreparedStatement ps = null;
				try {
					javax.naming.Context initContext = new InitialContext();
					DataSource ds = (DataSource) initContext
							.lookup(Constantes.JNDI_DATA_SOURCE);
					jndiConnection = ds.getConnection();

					ps = jndiConnection
							.prepareStatement(DaoSQL.INSERT_INCIDENTE);
					ps.setInt(1, tipoId);
					ps.setString(2, titulo);
					ps.setBoolean(3, false);
					ps.setDouble(4, Double.parseDouble(coord_x));
					ps.setDouble(5, Double.parseDouble(coord_y));
					ps.setString(6, nombre);
					ps.setString(7, correo);
					ps.setString(8, telefono);
					ps.setString(9, descripcion);
					ps.setString(10, descripcion);
					ps.setInt(11, respuesta.equals("movil") ? 2 : 1);

					ps.executeUpdate();

					if (!respuesta.equals("movil")) {
						session.removeAttribute(Captcha.NAME);
					}
					return returnSuccess(callback,
							"Tu reporte de incidente fue registrado");
				} catch (Exception e) {
					return returnError(callback, e);
				} finally {
					try {
						if (jndiConnection != null) {
							jndiConnection.close();
						}
						if (ps != null) {
							ps.close();
						}
					} catch (Exception e) {
					}
				}
			}
			return returnError(callback,
					"Escribe correctamente el código que aparece en la imagen",
					true);
		} catch (Exception e) {
			return returnError(callback, e);
		}
	}

	@Override
	public String obtenerMarcadores(double x1, double x2, String callback) {

		EntityTransaction t = null;
		try {

			t = EntityManager.getEntityManager().getTransaction();
			t.begin();
			String idStr = EntityManager
					.directQuerySingle(DaoSQL.OBTENER_MARCADORES_SELECT);
			Integer idInt = Integer.parseInt(idStr) + 1;

			Query query = EntityManager.getEntityManager().createNativeQuery(
					DaoSQL.OBTENER_MARCADORES_INSERT);

			query.setParameter(1, idInt);
			query.setParameter(2, x1);
			query.setParameter(3, x2);
			query.setParameter(4, "Hora: " + new Date());
			query.executeUpdate();
			t.commit();

			return returnSuccess(callback, "Se han recibido las coordenadas.");

		} catch (Exception e) {
			if (t != null) {
				t.rollback();
			}
			return returnError(e);
		}

	}

	@Override
	public String returnError(Exception e) {
		MappirException.imprimirLog(this.getClass(), e);
		return "{\"error\": true, \"message\": \"Ha ocurrido un error al procesar tu petición, por favor intenta más tarde\"}";
	}

	private String returnError(String callback, Exception e) {
		MappirException.imprimirLog(this.getClass(), e);
		return callback
				+ "({\"error\": true, \"message\": \"Ha ocurrido un error al procesar tu petición, por favor intenta más tarde\"})";
	}

	private String returnError(String callback, String error,
			boolean mostrarError) {
		MappirException.imprimirLog(this.getClass(), error);
		String msg = null;
		if (mostrarError) {
			msg = callback + "({\"error\": true, \"message\": '" + error
					+ "'})";
		} else {
			msg = callback + "({\"error\": true, \"message\": ''})";
		}
		return msg;
	}

	private String returnError(String error) {
		MappirException.imprimirLog(this.getClass(), error);
		return "{\"error\": true, \"message\": ''}";
	}

	private String returnSuccess(String callback, String message) {
		return callback + "({\"error\": false, \"message\": \"" + message
				+ "\"})";
	}

	// private String returnSuccess(String message) {
	// return "{\"error\": false, \"message\": \"" + message + "\"}";
	// }

	private JsonQuery getJsonQuery() throws Exception {
		if (null == this.jsonQuery) {
			this.jsonQuery = JsonQuery.getInstance();
		}
		return this.jsonQuery;
	}

}
