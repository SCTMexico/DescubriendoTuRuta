/**
 * jQuery plugin for Pretty looking right click context menu.
 *
 * Requires popup.js and popup.css to be included in your page. And jQuery, obviously.
 *
 * Usage:
 *
 *   $('.something').contextPopup({
 *     title: 'Some title',
 *     items: [
 *       {label:'My Item', icon:'/some/icon1.png', action:function() { alert('hi'); }},
 *       {label:'Item #2', icon:'/some/icon2.png', action:function() { alert('yo'); }},
 *       null, // divider
 *       {label:'Blahhhh', icon:'/some/icon3.png', action:function() { alert('bye'); }, isEnabled: function() { return false; }},
 *     ]
 *   });
 *
 * Icon needs to be 16x16. I recommend the Fugue icon set from: http://p.yusukekamiyamane.com/
 *
 * - Joe Walnes, 2011 http://joewalnes.com/
 *   https://github.com/joewalnes/jquery-simple-context-menu
 *
 * MIT License: https://github.com/joewalnes/jquery-simple-context-menu/blob/master/LICENSE.txt
 */
jQuery.fn.contextPopup = function (menuData) {

    if (menuData)
    // Define default settings
        var settings = {
            contextMenuClass: 'contextMenuPlugin',
            gutterLineClass : 'gutterLine',
            headerClass     : 'header',
            seperatorClass  : 'divider',
            title           : '',
            items           : []
        };

    var menu = null;
    var contextTimer ;

    // merge them
    $.extend(settings, menuData);

    // Build popup menu HTML
    function createMenu(e) {
        var pixel = e.xy;
        pixel.y = e.layerY;
        var lonLat = MappirMap.instance.mapa.getLonLatFromPixel(e.xy).transform('EPSG:900913', "EPSG:4326");
        menu = $('<ul id="menuContextualMapa" class="' + settings.contextMenuClass + '"><div class="' + settings.gutterLineClass + '"></div></ul>')
            .appendTo(document.body);
        if (settings.title) {
            $('<li class="' + settings.headerClass + '"></li>').text(settings.title).appendTo(menu);
        }
        settings.items.forEach(function (item) {
            if (item) {
                if (item.show && !item.show()) {
                    return;
                }
                var rowCode = '<li><a style="cursor: pointer;" data-lon="' + lonLat.lon + '" data-lat="' + lonLat.lat + '"><span></span></a></li>';
                var row = $(rowCode).appendTo(menu);
                if (item.icon) {
                    var icon = $('<img>');
                    icon.attr('src', item.icon);
                    icon.insertBefore(row.find('span'));
                }
                row.find('span').text(item.label);

                if (item.isEnabled != undefined && !item.isEnabled()) {
                    row.addClass('disabled');
                } else if (item.action) {
                    row.find('a').click(item.action);
                }
            } else {
                $('<li class="' + settings.seperatorClass + '"></li>').appendTo(menu);
            }
        });
        menu.find('.' + settings.headerClass).text(settings.title);
        return menu;
    }

    $(MappirMap.instance.mapa.viewPortDiv).bind('contextmenu', function(e){
        e = e?e:window.event;
        if (e.preventDefault) e.preventDefault(); // For non-IE browsers.
        else return false;
    });

    // On contextmenu event (right click)
    this.bind('sctContextMenu', function (event, eventOpenLayers) {

        if (menu) {
            menu.remove();
            menu = null;
        }

        menu = createMenu(eventOpenLayers)
            .show();

        var left = eventOpenLayers.pageX + 5, /* nudge to the right, so the pointer is covering the title */
            top = eventOpenLayers.pageY + 5;

        //console.debug(top + menu.height(), document.body.clientHeight);
        if (eventOpenLayers.clientY + menu.height() >= document.body.clientHeight) {
            top -= menu.height();
        }

        if (eventOpenLayers.clientX + menu.width() >= document.body.clientWidth) {
            left -= menu.width();
        }

        // Create and show menu
        menu.css({zIndex: 1000001, left: left, top: top})
            .bind('contextmenu', function () {
                return false;
            });

        // When clicking on a link in menu: clean up (in addition to handlers on link already)
        menu.find('a').click(function () {
            menu.remove();
            menu = null;
        });
        clearTimeout(contextTimer);
        contextTimer = setTimeout(function () {
            if (menu) {
                menu.remove();
            }
            menu = null;
        }, 6000);

        // Cancel event, so real browser popup doesn't appear.
        return false;
    });

    return this;
};

