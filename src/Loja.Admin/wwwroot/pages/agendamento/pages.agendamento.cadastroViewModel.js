var pages = pages || {};
pages.agendamento = pages.agendamento || {};
pages.agendamento.model = pages.agendamento.model || {};
pages.agendamento.services = pages.agendamento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.agendamento.cadastroViewModel = function () {   
    var model = pages.agendamento.model;
    var service = pages.agendamento.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.agendamento = ko.observable(new model.vmAgendamento());  
        self.estabelecimentos = ko.observableArray([]);
        self.servicos = ko.observableArray([]);
        self.clientes = ko.observableArray([]);
        self.horariosDisponiveis = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);  
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {
            if (self.usuarioLogado().isAdministrador()) {
                self.obterTodosEstabelecimentos();
                self.agendamento().estabelecimentoId.subscribe(function (estabelecimentoId) {                    
                    if (!estabelecimentoId) return;

                    self.servicos([]);
                    self.clientes([]);

                    self.obterTodosServicosPorEstabelecimentoId(estabelecimentoId);
                    self.obterTodosClientesPorEstabelecimentoId(estabelecimentoId);
                });
            }
            else {
                self.obterTodosServicosPorEstabelecimentoId(self.usuarioLogado().estabelecimentoId());
                self.obterTodosClientesPorEstabelecimentoId(self.usuarioLogado().estabelecimentoId());
            }

            ko.computed(function () {

                self.agendamento().horaInicial('');
                self.agendamento().horaFinal('');

                if ((!self.agendamento().estabelecimentoId() && !self.usuarioLogado().estabelecimentoId()) || !self.agendamento().dataAgendamentoStr() || !self.agendamento().servicoId()) return;
                
                let estabelecimentoId = self.agendamento().estabelecimentoId() || self.usuarioLogado().estabelecimentoId();
                self.obterHorariosDisponiveis(self.agendamento().dataAgendamentoStr(), estabelecimentoId, self.agendamento().servicoId());
                
            });

            self.agendamento().horaInicial.subscribe(function (horaInicial) {
                if (!horaInicial) return;

                let horario = self.horariosDisponiveis().firstOrDefault(x => x.horarioInicial() === horaInicial);

                self.agendamento().horaFinal(horario.horarioFinal());
            });
        };

        self.obterTodosEstabelecimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodosEstabelecimentos().then(function (result) {
                result.forEach(function (item) {
                    self.estabelecimentos.push(new model.vmEstabelecimento(item));
                });
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTodosServicosPorEstabelecimentoId = function (estabelecimentoId) {
            pages.dataServices.bloquearTela();
            service.obterTodosServicosPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                result.forEach(function (item) {
                    self.servicos.push(new model.vmServico(item));
                });
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
            pages.dataServices.bloquearTela();
            service.obterTodosClientesPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                result.forEach(function (item) {
                    self.clientes.push(new model.vmCliente(item));
                });
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterHorariosDisponiveis = function (dataAgendamento, estabelecimentoId, servicoId) {
            pages.dataServices.bloquearTela();
            self.horariosDisponiveis([]);
            service.obterHorariosDisponiveis(dataAgendamento, estabelecimentoId, servicoId).then(function (result) {
                result.forEach(function (item) {
                    self.horariosDisponiveis.push(new model.vmHorarioDisponivel(item));
                });
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.validar = function () {
            var mensagens = [];

            if (isNullOrEmpty(self.agendamento().dataAgendamentoStr()))
                mensagens.push("<strong>Data Agendamento</strong> é obrigatório!");

            if (isNullOrEmpty(self.agendamento().horaInicial()))
                mensagens.push("<strong>Horário Inicial</strong> é obrigatório!");

            if (isNullOrEmpty(self.agendamento().horaFinal()))
                mensagens.push("<strong>Horário Final</strong> é obrigatório!");

            if (isNullOrEmpty(self.agendamento().servicoId()))
                mensagens.push("<strong>Serviço</strong> é obrigatório!");

            if (isNullOrEmpty(self.agendamento().userId()))
                mensagens.push("<strong>Cliente</strong> é obrigatório!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validar()) { return; }

            var parametro = {
                dataAgendamentoStr: self.agendamento().dataAgendamentoStr() + ' ' + self.agendamento().horaInicial(),
                dataFinalAgendamentoStr: self.agendamento().dataAgendamentoStr() + ' ' + self.agendamento().horaFinal(),                
                servicoId: self.agendamento().servicoId(),
                userId: self.agendamento().userId(),
                observacao: self.agendamento().observacao(),
                estabelecimentoId: self.usuarioLogado().isAdministrador() ? self.agendamento().estabelecimentoId() : self.usuarioLogado().estabelecimentoId()
            };
            console.log(parametro);
            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.salvar(parametro).then(function () {
                bootbox.alert("Agendamento salvo com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (mensagem) {
                console.log(mensagem);
                self.bloqueiaSalvar(false);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Agendamento/Index";
        };

        self.init();

    }, bindingBody);
}();