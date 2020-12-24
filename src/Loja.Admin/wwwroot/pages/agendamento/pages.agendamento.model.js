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
        self.duracao = ko.observable(servico.duracao);
    };

    var vmCliente = function (cliente) {
        var self = this;

        self.userId = ko.observable(cliente.id);
        self.nome = ko.observable(cliente.nome);
    };  

    var vmHorarioDisponivel = function (horarioDisponivel) {
        var self = this;
                
        self.horarioInicial = ko.observable(horarioDisponivel.horarioInicial);
        self.horarioFinal = ko.observable(horarioDisponivel.horarioFinal);
    };

    var vmAgendamento = function (agendamento, adicionarHorarioDisponivel) {
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
        self.possuiAtendimento = ko.observable(); 

        self.iniciar = function (agendamento, adicionarHorarioDisponivel) {
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
            
            self.observacao(agendamento.observacao);
            self.dataCadastro(agendamento.dataCadastro);
            self.situacao(agendamento.situacao);
            self.possuiAtendimento(agendamento.possuiAtendimento);

            setTimeout(function () {
                self.servicoId(agendamento.servicoId);
                self.servicoNome(agendamento.servicoNome);
                self.userId(agendamento.userId);
                self.usuarioNome(agendamento.usuarioNome);
                setTimeout(function () {
                    if (adicionarHorarioDisponivel) {
                        adicionarHorarioDisponivel(new vmHorarioDisponivel({
                            horarioInicial: splitDataHoraInicial[1],
                            horarioFinal: splitDataHoraFinal[1]
                        }))
                    }
                    self.horaInicial(splitDataHoraInicial[1]);
                    self.horaFinal(splitDataHoraFinal[1]);
                }, 500);  
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
            self.iniciar(agendamento, adicionarHorarioDisponivel);
        }
    };   

    var vmAgendamentoListagem = function (agendamento) {
        var self = this;

        let splitDataHoraInicial = agendamento.dataAgendamentoStr.split(' ');
        let splitDataHoraFinal = agendamento.dataFinalAgendamentoStr.split(' ');

        self.agendamentoId = ko.observable(agendamento.agendamentoId);
        self.dataAgendamento = ko.observable(agendamento.dataAgendamento);
        self.dataAgendamentoStr = ko.observable(splitDataHoraInicial[0]);
        self.dataAgendamentoDP = ko.observable(splitDataHoraInicial[0]);
        self.dataFinalAgendamento = ko.observable(agendamento.dataFinalAgendamento);
        self.dataFinalAgendamentoStr = ko.observable(agendamento.dataFinalAgendamentoStr);
        self.horaInicial = ko.observable(splitDataHoraInicial[1]);
        self.horaFinal = ko.observable(splitDataHoraFinal[1]);
        self.servicoId = ko.observable(agendamento.servicoId);
        self.servicoNome = ko.observable(agendamento.servicoNome);
        self.observacao = ko.observable(agendamento.observacao);
        self.dataCadastro = ko.observable(agendamento.dataCadastro);
        self.situacao = ko.observable(agendamento.situacao);
        self.userId = ko.observable(agendamento.userId);
        self.usuarioNome = ko.observable(agendamento.usuarioNome);
        self.estabelecimentoId = ko.observable(agendamento.estabelecimentoId);
        self.estabelecimentoNome = ko.observable(agendamento.estabelecimentoNome);
        self.possuiAtendimento = ko.observable(agendamento.possuiAtendimento);
    };    

    return {       
        vmServico,
        vmCliente,
        vmEstabelecimento,
        vmAgendamento,
        vmAgendamentoListagem,
        vmHorarioDisponivel
    };
}();