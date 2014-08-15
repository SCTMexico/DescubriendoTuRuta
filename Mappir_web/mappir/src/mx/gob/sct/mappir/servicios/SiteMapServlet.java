package mx.gob.sct.mappir.servicios;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mx.gob.sct.mappir.persitencia.EntityManager;
import mx.gob.sct.mappir.util.Config;
import mx.gob.sct.mappir.util.Constantes;
import mx.gob.sct.mappir.util.MappirException;

import org.apache.commons.codec.binary.Base64;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class SiteMapServlet extends HttpServlet {

    private static final long serialVersionUID = -1554883703392863543L;

    protected String siteMap;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        PrintWriter out = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), "UTF-8"));

        siteMap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        siteMap += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

        List<Object[]> siguemeLinks = EntityManager.directQuery("SELECT codigo, valor FROM ttr_variables WHERE codigo LIKE 'seguir.%' OR codigo LIKE 'store.%' ");
        addNode("https://sct.gob.mx");

        for(Object[] siguemeLink : siguemeLinks){
            addNode(siguemeLink[1].toString(), "monthly", "0.9");
        }

        try{
            // Debe ser el mismo del MappirInterface.js linea 68, con usuario y contraseña
			String urlServiciosCoconut = Config
					.getVariable(Constantes.IP_SERVICIOS_COCONUT);
            String json = readUrl(urlServiciosCoconut+"/GeoRouteSvt/top?usr=sct&key=sct&limit=100");
            JSONObject top = (JSONObject)new JSONParser().parse(json);

            if(top.get("code").toString().equals("100")){
                JSONArray resultados = (JSONArray)top.get("results");
                for(int i = 0; i < resultados.size(); i++){

                    JSONObject resultado = (JSONObject)new JSONParser().parse(resultados.get(i).toString());
                    String  urlBase = "{\"origen\":" + resultado.get("origen") + ",\"destinos\":[" + resultado.get("destino") + "]}";
                    String urlEncoded = new String(Base64.encodeBase64(urlBase.getBytes()));
                    addNode(request.getRequestURI().replace("/sitemap.xml", "") +"?ruta=" + urlEncoded);
                }
            }
            //out.write(json);
        } catch(Exception e){
            //SILENCIADA
        	MappirException.imprimirLog(this.getClass(), e);
        }

        siteMap += "</urlset>";

        out.write(siteMap);

        out.flush();
    }

    protected void addNode(String url, String frequency, String priority){

        Date date = new Date();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-01");
        siteMap += "   <url>\n" +
                "      <loc>" + url +"</loc>\n" +
                "      <lastmod>" + dateFormat.format(date) + "</lastmod>\n" +
                "      <changefreq>" + frequency + "</changefreq>\n" +
                "      <priority>" + priority + "</priority>\n" +
                "   </url>";

    }

    protected void addNode(String url){
        addNode(url, "monthly", "8.0");
    }

    private static String readUrl(String urlString) throws Exception {
        BufferedReader reader = null;
        try {
            URL url = new URL(urlString);
            reader = new BufferedReader(new InputStreamReader(url.openStream()));
            StringBuffer buffer = new StringBuffer();
            int read;
            char[] chars = new char[1024];
            while ((read = reader.read(chars)) != -1)
                buffer.append(chars, 0, read);

            return buffer.toString();
        } finally {
            if (reader != null)
                reader.close();
        }

    }
}
