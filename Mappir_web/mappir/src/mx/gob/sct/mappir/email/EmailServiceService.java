/**
 * EmailServiceService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package mx.gob.sct.mappir.email;

public interface EmailServiceService extends javax.xml.rpc.Service {
	public java.lang.String getEmailServiceSoapPortAddress();

	public EmailService getEmailServiceSoapPort()
			throws javax.xml.rpc.ServiceException;

	public EmailService getEmailServiceSoapPort(java.net.URL portAddress)
			throws javax.xml.rpc.ServiceException;
}
