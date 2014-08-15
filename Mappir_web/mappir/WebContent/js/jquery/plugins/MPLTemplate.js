/**
 * Mauricio Pazaran Lemus 2011
 * Plugin template jquery
 */
MPLTemplate = function (target, template) {
    this.init(target, template);
};
jQuery.extend(MPLTemplate.prototype, {

    template      : null,
    twig          : null,
    target        : null,
    defaultData   : null,
    init          : function (target, template) {
        this.target = $(target);
        this.template = template = undefined ? "" : template;
        this.twig = twig({data: this.template});
    },
    _perform      : function (data) {
        if (data == undefined) {
            return this.template;
        }
        return this.template.replace(/\{([\w\.]*)\}/g, function (str, key) {
            var keys = key.split("."), v = data[keys.shift()];
            for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
            return (typeof v !== "undefined" && v !== null) ? v : "";
        });
    },
    load          : function (template) {
        templateObject = $(template);
        this.template = templateObject.html();
        this.defaultData = templateObject.data();
        this.twig = twig({data: this.template});
        return this;
    },
    perform       : function (data, clean) {
        if (undefined == data && null == this.defaultData) {
            this.target.append($(this.twig.render({})));
        }
        if (undefined != clean && clean == true) {
            this.empty();
        }
        if (Object.prototype.toString.call(data) === '[object Array]') {
            $.each(data, $.proxy(function (i, item) {
                if (null != this.defaultData) {
                    if (undefined == item) {
                        item = this.defaultData;
                    } else {
                        for (var i in this.defaultData) {
                            if (undefined == item[i]) {
                                item[i] = this.defaultData[i];
                            }
                        }
                    }
                }
                this.target.append($(this.twig.render(item)));
            }, this));
        } else {
            if (null != this.defaultData) {
                if (undefined == data) {
                    data = this.defaultData;
                } else {
                    for (var i in this.defaultData) {
                        if (undefined == data[i]) {
                            data[i] = this.defaultData[i];
                        }
                    }
                }
            }
            this.target.append($(this.twig.render(data)));
        }
        return this;
    },
    empty         : function () {
        this.target.empty();
        return this;
    },
    setDefaultData: function (data) {
        this.defaultData = data;
        return this;
    }
});
