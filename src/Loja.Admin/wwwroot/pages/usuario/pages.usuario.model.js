var pages = pages || {};
pages.usuario = pages.usuario || {};

pages.usuario.model = function () {

    var vmUsuario = function (usuario) {
        var self = this;

        self.usuarioId = ko.observable();
        self.nome = ko.observable();
        self.email = ko.observable();
        self.senha = ko.observable();
        self.confirmarSenha = ko.observable();
        self.telefone = ko.observable();
        self.celular = ko.observable();
        self.perfil = ko.observable();
        self.isGoogle = ko.observable();
        self.isFacebook = ko.observable();
        self.endereco = ko.observable(new vmEndereco());    
        self.estabelecimentoId = ko.observable();
        self.dataCadastro = ko.observable();  

        if (usuario) {
            self.usuarioId(usuario.id);
            self.nome(usuario.nome);
            self.email(usuario.email);            
            self.telefone(usuario.telefone);
            self.celular(usuario.celular);
            self.perfil(usuario.role);
            self.isGoogle(usuario.isGoogle);
            self.isFacebook(usuario.isFacebook);
            self.endereco(new vmEndereco(usuario.endereco));            
            self.dataCadastro(usuario.dataCadastro);
        }
    };

    var vmEndereco = function (endereco) {
        var self = this;

        self.logradouro = ko.observable();
        self.numero = ko.observable();
        self.cep = ko.observable();
        self.bairro = ko.observable();
        self.complemento = ko.observable();
        self.municipioId = ko.observable();
        self.municipioNome = ko.observable();
        self.estadoId = ko.observable();
        self.estadoNome = ko.observable();

        if (endereco) {
            self.logradouro(endereco.logradouro);
            self.numero(endereco.numero);
            self.cep(endereco.cep);
            self.bairro(endereco.bairro);
            self.complemento(endereco.complemento);
            self.municipioId(endereco.municipioId);
            self.municipioNome(endereco.municipioNome);
            self.estadoId(endereco.estadoId);
            self.estadoNome(endereco.estadoNome);
        }

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

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable(estabelecimento.estabelecimentoId);
        self.nome = ko.observable(estabelecimento.nome);
    };  

    return {
        vmUsuario,
        vmEstado,
        vmMunicipio,
        vmEstabelecimento
    };

}();