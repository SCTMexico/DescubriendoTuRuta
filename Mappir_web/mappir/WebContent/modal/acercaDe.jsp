<%@ page import="mx.gob.sct.mappir.helpers.CatalogosContenido" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    Object[] contenido = CatalogosContenido.getContent("acerca_de");
%>
<div id="acercaDe" class="modal fade" tabindex="-1" >
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title"><% out.print(contenido[0]); %></h4>
            </div>
            <div id="bodyAcercaDe" tabindex='1' 
            	class="modal-body" style="max-height:420px; overflow-y: scroll;">
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
        $('#acercaDe').on('show.bs.modal', function () {
			setTimeout(function() {
						$('#bodyAcercaDe').focus();
					}, 600);
		});
	});
</script>