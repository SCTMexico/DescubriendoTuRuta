function sendReport(){
    loader("show");
    removeScriptElems("reportNombre");
    removeScriptElems("reportEMail");
    removeScriptElems("reportTel");
    removeScriptElems("useText");
    var success=false;
    var texto =$('#useLocationText').html();
    var type = $("#marker-category option:selected").val();
    var typeText = $("#marker-category option:selected").text();
    var nombre =$('#reportNombre').val();
    var email =$('#reportEMail').val();
    var tel =$('#reportTel').val();
    //var captcha = $('#reportCaptcha').val();
    var desc = $('#useText').val();
    try{
        if(reportLocation==null){
            try{
                navigator.notification.alert(
                    'No se ha seleccionado una ubicación por lo que no puedes enviar un reporte.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('No se ha seleccionado una ubicación por lo que no puedes enviar un reporte.');
            }
            loader("hide");
            return
        }if(nombre!=""){
            if(nombre.length>30){
                try{
                    navigator.notification.alert(
                        'El nombre "+ nombre+" es demasiado largo, usa menos de 30 carácteres.',// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert('El nombre "+ nombre+" es demasiado largo, usa menos de 30 carácteres.');
                }
                loader("hide");
                return
            }
        }
        if(type==0){
            try{
                navigator.notification.alert(
                    'No se ha seleccionado el tipo de accidente/alerta por lo que no puedes enviar un reporte.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('No se ha seleccionado el tipo de accidente/alerta por lo que no puedes enviar un reporte.');
            }
            loader("hide");
            return
        }
        else{
            var data = {"ubicacion":reportLocation,"desc":desc,"tipo":type};
        }
    }catch(e){
        try{
            navigator.notification.alert(
                'Ha ocurrido un error al procesar su petición, por favor intente más tarde.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('Ha ocurrido un error al procesar su petición, por favor intente más tarde.');
        }
        loader("hide");return;
    }
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    var location = reportLocation.toLatLon();
    var data ={"nombre":nombre,"correo":email,"telefono":tel,"tipo":type,"descripcion":desc,"respuesta": "movil" ,"coord_x":location[1],"coord_y":location[0],"titulo": "REPORTE:"+texto};//"x":location[1],"y":location[0],"titulo": "REPORTE:"+texto,
    jqxhr = $.get(configArray['servicios']['reportarAlerta'],data, function(result){
        if(result.error !== "undefined"){
            if(result.error==true){
                try{
                    navigator.notification.alert(
                        result.message,// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert(result.message);
                }
            }else{
                success=true;
            }
        }else{
            try{
                navigator.notification.alert(
                    'Ha ocurrido un error al procesar su petición, por favor intente más tarde.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('Ha ocurrido un error al procesar su petición, por favor intente más tarde.');
            }
        }
        if(success){
            if (prevPage!= null){
                try{
                    $.mobile.navigate(prevPage);
                }catch(e){
                    $.mobile.navigate('#routepage');
                }

            }else{
                $.mobile.navigate('#routepage');
            }
            try{
                navigator.notification.alert(
                    'Gracias por tu apoyo, procesaremos tu información a la brevedad.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('Gracias por tu apoyo, procesaremos tu información a la brevedad.');
            }
        }
        loader("hide");
    },'jsonp')
        .fail(function(msg) {
            debugger;
            try{
                navigator.notification.alert(
                    'Ha ocurrido un error al procesar su petición, por favor intente más tarde.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('Ha ocurrido un error al procesar su petición, por favor intente más tarde.');
            }
            if (prevPage!= null){
                try{
                    $.mobile.navigate(prevPage);
                }catch(e){
                    $.mobile.navigate('#routepage');
                }
            }else{
                $.mobile.navigate('#routepage');
            }
            loader("hide");
        });
}
function cancelReport(){
    if (prevPage!= null){
        try{
            $.mobile.navigate(prevPage);
        }catch(e){
            $.mobile.navigate('#routepage');
        }
    }else{
        $.mobile.navigate('#routepage');
    }
}
function locationReport(){
    loader("show");
    if(!isApp){
        try{
            if(geo_position_js.init()){
                geo_position_js.getCurrentPosition(function(position){
                    locationReportSucces(position);
                },function(error){
                    loader("hide");
                    debugger;alert("Ocurrió un error al intentar localizar tu ubicación, por favor intenta desde otro dispositivo o descarga la versión app.");
                });
            }
            else{
                loader("hide");
                try{
                    navigator.notification.alert(
                        'Esta funcionalidad no esta disponible en este dispositivo, por favor intenta desde otro dispositivo o descarga la versión app.',// mensaje (message)
                        alertDismissed,                      // función 'callback' (alertCallback)
                        'Mappir',                         // titulo (title)
                        'Cerrar'                             // nombre del botón (buttonName)
                    );
                }catch (e){
                    alert("Esta funcionalidad no esta disponible en este dispositivo, por favor intenta desde otro dispositivo o descarga la versión app.");
                }
            }
        }catch (ex){debugger;}
    }else{
        var options = {timeout: 15000, enableHighAccuracy:false};
        navigator.geolocation.getCurrentPosition(locationReportSucces, showLocationError, options);
    }
}
function locationReportSucces(position){
    reportLocation = "("+position.coords.latitude+", "+position.coords.longitude+")";
    loader("hide");
    getLocationName();
}
function chooseLocation(){
    if (window.map && window.map instanceof OpenLayers.Map) {
        var footer = $('#mapfooter');
        var header = $('#mapheader');
        var home = $('#homeButton');
        var extent = $('#allExtent');
        var report = $('#reportMapMenu');
        try{
            footer.hide();
            header.hide();
            home.hide();
            extent.hide();
            report.hide();
        }catch (e){debugger;}
        var control = map.getControlsBy("CLASS_NAME", "OpenLayers.Control")[0];
        if (control) {
            if (!control.active) {
                control.activate();
            }
        }else{
            var click = new OpenLayers.Control.Click();
            map.addControl(click);
            click.activate();
        }
    }else{
        addClickControl=true;
    }
    fromReport=true;
    useReportLocation=false;
    $.mobile.navigate('#mappage');



}
function endChooseLocation(lat,long){
    useReportLocation=true;
    reportLocation = "("+lat+", "+long+")";
    var control = map.getControlsBy("CLASS_NAME", "OpenLayers.Control")[0];
    if (control){
        try{
            control.deactivate();
        }catch (e){}
    }
    var footer = $('#mapfooter');
    var header = $('#mapheader');
    var home = $('#homeButton');
    var extent = $('#allExtent');
    var report = $('#reportMapMenu');
    try{
        footer.show();
        header.show();
        home.show();
        extent.show();
        report.show();
    }catch (e){debugger;}
}
function getLocationName(){
    loader("show");
    var locationText= $('#useLocationText');
    locationText.html( "<span class='blink'>Cargando Ubicación...</span>" );
    try{
        var latLon = reportLocation.toLatLon();
        var sendData =  {"usr" : usr,"key" : key,"x" : latLon[1],"y" : latLon[0]};
        $.get( configArray['servicios']['geoCodificacionInversa'], sendData, function(msg){
            var val= parseFloat(latLon[1]).toFixed(2);
            var val2=parseFloat(latLon[0]).toFixed(2);
            var temp="Ubicación ("+val+","+val2+")";
            var tempString="";
            if(msg.results){
                if(msg.code){
                    if(msg.code==400&&(msg.status.indexOf("fuera")>0)){
                        try{
                            navigator.notification.alert(
                                '¡Advertencia!, La coordenada se encuentra fuera de la republica mexicana.',// mensaje (message)
                                alertDismissed,                      // función 'callback' (alertCallback)
                                'Mappir',                         // titulo (title)
                                'Cerrar'                             // nombre del botón (buttonName)
                            );
                        }catch (e){
                            alert('¡Advertencia!, La coordenada se encuentra fuera de la republica mexicana.');
                        }
                        reportLocation=null;
                        loader("hide");
                        var locationText= $('#useLocationText');
                        locationText.html( "" );
                        return;
                    }else if(msg.code==100){
                        temp = msg.results.desc;
                        var tempArray =[];
                        tempArray.push({"idTramo": msg.results.idTramo, "source": msg.results.source, "target": msg.results.target, "idCategoria": "-1"});
                        tempString = setPointData(tempArray);
                    }
                }
                loader("hide");
                var locationText= $('#useLocationText');
                locationText.html( "" );
                var html = temp;
                locationText.html(html);

            }else if (msg.code!=100){
                loader("hide");
                if(msg.code){
                    try{
                        navigator.notification.alert(
                            'Ocurrió un error al procesar el nombre de tu Ubicación, se utilizará solo l a coordenada.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert('Ocurrió un error al procesar el nombre de tu Ubicación, se utilizará solo l a coordenada.');
                    }
                }else{
                    try{
                        navigator.notification.alert(
                            '¡Advertencia, Ocurrió un error al comunicarse con el servidor para obtener el nombre de tu Ubicación!, se utilizará solo la coordenada.',// mensaje (message)
                            alertDismissed,                      // función 'callback' (alertCallback)
                            'Mappir',                         // titulo (title)
                            'Cerrar'                             // nombre del botón (buttonName)
                        );
                    }catch (e){
                        alert('¡Advertencia, Ocurrió un error al comunicarse con el servidor para obtener el nombre de tu Ubicación!, se utilizará solo la coordenada.');
                    }
                }
                var locationText= $('#useLocationText');
                locationText.html( "" );
                var html = temp;
                locationText.html(html);
            }
        },'jsonp')
            .fail(function(msg) {
                if (msg.statusText=="abort"){
                }else if (msg.code!=100){
                    loader("hide");
                    if(msg.code){
                        showPopupError("¡Advertencia!","Error en la respueta del servidor geo al obtener el nombre de tu Ubicación, se utilizará solo la coordenada.");
                    }else{
                        showPopupError("¡Advertencia!","Error, el servidor geo no respondió al obtener el nombre de tu Ubicación, se utilizará solo la coordenada.");
                    }
                    var locationText= $('#useLocationText');
                    locationText.html( "" );
                    var html = temp;
                    locationText.html(html);
                    return null;
                }else{
                    loader("hide");
                    showPopupError("¡Advertencia!",'Error en la respuesta del servidor geo al obtener el nombre de tu Ubicación,  se utilizará solo la coordenada.');
                    var locationText= $('#useLocationText');
                    locationText.html( "" );
                    var html = temp;
                    locationText.html(html);
                    return null;
                }
            });
    }catch (e){
        try{
            navigator.notification.alert(
                'Ha ocurrido un error al procesar su petición, por favor intente más tarde.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('Ha ocurrido un error al procesar su petición, por favor intente más tarde.');
        }
    }

}
