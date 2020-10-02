var pages = pages || {};
pages.servico = pages.servico || {};

pages.servico.model = function () {

    var vmServico = function (servico) {
        var self = this;

        self.servicoId = ko.observable();
        self.nome = ko.observable();
        self.valor = ko.observable();    
        self.dataCadastro = ko.observable();
        self.situacao = ko.observable();

        if (servico) {
            self.servicoId(servico.servicoId);
            self.nome(servico.nome);
            self.valor(servico.valor);            
            self.dataCadastro(servico.dataCadastro);
            self.situacao(servico.situacao);
        }
    };    

    return {       
        vmServico
    };
}();