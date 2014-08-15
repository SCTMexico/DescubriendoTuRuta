<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="mx.gob.sct.mappir.helpers.CatalogosContenido" %>
<%
    Object[] contenido = CatalogosContenido.getContent("telefono_web");
%>
<div id="telefonsEmergencia" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title"><img src="img/menu_tel.png" class="imageMenu">Teléfonos de emergencia</h4>
            </div>
            <div id="bodyTelEmerg" tabindex='1' class="modal-body" style="max-height:450px; overflow-y: scroll;">
                <%
                    out.print(contenido[1]);
                %>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>
<script>
    $(function () {
        $('#telefonsEmergencia').on('show.bs.modal', function () {
			setTimeout(function() {
						$('#bodyTelEmerg').focus();
					}, 600);
		});
	});
</script>