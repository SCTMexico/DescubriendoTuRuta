function sendContact(){
    debugger;
    loader("show");
    removeScriptElems("contactEMail");
    removeScriptElems("contactText");
    var success=false;
    var email =$('#contactEMail').val();
    var desc = $('#contactText').val();
    if (jqxhr) {
        jqxhr.abort();
        jqxhr=null;
    }
    var data ={"de":email,"mensaje":desc,"respuesta": "movil"};
    jqxhr = $.get(configArray['servicios']['contacto'],data, function(result){
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
function cancelContact(){
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