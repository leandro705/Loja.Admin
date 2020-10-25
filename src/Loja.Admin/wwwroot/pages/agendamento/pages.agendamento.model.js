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
        self.dataAgendamentoStr = ko.observable();
        self.dataAgendamentoDP = ko.observable();
        self.dataFinalAgendamento = ko.observable();        
        self.dataFinalAgendamentoStr = ko.observable();        
        self.horaInicial = ko.observable();
        self.horaFinal = ko.observable();
        self.servicoId = ko.observable();        
        self.servicoNome = ko.observable();
        self.observacao = ko.observable();
        self.dataCadastro = ko.observable();
        self.situacao = ko.observable();
        self.userId = ko.observable();
        self.usuarioNome = ko.observable();
        self.estabelecimentoId = ko.observable();
        self.estabelecimentoNome = ko.observable();               

        self.iniciar = function (agendamento) {
            let splitDataHoraInicial = agendamento.dataAgendamentoStr.split(' ');
            let splitDataHoraFinal = agendamento.dataFinalAgendamentoStr.split(' ');

            self.estabelecimentoId(agendamento.estabelecimentoId);
            self.estabelecimentoNome(agendamento.estabelecimentoNome);
            self.agendamentoId(agendamento.agendamentoId);
            self.dataAgendamentoDP(splitDataHoraInicial[0]);
            self.dataAgendamentoStr(splitDataHoraInicial[0]);
            self.dataAgendamento(agendamento.dataAgendamento);
            self.dataFinalAgendamento(agendamento.dataFinalAgendamento);
            self.dataFinalAgendamentoStr(agendamento.dataFinalAgendamentoStr);
            self.horaInicial(splitDataHoraInicial[1]);
            self.horaFinal(splitDataHoraFinal[1]);
            self.observacao(agendamento.observacao);
            self.dataCadastro(agendamento.dataCadastro);
            self.situacao(agendamento.situacao);

            setTimeout(function () {
                self.servicoId(agendamento.servicoId);
                self.servicoNome(agendamento.servicoNome);
                self.userId(agendamento.userId);
                self.usuarioNome(agendamento.usuarioNome);
            }, 500);                        
            
        };

        self.limpar = function () {
            self.agendamentoId(null);
            self.dataAgendamentoDP(null);
            self.dataAgendamentoStr(null);
            self.dataAgendamento(null);
            self.dataFinalAgendamento(null);
            self.dataFinalAgendamentoStr(null);
            self.horaInicial(null);
            self.horaFinal(null);
            self.observacao(null);
            self.servicoId(null);
            self.servicoNome(null);
            self.dataCadastro(null);
            self.situacao(null);
            self.userId(null);
            self.usuarioNome(null);
            self.estabelecimentoId(null);
            self.estabelecimentoNome(null);
        };

        if (agendamento) {
            self.iniciar(agendamento);
        }
    };    

    return {       
        vmServico,
        vmCliente,
        vmEstabelecimento,
        vmAgendamento
    };
}();