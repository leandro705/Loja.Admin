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

        self.estabelecimentos = ko.observableArray([]);        
        self.clientes = ko.observableArray([]);
                
        self.estabelecimentoIdFiltro = ko.observable('');
        self.usuarioIdFiltro = ko.observable('');

        self.totalUsuarios = ko.observable();
        self.totalAgendamentos = ko.observable();
        self.totalAtendimentos = ko.observable();
        self.valorTotal = ko.observable();        

        self.init = function () {            
            self.obterTodosEstabelecimentos(); 
            self.CarregarGraficos();

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

        self.obterTotalUsuarios = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalUsuarios(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.totalUsuarios(result);
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTotalAgendamentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalAgendamentos(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.totalAgendamentos(result);
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterTotalAtendimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalAtendimentos(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.totalAtendimentos(result);
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterValorTotal = function () {
            pages.dataServices.bloquearTela();
            service.obterValorTotal(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.valorTotal(result);
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.popularGraficoAtendimentosPorMes = function (dados) {
           
            var ctx = document.getElementById('line-chart-atendimentosFinalizados').getContext('2d');

            var labels = [];
            var dataVales = [];

            dados.forEach(function (item) {
                labels.push(item.mes + '-' + item.ano);
                dataVales.push(item.total);
            });           

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '# Atendimentos Finalizados por Mês',
                        data: dataVales
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
                                var indice = tooltipItem.index;
                                var atendimentos = data.datasets[0].data[indice];
                                return 'Atendimentos Finalizados: ' + atendimentos;
                            }
                        }
                    }
                }
            });
        };

        self.obterTotalAtendimentosMes = function () {
            pages.dataServices.bloquearTela();
            service.obterTotalAtendimentosMes(self.estabelecimentoIdFiltro(), self.usuarioIdFiltro()).then(function (result) {
                self.popularGraficoAtendimentosPorMes(result);
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.CarregarGraficos = function () {
            self.obterTotalUsuarios();
            self.obterTotalAgendamentos();
            self.obterTotalAtendimentos();
            self.obterValorTotal();
            self.obterTotalAtendimentosMes();
        }
        
        self.init();

    }, bindingBody);
}();