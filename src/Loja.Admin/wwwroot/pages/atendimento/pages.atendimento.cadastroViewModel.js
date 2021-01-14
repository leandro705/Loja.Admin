var pages = pages || {};
pages.atendimento = pages.atendimento || {};
pages.atendimento.model = pages.atendimento.model || {};
pages.atendimento.services = pages.atendimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.atendimento.cadastroViewModel = function () {   
    var model = pages.atendimento.model;
    var service = pages.atendimento.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.atendimento = ko.observable(new model.vmAtendimento()); 
        self.servicoId = ko.observable();
        self.valor = ko.observable();
        self.estabelecimentos = ko.observableArray([]);
        self.servicos = ko.observableArray([]);
        self.clientes = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));
        var agendamentoId = pages.utils.getUrlParameter('agendamentoId');

        self.init = function () {

            self.servicoId.subscribe(function (servicoId) {
                if (!servicoId) return;

                let servico = self.servicos().firstOrDefault(x => x.servicoId() === servicoId);
                self.valor(servico.valor());
            });

            if (agendamentoId) {
                self.obterAgendamentoPorId(agendamentoId);
            }
            else {                
                if (self.usuarioLogado().isAdministrador()) {
                    self.obterTodosEstabelecimentos();
                    self.atendimento().estabelecimentoId.subscribe(function (estabelecimentoId) {
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
            }               
        };

        self.obterAgendamentoPorId = function (agendamentoId) {
            pages.dataServices.bloquearTela();
            service.obterAgendamentoPorId(agendamentoId).then(async function (result) {
                if (self.usuarioLogado().isAdministrador())
                    await self.obterTodosEstabelecimentos();                

                await self.obterTodosServicosPorEstabelecimentoId(result.data.estabelecimentoId)
                await self.obterTodosClientesPorEstabelecimentoId(result.data.estabelecimentoId)

                self.atendimento().preencherAgendamento(result.data);               

            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTodosEstabelecimentos = function () {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterTodosEstabelecimentos().then(function (result) {
                    result.data.forEach(function (item) {
                        self.estabelecimentos.push(new model.vmEstabelecimento(item));
                    });
                    sucesso();
                }).catch(function (result) {                    
                    falha(result);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTodosServicosPorEstabelecimentoId = function (estabelecimentoId) {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterTodosServicosPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                    result.data.forEach(function (item) {
                        self.servicos.push(new model.vmServico(item));
                    });
                    sucesso();
                }).catch(function (result) {                    
                    falha(result);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterTodosClientesPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                    result.data.forEach(function (item) {
                        self.clientes.push(new model.vmCliente(item));
                    });
                    sucesso();
                }).catch(function (result) {                    
                    falha(result);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        }; 

        self.adicionar = function () {
            if (!self.validarAdicionar()) { return; }

            let servico = self.servicos().firstOrDefault(x => x.servicoId() === self.servicoId());

            self.atendimento().atendimentoItens.push(new model.vmAtendimentoItem({
                servicoId: servico.servicoId(),
                servicoNome: servico.nome(),
                valorFormatado: self.valor()
            }));

            self.limparItem();
        };

        self.remover = function (item) {
            self.atendimento().atendimentoItens.remove(item);    
        };

        self.limparItem = function () {
            self.servicoId(null);
            self.valor(null);
        };

        self.validarAdicionar = function () {
            var mensagens = [];

            if (isNullOrEmpty(self.servicoId()))
                mensagens.push("<strong>Serviço</strong> é obrigatório!");

            if (isNullOrEmpty(self.valor()))
                mensagens.push("<strong>Valor</strong> é obrigatório!");  

            let servico = self.atendimento().atendimentoItens().firstOrDefault(x => x.servicoId() === self.servicoId());

            if (servico)
                mensagens.push("<strong>Serviço</strong> já foi adicionado!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.validar = function () {
            var mensagens = [];

            if (isNullOrEmpty(self.atendimento().dataAtendimento()))
                mensagens.push("<strong>Data Atendimento</strong> é obrigatório!");

            if (isNullOrEmpty(self.atendimento().valor()))
                mensagens.push("<strong>Valor</strong> é obrigatório!");  

            if (isNullOrEmpty(self.atendimento().userId()))
                mensagens.push("<strong>Cliente</strong> é obrigatório!");

            if (isNullOrEmpty(self.atendimento().atendimentoItens().any()))
                mensagens.push("Nenhum <strong>Serviço</strong> selecionado!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validar()) { return; }

            var parametro = {
                dataAtendimento: self.atendimento().dataAtendimento(),
                observacao: self.atendimento().observacao(),
                valor: parseFloatVirgula(self.atendimento().valor()),
                desconto: parseFloatVirgula(self.atendimento().desconto()),
                valorTotal: parseFloatVirgula(self.atendimento().valorTotal()),
                userId: self.usuarioLogado().isAdministrador() ? self.atendimento().userId() : self.usuarioLogado().id(),
                estabelecimentoId: self.usuarioLogado().isAdministrador() ? self.atendimento().estabelecimentoId() : self.usuarioLogado().estabelecimentoId(),
                atendimentoItens: self.formataAtendimentoItens(),
                agendamentoId: self.atendimento().agendamentoId(),
            };

            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.salvar(parametro).then(function () {
                bootbox.alert("Atendimento salvo com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);

                self.bloqueiaSalvar(false);                       
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.formataAtendimentoItens = function () {
            var atendimentoItens = [];
            self.atendimento().atendimentoItens().forEach(function (item) {
                atendimentoItens.push({
                    atendimentoItemId: item.atendimentoItemId(),
                    valor: parseFloatVirgula(item.valor()),
                    servicoId: item.servicoId()
                });
            });

            return atendimentoItens;
        };                
        
        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Atendimento/Index";
        };

        self.init();

    }, bindingBody);
}();