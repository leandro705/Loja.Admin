var pages = pages || {};
pages.agendamento = pages.agendamento || {};
pages.agendamento.model = pages.agendamento.model || {};
pages.agendamento.services = pages.agendamento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.agendamento.visualizarViewModel = function () {   
    var model = pages.agendamento.model;
    var service = pages.agendamento.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.agendamento = ko.observable();        
        self.init = function () {               
            self.obterAgendamentoPorId(id);                      
        };

        self.obterAgendamentoPorId = function (agendamentoId) {  
            pages.dataServices.bloquearTela();
            service.obterPorId(agendamentoId).then(function (result) {
                self.agendamento(new model.vmAgendamentoListagem(result.data));                             
            }).catch(function (result) {
                console.log(result.data);          
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });            
        };

        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Agendamento/Index";
        };

        self.init();

    }, bindingBody);
}();