var pages = pages || {};
pages.atendimento = pages.atendimento || {};
pages.atendimento.model = pages.atendimento.model || {};
pages.atendimento.services = pages.atendimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.atendimento.edicaoViewModel = function () {   
    var model = pages.atendimento.model;
    var service = pages.atendimento.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.atendimento = ko.observable();
        self.servicoId = ko.observable();
        self.valor = ko.observable();
        self.estabelecimentos = ko.observableArray([]);
        self.servicos = ko.observableArray([]);
        self.clientes = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {

            self.servicoId.subscribe(function (servicoId) {
                if (!servicoId) return;

                let servico = self.servicos().firstOrDefault(x => x.servicoId() === servicoId);
                self.valor(servico.valor());
            });

            self.obterAtendimentoPorId(id);
        };

        self.obterAtendimentoPorId = function (atendimentoId) {
            pages.dataServices.bloquearTela();
            service.obterPorId(atendimentoId).then(async function (result) {

                let atendimento = new model.vmAtendimento(result.data)

                await self.obterTodosServicosPorEstabelecimentoId(result.data.estabelecimentoId)
                await self.obterTodosClientesPorEstabelecimentoId(result.data.estabelecimentoId)

                self.atendimento(atendimento);

                if (self.usuarioLogado().isAdministrador()) {
                    await self.obterTodosEstabelecimentos();
                    atendimento.estabelecimentoId.subscribe(function (estabelecimentoId) {
                        if (!estabelecimentoId) return;

                        self.servicos([]);
                        self.clientes([]);

                        self.obterTodosServicosPorEstabelecimentoId(estabelecimentoId);
                        self.obterTodosClientesPorEstabelecimentoId(estabelecimentoId);
                    });
                }

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
                    console.log(result.data);
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
                    result.data.forEach(function (item) {
                        self.servicos.push(new model.vmServico(item));
                    });
                    sucesso();
                }).catch(function (result) {
                    console.log(result.data);
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
                    result.data.forEach(function (item) {
                        self.clientes.push(new model.vmCliente(item));
                    });
                    sucesso();
                }).catch(function (result) {
                    console.log(result.data);
                    falha();
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
                atendimentoId: self.atendimento().atendimentoId(),
                observacao: self.atendimento().observacao(),
                dataAtendimento: self.atendimento().dataAtendimento(),
                valor: parseFloatVirgula(self.atendimento().valor()),
                desconto: parseFloatVirgula(self.atendimento().desconto()),
                valorTotal: parseFloatVirgula(self.atendimento().valorTotal()),
                userId: self.usuarioLogado().isAdministrador() ? self.atendimento().userId() : self.usuarioLogado().id(),
                estabelecimentoId: self.usuarioLogado().isAdministrador() ? self.atendimento().estabelecimentoId() : self.usuarioLogado().estabelecimentoId(),
                atendimentoItens: self.formataAtendimentoItens()
            };

            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.atualizar(id, parametro).then(function () {
                bootbox.alert("Atendimento atualizado com sucesso!", function () {
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