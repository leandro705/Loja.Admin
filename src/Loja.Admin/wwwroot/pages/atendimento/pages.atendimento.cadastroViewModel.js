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

        self.init = function () {
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

            self.servicoId.subscribe(function (servicoId) {
                if (!servicoId) return;

                let servico = self.servicos().firstOrDefault(x => x.servicoId() === servicoId);
                self.valor(servico.valor());
            });
        };

        self.obterTodosEstabelecimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodosEstabelecimentos().then(function (result) {
                result.forEach(function (item) {
                    self.estabelecimentos.push(new model.vmEstabelecimento(item));
                });
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
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
                atendimentoItens: self.formataAtendimentoItens()
            };

            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.salvar(parametro).then(function () {
                bootbox.alert("Atendimento salvo com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
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