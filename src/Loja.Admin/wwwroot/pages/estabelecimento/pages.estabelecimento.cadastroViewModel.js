﻿var pages = pages || {};
pages.estabelecimento = pages.estabelecimento || {};
pages.estabelecimento.model = pages.estabelecimento.model || {};
pages.estabelecimento.services = pages.estabelecimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.estabelecimento.cadastroViewModel = function () {   
    var model = pages.estabelecimento.model;
    var service = pages.estabelecimento.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.estabelecimento = ko.observable(new model.vmEstabelecimento());       
        self.bloqueiaSalvar = ko.observable(false);        

        self.validar = function () {
            var mensagens = [];

            if (isNullEmptyOrWriteSpace(self.estabelecimento().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (isNullEmptyOrWriteSpace(self.estabelecimento().email()))
                mensagens.push("<strong>E-Mail</strong> é obrigatório!");

            if (isNullEmptyOrWriteSpace(self.estabelecimento().celular()))
                mensagens.push("<strong>Celular</strong> é obrigatório!");

            if (isNullEmptyOrWriteSpace(self.estabelecimento().descricao()))
                mensagens.push("<strong>Descrição</strong> é obrigatório!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validar()) { return; }

            var parametro = {
                nome: self.estabelecimento().nome(),
                email: self.estabelecimento().email(),
                descricao: self.estabelecimento().descricao(),
                celular: self.estabelecimento().celular(),
                telefone: self.estabelecimento().telefone(),
                instagram: self.estabelecimento().instagram(),
                facebook: self.estabelecimento().facebook()
            };

            self.bloqueiaSalvar(true);
            service.salvar(parametro).then(function () {
                bootbox.alert("Estabelecimento salvo com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
                self.bloqueiaSalvar(false);
            }).finally(function () {

            });
        };

        self.voltar = function () {
            window.location.href = "/Estabelecimento/Index";
        };

    }, bindingBody);
}();