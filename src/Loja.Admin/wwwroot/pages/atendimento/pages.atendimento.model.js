var pages = pages || {};
pages.atendimento = pages.atendimento || {};

pages.atendimento.model = function () {

    var vmEstabelecimento = function (estabelecimento) {
        var self = this;

        self.estabelecimentoId = ko.observable(estabelecimento.estabelecimentoId);
        self.nome = ko.observable(estabelecimento.nome);
    };

    var vmServico = function (servico) {
        var self = this;

        self.servicoId = ko.observable(servico.servicoId);
        self.nome = ko.observable(servico.nome);
        self.valor = ko.observable(servico.valorFormatado);
    };

    var vmCliente = function (cliente) {
        var self = this;

        self.userId = ko.observable(cliente.id);
        self.nome = ko.observable(cliente.nome);
    }; 

    var vmAtendimento = function (atendimento) {
        var self = this;

        self.atendimentoId = ko.observable();
        self.dataAtendimento = ko.observable();       
        self.dataAtendimentoDP = ko.observable();              
        self.valor = ko.observable();
        self.desconto = ko.observable();       
        self.valorTotal = ko.observable();
        self.observacao = ko.observable();

        self.dataCadastro = ko.observable();
        self.situacao = ko.observable();
        self.userId = ko.observable();
        self.usuarioNome = ko.observable();
        self.estabelecimentoId = ko.observable();
        self.estabelecimentoNome = ko.observable();

        self.servicoId = ko.observable();
        self.servicoNome = ko.observable();

        self.agendamentoId = ko.observable();

        self.atendimentoItens = ko.observableArray([]);

        self.atendimentoItens.subscribe(function (itens) {
            if (!itens) return;

            let soma = itens.reduce(function (soma, item) {
                let valor = isNaN(parseFloatVirgula(item.valor())) ? 0 : parseFloatVirgula(item.valor());
                return soma + valor;
            }, 0);

            self.valor(soma.toFixed(2).toString().replace('.', ','));
        });

        ko.computed(function () {
            let valor = isNaN(parseFloatVirgula(self.valor())) ? 0 : parseFloatVirgula(self.valor());
            let desconto = isNaN(parseFloatVirgula(self.desconto())) ? 0 : parseFloatVirgula(self.desconto());

            if (desconto > valor) {
                bootbox.alert("Desconto não pode ser maior que o valor!");
                self.desconto(null);
                desconto = 0;
            }

            let valorTotal = valor - desconto;
            self.valorTotal(valorTotal.toFixed(2).toString().replace('.', ','));
        });

        if (atendimento) {
            
            self.atendimentoId(atendimento.atendimentoId);
            self.dataAtendimentoDP(atendimento.dataAtendimento);
            self.dataAtendimento(atendimento.dataAtendimento);
            self.valor(atendimento.valorFormatado);
            self.desconto(atendimento.descontoFormatado);
            self.observacao(atendimento.observacao);            

            self.dataCadastro(atendimento.dataCadastro);
            self.situacao(atendimento.situacao);
            self.userId(atendimento.userId);
            self.usuarioNome(atendimento.usuarioNome);
            self.estabelecimentoId(atendimento.estabelecimentoId);
            self.estabelecimentoNome(atendimento.estabelecimentoNome);

            atendimento.atendimentoItens.forEach(function (item) {
                self.atendimentoItens.push(new vmAtendimentoItem(item));
            });
        }

        self.preencherAgendamento = function (agendamento) {
            let splitdataAgendamento = agendamento.dataAgendamentoStr.split(' ');
            self.agendamentoId(agendamento.agendamentoId);
            self.dataAtendimentoDP(splitdataAgendamento[0]);
            self.dataAtendimento(splitdataAgendamento[0]);
            self.userId(agendamento.userId);
            self.usuarioNome(agendamento.usuarioNome);
            self.estabelecimentoId(agendamento.estabelecimentoId);
            self.estabelecimentoNome(agendamento.estabelecimentoNome);

            self.atendimentoItens.push(new vmAtendimentoItem({
                servicoId: agendamento.servicoId,
                servicoNome: agendamento.servicoNome,
                valorFormatado: agendamento.servicoValor
            }));            
        }
    }; 

    var vmAtendimentoItem = function (atendimentoItem) {
        var self = this;

        self.atendimentoItemId = ko.observable();       
        self.valor = ko.observable(); 
        self.servicoId = ko.observable();
        self.servicoNome = ko.observable();      

        if (atendimentoItem) {
            self.atendimentoItemId(atendimentoItem.atendimentoId);         
            self.valor(atendimentoItem.valorFormatado);
            self.servicoId(atendimentoItem.servicoId);
            self.servicoNome(atendimentoItem.servicoNome);
        }
    };

    return { 
        vmEstabelecimento,
        vmServico,
        vmCliente,
        vmAtendimento,
        vmAtendimentoItem
    };
}();