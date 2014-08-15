package mx.gob.sct.mappir.email;

import mx.gob.sct.mappir.util.MappirException;

public class EmailServiceProxy implements EmailService {
	private String _endpoint = null;
	private EmailService emailService = null;

	public EmailServiceProxy() {
		_initEmailServiceProxy();
	}

	public EmailServiceProxy(String endpoint) {
		_endpoint = endpoint;
		_initEmailServiceProxy();
	}

	private void _initEmailServiceProxy() {
		try {
			emailService = (new EmailServiceServiceLocator())
					.getEmailServiceSoapPort();
			if (emailService != null) {
				if (_endpoint != null)
					((javax.xml.rpc.Stub) emailService)
							._setProperty(
									"javax.xml.rpc.service.endpoint.address",
									_endpoint);
				else
					_endpoint = (String) ((javax.xml.rpc.Stub) emailService)
							._getProperty("javax.xml.rpc.service.endpoint.address");
			}

		} catch (javax.xml.rpc.ServiceException serviceException) {
			MappirException.imprimirLog(this.getClass(), serviceException);
		}
	}

	public String getEndpoint() {
		return _endpoint;
	}

	public void setEndpoint(String endpoint) {
		_endpoint = endpoint;
		if (emailService != null)
			((javax.xml.rpc.Stub) emailService)._setProperty(
					"javax.xml.rpc.service.endpoint.address", _endpoint);

	}

	public EmailService getEmailService() {
		if (emailService == null)
			_initEmailServiceProxy();
		return emailService;
	}

	public java.lang.String sendEMail(java.lang.String toEmail,
			java.lang.String subject, java.lang.String body,
			java.lang.String usuario, java.lang.String cPwd)
			throws java.rmi.RemoteException {
		if (emailService == null)
			_initEmailServiceProxy();
		return emailService.sendEMail(toEmail, subject, body, usuario, cPwd);
	}

}