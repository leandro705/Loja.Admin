var pages = pages || {};
pages.agendamento = pages.agendamento || {};
pages.agendamento.model = pages.agendamento.model || {};
pages.agendamento.services = pages.agendamento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.agendamento.edicaoViewModel = function () {   
    var model = pages.agendamento.model;
    var service = pages.agendamento.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.agendamento = ko.observable();     
        self.estabelecimentos = ko.observableArray([]);
        self.servicos = ko.observableArray([]);
        self.clientes = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {                 
            self.obterAgendamentoPorId(id);            
        };

        self.obterAgendamentoPorId = function (agendamentoId) {
            pages.dataServices.bloquearTela();
            service.obterPorId(agendamentoId).then(async function (result) {

                let agendamento = new model.vmAgendamento(result)
                
                await self.obterTodosServicosPorEstabelecimentoId(result.estabelecimentoId)
                await self.obterTodosClientesPorEstabelecimentoId(result.estabelecimentoId)

                self.agendamento(agendamento);

                if (self.usuarioLogado().isAdministrador()) {
                    await self.obterTodosEstabelecimentos();
                    agendamento.estabelecimentoId.subscribe(function (estabelecimentoId) {
                        if (!estabelecimentoId) return;

                        self.servicos([]);
                        self.clientes([]);

                        self.obterTodosServicosPorEstabelecimentoId(estabelecimentoId);
                        self.obterTodosClientesPorEstabelecimentoId(estabelecimentoId);
                    });
                }               
                
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTodosEstabelecimentos = function () {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterTodosEstabelecimentos().then(function (result) {
                    result.forEach(function (item) {
                        self.estabelecimentos.push(new model.vmEstabelecimento(item));
                    });
                    sucesso();
                }).catch(function (mensagem) {
                    console.log(mensagem);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTodosServicosPorEstabelecimentoId = function (estabelecimentoId) {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterTodosServicosPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                    result.forEach(function (item) {
                        self.servicos.push(new model.vmServico(item));
                    });
                    sucesso();
                }).catch(function (mensagem) {
                    console.log(mensagem);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterTodosClientesPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                    result.forEach(function (item) {
                        self.clientes.push(new model.vmCliente(item));
                    });
                    sucesso();
                }).catch(function (mensagem) {
                    console.log(mensagem);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
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
                agendamentoId: self.agendamento().agendamentoId(),
                dataAgendamentoStr: self.agendamento().dataAgendamentoStr() + ' ' + self.agendamento().horaInicial(),
                dataFinalAgendamentoStr: self.agendamento().dataAgendamentoStr() + ' ' + self.agendamento().horaFinal(),
                servicoId: self.agendamento().servicoId(),
                userId: self.agendamento().userId(),
                observacao: self.agendamento().observacao(),
                estabelecimentoId: self.usuarioLogado().isAdministrador() ? self.agendamento().estabelecimentoId() : self.usuarioLogado().estabelecimentoId()
            };

            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.atualizar(id, parametro).then(function () {
                bootbox.alert("Agendamento atualizado com sucesso!", function () {
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