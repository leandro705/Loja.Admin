var pages = pages || {};
pages.servico = pages.servico || {};

pages.servico.model = function () {

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable(estabelecimento.estabelecimentoId);
        self.nome = ko.observable(estabelecimento.nome);       
    };    

    var vmServico = function (servico) {
        var self = this;

        self.servicoId = ko.observable();
        self.nome = ko.observable();
        self.valor = ko.observable();
        self.duracao = ko.observable();
        self.estabelecimentoId = ko.observable();
        self.dataCadastro = ko.observable();
        self.situacao = ko.observable();
        self.estabelecimentoNome = ko.observable();

        if (servico) {
            self.servicoId(servico.servicoId);
            self.nome(servico.nome);
            self.valor(servico.valorFormatado);    
            self.duracao(servico.duracao);    
            self.estabelecimentoId(servico.estabelecimentoId);    
            self.dataCadastro(servico.dataCadastro);
            self.situacao(servico.situacao);
            self.estabelecimentoNome(servico.estabelecimentoNome);
        }
    };    

    return {       
        vmServico,
        vmEstabelecimento
    };
}();