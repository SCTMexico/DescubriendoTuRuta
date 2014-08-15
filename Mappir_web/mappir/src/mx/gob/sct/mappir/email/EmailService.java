/**
 * EmailService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package mx.gob.sct.mappir.email;

public interface EmailService extends java.rmi.Remote {
	public java.lang.String sendEMail(java.lang.String toEmail,
			java.lang.String subject, java.lang.String body,
			java.lang.String usuario, java.lang.String cPwd)
			throws java.rmi.RemoteException;
}
