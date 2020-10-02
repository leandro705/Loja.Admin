var pages = pages || {};
pages.servico = pages.servico || {};
pages.servico.model = pages.servico.model || {};
pages.servico.services = pages.servico.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.servico.cadastroViewModel = function () {   
    var model = pages.servico.model;
    var service = pages.servico.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.servico = ko.observable(new model.vmServico());       
        self.bloqueiaSalvar = ko.observable(false);        

        self.validar = function () {
            var mensagens = [];

            if (isNullEmptyOrWriteSpace(self.servico().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (isNullEmptyOrWriteSpace(self.servico().valor()))
                mensagens.push("<strong>Valor</strong> é obrigatório!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validar()) { return; }

            var parametro = {
                nome: self.servico().nome(),
                email: self.servico().valor()               
            };

            self.bloqueiaSalvar(true);
            service.salvar(parametro).then(function () {
                bootbox.alert("Serviço salvo com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
                self.bloqueiaSalvar(false);
            }).finally(function () {

            });
        };

        self.voltar = function () {
            window.location.href = "/Servico/Index";
        };

    }, bindingBody);
}();