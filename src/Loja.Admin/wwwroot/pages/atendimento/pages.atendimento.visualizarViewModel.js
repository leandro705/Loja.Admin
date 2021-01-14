var pages = pages || {};
pages.atendimento = pages.atendimento || {};
pages.atendimento.model = pages.atendimento.model || {};
pages.atendimento.services = pages.atendimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.atendimento.visualizarViewModel = function () {   
    var model = pages.atendimento.model;
    var service = pages.atendimento.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.atendimento = ko.observable();        
        self.init = function () {               
            self.obterAtendimentoPorId(id);                      
        };

        self.obterAtendimentoPorId = function (atendimentoId) {  
            pages.dataServices.bloquearTela();
            service.obterPorId(atendimentoId).then(function (result) {
                self.atendimento(new model.vmAtendimento(result.data));                             
            }).catch(function (result) {
                console.log(result.data);          
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });            
        };

        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Atendimento/Index";
        };

        self.init();

    }, bindingBody);
}();