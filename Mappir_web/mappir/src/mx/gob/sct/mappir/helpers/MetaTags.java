package mx.gob.sct.mappir.helpers;

import mx.gob.sct.mappir.util.MappirException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.postgresql.util.Base64;

public class MetaTags {
    public static String metaTagasDesdeParametro(Object jsonParameter) {
        try {
            if (null == jsonParameter) {
                return "<meta name=\"description\" content=\"MAPPIR buscador de rutas\">\n" +
                        "<meta name=\"keywords\" content=\"rutas,casetas,alertas,ciudades turisticas\">";
            }

            String json = new String(Base64.decode(jsonParameter.toString()));

            if (json.isEmpty()) {
                return "<meta name=\"description\" content=\"MAPPIR buscador de rutas\">\n" +
                        "<meta name=\"keywords\" content=\"rutas,casetas,alertas,ciudades turisticas\">";
            }

            JSONObject ruta = (JSONObject)new JSONParser().parse(json.toString());
            JSONArray destinos = ((JSONArray) ruta.get("destinos"));

            String origen = ((JSONObject) ruta.get("origen")).get("desc").toString();
            String destino =  ((JSONObject)destinos.get(destinos.size() -1)).get("desc").toString();
            String metaTags = "<meta name=\"description\" content=\"Ruta de " +
                    origen + " a "  + destino + "\"> \n" +
                    "<meta name=\"keywords\" content=\"" +
                    origen + "," + destino + "\">";

            return metaTags;

        } catch (Exception e) {
        	MappirException.imprimirLog(MetaTags.class, e);
            return "<meta name=\"description\" content=\"MAPPIR buscador de rutas\">\n" +
                    "<meta name=\"keywords\" content=\"rutas,casetas,alertas,ciudades turisticas\">";
        }
    }

}
