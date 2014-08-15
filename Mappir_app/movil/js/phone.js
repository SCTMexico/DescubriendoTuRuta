function phonePage(data){
    var htmlToAppend=data;
    //var htmlToAppend ='<div class="modal-body" style="overflow-y: scroll;"><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Caminos y Puentes Federales:</span><br /><a href="tel:+074" style="color:#03853d;">074</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Ángeles Verdes</span><br /><a href="tel:+078" style="color:#03853d;">078</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Cruz Roja</span><br /><a href="tel:+55575757" style="color:#03853d;">5557 5757</a></div><div style="margin: .5em"><a href="tel:+53951111"style="color:#03853d;">5395 1111</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Control de Incendios Forestales</span><br /><a href="tel:+55540612"style="color:#03853d;">5554 0612</a></div><div style="margin: .5em"><a href="tel:+55547097" style="color:#03853d;">5554 7097</a></div><div style="margin: .5em"> 	<a href="tel:+56531369" style="color:#03853d;">5653 1369</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">LOCATEL</span><br /><a href="tel:+56581111" style="color:#03853d;">5658 1111</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Coordinación General de Protección Civil, SEGOB</span><br /><a href="tel:+55355488" style="color:#03853d;">5535 5488</a></div><div style="margin: .5em"><a href="tel:+57031669" style="color:#03853d;">5703 1669</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Dirección General de Protección Civil, SEGOB</span><br /><a href="tel:+55504911" style="color:#03853d;">5550 4911</a></div><div style="margin: .5em"><a href="tel:+55504299" style="color:#03853d;">5550 4299</a></div><div style="margin: .5em"><a href="tel:+55504858" style="color:#03853d;">5550 4858</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Centro Nacional de Prevención de Desastres, SEGOB</span><br /><a href="tel:+54246100" style="color:#03853d;">5424 6100</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Buzón del Sistema Nacional de Protección Civil, SEGOB</span><br /><a href="tel:+55355488" style="color:#03853d;">5535 5488</a></div><div style="margin: .5em"><a href="tel:+57031669" style="color:#03853d;">5703 1669</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Denuncia de Delitos a la Policía Federal</span><br /><a href="tel:+088" style="color:#03853d;">088</a></div><div style="margin: .5em"><a href="tel:+018007374842" style="color:#03853d;">01 800 737 48 42</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Denuncia por SMS desde tu celular</span><br /><a href="sms://+90089" style="color:#03853d;">90089</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Emergencias</span><br /><a href="tel:+066" style="color:#03853d;">066</a></div><div style="margin: .5em"><span class="text3" style="font-weight: bolder">Denuncia Anónima</span><br /><a href="tel:+089" style="color:#03853d;">089</a></div>';

    htmlToAppend = '<div class="background2" style="padding-top:.8em;padding-bottom:.8em;font-size: 1.3em"><img class="imageMenu" src="img/menu_tel.png">Teléfonos de emergencia</div>'+htmlToAppend;
    try{
        $("#phoneBlock").empty();
        $(htmlToAppend).appendTo("#phoneBlock");
    }catch (e){
        try{
            navigator.notification.alert(
                'Ocurrió un error con el contenido.',// mensaje (message)
                alertDismissed,                      // función 'callback' (alertCallback)
                'Mappir',                         // titulo (title)
                'Cerrar'                             // nombre del botón (buttonName)
            );
        }catch (e){
            alert('Ocurrió un error con el contenido.');
        }
    }
}
