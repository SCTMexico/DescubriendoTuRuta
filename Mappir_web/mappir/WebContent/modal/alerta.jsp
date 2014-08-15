<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" id="mappirAlert">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="tituloAlerta"></h4>
            </div>
            <div class="modal-body" style="overflow-y: scroll;">
                <div class="row">
                    <div class="col-xs-2"><img src="images/logo_solo.png" class="pull-left"/></div>
                    <div class="col-xs-9 text-center" style="margin-left:30px" ><p id="mappirAlertContenido"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal"
                	onclick="javascript:$('.modal-backdrop').remove();">
                	Aceptar
                </button>
            </div>
        </div>
    </div>
</div>