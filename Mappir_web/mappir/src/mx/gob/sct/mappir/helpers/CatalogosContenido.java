package mx.gob.sct.mappir.helpers;

import mx.gob.sct.mappir.persitencia.EntityManager;

import java.util.List;

/**
 * Created by mau on 3/03/14.
 */
public class CatalogosContenido {

    public static List<Object[]> listaDeCombustibles() {
        return EntityManager.directQuery("SELECT id_tipo_combustible, nombre, costo_por_litro FROM ttr_tipos_combustible AS g");
    }

    public static List<Object[]> listaDeVehiculos() {
        return EntityManager.directQuery("SELECT tstv.id_sub_tipo_vehiculo id, tstv.id_tipo_vehiculo categoria_id, ttv.nombre categoria, tstv.nombre, tstv.rendimiento_por_litro rendimiento"
                + " FROM ttr_sub_tipos_vehiculo as tstv "
                + " JOIN ttr_tipos_vehiculo as ttv ON tstv.id_tipo_vehiculo = ttv.id_tipo_vehiculo ORDER BY categoria_id");
    }

    public static Object[] getContent(String codigo){
        return EntityManager.directOneRow("SELECT titulo, contenido FROM ttr_contenido WHERE codigo = '" + codigo + "'");
    }
}
