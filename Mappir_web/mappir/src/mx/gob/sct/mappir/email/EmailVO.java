package mx.gob.sct.mappir.email;

import java.io.Serializable;

/**
 * Created by Roman on 30/04/2014.
 */
public class EmailVO implements Serializable {

	private static final long serialVersionUID = -6950148052831042071L;

	// Propiedades necesarias para el funcionamiento del servicio:
	public static final String EMWSPort = "http://aplicaciones2.sct.gob.mx/emailService/EmailService";
	public static final String EMQWERTY = "zxcv";
	public static final String EMASDFG = "poiu";

	private String para;
	private String asunto;
	private String cuerpo;

	public String getPara() {
		return para;
	}

	public void setPara(String para) {
		this.para = para;
	}

	public String getAsunto() {
		return asunto;
	}

	public void setAsunto(String asunto) {
		this.asunto = asunto;
	}

	public String getCuerpo() {
		return cuerpo;
	}

	public void setCuerpo(String cuerpo) {
		this.cuerpo = cuerpo;
	}
}
