package mx.gob.sct.mappir.util;

public class Constantes {

	private Constantes() {
	}

	public static final String CAD_VACIA = "";
	public static final String JNDI_DATA_SOURCE = "SCT_MAPPIR_RUTEADOR";

	// Variables de la aplicacion (valor en BD)
	public static final String SEGUIR_FACEBOOK = "seguir.facebook";
	public static final String SEGUIR_TWITTER = "seguir.twitter";
	public static final String SEGUIR_GOOGLE = "seguir.google";
	public static final String COMPARTIR_FACEBOOK = "compartir.facebook";
	public static final String COMPARTIR_TWITTER = "compartir.twitter";
	public static final String COMPARTIR_GOOGLE = "compartir.google";
	public static final String PAGINA_TITULO = "pagina.titulo";
	public static final String STORE_APPLE = "store.apple";
	public static final String STORE_GOOGLE = "store.google";
	public static final String SERVICIOS_CATALOGOVEHICULOS = "servicios.catalogoVehiculos";
	public static final String SERVICIOS_CATALOGOGASOLINA = "servicios.catalogoGasolina";
	public static final String SERVICIOS_BUSQUEDADEDESTINOS = "servicios.busquedaDeDestinos";
	public static final String SERVICIOS_BUSQUEDADERUTA = "servicios.busquedaDeRuta";
	public static final String SERVICIOS_GEOCODIFICACIONINVERSA = "servicios.geoCodificacionInversa";
	public static final String SERVICIOS_REPORTARALERTA = "servicios.reportarAlerta";
	public static final String SERVICIOS_OBTENERCONTENIDO = "servicios.obtenerContenido";
	public static final String JS_SERVICIOSGEO = "js.serviciosGeo";
	public static final String IP_SERVICIOS_COCONUT = "ip.servicios.coconut";
	public static final String GENERAL_UNSECURE_URL = "general.unsecure_url";
	public static final String CORREO_CONTACTO = "correo.contacto";
	public static final String USUARIO_ID = "usuario_id";

	// Cadenas utilizadas para validaciones de contenido
	public static final String PATTERN_CORREO = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	public static final String PATTERN_TELFONO = "^([\\(\\)\\-\\ 0-9]*)$";
	public static final String LETRAS_VALIDAS = "/@,.-_:()[] 0123456789áéíóúabcdefghijklmnñopqrstuvwxyzÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	public static final Integer[] CARACTERES_ESPECIALES = new Integer[] { 9, 10, 11, 13, 32, 38, 40, 8629 };

	// Constantes para la configuracion de los marcadores
	public static final int CLUSTER_SIZE = 20;

}
