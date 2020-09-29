var pages = pages || {};
pages.perfil = pages.perfil || {};

pages.perfil.model = function () {

    var vmUsuario = function (usuario) {
        var self = this;

        self.id = ko.observable(usuario.id);
        self.nome = ko.observable(usuario.nome);
        self.email = ko.observable(usuario.email);
        self.telefone = ko.observable(usuario.telefone);
        self.celular = ko.observable(usuario.celular);
        self.perfil = ko.observable(usuario.role);
        self.isGoogle = ko.observable(usuario.isGoogle);
        self.isFacebook = ko.observable(usuario.isFacebook);
        self.endereco = ko.observable(new vmEndereco(usuario.endereco));
        self.alterarSenha = ko.observable(new vmAlterarSenha());

        self.loginSocial = ko.computed(function () {
            if (self.isGoogle() || self.isFacebook())
                return true;

            return false;
        });
        
    };

    var vmEndereco = function (endereco) {
        var self = this;

        self.logradouro = ko.observable();
        self.numero = ko.observable();
        self.cep = ko.observable();
        self.bairro = ko.observable();
        self.complemento = ko.observable();
        self.municipioId = ko.observable();
        self.estadoId = ko.observable();

        if (endereco) {
            self.logradouro(endereco.logradouro);
            self.numero(endereco.numero);
            self.cep(endereco.cep);
            self.bairro(endereco.bairro);
            self.complemento(endereco.complemento);
            self.municipioId(endereco.municipioId);
            self.estadoId(endereco.estadoId);
        }

    };

    var vmAlterarSenha = function () {
        var self = this;

        self.senhaAtual = ko.observable();
        self.novaSenha = ko.observable();
        self.confirmarSenha = ko.observable();

    };

    var vmEstado = function (estado) {
        var self = this;

        self.estadoId = ko.observable(estado.estadoId);
        self.nome = ko.observable(estado.nome);
        self.sigla = ko.observable(estado.sigla);
    };

    var vmMunicipio = function (municipio) {
        var self = this;

        self.municipioId = ko.observable(municipio.municipioId);
        self.nome = ko.observable(municipio.nome);
    };

    return {       
        vmUsuario,
        vmEstado,
        vmMunicipio
    };
}();