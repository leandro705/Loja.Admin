
ko.bindingHandlers.select2 = {
    init: function (el, valueAccessor, allBindingsAccessor, viewModel) {
        ko.utils.domNodeDisposal.addDisposeCallback(el, function () {
            $(el).select2('destroy');
        });

        var allBindings = allBindingsAccessor(),
            select2 = ko.utils.unwrapObservable(allBindings.select2);

        $(el).select2(select2);
    },
    update: function (el, valueAccessor, allBindingsAccessor, viewModel) {
        var allBindings = allBindingsAccessor();

        if ("value" in allBindings) {
            if ((allBindings.select2.multiple || el.multiple) && (allBindings.value() || "").constructor != Array) {
                $(el).val((allBindings.value() || "").toString().split(',')).trigger('change');
            }
            else {
                $(el).val(allBindings.value()).trigger('change');
            }
        } else if ("selectedOptions" in allBindings) {
            var converted = [];
            var textAccessor = function (value) { return value; };
            if ("optionsText" in allBindings) {
                textAccessor = function (value) {
                    var valueAccessor = function (item) { return item; }
                    if ("optionsValue" in allBindings) {
                        valueAccessor = function (item) { return item[allBindings.optionsValue]; }
                    }
                    var items = $.grep(allBindings.options(), function (e) { return valueAccessor(e) == value });
                    if (items.length == 0 || items.length > 1) {
                        return "UNKNOWN";
                    }
                    return items[0][allBindings.optionsText];
                }
            }
            $.each(allBindings.selectedOptions(), function (key, value) {
                converted.push({ id: value, text: textAccessor(value) });
            });
            $(el).select2("data", converted);
        }
        $(el).trigger("change");
    }
};

ko.bindingHandlers.masked = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var mask = allBindingsAccessor().mask || {};
        var telefone = allBindingsAccessor().telefone || false;
        var horario = allBindingsAccessor().horario || false;
        var maskOptions = allBindingsAccessor().maskOptions || {};

        if (telefone) {
            var behavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            },
            options = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(behavior.apply({}, arguments), options);
                }
            };

            $(element).mask(behavior, options);
        }
        else if (horario) {
            var behavior = function (val) {
                return val.replace(/\D/g, '')[0] === '2' ? 'AE:CD' : 'AB:CD';
            },
            options = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(behavior.apply({}, arguments), options);
                },
                translation: {
                    "A": { pattern: /[0-2]/, optional: false },
                    "B": { pattern: /[0-9]/, optional: false },
                    "C": { pattern: /[0-5]/, optional: false },
                    "D": { pattern: /[0-9]/, optional: false },
                    "E": { pattern: /[0-3]/, optional: false }
                }
            };
            $(element).mask(behavior, options);              
        }
        else
            $(element).mask(mask, maskOptions);

        ko.utils.registerEventHandler(element, 'focusout', function () {
            var observable = valueAccessor();
            var valor = $(element).val(); 
            observable(valor);
        });        
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).val(value);
    }
};

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var $el = $(element);

        //initialize datepicker with some optional options
        var options = ko.bindingHandlers.datepicker.optionsDefault;
        var local = {};

        ko.utils.extend(local, options);
        ko.utils.extend(local, allBindingsAccessor().datepickerOptions || {});

        if (local.dataMesAno) {
            var dataMesAnoOptions = {
                dateFormat: 'mm/yy',
                format: {
                    toDisplay: function (date, format, language) {
                        var d = new Date(date);
                        var UTCZone = d.getTimezoneOffset() / 60;
                        d.setHours(d.getHours() + UTCZone);
                        return [(d.getMonth() + 1).toString().padStart(2, "0"), d.getFullYear()].join("/");
                    },
                    toValue: function (date, format, language) {
                        if (date.length == 7) {
                            var separado = date.split("/");
                            var mes = parseInt(separado[0]) - 1;
                            var ano = parseInt(separado[1]);
                            return new Date(ano, mes, 1);
                        }
                    }
                }
            }

            ko.utils.extend(local, dataMesAnoOptions);
        }

        $el.datepicker(local);

        var masked = allBindingsAccessor().mask || null;

        if (masked) {
            $el.mask(masked);
        }
        
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($el.datepicker("getDate"));
        });
        
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $el.datepicker("destroy");
        });

    },
    optionsDefault: {
        dateFormat: 'dd/mm/yyyy',
        buttonImageOnly: true,
        language: 'pt-BR',
        autoclose: true
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            $el = $(element),
            current = $el.datepicker("getDate");

        if (value - current !== 0) {
            $el.datepicker("setDate", value);
        }
    }
};

ko.bindingHandlers.modal = {
    init: function (element, valueAccessor) {
        $(element).modal({
            show: false
        });

        var value = valueAccessor();

        $.prototype.modal = (function (modal) {
            return function (config) {
                try {
                    return modal.call(this, config);
                } catch (ex) {
                    if (ex instanceof TypeError && config === "destroy") {
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        return modal.call(this, "dispose");
                    }
                }
            };
        })($.prototype.modal);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).modal("destroy");
        });

    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            $(element).modal('show');
        } else {
            $(element).modal('hide');
        }
    }
};