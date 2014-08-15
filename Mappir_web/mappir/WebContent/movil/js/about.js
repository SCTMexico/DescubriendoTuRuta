function aboutPage(data){
    var htmlToAppend=data;
    try{
        $("#aboutBlock").empty();
        $(htmlToAppend).appendTo("#aboutBlock");
    }catch (e){
        try{
            navigator.notification.alert(
                'Ocurrió un error con el contenido.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert("Ocurrió un error con el contenido.");
        }
    }

}