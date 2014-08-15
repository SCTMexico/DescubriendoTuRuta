<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div id="contactoCorreo" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="width: 420px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Envia tus comentarios</h4>
            </div>
            <div class="modal-body" style="overflow-y: scroll; padding-bottom:10px;">
                <span class="label-warning col-xs-12 ui-helper-hidden" style="padding:4px;" id="contacto_error"></span>
                <div class="row" style="padding-bottom:10px;">
                    <label for="contacto_de" class="col-xs-4">De: <i>*</i></label>
                    <div class="col-xs-8">
                        <input id="contacto_de"
                        	onkeypress="return validateText(event)"
                        	onblur="validateTextBlur(this)"
                        	placeholder="Tu correo electrónico"
                        	autocomplete="off"
                        	class="form-control">
                    </div>
                </div>
                <div class="row" style="padding-bottom:10px;">
                    <label for="contacto_mensaje" class="col-xs-4">Mensaje: <i>*</i></label>
                    <div class="col-xs-8">
                        <textarea id="contacto_mensaje" cols="40" rows="10"
                        	onkeypress="return validateText(event)"
                        	onblur="validateTextBlur(this)"
                            placeholder="Mensaje adicional al correo"
                            autocomplete="off" class="form-control"></textarea>
                    </div>
                </div>
                <div class="row" style="padding-bottom:10px;">
                    <label for="contacto_respuesta" class="col-xs-4">Código de seguridad: <i>*</i></label>

                    <div class="col-xs-8" style="padding: 0px; padding-left:10px;">
                        <img src="" id="contacto_captcha">
                        <button type="button" class="btn"
                                onclick="$('#contacto_captcha').attr('src', 'captcha.png?' + Math.random())"><i
                                class="glyphicon glyphicon-refresh"></i></button>
                        <br/>

                        <div style="width:100%; margin-top:5px;">
                            <input type="text"
                            	onkeypress="return validateText(event)"
                            	onblur="validateTextBlur(this)"
                            	id="contacto_respuesta"
                            	placeholder="Escribe el texto de la imagen aquí"
                            	autocomplete="off" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="width:100%;">
                <div class="small pull-left"><i>*</i> Campos requeridos.</div>
                <button type="button" class="btn btn-default" data-dismiss="modal"
                	onclick="javascript:$('.modal-backdrop').remove();">
                	Cancelar
                </button>
                <button id="btnEnviarContacto" type="button" class="btn btn-primary" 
                	onclick="MappirInterface.instance.enviarContacto();">
                    Enviar
                </button>
            </div>
        </div>
    </div>
</div>
<script>
    $(function () {

        $('#contactoCorreo').on('show.bs.modal', function () {
            $('#contacto_captcha').attr('src', 'captcha.png?' + Math.random());
        });

    });
</script>