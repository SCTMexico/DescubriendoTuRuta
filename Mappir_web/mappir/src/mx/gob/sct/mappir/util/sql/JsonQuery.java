package mx.gob.sct.mappir.util.sql;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import mx.gob.sct.mappir.persitencia.EntityManager;
import mx.gob.sct.mappir.util.MappirException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class JsonQuery {

	protected static JsonQuery instance = null;

	protected JsonQuery() throws Exception {

	}

	public static JsonQuery getInstance() throws Exception {
		if (null == instance) {
			instance = new JsonQuery();
		}
		return instance;
	}

	public String execute(String query, String[] columnNames) {

		try {

			List<Object[]> result = EntityManager.directQuery(query);
			JSONObject resultObject = new JSONObject();
			resultObject.put("error", new Boolean(false));
			resultObject.put("message", "");
			JSONArray data = new JSONArray();
			resultObject.put("data", data);
			for (Object[] record : result) {
				JSONObject row = new JSONObject();
				for (int column = 0; column < columnNames.length; column++) {
					if (null == record[column]) {
						row.put(columnNames[column], "");
						continue;
					}
					row.put(columnNames[column], record[column].toString());
				}
				data.add(row);
			}
			return resultObject.toString();

		} catch (Exception e) {
			MappirException.imprimirLog(this.getClass(), e);
			return "{\"error\":true, \"message\": " + e.getCause() + "}";
		}

	}

	public String[] getColumns(String query) {
		Pattern p = Pattern.compile("\\s*\\w+,");
		Pattern p1 = Pattern.compile("\\s+\\w+\\s+from");
		Matcher m = p.matcher(query);
		Matcher m1 = p1.matcher(query);
		String colsOnly = "";
		while (m.find()) {
			colsOnly += (m.group().trim());
		}
		while (m1.find()) {
			colsOnly += (m1.group().substring(0, m1.group().length() - 4)
					.trim());
		}
		System.out.println(colsOnly);
		System.out.println(colsOnly);
		return colsOnly.split(",");
	}
}
