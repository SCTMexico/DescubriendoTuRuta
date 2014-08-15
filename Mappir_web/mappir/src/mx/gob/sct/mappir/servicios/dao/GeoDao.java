package mx.gob.sct.mappir.servicios.dao;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

public interface GeoDao {

	public String index();

	public String obtenerVehiculos();

	public String obtenerCombustibles();

	public String obtenerTiposDeMarcadores();

	public String obtenerMarcadores(double x1, double x2, double y1, double y2,
			List<String> tipos);

	public String enviarCorreo(HttpServletRequest request, String respuesta,
			String titulo, String para, String de, String mensaje,
			String callback, String ruta);

	public String contacto(HttpServletRequest request, String respuesta,
			String de, String mensaje, String callback);

	public String obtenerContenidos();

	public String obtenerListaDeAdvertencias();

	public String repotarIncidente(HttpServletRequest request, String titulo,
			String nombre, String correo, String telefono, String tipo,
			String descripcion, String respuesta, String coord_x,
			String coord_y, String callback);

	public String obtenerMarcadores(double x1, double x2, String callback);

	public String returnError(Exception e);

}
