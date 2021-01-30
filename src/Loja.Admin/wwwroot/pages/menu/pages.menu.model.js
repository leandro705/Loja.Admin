var pages = pages || {};
pages.menu = pages.menu || {};

pages.menu.model = function () {

    var vmUsuarioLogado = function (usuarioLogado) {
        var self = this;

        self.id = ko.observable(usuarioLogado.id);
        self.nome = ko.observable(usuarioLogado.nome);
        self.email = ko.observable(usuarioLogado.email);
        self.perfil = ko.observable(usuarioLogado.role);
        self.estabelecimentoId = ko.observable(usuarioLogado.estabelecimentoId);
        self.estabelecimentoNome = ko.observable(usuarioLogado.estabelecimentoNome);
        self.estabelecimentoNomeUrl = ko.observable(usuarioLogado.estabelecimentoNomeUrl);
        self.isAdministrador = ko.observable(usuarioLogado.isAdministrador); 
        self.isGerente = ko.observable(usuarioLogado.role == "Gerente"); 
        self.isCliente = ko.observable(usuarioLogado.role == "Cliente"); 
    };

    return {       
        vmUsuarioLogado
    };
}();