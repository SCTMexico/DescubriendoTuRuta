package mx.gob.sct.mappir.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import mx.gob.sct.mappir.persitencia.EntityManager;

/**
 * Created by mau on 1/03/14.
 */
public class Config {

	public static String getConfigValue(String code) {
		String result = EntityManager
				.directQuerySingle("SELECT valor FROM ttr_variables WHERE codigo = '"
						+ code + "'");
		return result;
	}

	/**
	 * Metodo que lee todas las variables de la tabla de variables y genera un
	 * HashMap para un manejo mas facil y optimo
	 * 
	 * @return
	 */
	public static Map<String, String> leerVariables() {

		List<Object[]> result = EntityManager
				.directQuery("SELECT codigo, valor FROM ttr_variables");

		variables = new HashMap<String, String>(result.size());
		for (Object[] obj : result) {
			variables.put(Constantes.CAD_VACIA + obj[0], Constantes.CAD_VACIA
					+ obj[1]);
		}
		return variables;
	}

	/**
	 * Devuelve una variable almacenada en BD por medio de su codigo
	 * 
	 * @param key
	 *            Codigo de la variable referenciado en la Base de Datos
	 * @return El valor de la variable
	 */
	public static String getVariable(String key) {
		if (variables == null) {
			leerVariables();
		}
		return variables.get(key);
	}

	private static Map<String, String> variables = null;

}
