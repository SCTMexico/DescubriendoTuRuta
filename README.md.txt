INTRODUCCI�N
El siguiente documento presenta ejemplos de c�mo invocar los servicios web a trav�s de llamadas AJAX.
WEB SERVICES
Existen los siguientes servicios en listados a continuaci�n.
*	GeoRouteSvt. Encapsula operaciones para la generaci�n de una ruta entre dos ubicaciones 
indicadas.
*	GeoSearchLocation. Encapsula operaciones para la b�squeda de direcciones, lugares o puntos de 
inter�s que funcionaran como puntos de inicio y final para el servicio GeoRouteSvt.
*	GeoValidateSvt. Brinda la capacidad de validar si a una coordenada indicada, se le puede asignar 
un tramo de carretera. A trav�s de este se obtiene informaci�n cartogr�fica para la generaci�n de 
casetas y alertas del aplicativo MAPPIR.
*	ReverseGeocodeSvt. Obtiene la direcci�n de una coordenada espec�fica.
A continuaci�n se detallada cada servicio.
EJEMPLO DE INVOCACI�N

GEOROUTESVT
Ruta: GeoRouteSvt
var origen, destinos, opciones, vehiculo;

origen = {
	"x" : -99.1867,
	"y" : 19.3087,
	"source" : -1,
	"target" : -1,
	"desc" : "Insurgentes Sur, Insurgentes Cuicuilco, Coyoac�n, Coyoac�n, Distrito Federal",
	"idTramo" : 1,
	"idCategoria" : "A-9"
};

destinos = [ {
	"x" : -100.386986,
	"y" : 20.589804,
	"source" : 756319,
	"target" : 750929,
	"desc" : "Quer�taro",
	"idTramo" : 3086642,
	"idCategoria" : "A-1"
	}, {
	"x" : -103.335,
	"y" : 20.6782,
	"source" : 495851,
	"target" : 495852,
	"desc" : "Guadalajara, Jalisco",
	"idTramo" : 2688371,
	"idCategoria" : "A-2"
	} ];

opciones = {
	casetas : true,
	alertas : false
};

vehiculo = {
	tipo : 1, 
	subtipo : 1,
	excedente : 1,
	rendimiento : 17.0,
	costoltgas : 12.0
};


$.ajax({
	type : 'POST',
	url : 'http://www.mappir.gob.mx/TTR/rest/GeoRouteSvt',
	data : {
		�json� : JSON.stringify({
			"usr" : "sct",
			"key" : "sct",
			"origen" : origen,
			"destinos" : destinos,
			"ruta" : 1,
			"opciones" : opciones,
			"vehiculo" : vehiculo
		})
	},
	contentType : 'application/json',
	dataType : 'jsonp',
	success : function(resp) {
		console.log("Resp", resp);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		if (textStatus != "abort") {
			console.log(textStatus);
		}
	}
});
Ruta: GeoRouteSvt/last
$.ajax({
	type : 'POST',
	url : 'http://www.mappor.gob.mx/TTR/rest/GeoRouteSvt/last',
	data : {
		"usr" : �sct�,
		"key" : �sct�,
		"limit" : 10
	},
	dataType : 'jsonp',
	success : function(resp) {
		console.log(resp);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		if (textStatus != "abort") {
			console.log(textStatus);
		}
	}
});

Ruta: GeoRouteSvt/top
$.ajax({
	type : 'POST',
	url : 'http://www.mappor.gob.mx/TTR/rest/GeoRouteSvt/top',
	data : {
		"usr" : �sct�,
		"key" : �sct�,
		"limit" : 10
	},
	dataType : 'jsonp',
	success : function(resp) {
		console.log(resp);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		if (textStatus != "abort") {
			console.log(textStatus);
		}
	}
});
GEOSEARCHLOCATIONSVT
Ruta: GeoSearchLocationSvt
$.ajax({
	type : 'POST',
	url : 'http://www.mappor.gob.mx/TTR/rest/GeoSearchLocationSvt',
	data : {
		"search" : �Queretaro�,
		"usr" : �sct�,
		"key" : �sct�
	},
	dataType : 'jsonp',
	success : function(resp) {
		console.log(resp);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		if (textStatus != "abort") {
			console.log(textStatus);
		}
	}
});
GEOVALIDATESVT
Ruta: GeoValidateSvt
$.ajax({
	type : 'POST',
	url : 'http://www.mappor.gob.mx/TTR/rest/GeoValidateSvt',
	data : {	
		"usr" : �sct�,
		"key" : �sct�,
		"x" : -103.335,
		"y" : 20.6782
	},
	dataType : 'jsonp',
	success : function(resp) {
		console.log(resp);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		if (textStatus != "abort") {
			console.log(textStatus);
		}
	}
});
REVERSEGEOCODESVT
Ruta: ReverseGeocodeSvt
$.ajax({
	type : 'POST',
	url : 'http://www.mappor.gob.mx/TTR/rest/ReverseGeocodeSvt',
	data : {	
		"usr" : �sct�,
		"key" : �sct�,
		"x" : -103.335,
		"y" : 20.6782
	},
	dataType : 'jsonp',
	success : function(resp) {
		console.log(resp);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		if (textStatus != "abort") {
			console.log(textStatus);
		}
	}
});



http://ttr.sct.gob.mx/TTR/rest/GeoSearchLocationSvt?search=df&usr=sct&key=sct
Los resultados de esta busqueda se utilizan para el servicio de ruteo

Servicio que obtiene las rutas mas buscadas
http://ttr.sct.gob.mx/TTR/rest/GeoRouteSvt/top?usr=sct&key=sct&limit=10



�COMO HACER UNA BUSQUEDA DE UBICACION?


Ejemplo de ruta desde M�xico D.F hacia Cancun , con el tipo de ruta 1
http://ttr.sct.gob.mx/TTR/rest/GeoRouteSvt?json={"usr":"sct","key":"sct","origen":{"idCategoria":"A-
1","desc":"Distrito Federal","idTramo":90465,"source":1483257,"target":1483284,"x":-
99.133969,"y":19.432529},"destinos":[{"idCategoria":"A-3","desc":"Canc�n, Benito Ju�rez, Quintana 
Roo","idTramo":86657,"source":1968475,"target":1609241,"x":-
86.8559,"y":21.1214}],"opciones":{"casetas":true,"alertas":true},"vehiculo":{"tipo":1,"subtipo":1,"r
endimiento":16,"combustible":1,"costoltgas":"12.60","excedente":"0"},"ruta":1}



Ejemplo de ruta desde M�xico D.F hacia Cancun , con el tipo de ruta 2
http://ttr.sct.gob.mx/TTR/rest/GeoRouteSvt?json={"usr":"sct","key":"sct","origen":{"idCategoria":"A-
1","desc":"Distrito Federal","idTramo":90465,"source":1483257,"target":1483284,"x":-
99.133969,"y":19.432529},"destinos":[{"idCategoria":"A-3","desc":"Canc�n, Benito Ju�rez, Quintana 
Roo","idTramo":86657,"source":1968475,"target":1609241,"x":-
86.8559,"y":21.1214}],"opciones":{"casetas":true,"alertas":true},"vehiculo":{"tipo":1,"subtipo":1,"r
endimiento":16,"combustible":1,"costoltgas":"12.60","excedente":"0"},"ruta":2}

