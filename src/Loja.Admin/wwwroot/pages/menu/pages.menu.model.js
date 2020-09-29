var pages = pages || {};
pages.menu = pages.menu || {};

pages.menu.model = function () {

    var vmUsuarioLogado = function (usuarioLogado) {
        var self = this;

        self.id = ko.observable(usuarioLogado.id);
        self.nome = ko.observable(usuarioLogado.nome);
        self.email = ko.observable(usuarioLogado.email);
        self.perfil = ko.observable(usuarioLogado.role);
        
    };

    return {       
        vmUsuarioLogado
    };
}();