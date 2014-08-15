package mx.gob.sct.mappir.util;

import java.text.DecimalFormat;

import org.apache.commons.lang.StringUtils;

public class Utils {

	private static final DecimalFormat df = new DecimalFormat("#,##0.00");

	private Utils() {
	}

	public static boolean validaContenido(String texto) {
		for (char i : texto.toCharArray()) {
			if (!validaCaracter(i)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Metodo que valida si es el contenido de una cadena de texto contiene
	 * caracteres válidos.
	 * 
	 * @param cadena
	 *            Cadena a validar
	 * @return <b>true</b> si la cadena es válida <b>false</b> en caso contrario
	 */
	public static boolean validaCaracter(int carASCII) {
		boolean tecla_especial = false;
		for (int i = 0; i < Constantes.CARACTERES_ESPECIALES.length; i++) {
			if (carASCII == Constantes.CARACTERES_ESPECIALES[i]) {
				tecla_especial = true;
				break;
			}
		}
		if (Constantes.LETRAS_VALIDAS.indexOf(((char) carASCII)) == -1
				&& !tecla_especial) {
			return false;
		}
		return true;
	}

	public static boolean validaContenido(String cadena, String extend) {
		return StringUtils.containsOnly(cadena, Constantes.LETRAS_VALIDAS
				+ extend);
	}

	/**
	 * Metodo que transforma un valor double a una cadena en formato numerico
	 * con 2 decimal y una coma como separador de miles
	 * 
	 * @param val
	 *            Valor que se desea formatear/transformar
	 * @return El valor en String transformado/formateado ej:
	 *         127555.5001=127,555.50, 0024125.49345=24,125.49,
	 *         6727.678=6,727.68
	 */
	public static String formatDoubleStr(double val) {
		return df.format(val);
	}

}
