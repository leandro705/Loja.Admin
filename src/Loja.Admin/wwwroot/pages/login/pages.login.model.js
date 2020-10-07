var pages = pages || {};
pages.login = pages.login || {};

pages.login.model = function () {

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable();
        self.nome = ko.observable();
        self.email = ko.observable();
        self.descricao = ko.observable();
        self.url = ko.observable();        

        if (estabelecimento) {
            self.estabelecimentoId(estabelecimento.estabelecimentoId);
            self.nome(estabelecimento.nome);
            self.email(estabelecimento.email);
            self.descricao(estabelecimento.descricao);
            self.url(estabelecimento.url);            
        }
    };

    return {
        vmEstabelecimento
    };
}();