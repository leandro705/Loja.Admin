var pages = pages || {};
pages.usuario = pages.usuario || {};
pages.usuario.model = pages.usuario.model || {};
pages.usuario.services = pages.usuario.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.usuario.visualizarViewModel = function () {   
    var model = pages.usuario.model;
    var service = pages.usuario.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.usuario = ko.observable();        
        self.init = function () {               
            self.obterUsuarioPorId(id);                      
        };

        self.obterUsuarioPorId = function (usuarioId) {  
            pages.dataServices.bloquearTela();
            service.obterPorId(usuarioId).then(function (result) {
                self.usuario(new model.vmUsuario(result.data));                             
            }).catch(function (result) {
                console.log(result.data);          
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });            
        };

        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Usuario/Index";
        };

        self.init();

    }, bindingBody);
}();