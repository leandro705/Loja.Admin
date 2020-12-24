var pages = pages || {};
pages.agendamento = pages.agendamento || {};
pages.agendamento.model = pages.agendamento.model || {};
pages.agendamento.services = pages.agendamento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.agendamento.calendarioViewModel = function () {   
    var model = pages.agendamento.model;
    var service = pages.agendamento.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.agendamentoVisualizar = ko.observable();
        self.agendamento = ko.observable(new model.vmAgendamento());
        self.estabelecimentos = ko.observableArray([]);
        self.servicos = ko.observableArray([]);
        self.servicosCadastro = ko.observableArray([]);        
        self.clientes = ko.observableArray([]);
        self.clientesCadastro = ko.observableArray([]);
        self.horariosDisponiveis = ko.observableArray([]);

        self.modalAgendamento = ko.observable(false);
        self.modalMensagem = ko.observable(false);
        self.modalVisualizar = ko.observable(false); 
        self.modalExcluir = ko.observable(false); 
        
        self.mensagem = ko.observable();
        self.estabelecimentoIdFiltro = ko.observable();
        self.usuarioIdFiltro = ko.observable();        
        self.calendario = ko.observable();      
        self.evento = ko.observable();
        self.bloqueiaSalvar = ko.observable(false);
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.exibeDropEstabelecimento = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR                    
                ))
                return true;

            return false;
        });

        self.exibeDropCliente = ko.computed(function () {
            if (self.usuarioLogado() &&
                (
                    self.usuarioLogado().perfil() === service.EPerfil.ADMINISTRADOR ||
                    self.usuarioLogado().perfil() === service.EPerfil.GERENTE
                ))
                return true;

            return false;
        });

        self.init = async function () {            
            if (self.usuarioLogado().isAdministrador() || self.usuarioLogado().isGerente()) {
                if (self.usuarioLogado().isAdministrador()) {
                    self.obterTodosEstabelecimentos();
                    self.estabelecimentoIdFiltro.subscribe(async function (estabelecimentoId) {
                        if (!estabelecimentoId) return;
                        self.servicos([]);
                        self.clientes([]);

                        let servicos = await self.obterTodosServicosPorEstabelecimentoId(estabelecimentoId);
                        let clientes = await self.obterTodosClientesPorEstabelecimentoId(estabelecimentoId);
                        self.servicos(servicos);
                        self.clientes(clientes);
                        self.inicializarCalendario();
                    });

                    self.agendamento().estabelecimentoId.subscribe(async function (estabelecimentoId) {
                        if (!estabelecimentoId) return;

                        self.servicos([]);
                        self.clientesCadastro([]);

                        let servicos = await self.obterTodosServicosPorEstabelecimentoId(estabelecimentoId);
                        let clientes = await self.obterTodosClientesPorEstabelecimentoId(estabelecimentoId);
                        self.servicosCadastro(servicos);
                        self.clientesCadastro(clientes);

                    });                    

                    self.usuarioIdFiltro.subscribe(function (usuarioId) {
                        if (!usuarioId) return;

                        let usuario = self.clientes().firstOrDefault(x => x.userId() === usuarioId);
                        self.agendamento().usuarioNome(usuario.nome());
                        self.inicializarCalendario();
                    });                    
                }

                self.agendamento().userId.subscribe(function (usuarioId) {
                    if (!usuarioId) return;

                    let usuario = self.clientesCadastro().firstOrDefault(x => x.userId() === usuarioId);
                    if (usuario)
                        self.agendamento().usuarioNome(usuario.nome());                    
                });
                if (self.usuarioLogado().isGerente()) {

                    let servicos = await self.obterTodosServicosPorEstabelecimentoId(self.usuarioLogado().estabelecimentoId());
                    let clientes = await self.obterTodosClientesPorEstabelecimentoId(self.usuarioLogado().estabelecimentoId());
                    self.servicos(servicos);
                    self.clientes(clientes);
                }
            }
            else {                
                let servicos = await self.obterTodosServicosPorEstabelecimentoId(self.usuarioLogado().estabelecimentoId());
                self.servicos(servicos);
                self.agendamento().usuarioNome(self.usuarioLogado().nome());
            }    

            self.agendamento().servicoId.subscribe(function (servicoId) {
                if (!servicoId) return;

                let servico = self.servicosCadastro().firstOrDefault(x => x.servicoId() === servicoId);
                if (servico)
                    self.agendamento().servicoNome(servico.nome());
            });

            self.agendamento().horaInicial.subscribe(function (horaInicial) {
                if (!horaInicial) return;

                let horario = self.horariosDisponiveis().firstOrDefault(x => x.horarioInicial() === horaInicial);

                self.agendamento().horaFinal(horario?.horarioFinal());
            });

            ko.computed(async function () {

                self.agendamento().horaInicial('');
                self.agendamento().horaFinal('');

                if (!self.agendamento().estabelecimentoId() || !self.agendamento().dataAgendamentoStr() || !self.agendamento().servicoId()) return;

                await self.obterHorariosDisponiveis(self.agendamento().dataAgendamentoStr(), self.agendamento().estabelecimentoId(), self.agendamento().servicoId());

            });

            self.inicializarCalendario();  
        };

        self.obterAgendamentoPorId = function (agendamentoId) {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                service.obterPorId(agendamentoId).then(function (result) {              
                    sucesso(result.data); 
                }).catch(function (result) {
                    console.log(result.data);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTodosEstabelecimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodosEstabelecimentos().then(function (result) {
                result.data.forEach(function (item) {
                    self.estabelecimentos.push(new model.vmEstabelecimento(item));
                });
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTodosClientesPorEstabelecimentoId = function (estabelecimentoId) {
            return new Promise(function (sucesso, falha) {
                var clientes = [];
                pages.dataServices.bloquearTela();
                service.obterTodosClientesPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                    result.data.forEach(function (item) {
                        clientes.push(new model.vmCliente(item));
                    });
                    sucesso(clientes);
                }).catch(function (result) {
                    console.log(result.data);
                    falha([]);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTodosServicosPorEstabelecimentoId = function (estabelecimentoId) {
            return new Promise(function (sucesso, falha) {
                var servicos = [];
                pages.dataServices.bloquearTela();
                service.obterTodosServicosPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                    result.data.forEach(function (item) {
                        servicos.push(new model.vmServico(item));
                    });
                    sucesso(servicos);
                }).catch(function (result) {
                    console.log(result.data);
                    falha([]);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterHorariosDisponiveis = function (dataAgendamento, estabelecimentoId, servicoId) {
            return new Promise(function (sucesso, falha) {
                pages.dataServices.bloquearTela();
                self.horariosDisponiveis([]);
                service.obterHorariosDisponiveis(dataAgendamento, estabelecimentoId, servicoId).then(function (result) {
                    result.data.forEach(function (item) {
                        self.horariosDisponiveis.push(new model.vmHorarioDisponivel(item));
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
      
        self.inicializarCalendario = function () {

            var initialView = 'dayGridMonth';
            var headerToolbar = {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            };

            if (isMobile()) {
                initialView = 'timeGridDay';
                headerToolbar = {
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridDay'
                };
            }
            
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                locale: 'pt-br',
                themeSystem: 'cerulean',
                bootstrapFontAwesome: false,
                allDaySlot: false,
                headerToolbar: headerToolbar,
                views: {
                    day: {
                        titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
                    },
                    week: {
                        titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
                    }
                },
                initialView: initialView,
                navLinks: false,
                businessHours: false,
                editable: false,
                selectable: false,
                events:
                    function (info, successCallback, failureCallback) {
                    var parametro = {
                        inicio: info.startStr,
                        final: info.endStr,
                        estabelecimentoId: self.usuarioLogado().isAdministrador() ? self.estabelecimentoIdFiltro() : self.usuarioLogado().estabelecimentoId(),
                        usuarioId: self.usuarioLogado().isAdministrador() ? self.usuarioIdFiltro() : self.usuarioLogado().isGerente() ? '' : self.usuarioLogado().id()
                    }
                    $.get(URL_API + '/api/agendamentos/calendario', parametro, function (result, status) {
                        if (status === "success" && result.data) {
                            successCallback(
                                result.data.map(function (agendamento) {
                                    var titulo = self.usuarioLogado().perfil() === service.EPerfil.CLIENTE && self.usuarioLogado().id() != agendamento.userId ? 'Reservado' : agendamento.usuarioNome;
                                    return {
                                        title: titulo,
                                        start: agendamento.dataAgendamento,
                                        end: agendamento.dataFinalAgendamento,
                                        agendamentoId: agendamento.agendamentoId
                                    };
                                })
                            )
                        }
                    });
                },
                dateClick: function (info) { self.abrirModalAgendamento(info); },
                eventClick: function (info) { self.abrirModalEdicao(info); }
            });

            calendar.render();
            self.calendario(calendar);
        }; 

        self.abrirModalAgendamento = function (info) {   
                        
            var dataAtual = new Date(new Date().toDateString());

            if (new Date(info.date) < dataAtual) {
                self.abrirModalMensagem("Selecione uma data e hora maior que atual!");
                return;
            } 
            self.bloqueiaSalvar(false);
            self.horariosDisponiveis([]);
            let dataAgendamento = pages.utils.format(info.date, 'dd/MM/yyyy');
            self.agendamento().dataAgendamentoStr(dataAgendamento);
            self.agendamento().dataAgendamentoDP(info.date);
            if (self.usuarioLogado().isAdministrador()) {
                self.agendamento().estabelecimentoId(self.estabelecimentoIdFiltro());
                self.agendamento().userId(self.usuarioIdFiltro());
            }                
            else {
                self.agendamento().estabelecimentoId(self.usuarioLogado().estabelecimentoId());
                self.agendamento().userId(self.usuarioLogado().id());
                self.agendamento().usuarioNome(self.usuarioLogado().nome());
            }                
                    
            self.servicosCadastro(self.servicos());
            self.clientesCadastro(self.clientes());          
            self.modalAgendamento(true);
            
        };

        self.abrirModalEdicao = async function (info) {

            self.evento(info.event);
            self.horariosDisponiveis([]);
            let agendamento = await self.obterAgendamentoPorId(info.event.extendedProps.agendamentoId);
            var dataAtual = new Date(new Date().toDateString());

            if (new Date(agendamento.dataAgendamento) < dataAtual) {
                self.agendamentoVisualizar(new model.vmAgendamento(agendamento));   
                self.abrirModalVisualizar();
                return;
            }

            await self.agendamento().iniciar(agendamento, self.adicionarHorarioDisponivel);
            
            self.modalAgendamento(true);
        };

        self.adicionarHorarioDisponivel = function (vmHorarioDisponivel) {
            self.horariosDisponiveis.push(vmHorarioDisponivel);
        };

        self.fecharModalAgendamento = function () {            
            self.modalAgendamento(false);
            self.bloqueiaSalvar(false);
            self.agendamento().limpar();
        };

        self.abrirModalVisualizar = function () {
            self.modalVisualizar(true);            
        };

        self.fecharModalVisualizar = function () {
            self.modalVisualizar(false);
        };

        self.abrirModalExcluir = function () {
            self.modalExcluir(true);
            self.mensagem("Confirma a exclusão do agendamento <strong>" + self.agendamento().dataAgendamentoStr() + ' ' + self.agendamento().horaInicial() + "</strong>!");
        };

        self.fecharModalExcluir = function () {
            self.modalExcluir(false);
        };

        self.abrirModalMensagem = function (mensagem) {
            self.modalMensagem(true);
            self.mensagem(mensagem);
        };

        self.fecharModalMensagem = function () {
            self.modalMensagem(false);
        };


        self.editar = function (item) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Agendamento/Edicao/" + item.agendamentoId();
        };

        self.iniciarAtendimento = function (agendamentoId) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Atendimento/Cadastro?agendamentoId=" + agendamentoId;
        };

        self.excluir = function () {
            pages.dataServices.bloquearTela();
            service.deletar(self.agendamento().agendamentoId()).then(function () {
                self.evento().remove();
                self.evento(null);
                self.fecharModalExcluir();
                self.fecharModalAgendamento();
                self.abrirModalMensagem("Agendamento excluído com sucesso!");
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);
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
                self.abrirModalMensagem(mensagens.join("</br>"));
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

            if (self.agendamento().agendamentoId()) {
                parametro.agendamentoId = self.agendamento().agendamentoId();

                self.bloqueiaSalvar(true);
                pages.dataServices.bloquearTela();
                service.atualizar(self.agendamento().agendamentoId(), parametro).then(function () {

                    self.evento().remove();
                    self.evento(null);

                    var eventData = {
                        title: self.agendamento().usuarioNome() + ' - ' + self.agendamento().servicoNome(),
                        start: pages.utils.format(self.agendamento().dataAgendamentoDP(), 'yyyy-MM-dd') + ' ' + self.agendamento().horaInicial(),
                        end: pages.utils.format(self.agendamento().dataAgendamentoDP(), 'yyyy-MM-dd') + ' ' + self.agendamento().horaFinal(),
                        agendamentoId: self.agendamento().agendamentoId()
                    };

                    self.calendario().addEvent(eventData);
                    self.fecharModalAgendamento();
                    self.abrirModalMensagem("Agendamento salvo com sucesso!");
                }).catch(function (result) {
                    if (result.exibeMensagem)
                        bootbox.alert(result.data);

                    self.bloqueiaSalvar(false);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            }
            else {
                self.bloqueiaSalvar(true);
                pages.dataServices.bloquearTela();
                service.salvar(parametro).then(function (agendamento) {

                    var eventData = {
                        title: self.agendamento().usuarioNome() + ' - ' + self.agendamento().servicoNome(),
                        start: agendamento.data.dataAgendamento,
                        end: agendamento.data.dataFinalAgendamento,
                        agendamentoId: agendamento.data.agendamentoId
                    };

                    self.calendario().addEvent(eventData);
                    self.fecharModalAgendamento();
                    self.abrirModalMensagem("Agendamento salvo com sucesso!");
                }).catch(function (result) {
                    if (result.exibeMensagem)
                        bootbox.alert(result.data);

                    self.bloqueiaSalvar(false);
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            }           
           
        };

        self.init();

    }, bindingBody);
}();