getMarksList();
function getMarksList(){
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    jqxhr = $.get(configArray['servicios']['listaDeMarcadores'],{}, function(msg){
        var markersHeader =
            '<div class="menuElement" style="text-align: center">Puntos de Interes</div>';
        $(markersHeader).appendTo('#markersMenu');
        for (var i=0 ; i<msg.data.length ;i++){
            var inArray = false;
            var urlServer = configArray['url']['base']+"img/mapa/"+msg.data[i].icono_url;
            var urlPhone = "img/mapa/"+msg.data[i].icono_url;
            // checks if the image is already in the iconArray
            for (var image in iconArray){
                if(urlServer==iconArray[image]||urlPhone == iconArray[image]){
                    inArray=true;
                    break;
                }
            }
            // if the icon is not in the array it pushes it
            var imageUrl = "";
            if (!inArray){
                imageUrl=(urlServer).replace("/mapa/","/layers/");
            }else{
                imageUrl=(urlPhone).replace("/mapa/","/layers/");
            }
            // Los iconos de mapa deben estar en carpeta mapa y los iconos de menu en carpeta layer


            var markers =
                '<div class="ui-grid-b menuElement">'+
                    '<div class="ui-block-a" style="width: 35px;"><img src="'+imageUrl+'" class="image35w"/></div>'+
                    '<div class="ui-block-b" style="width: 95px"><div>'+msg.data[i].tipo+'</div></div>'+
                    '<div class="ui-block-c" style="width: 55px">'+
                    '<select name="mark'+msg.data[i].codigo+'" id="mark'+msg.data[i].codigo+'" data-role="slider" data-mini="true" onchange="addMarkToArray(\''+msg.data[i].codigo+'\')">'+
                    '<option value="off">OFF</option>'+
                    '<option value="on">ON</option>'+
                    '</select>'+
                    '</div>'+
                    '</div>';
            $(markers).appendTo('#markersMenu');
        }
        progressBar('50%');
        getWarningList();
    },'json')
        .fail(function(msg) {
            try{
                navigator.notification.alert(
                    'Ocurrió un error al descargar la lista de puntos de interés, puedes seguir utilizando la aplicación pero no podrás ver los marcadores en el menú del mapa.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("Ocurrió un error al descargar la lista de puntos de interés, puedes seguir utilizando la aplicación pero no podrás ver los marcadores en el menú del mapa.");
            }
            progressBar('50%');
            getWarningList();
        });
}
function getWarningList(){
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    jqxhr = $.get(configArray['servicios']['listaDeAdvertencias'],{}, function(msg){
        for (var i=0 ; i<msg.data.length ;i++){
            //add markers to report category
            $('#marker-category').append('<option value="'+msg.data[i].code+'">'+msg.data[i].name+'</option>');
            alertasList.push(msg.data[i]);
        }
        progressBar('60%');
        getVehiclesList();
    },'json')
        .fail(function(msg) {
            try{
                navigator.notification.alert(
                    'Ocurrió un error al descargar la lista de incidentes, puedes seguir utilizando la aplicación pero no podrás reportar incidentes.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("Ocurrió un error al descargar la lista de incidentes, puedes seguir utilizando la aplicación pero no podrás reportar incidentes.");
            }
            progressBar('60%');
            getVehiclesList();
        });
}
function getVehiclesList(){
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    jqxhr = $.get(configArray['servicios']['catalogoVehiculos'],{}, function(msg){
        for (var i=0 ; i<msg.data.length ;i++){
            var tempSubType = {"name":msg.data[i].nombre,"category":msg.data[i].categoria_id,"id":msg.data[i].id,"rend":msg.data[i].rendimiento};
            vehicleSubType.push(tempSubType);
            var id =parseInt(msg.data[i].categoria_id);
            var passed=true;
            var category =   {"name":msg.data[i].categoria, "id": parseInt(msg.data[i].categoria_id)};
            for(var elem in vehicleType){
                if(vehicleType[elem]["id"]==id){
                    passed=false;
                }
            }
            if(passed){
                vehicleType.push(category);
                $('#vehicle-type').append('<option value="'+id+'">'+msg.data[i].categoria+'</option>');
            }

        }
        progressBar('80%');
        getGasolineList();
        //bind VehicleConfig Vehicle Select event
    },'json')
        .fail(function(msg) {
            try{
                navigator.notification.alert(
                    'Ocurrió un error al descargar la lista de vehículos, puedes seguir utilizando el aplicativo pero no podrás cambiar los ajustes del vehículo.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("Ocurrió un error al descargar la lista de vehículos, puedes seguir utilizando el aplicativo pero no podrás cambiar los ajustes del vehículo.");
            }
            progressBar('80%');
            getGasolineList();
            ajustesDisabled=true;
        });
}
function getGasolineList(){
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    jqxhr = $.get(configArray['servicios']['catalogoGasolina'],{}, function(msg){
        for (var i=0 ; i<msg.data.length ;i++){
            if (msg.data[i].nombre.toLowerCase().indexOf("magna") >= 0){
                gasValTipico=msg.data[i].costo;
            }
            gasArray.push(msg.data[i].costo);
            $('#gas-type').append('<option value="'+msg.data[i].id+'" data-cost="'+msg.data[i].costo+'">'+msg.data[i].nombre+' - $'+msg.data[i].costo+'/lt'+'</option>');
        }
        progressBar('90%');
        getContent();
    },'json')
        .fail(function(msg) {
            try{
                navigator.notification.alert(
                    'Ocurrió un error al descargar la lista de combustibles, puedes seguir utilizando el aplicativo pero no podrás cambiar los ajustes del vehículo.',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert("Ocurrió un error al descargar la lista de combustibles, puedes seguir utilizando el aplicativo pero no podrás cambiar los ajustes del vehículo.");
            }
            progressBar('90%');
            getContent();
            ajustesDisabled=true;
        });
}
function getContent(){
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    jqxhr = $.get(configArray['servicios']['obtenerContenido'],{}, function(msg){
        for (var i=0 ; i<msg.data.length ;i++){
            var contenido = msg.data[i];
            if(contenido['titulo'].toLowerCase().indexOf("teléfonos")>-1){
                phonePage(contenido['contenido']);
            }else if(contenido['titulo'].toLowerCase().indexOf("acerca")>-1){
                aboutPage(contenido['contenido']);
            }else if(contenido['titulo'].toLowerCase().indexOf("noticias")>-1){
                loadBanner(contenido['contenido']);
            }
        }
        progressBar('100%');
        setTimeout(function(){
            try{
                var ruta = getURLParameter("ruta");
                if (ruta!="null"){
                    getSharedRoute(ruta);
                }else{
                    $.mobile.navigate('#routepage');
                }
            }catch (ex){$.mobile.navigate('#routepage');debugger;}
        },500);
    },'json')
        .fail(function(msg) {
            try{
                navigator.notification.alert(
                    'Ocurrió un error al descargar el contenido de "Acerca de", "Telefonos", "Noticias"',// mensaje (message)
                    alertDismissed,                      // función 'callback' (alertCallback)
                    'Mappir',                         // titulo (title)
                    'Cerrar'                             // nombre del botón (buttonName)
                );
            }catch (e){
                alert('Ocurrió un error al descargar el contenido de "Acerca de", "Telefonos", "Noticias"');
            }
            progressBar('100%');
            setTimeout(function(){
                try{
                    var ruta = getURLParameter("ruta");
                    if (ruta!="null"){
                        getSharedRoute(ruta);
                    }else{
                        $.mobile.navigate('#routepage');
                    }
                }catch (ex){$.mobile.navigate('#routepage');debugger;}
            },500);
        });
}