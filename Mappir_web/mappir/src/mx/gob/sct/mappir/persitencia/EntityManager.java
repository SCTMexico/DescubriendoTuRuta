package mx.gob.sct.mappir.persitencia;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

import mx.gob.sct.mappir.util.Constantes;

import java.util.List;

abstract public class EntityManager {

    protected static javax.persistence.EntityManager instance = null;

    public static javax.persistence.EntityManager getEntityManager(){
        if(null == instance){
            EntityManagerFactory emf = Persistence.createEntityManagerFactory(Constantes.JNDI_DATA_SOURCE);
            instance = emf.createEntityManager();
        }
        return instance;
    }

    @SuppressWarnings("unchecked")
	public static List<Object[]> directQuery(String query){
//        System.out.println(query);
        return getEntityManager().createNativeQuery(query).getResultList();
    }

    public static String directQuerySingle(String query){
//        System.out.println(query);
        return (String) getEntityManager().createNativeQuery(query).getSingleResult();
    }

    public static Object[] directOneRow(String query){
//        System.out.println(query);
        return (Object[])getEntityManager().createNativeQuery(query).getResultList().get(0);
    }
}
