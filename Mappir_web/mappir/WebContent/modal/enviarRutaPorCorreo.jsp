<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div id="enviarRutaPorCorreo" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 420px;">
        <div class="modal-content">
            <input type="hidden" id="compartir_titulo" value="">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Enviar ruta por correo</h4>
            </div>
            <div class="modal-body" style="overflow-y: scroll;">
                <span class="label-warning col-xs-12 ui-helper-hidden" style="padding:4px;padding-bottom:10px;" id="compartir_error"></span>
                <div class="row">
                    <label for="compartir_para" class="col-xs-4">Correo: <i>*</i></label>

                    <div class="col-xs-8" style="padding-bottom:10px;">
                        <input id="compartir_para"
                        	   onkeypress="return validateText(event)"
                        	   onblur="validateTextBlur(this)"
                               placeholder="Correo al que deseas mandar la ruta"
                               autocomplete="off"
                               class="form-control">
                    </div>
                </div>
                <div class="row">
                    <label for="compartir_de" class="col-xs-4">De: <i>*</i></label>

                    <div class="col-xs-8" style="padding-bottom:10px;">
                        <input id="compartir_de"
                        	onkeypress="return validateText(event)"
                        	onblur="validateTextBlur(this)"
                        	placeholder="Tu nombre"
                        	autocomplete="off"
                        	class="form-control">
                    </div>
                </div>
                <div class="row">
                    <label for="compartir_mensaje" class="col-xs-4">Mensaje: <i>*</i></label>

                    <div class="col-xs-8" style="padding-bottom:10px;">
                        <textarea id="compartir_mensaje" cols="40" rows="10"
                        	onkeypress="return validateText(event)"
                        	onblur="validateTextBlur(this)"
                        	placeholder="Mensaje adicional al correo"
                            autocomplete="off" style="padding-left:10px;"
                            class="form-control"></textarea>
                    </div>
                </div>
                <div class="row">
                    <label for="compartir_respuesta" class="col-xs-4">Código de seguridad: <i>*</i></label>

                    <div class="col-xs-8" style="padding: 0px; padding-left:10px;">
                        <img src="" id="compartir_captcha">
                        <button type="button" class="btn" style="border-radius:15px;"
                                onclick="$('#compartir_captcha').attr('src', 'captcha.png?' + Math.random())">
                            <i class="glyphicon glyphicon-refresh"></i></button>
                        <br/>

                        <div style="width:100%; margin-top:5px;">
                            <input type="text"
                            	onkeypress="return validateText(event)"
                        	    onblur="validateTextBlur(this)"
                            	id="compartir_respuesta"
                            	placeholder="Escribe el texto de la imagen aquí"
                            	autocomplete="off"
                            	class="form-control"></div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="width:100%;">
                <div class="small pull-left"><i>*</i> Campos requeridos.</div>
                <button type="button" class="btn btn-default" data-dismiss="modal"
                	onclick="javascript:$('.modal-backdrop').remove();">
                	Cancelar
                </button>
                <button id="btnEnviarRutaPorCorreo" type="button" class="btn btn-primary"
                	onclick="MappirInterface.instance.enviarCorreo()">
                    Enviar
                </button>
            </div>
        </div>
    </div>
</div>
<script>
    $(function () {

        $('#enviarRutaPorCorreo').on('show.bs.modal', function () {
            $('#compartir_captcha').attr('src', 'captcha.png?' + Math.random());
        });

    });
</script>