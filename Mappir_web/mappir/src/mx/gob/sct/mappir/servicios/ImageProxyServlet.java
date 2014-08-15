package mx.gob.sct.mappir.servicios;

import java.awt.*;
import java.io.*;
import java.net.URL;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mx.gob.sct.mappir.util.MappirException;

public class ImageProxyServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        OutputStream out = response.getOutputStream();
        Image image = null;

        String urlParam = request.getParameter("url");
        System.out.println(urlParam);

        try {
            URL url = new URL(urlParam);
            InputStream in = new BufferedInputStream(url.openStream());
            image = ImageIO.read(url);

            byte[] buf = new byte[1024];
            int n = 0;
            while (-1 != (n = in.read(buf))) {
                out.write(buf);
            }
            in.close();
            out.flush();

        } catch (IOException e) {
        	MappirException.imprimirLog(this.getClass(), e);
        }

    }
}
