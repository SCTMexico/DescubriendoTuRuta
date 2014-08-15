package mx.gob.sct.mappir.servicios.dao;

import java.util.List;

import mx.gob.sct.mappir.util.Constantes;

public class DaoSQL {

	public static final String OBTENER_VEHICULOS = "SELECT tstv.id_sub_tipo_vehiculo id, tstv.id_tipo_vehiculo categoria_id, ttv.nombre categoria, tstv.nombre, tstv.rendimiento_por_litro rendimiento FROM ttr_sub_tipos_vehiculo as tstv JOIN ttr_tipos_vehiculo as ttv ON tstv.id_tipo_vehiculo = ttv.id_tipo_vehiculo";
	public static final String OBTENER_COMBUSTIBLES = "SELECT id_tipo_combustible id, nombre, url_icono icono, costo_por_litro costo FROM ttr_tipos_combustible AS g";
	public static final String OBTENER_TIPOS_DE_MARCADORES = "SELECT tipo_de_marcador_id id, tipo_de_marcador tipo, icono_url, codigo FROM ttr_tipos_de_marcadores WHERE activo ORDER BY tipo";
	public static final String OBTENER_CONTENIDOS = "SELECT titulo, contenido FROM ttr_contenido";
	public static final String OBTENER_LISTA_DE_ADVERTENCIAS = "SELECT tipo_de_alerta as name,codigo as code FROM ttr_tipos_de_alertas AS ttda ORDER BY tipo_de_alerta ASC";
	public static final String INSERT_INCIDENTE = "INSERT INTO ttr_alertas(tipo_de_alerta_id, titulo, activo, coord_x, coord_y, creado_el, fecha_reporte, hora_reporte, nombre, correo, telefono, descripcion_reporte, descripcion, origen_reporte_id) VALUES (?,?,?,?,?,now(),now(),now()::time,?,?,?,?,?,?)";
	public static final String OBTENER_MARCADORES_SELECT = "select ''||id_caseta_combinada from ttr_caseta_combinada order by id_caseta_combinada desc limit 1";
	public static final String OBTENER_MARCADORES_INSERT = "INSERT INTO ttr_caseta_combinada(id_caseta_combinada, coord_x, coord_y,nombre) VALUES (?,?,?,?)";

	public static final String obtenerMarcadoresQuery(double x1, double x2,
			double y1, double y2, List<String> tipos) {
		StringBuilder sbQuery = new StringBuilder();

		String codeInFilter = "";
		if (tipos != null && tipos.size() > 0) {
			codeInFilter = " AND ttdm.codigo IN ('"
					+ tipos.get(0).replace("'", "\\'") + "'";
			for (int i = 1; i < tipos.size(); i++) {
				codeInFilter += ",'" + tipos.get(i).replace("'", "\\'") + "'";
			}
			codeInFilter += ")";
		}
		if (distance(x1, y1, x2, y2) < 21) {
			sbQuery.append("SELECT marcador_id, ttdm.tipo_de_marcador_id, nombre, info, coord_x, coord_y, tipo_de_marcador, icono_url");
			sbQuery.append(" FROM ttr_marcadores tm JOIN ttr_tipos_de_marcadores ttdm ON tm.tipo_de_marcador_id = ttdm.tipo_de_marcador_id ");
			sbQuery.append(" WHERE CAST(coord_x AS FLOAT) BETWEEN ");
			sbQuery.append(x1);
			sbQuery.append(" AND ");
			sbQuery.append(x2);
			sbQuery.append(" AND CAST(coord_y AS FLOAT) BETWEEN ");
			sbQuery.append(y1);
			sbQuery.append(" AND ");
			sbQuery.append(y2);
			sbQuery.append(" AND tm.activo ");
			sbQuery.append(codeInFilter);
			sbQuery.append(" ORDER BY tipo_de_marcador");
		} else {

			double offsetX = (x2 - x1) / Constantes.CLUSTER_SIZE;
			double offsetY = (y2 - y1) / Constantes.CLUSTER_SIZE;
			String boxes = new String();

			double xPrima = x1;
			double xDelta = xPrima;
			int box = 0;
			for (int x = 0; x < Constantes.CLUSTER_SIZE; x++) {
				xDelta += offsetX;
				double yPrima = y1;
				double yDelta = yPrima;
				for (int y = 0; y < Constantes.CLUSTER_SIZE; y++) {
					yDelta += offsetY;
					boxes += "WHEN CAST(coord_x AS FLOAT) BETWEEN " + xPrima
							+ " AND " + xDelta
							+ " AND CAST(coord_y AS FLOAT) BETWEEN " + yPrima
							+ " AND " + yDelta + " THEN " + box++ + "\n";
					yPrima = yDelta;
				}
				xPrima = xDelta;
			}

			sbQuery.append("SELECT CASE ");
			sbQuery.append(boxes);
			sbQuery.append(" END AS grupo, ");
			sbQuery.append(" ttdm.tipo_de_marcador_id, ");
			sbQuery.append(" 'Agrupación de '|| tipo_de_marcador, ");
			sbQuery.append(" CASE WHEN count(marcador_id) > 1 THEN 'Existen ' || count(marcador_id) || ' cerca de este punto.' ELSE max(tm.info) END AS info, ");
			// +
			// " 'Existen ' || count(marcador_id) || ' cerca de este punto.', "
			sbQuery.append(" avg(CAST(coord_x AS FLOAT)), avg(CAST(coord_Y AS FLOAT)), tipo_de_marcador, icono_url ");
			sbQuery.append(" FROM ttr_marcadores tm JOIN ttr_tipos_de_marcadores ttdm ON tm.tipo_de_marcador_id = ttdm.tipo_de_marcador_id ");
			sbQuery.append(" WHERE CAST(coord_x AS FLOAT) BETWEEN ");
			sbQuery.append(x1);
			sbQuery.append(" AND ");
			sbQuery.append(x2);
			sbQuery.append(" AND CAST(coord_y AS FLOAT) BETWEEN ");
			sbQuery.append(y1);
			sbQuery.append(" AND ");
			sbQuery.append(y2);
			sbQuery.append(" AND tm.activo ");
			sbQuery.append(codeInFilter);
			sbQuery.append(" GROUP BY grupo, ttdm.tipo_de_marcador_id");

		}
		return sbQuery.toString();
	}

	private static double distance(double lat1, double lon1, double lat2,
			double lon2) {
		double theta = lon1 - lon2;
		double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2))
				+ Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
				* Math.cos(deg2rad(theta));
		dist = Math.acos(dist);
		return rad2deg(dist) * 111.18957696;
	}

	private static double deg2rad(double deg) {
		return (deg * Math.PI / 180.0);
	}

	private static double rad2deg(double rad) {
		return (rad * 180 / Math.PI);
	}
}
