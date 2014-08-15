function strip_tags(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

$.fn.imageToDataUrl = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width();
    canvas.height = this.height();
    canvas.style.backgroundColor = 'white';
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(this[0], 0, 0);
    return canvas.toDataURL('image/jpeg');
};

MappirPdf = function (selector) {
    this.init(selector);
};

MappirPdf.instance = null;
MappirPdf.primeraOcurrenciaDeResultados = undefined;

MappirPdf.generarPdf = function (ruta) {

    var fechaObjeto = new Date();
    var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var fecha = dias[fechaObjeto.getDay()] + " " + fechaObjeto.getDate() + " de " + meses[fechaObjeto.getMonth()] + " de " + fechaObjeto.getFullYear();

 // ROS, Esta linea sirve para que la imagen NO salga negra
    var canvasTmp = document.getElementById("mapaCanvas");
    MappirMap.instance.exportMapControl.trigger(canvasTmp);
	//MappirMap.instance.exportMapControl.trigger(document.getElementById("mapaCanvas"));
//    var mapaImagenData = document.getElementById("mapaCanvas").toDataURL("image/jpeg");

    /* @var doc jsPDF */
    var doc = new jsPDF();
    doc.setLineWidth(0.1);

//        cuadricula
/*

     doc.setDrawColor(255.0,0);
     for(var xx = 0; xx < 210; xx+=10){
     doc.line(xx,0, xx, 270);
     doc.text("" + xx, xx,2);
     }
     for(var yy = 0; yy < 300; yy+=10){
     doc.line(0,yy, 270,yy);
     doc.text("" + yy, 2,yy);
     }*/

    doc.setDrawColor(29, 39, 49);
    var logoMappirData = $("#logoMappir").imageToDataUrl();
    var logoSctData = $("#logoSct").imageToDataUrl();
    var imagenCasetaData = $("#imagenCasetas").imageToDataUrl();
    var imagenAlertasData = $("#imagenAlertas").imageToDataUrl();

    var indicaciones = [null, null,
        $("#rutaDetalleIndicaciones2").imageToDataUrl(),
        $("#rutaDetalleIndicaciones3").imageToDataUrl(),
        $("#rutaDetalleIndicaciones4").imageToDataUrl(),
        $("#rutaDetalleIndicaciones5").imageToDataUrl(),
        $("#rutaDetalleIndicaciones6").imageToDataUrl()
    ];
    var puntosFinales = [
        $("#rutaMapaPuntosFinales0").imageToDataUrl(),
        $("#rutaMapaPuntosFinales1").imageToDataUrl(),
        $("#rutaMapaPuntosFinales2").imageToDataUrl(),
        $("#rutaMapaPuntosFinales3").imageToDataUrl(),
        $("#rutaMapaPuntosFinales4").imageToDataUrl(),
        $("#rutaMapaPuntosFinales5").imageToDataUrl(),
        $("#rutaMapaPuntosFinales6").imageToDataUrl()];
    var puntosIntermedios = [
        $("#rutaMapaPuntosIntermedios0").imageToDataUrl(),
        $("#rutaMapaPuntosIntermedios1").imageToDataUrl(),
        $("#rutaMapaPuntosIntermedios2").imageToDataUrl(),
        $("#rutaMapaPuntosIntermedios3").imageToDataUrl(),
        $("#rutaMapaPuntosIntermedios4").imageToDataUrl(),
        $("#rutaMapaPuntosIntermedios5").imageToDataUrl(),
        $("#rutaMapaPuntosIntermedios6").imageToDataUrl()];

    doc.addImage(logoMappirData, 'JPEG', 10, 10, 50, 20);
    doc.addImage(logoSctData, 'JPEG', 140, 10, 59, 20);
    doc.setTextColor(0, 133, 61);
    doc.setFontSize(12);
    var fontSize = doc.internal.getFontSize();
    var scaleFactor = doc.internal.scaleFactor;
    var linesTitulo = doc.splitTextToSize(ruta.titulo, 178);
//==============================================
    //TITULO
    y = 36;
    for(var l = 0; l < linesTitulo.length; l++){
        var lineRuta = (linesTitulo[l]).trim();
        var txtWidth = doc.getStringUnitWidth(lineRuta)*fontSize/scaleFactor;
        var x = 99 - (txtWidth / 2);
        doc.text(x, y, lineRuta);
        y += 4;
    }
//==============================================
    doc.setFontSize(10);
    doc.text(10, 45, ruta.descripcion);
    doc.line(10, 46, 200, 46);
    doc.setFontType("bold");
    doc.setFontSize(14);
    y = 52;

    doc.text(10, y, "Tiempo");
    doc.text(50, y, "Distancia");
    doc.text(90, y, "Casetas");
    doc.text(130, y, "Combustible");
    doc.text(170, y, "Costo total");

    y += 6;

    doc.setFontType("normal");
    doc.text(10, y, strip_tags(ruta.tiempo));
    doc.line(48, y - 9, 48, y + 3);
    doc.text(50, y, strip_tags(ruta.distancia));
    doc.line(88, y - 9, 88, y + 3);
    doc.text(90, y, strip_tags(ruta.costoCasetas));
    doc.line(128, y - 9, 128, y + 3);
    doc.text(130, y, strip_tags(ruta.costoGasolina));
    doc.line(168, y - 9, 168, y + 3);
    doc.text(170, y, strip_tags(ruta.costo));
    y += 5;
    doc.line(10, y, 200, y);
    y += 4;
    doc.setFontSize(10);
    doc.setFontType("bold");
    doc.text(10, y, "Costos aproximados para: ");
    doc.setFontType("normal");
    doc.text(56, y, ruta.tipoVehiculo);

    doc.setFontType("bold");
    doc.text(120, y, "Rendimiento:");
    doc.setFontType("normal");
    doc.text(144, y, ruta.rendimiento);
    y += 4;

    if (ruta.numeroCasetas > 0) {
        doc.setFontType("bold");
        doc.text(10, y, "Casetas:");
        doc.setFontType("normal");
        doc.text(26, y, "" + ruta.numeroCasetas);
    } else {
        doc.setFontType("bold");
        doc.text(10, y, "Sin peajes.");
    }

    if (ruta.numeroAlertas > 0) {
        doc.setFontType("bold");
        doc.text(60, y, "Incidentes:");
        doc.setFontType("normal");
        doc.text(79, y, "" + ruta.numeroAlertas);
    } else {
        doc.setFontType("bold");
        doc.text(60, y, "Sin incidentes.");
    }
    
    // Se cambio de linea para esperar que termine el repintado de la imagen
//    var mapaImagenData = document.getElementById("mapaCanvas").toDataURL("image/jpeg");
//    var canvasTmp = document.getElementById("mapaCanvas");
    var mapaImagenData = canvasTmp.toDataURL("image/jpeg");
        //map image
    doc.addImage(mapaImagenData, 'JPEG', 10, 80, 190, 130);


    y = 271;

    x = 20;
    fechaPintada = false;


    doc.setFontType("normal");
    for (var i = 0; i < ruta.detalles.length; i++) {
        detalle = ruta.detalles[i];
        if (y > 270) {

            /*doc.setDrawColor(255.0,0);
            for(var xx = 0; xx < 210; xx+=10){
                doc.line(xx,0, xx, 270);
                doc.text("" + xx, xx,2);
            }
            for(var yy = 0; yy < 300; yy+=10){
                doc.line(0,yy, 270,yy);
                doc.text("" + yy, 2,yy);
            } */

            doc.setFontSize(9);
            doc.text(150, 285, fecha);
            fechaPintada = true;

            doc.addPage();
            doc.addImage(logoMappirData, 'JPEG', 10, 10, 50, 20);
            doc.addImage(logoSctData, 'JPEG', 140, 10, 59, 20);

            doc.setTextColor(0, 133, 61);
            doc.setFontSize(9);
//==============================================
            //TITULO
            y = 38;
            for(var l = 0; l < linesTitulo.length; l++){
                var lineRuta = (linesTitulo[l]).trim();
                var txtWidth = doc.getStringUnitWidth(lineRuta)*fontSize/scaleFactor;
                var x = 99 - (txtWidth / 2);
                doc.text(x, y, lineRuta);
                y += 3;
            }
//==============================================
            doc.setFontSize(10);
            y = y < 30? 30 : y;
        }
        fechaPintada = false;
        y += 7;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);

        lines = doc.splitTextToSize(detalle.descripcion + ", " + detalle.estado + " " + detalle.municipio, 128);

        y -= (lines.length - 1) * 2.2;

        doc.text(20, y, (detalle.consecutivo).toString() );
        doc.text(25, y, ")");
        doc.text(27, y, lines);

        y += (lines.length - 1) * 2.8;

        var imagen = null;
        if (detalle.indicacionId > 1) {
            imagen = indicaciones[detalle.indicacionId];
        } else {
            if (detalle.indicacionId == 1) {
                imagen = puntosFinales[detalle.indicacionId];
            } else {
                imagen = puntosIntermedios[detalle.indicacionId];
            }
        }

        if(null !== imagen){
            doc.addImage(imagen, 'JPEG', 11, y - 6, 8, 7.5);
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 133, 61);
        doc.setFontType("normal");
        doc.text(158, y, strip_tags(detalle.distancia));
        doc.text(179, y, "" + strip_tags(detalle.tiempo));

        doc.setFontSize(8);
        for(var c = 0; c < detalle.casetas.length; c++){
            y += 5;
            var caseta = detalle.casetas[c];
            doc.addImage(imagenCasetaData, 'JPEG', 24, y - 3, 4, 4);
            doc.setFontType("bold");
            doc.text(30, y, strip_tags(caseta.titulo));
            doc.text(30, y + 4, 'Acepta: ' + caseta.acepta);
            doc.text(158, y, strip_tags(caseta.costo));
            y += 5;
        }

        doc.setFontType("normal");

        for(var c = 0; c < detalle.alertas.length; c++){
            y += 5;
            var incidente = detalle.alertas[c];
            doc.addImage(imagenAlertasData, 'JPEG', 24, y - 3, 4, 4);
            doc.text(30, y, strip_tags(incidente.descripcion));
        }

        y += 3;

        doc.line(10, y, 200, y);
    }
    if (!fechaPintada) {
        doc.setFontSize(9);
        doc.text(150, 285, fecha);
    }

    doc.save(reemplazarPuntos(ruta.titulo), ".pdf");

};
function reemplazarPuntos(cad) {
	while(cad.indexOf(".") !== -1) {
		cad = cad.replace(".", "");
	}
	return cad.trim();
}