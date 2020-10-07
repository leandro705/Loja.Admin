var pages = pages || {};
pages.estabelecimento = pages.estabelecimento || {};

pages.estabelecimento.model = function () {

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable();
        self.nome = ko.observable();
        self.email = ko.observable();
        self.descricao = ko.observable();        
        self.url = ko.observable();
        self.telefone = ko.observable();
        self.celular = ko.observable();
        self.instagram = ko.observable();
        self.facebook = ko.observable();
        self.dataCadastro = ko.observable();
        self.situacao = ko.observable();

        if (estabelecimento) {
            self.estabelecimentoId(estabelecimento.estabelecimentoId);
            self.nome(estabelecimento.nome);
            self.email(estabelecimento.email);
            self.descricao(estabelecimento.descricao);
            self.url(estabelecimento.url);
            self.telefone(estabelecimento.telefone);
            self.celular(estabelecimento.celular);
            self.instagram(estabelecimento.instagram);
            self.facebook(estabelecimento.facebook);
            self.dataCadastro(estabelecimento.dataCadastro);
            self.situacao(estabelecimento.situacao);
        }
    };    

    return {       
        vmEstabelecimento
    };
}();