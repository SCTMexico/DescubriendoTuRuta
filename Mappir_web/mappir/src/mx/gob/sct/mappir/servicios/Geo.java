package mx.gob.sct.mappir.servicios;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import mx.gob.sct.mappir.servicios.dao.GeoDao;
import mx.gob.sct.mappir.servicios.dao.GeoDaoImpl;

@Path("/geo")
public class Geo {

	private GeoDao dao = new GeoDaoImpl();

	public Geo(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("allow-file-access-from-files", "true");
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/")
	public String index() {
		return dao.index();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/obtenerVehiculos")
	public String obtenerVehiculos() {
		return dao.obtenerVehiculos();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/obtenerCombustibles")
	public String obtenerCombustibles() {
		return dao.obtenerCombustibles();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/obtenerTiposDeMarcadores")
	public String obtenerTiposDeMarcadores() {
		return dao.obtenerTiposDeMarcadores();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/obtenerMarcadores")
	public String obtenerMarcadores(@QueryParam("x1") double x1,
			@QueryParam("x2") double x2, @QueryParam("y1") double y1,
			@QueryParam("y2") double y2,
			@QueryParam("tipos[]") List<String> tipos) {
		return dao.obtenerMarcadores(x1, x2, y1, y2, tipos);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/enviarCorreo")
	public String enviarCorreo(@Context HttpServletRequest request,
			@QueryParam("respuesta") String respuesta,
			@QueryParam("titulo") String titulo,
			@QueryParam("para") String para, @QueryParam("de") String de,
			@QueryParam("mensaje") String mensaje,
			@QueryParam("callback") String callback,
			@QueryParam("ruta") String ruta) {
		return dao.enviarCorreo(request, respuesta, titulo, para, de, mensaje,
				callback, ruta);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/contacto")
	public String contacto(@Context HttpServletRequest request,
			@QueryParam("respuesta") String respuesta,
			@QueryParam("de") String de, @QueryParam("mensaje") String mensaje,
			@QueryParam("callback") String callback) {
		return dao.contacto(request, respuesta, de, mensaje, callback);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/obtenerContenidos")
	public String obtenerContenidos() {
		return dao.obtenerContenidos();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/obtenerListaDeAdvertencias")
	public String obtenerListaDeAdvertencias() {
		return dao.obtenerListaDeAdvertencias();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/repotarIncidente")
	public String repotarIncidente(@Context HttpServletRequest request,
			@QueryParam("titulo") String titulo,
			@QueryParam("nombre") String nombre,
			@QueryParam("correo") String correo,
			@QueryParam("telefono") String telefono,
			@QueryParam("tipo") String tipo,
			@QueryParam("descripcion") String descripcion,
			@QueryParam("respuesta") String respuesta,
			@QueryParam("coord_x") String coord_x,
			@QueryParam("coord_y") String coord_y,
			@QueryParam("callback") String callback) {
		return dao.repotarIncidente(request, titulo, nombre, correo, telefono,
				tipo, descripcion, respuesta, coord_x, coord_y, callback);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/backGeoLocation")
	public String obtenerMarcadores(@QueryParam("latitude") double x1,
			@QueryParam("longitude") double x2,
			@QueryParam("callback") String callback) {
		return dao.obtenerMarcadores(x1, x2, callback);
	}

}
