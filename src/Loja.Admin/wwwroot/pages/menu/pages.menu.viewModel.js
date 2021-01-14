var pages = pages || {};
pages.menu = pages.menu || {};
pages.menu.model = pages.menu.model || {};
pages.menu.services = pages.menu.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.menu.viewModel = function () {   
    var model = pages.menu.model;
    var service = pages.menu.services;

    var viewModelMenu = new function () {
        var self = this;       
        
        self.usuarioLogado = ko.observable(new model.vmUsuarioLogado(getDataToken()));          

        self.redirecionarPerfil = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Perfil/Index/" + self.usuarioLogado().id();
        };

        self.atualizarNome = function (nome) {
            atualizarNome(nome);
            self.usuarioLogado().nome(nome);
        };

        self.obterUsuarioLogado = function () {            
            return self.usuarioLogado();
        };

        self.exibeMenuDashboard = ko.computed(function () {            
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE 
                ))
                return true;

            return false;
        });
        
        self.exibeMenuCalendario = ko.computed(function () {           
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE ||
                    self.usuarioLogado().perfil() === service.EPerfil.CLIENTE
                ))
                return true;

            return false;
        });

        self.exibeMenuEstabelecimento = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE
                ))
                return true;

            return false;
        });
                
        self.exibeMenuEstabelecimentoVisualizar = ko.computed(function () {
            if (self.usuarioLogado() && self.usuarioLogado().perfil() === service.EPerfil.CLIENTE)
                return true;

            return false;
        });

        self.exibeMenuPerfil = ko.computed(function () {
            if (self.usuarioLogado() && self.usuarioLogado().perfil() === service.EPerfil.CLIENTE)
                return true;

            return false;
        });

        self.exibeMenuAgendamento = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE
                ))
                return true;

            return false;
        });

        self.exibeMenuAtendimento = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE
                ))
                return true;

            return false;
        });

        self.exibeMenuServico = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE
                ))
                return true;

            return false;
        });

        self.exibeMenuUsuario = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR 
                ))
                return true;

            return false;
        });

        
    };

    ko.applyBindings(viewModelMenu, binding);    
    return viewModelMenu;
}();