var pages = pages || {};
pages.agendamento = pages.agendamento || {};

pages.agendamento.model = function () {

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable(estabelecimento.estabelecimentoId);
        self.nome = ko.observable(estabelecimento.nome);       
    };  

    var vmServico = function (servico) {
        var self = this;

        self.servicoId = ko.observable(servico.servicoId);
        self.nome = ko.observable(servico.nome);
    };

    var vmCliente = function (cliente) {
        var self = this;

        self.userId = ko.observable(cliente.id);
        self.nome = ko.observable(cliente.nome);
    };    

    var vmAgendamento = function (agendamento) {
        var self = this;

        self.agendamentoId = ko.observable();
        self.dataAgendamento = ko.observable();
        self.dataFinalAgendamento = ko.observable();
        self.dataAgendamentoDP = ko.observable();
        self.horaInicial = ko.observable();
        self.horaFinal = ko.observable();
        self.servicoId = ko.observable();        
        self.servicoNome = ko.observable();
        self.observacao = ko.observable();
        self.dataCadastro = ko.observable();
        self.situacao = ko.observable();
        self.userId = ko.observable();
        self.estabelecimentoId = ko.observable();
        self.estabelecimentoNome = ko.observable();

        if (agendamento) {
            let splitDataHoraInicial = agendamento.dataAgendamento.split(' ');
            let splitDataHoraFinal = agendamento.dataFinalAgendamento.split(' ');


            self.agendamentoId(agendamento.agendamentoId);
            self.dataAgendamentoDP(splitDataHoraInicial[0]);
            self.dataAgendamento(splitDataHoraInicial[0]);
            self.dataFinalAgendamento(agendamento.dataFinalAgendamento);
            self.horaInicial(splitDataHoraInicial[1]);
            self.horaFinal(splitDataHoraFinal[1]);
            self.observacao(agendamento.observacao);    
            self.servicoId(agendamento.servicoId);
            self.servicoNome(agendamento.servicoNome);
            
            self.dataCadastro(agendamento.dataCadastro);
            self.situacao(agendamento.situacao);
            self.userId(agendamento.userId); 
            self.estabelecimentoId(agendamento.estabelecimentoId); 
            self.estabelecimentoNome(agendamento.estabelecimentoNome);
        }
    };    

    return {       
        vmServico,
        vmCliente,
        vmEstabelecimento,
        vmAgendamento
    };
}();