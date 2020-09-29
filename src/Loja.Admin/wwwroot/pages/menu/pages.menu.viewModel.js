﻿var pages = pages || {};
pages.menu = pages.menu || {};
pages.menu.model = pages.menu.model || {};
pages.menu.services = pages.menu.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.menu.viewModel = function () {   
    var model = pages.menu.model;
    var service = pages.menu.services;

    ko.applyBindings(new function () {
        var self = this;       
        
        self.usuarioLogado = ko.observable(new model.vmUsuarioLogado(getDataToken()));  

        self.redirecionarPerfil = function () {
            window.location.href = "/Perfil/Index/" + self.usuarioLogado().id();
        };

        self.atualizarNome = function (nome) {
            atualizaNome(nome);
            self.usuarioLogado().nome(nome);
        };

        self.exibeMenuDashboard = ko.computed(function () {            
            if (self.usuarioLogado() && self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR)
                return true;

            return false;
        });

        self.exibeMenuCalendario = ko.computed(function () {           
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.CLIENTE
                ))
                return true;

            return false;
        });

    }, binding);
}();