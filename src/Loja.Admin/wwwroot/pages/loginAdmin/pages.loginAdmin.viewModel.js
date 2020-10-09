var pages = pages || {};
pages.loginAdmin = pages.loginAdmin || {};
pages.loginAdmin.services = pages.loginAdmin.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.loginAdmin.viewModel = function () {  
    var service = pages.loginAdmin.services;

    ko.applyBindings(new function () {
        var self = this;  
       
        self.email = ko.observable();
        self.senha = ko.observable();

        self.init = function () {            
            pages.utils.initDataPassword();
        };
        
        self.validarLogin = function () {
            var mensagens = [];

            if (isNullOrEmptyOrWriteSpace(self.email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");
            if (isNullOrEmptyOrWriteSpace(self.senha()))
                mensagens.push("<strong>Senha</strong> é obrigatório!");
           
            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        }

        self.login = function () {            
            if (!self.validarLogin()) { return; }

            var parametro = {
                email: self.email(),
                senha: self.senha()
            };

            pages.dataServices.bloquearTela();
            service.login(parametro).then(function (result) {
                console.log(result)
                localStorage.setItem("token", JSON.stringify(result));
                window.location.href = "/Home/Index";
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.init();

    }, bindingBody);
}();