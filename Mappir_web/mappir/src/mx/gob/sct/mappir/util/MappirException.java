package mx.gob.sct.mappir.util;

public class MappirException {

	public static void imprimirLog(Class<?> c, Throwable e) {
		System.out.println("Tipo: " + c + ", Error: "
				+ (e.getCause() == null ? "personalizado" : e.getCause()));
		// e.printStackTrace();
	}

	public static void imprimirLog(Class<?> c, String error) {
		System.out.println("Tipo: " + c + ", Error: " + error);
		// e.printStackTrace();
	}

}
