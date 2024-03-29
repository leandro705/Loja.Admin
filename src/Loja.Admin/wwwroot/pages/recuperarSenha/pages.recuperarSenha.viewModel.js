﻿var pages = pages || {};
pages.recuperarSenha = pages.recuperarSenha || {};
pages.recuperarSenha.services = pages.recuperarSenha.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.recuperarSenha.viewModel = function () {    
    var service = pages.recuperarSenha.services;

    ko.applyBindings(new function () {
        var self = this;               

        var nomeUrl = pages.utils.getUrlParameter('nomeUrl');
        pages.utils.initDataPassword();
        self.senha = ko.observable();
        self.confirmarSenha = ko.observable();   

        self.validar = function () {
            var mensagens = [];
           
            if (isNullOrEmptyOrWriteSpace(self.senha()))
                mensagens.push("<strong>Senha</strong> é obrigatório!");
            if (isNullOrEmptyOrWriteSpace(self.confirmarSenha()))
                mensagens.push("<strong>Confirmar Senha</strong> é obrigatório!");
            if (self.senha() !== self.confirmarSenha())
                mensagens.push("<strong>Senha</strong> e <strong>Confirmar Senha</strong> devem ser iguais!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        }

        self.recuperarSenha = function () {

            if (!self.validar()) { return; }

            var parametro = {
                userId: pages.utils.getUrlParameter('id'),
                token: pages.utils.getUrlParameter('token'),
                novaSenha: self.senha()
            };

            pages.dataServices.bloquearTela();
            service.recuperarSenha(parametro).then(function () {
                bootbox.alert("Senha alterada com sucesso!", function () {
                    window.location.href = URL_SITE + "/Login/Index/" + nomeUrl;                    
                });                
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };       

    }, bindingBody);
}();