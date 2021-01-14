var pages = pages || {};
pages.servico = pages.servico || {};
pages.servico.model = pages.servico.model || {};
pages.servico.services = pages.servico.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.servico.visualizarViewModel = function () {   
    var model = pages.servico.model;
    var service = pages.servico.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.servico = ko.observable();        
        self.init = function () {               
            self.obterServicoPorId(id);                      
        };

        self.obterServicoPorId = function (servicoId) {  
            pages.dataServices.bloquearTela();
            service.obterPorId(servicoId).then(function (result) {
                self.servico(new model.vmServico(result.data));                             
            }).catch(function (result) {
                console.log(result.data);          
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