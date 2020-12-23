var pages = pages || {};
pages.estabelecimento = pages.estabelecimento || {};
pages.estabelecimento.model = pages.estabelecimento.model || {};
pages.estabelecimento.services = pages.estabelecimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.estabelecimento.contatoViewModel = function () {   
    var model = pages.estabelecimento.model;
    var service = pages.estabelecimento.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.estabelecimento = ko.observable();
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));
        self.init = function () {   
            let estabelecimentoId = self.usuarioLogado().isAdministrador() ? id : self.usuarioLogado().estabelecimentoId();
            self.obterEstabelecimentoPorId(estabelecimentoId);                      
        };

        self.obterEstabelecimentoPorId = function (estabelecimentoId) {  
            pages.dataServices.bloquearTela();
            service.obterPorId(estabelecimentoId).then(function (result) {
                self.estabelecimento(new model.vmEstabelecimento(result.data));                             
            }).catch(function (result) {
                console.log(result.data);          
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });            
        };

        self.init();

    }, bindingBody);
}();