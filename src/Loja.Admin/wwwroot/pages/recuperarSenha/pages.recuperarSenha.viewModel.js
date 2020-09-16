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

        pages.utils.initDataPassword();
        self.senha = ko.observable();
        self.confirmarSenha = ko.observable();   

        self.validar = function () {
            var mensagens = [];
           
            if (isNullEmptyOrWriteSpace(self.senha()))
                mensagens.push("<strong>Senha</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(self.confirmarSenha()))
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

            service.recuperarSenha(parametro).then(function () {
                bootbox.alert("Senha alterada com sucesso!", function () {
                    window.location.href = URL_SITE;
                });                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        };       

    }, binding);
}();