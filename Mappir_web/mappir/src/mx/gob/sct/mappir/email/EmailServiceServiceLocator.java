/**
 * EmailServiceServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package mx.gob.sct.mappir.email;

import mx.gob.sct.mappir.util.MappirException;

public class EmailServiceServiceLocator extends org.apache.axis.client.Service
		implements EmailServiceService {

	private static final long serialVersionUID = 2532432039593737020L;

	public EmailServiceServiceLocator() {
	}

	public EmailServiceServiceLocator(org.apache.axis.EngineConfiguration config) {
		super(config);
	}

	public EmailServiceServiceLocator(java.lang.String wsdlLoc,
			javax.xml.namespace.QName sName)
			throws javax.xml.rpc.ServiceException {
		super(wsdlLoc, sName);
	}

	// Use to get a proxy class for EmailServiceSoapPort
	private java.lang.String EmailServiceSoapPort_address = "http://10.33.169.117:7001/emailService/EmailService";

	public java.lang.String getEmailServiceSoapPortAddress() {
		return EmailServiceSoapPort_address;
	}

	// The WSDD service name defaults to the port name.
	private java.lang.String EmailServiceSoapPortWSDDServiceName = "EmailServiceSoapPort";

	public java.lang.String getEmailServiceSoapPortWSDDServiceName() {
		return EmailServiceSoapPortWSDDServiceName;
	}

	public void setEmailServiceSoapPortWSDDServiceName(java.lang.String name) {
		EmailServiceSoapPortWSDDServiceName = name;
	}

	public EmailService getEmailServiceSoapPort()
			throws javax.xml.rpc.ServiceException {
		java.net.URL endpoint;
		try {
			endpoint = new java.net.URL(EmailServiceSoapPort_address);
		} catch (java.net.MalformedURLException e) {
			throw new javax.xml.rpc.ServiceException(e);
		}
		return getEmailServiceSoapPort(endpoint);
	}

	public EmailService getEmailServiceSoapPort(java.net.URL portAddress)
			throws javax.xml.rpc.ServiceException {
		try {
			EmailServiceServiceSoapBindingStub _stub = new EmailServiceServiceSoapBindingStub(
					portAddress, this);
			_stub.setPortName(getEmailServiceSoapPortWSDDServiceName());
			return _stub;
		} catch (org.apache.axis.AxisFault e) {
			MappirException.imprimirLog(this.getClass(), e);
			return null;
		}
	}

	public void setEmailServiceSoapPortEndpointAddress(java.lang.String address) {
		EmailServiceSoapPort_address = address;
	}

	/**
	 * For the given interface, get the stub implementation. If this service has
	 * no port for the given interface, then ServiceException is thrown.
	 */
	public java.rmi.Remote getPort(Class serviceEndpointInterface)
			throws javax.xml.rpc.ServiceException {
		try {
			if (EmailService.class.isAssignableFrom(serviceEndpointInterface)) {
				EmailServiceServiceSoapBindingStub _stub = new EmailServiceServiceSoapBindingStub(
						new java.net.URL(EmailServiceSoapPort_address), this);
				_stub.setPortName(getEmailServiceSoapPortWSDDServiceName());
				return _stub;
			}
		} catch (java.lang.Throwable t) {
			MappirException.imprimirLog(this.getClass(), t);
			throw new javax.xml.rpc.ServiceException(t);
		}
		throw new javax.xml.rpc.ServiceException(
				"There is no stub implementation for the interface:  "
						+ (serviceEndpointInterface == null ? "null"
								: serviceEndpointInterface.getName()));
	}

	/**
	 * For the given interface, get the stub implementation. If this service has
	 * no port for the given interface, then ServiceException is thrown.
	 */
	public java.rmi.Remote getPort(javax.xml.namespace.QName portName,
			Class serviceEndpointInterface)
			throws javax.xml.rpc.ServiceException {
		if (portName == null) {
			return getPort(serviceEndpointInterface);
		}
		java.lang.String inputPortName = portName.getLocalPart();
		if ("EmailServiceSoapPort".equals(inputPortName)) {
			return getEmailServiceSoapPort();
		} else {
			java.rmi.Remote _stub = getPort(serviceEndpointInterface);
			((org.apache.axis.client.Stub) _stub).setPortName(portName);
			return _stub;
		}
	}

	public javax.xml.namespace.QName getServiceName() {
		return new javax.xml.namespace.QName("http://mx/gob/sct/utic/ws",
				"EmailServiceService");
	}

	private java.util.HashSet ports = null;

	public java.util.Iterator getPorts() {
		if (ports == null) {
			ports = new java.util.HashSet();
			ports.add(new javax.xml.namespace.QName(
					"http://mx/gob/sct/utic/ws", "EmailServiceSoapPort"));
		}
		return ports.iterator();
	}

	/**
	 * Set the endpoint address for the specified port name.
	 */
	public void setEndpointAddress(java.lang.String portName,
			java.lang.String address) throws javax.xml.rpc.ServiceException {

		if ("EmailServiceSoapPort".equals(portName)) {
			setEmailServiceSoapPortEndpointAddress(address);
		} else { // Unknown Port Name
			throw new javax.xml.rpc.ServiceException(
					" Cannot set Endpoint Address for Unknown Port" + portName);
		}
	}

	/**
	 * Set the endpoint address for the specified port name.
	 */
	public void setEndpointAddress(javax.xml.namespace.QName portName,
			java.lang.String address) throws javax.xml.rpc.ServiceException {
		setEndpointAddress(portName.getLocalPart(), address);
	}

}
