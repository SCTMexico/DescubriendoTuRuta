// Este para el acceso publico
var ___servidor = "http://ttr.sct.gob.mx/mappir/";

// var ___servidor = "http://localhost:7010/mappir/"; // Este para correr local

var __servidorServiciosCoconut = "http://ttr.sct.gob.mx/"; // para servicios Publicos de SCT

var device = navigator.userAgent;
if (device.match(/Iphone/i) || device.match(/Ipod/i)
		|| device.match(/Android/i) || device.match(/J2ME/i)
		|| device.match(/BlackBerry/i) || device.match(/iPhone|iPad|iPod/i)
		|| device.match(/Opera Mini/i) || device.match(/IEMobile/i)
		|| device.match(/Mobile/i) || device.match(/Windows Phone/i)
		|| device.match(/windows mobile/i) || device.match(/windows ce/i)
		|| device.match(/webOS/i) || device.match(/palm/i)
		|| device.match(/bada/i) || device.match(/series60/i)
		|| device.match(/nokia/i) || device.match(/symbian/i)
		|| device.match(/HTC/i)) {
	window.location = ___servidor + "movil/index.html?ruta="
			+ getURLParameter("ruta");
}

function getURLParameter(name) {
	return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [
			, null ])[1]);
}
