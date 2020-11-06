var pages = pages || {};
pages.home = pages.home || {};

pages.home.model = function () {

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable(estabelecimento.estabelecimentoId);
        self.nome = ko.observable(estabelecimento.nome);       
    };    

    var vmCliente = function (cliente) {
        var self = this;

        self.userId = ko.observable(cliente.id);
        self.nome = ko.observable(cliente.nome);
    };       

    return {       
        vmCliente,
        vmEstabelecimento
    };
}();