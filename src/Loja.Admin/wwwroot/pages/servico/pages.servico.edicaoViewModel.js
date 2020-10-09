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
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.servico = ko.observable();     
        self.estabelecimentos = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {     
            if (self.usuarioLogado().isAdministrador())
                self.obterTodosEstabelecimentos();

            self.obterServicoPorId(id);            
        };

        self.obterTodosEstabelecimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodosEstabelecimentos().then(function (result) {
                result.forEach(function (item) {
                    self.estabelecimentos.push(new model.vmEstabelecimento(item));
                });
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterServicoPorId = function (servicoId) {      
            pages.dataServices.bloquearTela();
            service.obterPorId(servicoId).then(function (result) {
                self.servico(new model.vmServico(result));                             
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);              
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });            
        };

        self.validar = function () {
            var mensagens = [];

            if (isNullOrEmptyOrWriteSpace(self.servico().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.servico().valor()))
                mensagens.push("<strong>Valor</strong> é obrigatório!");

            if (isNullOrEmpty(self.servico().duracao()))
                mensagens.push("<strong>Duração</strong> é obrigatório!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validar()) { return; }

            var parametro = {
                servicoId: self.servico().servicoId(),
                nome: self.servico().nome(),
                valor: pages.utils.formataDecimal(self.servico().valor()),
                duracao: self.servico().duracao(),
                estabelecimentoId: self.usuarioLogado().isAdministrador() ? self.servico().estabelecimentoId() : self.usuarioLogado().estabelecimentoId()
            };

            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.atualizar(id, parametro).then(function () {
                bootbox.alert("Serviço atualizado com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
                self.bloqueiaSalvar(false);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Servico/Index";
        };

        self.init();

    }, bindingBody);
}();