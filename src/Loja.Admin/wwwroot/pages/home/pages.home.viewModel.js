﻿var pages = pages || {};
pages.home = pages.home || {};
pages.home.model = pages.home.model || {};
pages.home.services = pages.home.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.home.viewModel = function () {   
    var model = pages.home.model;
    var service = pages.home.services;
   
    ko.applyBindings(new function () {
        var self = this;       

        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));
        self.estabelecimentos = ko.observableArray([]);        
        self.clientes = ko.observableArray([]);
                
        self.estabelecimentoIdFiltro = ko.observable('');
        self.usuarioIdFiltro = ko.observable('');

        self.totalUsuarios = ko.observable();
        self.totalAgendamentos = ko.observable();
        self.totalAtendimentos = ko.observable();
        self.valorTotalFinalizados = ko.observable();
        self.valorTotalPendentes = ko.observable();
        self.exibeGrafico = ko.observable(true);

        if (isMobile())
            self.exibeGrafico(false);

        self.init = function () {                        
            
            if (self.usuarioLogado().isAdministrador()) {
                self.obterTodosEstabelecimentos();
                self.estabelecimentoIdFiltro.subscribe(async function (estabelecimentoId) {
                    if (!estabelecimentoId) return;

                    self.clientes([]);
                    self.usuarioIdFiltro('');
                    self.obterTodosClientesPorEstabelecimentoId(estabelecimentoId);
                    self.CarregarGraficos();
                });

                self.usuarioIdFiltro.subscribe(async function (usuarioId) {
                    if (!usuarioId) return;

                    self.CarregarGraficos();
                });
            }
            else {
                self.estabelecimentoIdFiltro(self.usuarioLogado().estabelecimentoId());
            }

            self.CarregarGraficos();
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
            pages.dataServices.bloquearTela();
            service.obterTodosClientesPorEstabelecimentoId(estabelecimentoId).then(function (result) {
                result.data.forEach(function (item) {
                    self.clientes.push(new model.vmCliente(item));
                });
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTotalUsuarios = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalUsuarios(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.totalUsuarios(result.data);
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTotalAgendamentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalAgendamentos(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.totalAgendamentos(result.data);
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTotalAtendimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalAtendimentos(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.totalAtendimentos(result.data);
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterValorTotalFinalizados = function () {
            pages.dataServices.bloquearTela();
            service.obterValorTotal(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro(), service.ESituacao.FINALIZADO).then(function (result) {
                self.valorTotalFinalizados(result.data);
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterValorTotalPendente = function () {
            pages.dataServices.bloquearTela();
            service.obterValorTotal(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro(), service.ESituacao.PENDENTE).then(function (result) {
                self.valorTotalPendentes(result.data);
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.popularGraficoAtendimentosPorMes = function (atendimentosPendentes, atendimentosFinalizados, atendimentosCancelados) {
           
            var ctx = document.getElementById('line-chart-atendimentosPorMes').getContext('2d');

            var labels = [];
            var dataValesPendentes = [];
            var dataValesFinalizados = [];
            var dataValesCancelados = [];

            atendimentosPendentes.forEach(function (item) {
                labels.push(item.mes + '-' + item.ano);
                dataValesPendentes.push(item.total);
            }); 

            atendimentosFinalizados.forEach(function (item) {               
                dataValesFinalizados.push(item.total);
            }); 

            atendimentosCancelados.forEach(function (item) {                
                dataValesCancelados.push(item.total);
            }); 

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: ' Pendentes',
                        data: dataValesPendentes,
                        backgroundColor: pages.utils.hexToRGB("#3bafda", 0.3),
                        borderColor: "#3bafda"
                    },
                    {
                        label: ' Finalizados',
                        data: dataValesFinalizados,
                        backgroundColor: pages.utils.hexToRGB("#1abc9c", 0.3),
                        borderColor: "#1abc9c"
                    },
                    {
                        label: ' Cancelados',
                        data: dataValesCancelados,
                        backgroundColor: pages.utils.hexToRGB("#f1556c", 0.3),
                        borderColor: "#f1556c"
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    responsive: true,
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {  
                                
                                var atendimentos = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                var label = data.datasets[tooltipItem.datasetIndex].label;
                                return 'Atendimentos' + label + ': ' + atendimentos;
                            }
                        }
                    }
                }
            });
        };

        self.obterTotalAtendimentosMesPorSituacao = function (situacaoId) {
            return new Promise(function (sucesso, falha) {
                let estabelecimentoId = self.estabelecimentoIdFiltro() ?? "";
                let usuarioId = self.usuarioIdFiltro() ?? "";

                pages.dataServices.bloquearTela();
                service.obterTotalAtendimentosMes(estabelecimentoId, usuarioId, situacaoId).then(function (result) {
                    sucesso(result.data);
                }).catch(function (result) {
                    console.log(result.data);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterTotalAtendimentosMes = async function () {
            let atendimentosPendentes = await self.obterTotalAtendimentosMesPorSituacao(service.ESituacao.PENDENTE);
            let atendimentosFinalizados = await self.obterTotalAtendimentosMesPorSituacao(service.ESituacao.FINALIZADO);
            let atendimentosCancelados = await self.obterTotalAtendimentosMesPorSituacao(service.ESituacao.CANCELADO);

            if (self.exibeGrafico())
                self.popularGraficoAtendimentosPorMes(atendimentosPendentes, atendimentosFinalizados, atendimentosCancelados);
        };

        self.CarregarGraficos = function () {
            self.obterTotalUsuarios();
            self.obterTotalAgendamentos();
            self.obterTotalAtendimentos();
            self.obterValorTotalFinalizados();
            self.obterValorTotalPendente();
            self.obterTotalAtendimentosMes();
        }
        
        self.init();

    }, bindingBody);
}();