OpenLayers.Feature.prototype.mapaControl = null;
OpenLayers.Popup.prototype.layerVisibylity = false;
OpenLayers.Feature.prototype.marker = null;
OpenLayers.Popup.FramedCloud.prototype.feature = null;
OpenLayers.Popup.FramedCloud.prototype.featureControl = null;
OpenLayers.Feature.Vector.prototype.isMarker = false;
OpenLayers.Layer.prototype.isMarker = false;
OpenLayers.Marker.prototype.popup = null;
OpenLayers.Layer.prototype.popups = [];
OpenLayers.Layer.prototype.restringirZoom = true;
OpenLayers.Layer.prototype.togglePopups = function () {
    visibility = this.getVisibility();
    for (var i in this.popups) {
        try {
            popup = this.popups[i];
            if (visibility && popup.layerVisibylity) {
                popup.show();
            } else {
                popup.hide();
            }
        } catch (e) {
//        	console.log(e);
        }
    }
};
OpenLayers.Layer.prototype.setVisibilityPopups = function (visibility) {
    this.setVisibility(visibility);
    for (var i in this.popups) {
        try {
            popup = this.popups[i];
            if (visibility && popup.layerVisibylity) {
                popup.show();
            } else {
                popup.hide();
            }
        } catch (e) {
//        	console.log(e);
        }
    }
};
OpenLayers.Map.prototype.isValidZoomLevel = function (zoomLevel) {
    var _return = ( (zoomLevel != null) &&
        (zoomLevel >= 4) && // set min level here, could read from property
        (zoomLevel < this.getNumZoomLevels()) );
    if (!_return) {
        this.events.triggerEvent('moveend');
    }
    return _return;
};
/*
OpenLayers.Control.LayerSwitcher.prototype.redraw = function () {

    if (!this.checkRedraw())return this.div;
    this.clearLayersArray("base");
    this.clearLayersArray("data");
    var a = !1, b = !1, c = this.map.layers.length;
    this.layerStates = Array(c);
    for (var d = 0; d < c; d++) {
        var e = this.map.layers[d];
        this.layerStates[d] = {name: e.name, visibility: e.visibility, inRange: e.inRange, id: e.id}
    }
    var f = this.map.layers.slice();
    this.ascending || f.reverse();
    d = 0;
    var hold = [];
    for (c = f.length; d < c; d++) {
        var e = f[d], g = e.isBaseLayer;
        if (e.displayInLayerSwitcher) {
            g ? b = !0 : a = !0;
            var h = g ? e == this.map.baseLayer : e.getVisibility(), k = document.createElement("input"), l = OpenLayers.Util.createUniqueID(this.id +
                "_input_");
            k.id = l;
            k.name = g ? this.id + "_baseLayers" : e.name;
            k.type = g ? "radio" : "checkbox";
            k.value = e.name;
            k.checked = h;
            k.autocomplete = "off";
            k.defaultChecked = h;
            k.className = "olButton";
            k._layer = e.id;
            k._layerSwitcher = this.id;
            g || e.inRange || (k.disabled = !0);
            h = document.createElement("label");
            h["for"] = k.id;
            OpenLayers.Element.addClass(h, "labelSpan olButton");
            h._layer = e.id;
            h._layerSwitcher = this.id;
            g || e.inRange || (h.style.color = "gray");
            h.innerHTML = ' ' + e.label;
            h.style.verticalAlign = g ? "" : "baseline";
            h.style.whiteSpace = "nowrap";
            this.dataLayersDiv.style.whiteSpace = "nowrap";
            l = document.createElement("br");
            (g ? this.baseLayers :
                this.dataLayers).push({layer: e, inputElem: k, labelSpan: h});

            if (e.name == 'Clima' || e.name == 'Precipitación' || g) {
                var e = g ? this.baseLayersDiv : this.dataLayersDiv;
                e.appendChild(k);
                e.appendChild(h);
                e.appendChild(l)
            } else {
                hold.push({g: g, h: h, k: k, l: l});
            }
        }
    }
    for (var i = 0; i < hold.length; i++) {
        var e = hold[i], d = e.g ? this.baseLayersDiv : this.dataLayersDiv;
        d.appendChild(e.k);
        d.appendChild(e.h);
        d.appendChild(e.l);
    }

    //this.dataLbl.style.display = a ? "" : "none";
    this.dataLbl.style.display = a ? "" : "none";
    this.baseLbl.style.display = b ? "" : "none";
    return this.div;
};
*/
/**
 * Created by mau  on 17/02/14.
 */

OpenLayers.Feature.Vector.style['default']['cursor'] = 'pointer';
OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '6';
OpenLayers.Feature.Vector.style['default']['strokeColor'] = '#c10eb9';
OpenLayers.Feature.Vector.style['select']['cursor'] = 'pointer';
OpenLayers.Feature.Vector.style['select']['strokeWidth'] = '8';
OpenLayers.Feature.Vector.style['select']['strokeColor'] = '#61075c';


OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single'        : true,
        'double'        : true,
        'pixelTolerance': 0,
        'stopSingle'    : false,
        'stopDouble'    : false
    },
    handleRightClicks    : true,
    initialize           : function (options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        );
        this.handler = new OpenLayers.Handler.Click(
            this, this.eventMethods, this.handlerOptions
        );
    },
    CLASS_NAME           : "OpenLayers.Control.Click"

});