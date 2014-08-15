<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div id="reportarIncidente" class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <form id="#reportarIncidenteForm">
        <div class="modal-dialog" style="width: 520px;">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Reportar incidente</h4>
                </div>
                <div class="modal-body" style="overflow-y: scroll;">
                    <div class="col-xs-12"><b></b><i>Reportar incidente en <span id="modalReportarIncidenteLugar"></span></i></b></div>
                    <br>
                    <span class="label-warning col-xs-12 ui-helper-hidden" style="padding:4px;" id="reportarIncidenteError"></span>
                    <input id="incidente_titulo" name="incidente_titulo" type="hidden">

                    <div class="row">
                        <label for="incidente_nombre" class="col-xs-4">Nombre:</label>
                        <div class="col-xs-8">
                            <input id="incidente_nombre" name="incidente_nombre" placeholder="Tu nombre completo" autocomplete="off" class="form-control modal-input">
                        </div>
                    </div>
                    <div class="row">
                        <label for="incidente_correo" class="col-xs-4">Correo:</label>
                        <div class="col-xs-8">
                            <input id="incidente_correo" placeholder="Tu correo electrónico" autocomplete="off" class="form-control modal-input">
                        </div>
                    </div>
                    <div class="row">
                        <label for="incidente_telefono" class="col-xs-4">Teléfono:</label>
                        <div class="col-xs-8">
                            <input id="incidente_telefono" placeholder="Teléfono" autocomplete="off" class="form-control modal-input">
                            <input type="hidden" id="incidente_x" placeholder="incidente_x" autocomplete="off" class="form-control modal-input">
                        	<input type="hidden" id="incidente_y" placeholder="incidente_y" autocomplete="off" class="form-control modal-input">
                        </div>
                    </div>
                    <div class="row">
                        <label class="col-xs-4">Tipo: <i>*</i></label>
                        <div class="col-xs-8">
                            <ul class="sct-select pull-right/var/www/SCT_MAPPIR/web/modal/reportarIncidente.jsp">
                                <li class="sct-select-display">
                                    <div class="input-group input-group-sm">
                                        <div id="incidente_tipo" data-value="INC">Incidente</div>
                                            <span class="input-group-btn no-collapse">
                                                <button class="btn btn-default sct-select-button" type="button" data-lista="#incidente_tipoLista">
                                                    <i class="caret"></i>
                                                </button>
                                            </span>
                                    </div>
                                </li>
                                <li class="ui-helper-hidden" id="incidente_tipoLista" ">
                                    <ul class="sct-select-options" style="height: 41px;">
                                        <li class="sct-select-option" data-value="INC"
                                            onclick="MappirInterface.auxiliarCombo($(this), $('#incidente_tipo'), $('#incidente_tipoLista'));">Incidente
                                        </li>
                                        <li class="sct-select-option" data-value="EVN"
                                            onclick="MappirInterface.auxiliarCombo($(this), $('#incidente_tipo'), $('#incidente_tipoLista'));">Evento
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row">
                        <label for="incidente_descripcion" class="col-xs-4">Descripción: <i>*</i></label>
                        <div class="col-xs-8">
                        <textarea id="incidente_descripcion" cols="40" rows="5"
                                  placeholder="Descripción del incidente"
                                  autocomplete="off" class="form-control"></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <label for="incidente_respuesta" class="col-xs-4"><i>*</i> Código de seguridad:</label>

                        <div class="col-xs-8" style="margin-top: 8px; padding: 0px;">
                            <img src="" id="incidente_captcha" style="margin: 0px;">
                            <button type="button" class="btn"
                                    onclick="$('#incidente_captcha').attr('src', 'captcha.png?' + Math.random())"><i
                                    class="glyphicon glyphicon-refresh"></i></button>
                            <br/>
                            <div style="width:100%; margin-top:5px;">
                                <input type="text" id="incidente_respuesta" placeholder="Escribe el texto de la imagen aquí" autocomplete="off"
                                       class="form-control"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="width:100%; padding-top: 8px;margin-top: 0px;">
                    <div class="small pull-left"><i>*</i> Campos requeridos.</div>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="MappirInterface.instance.reportarIncidente()">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>
<script>
    $(function () {
        $('#reportarIncidente').on('show.bs.modal', function () {
            $('#incidente_captcha').attr('src', 'captcha.png?' + Math.random());
        });
    });
</script>