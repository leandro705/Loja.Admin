var pages = pages || {};
pages.servico = pages.servico || {};
pages.servico.model = pages.servico.model || {};
pages.servico.services = pages.servico.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.servico.viewModel = function () {   
    var model = pages.servico.model;
    var service = pages.servico.services;
    var viewModelSevico = new function () {
        var self = this;

        self.servicos = ko.observableArray([]);
        self.datatable = ko.observable();
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {
            self.obterServicos(self.usuarioLogado().isAdministrador() ? null : self.usuarioLogado().estabelecimentoId());
        };

        self.obterServicos = function (estabelecimentoId) {
            pages.dataServices.bloquearTela();
            service.obterTodos(estabelecimentoId).then(function (result) {
                result.data.forEach(function (item) {
                    self.servicos.push(new model.vmServico(item));
                });
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                self.inicializarDatatable();
                pages.dataServices.desbloquearTela();
            });
        };

        self.inicializarDatatable = function () {
            var table = $('#datatable-servico').DataTable({
                lengthChange: false,
                order: [[1, 'asc']],
                responsive: true,
                columnDefs: [
                    {
                        targets: [0],
                        orderable: false,
                        searchable: false,
                        visible: false
                    },
                    {
                        targets: [7],
                        orderable: false,
                        searchable: false,
                        className: "text-center"                       
                    }],
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: 'Listagem Serviços'
                    },
                ],
                language: pages.utils.languageDataTablePtBr
            });

            table.buttons().container().appendTo('#datatable-servico_wrapper .col-md-6:eq(0)');
            self.datatable(table);
        };

        self.editar = function (servicoId) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Servico/Edicao/" + servicoId;
        };

        self.ativar = function (servicoId) {
            pages.dataServices.bloquearTela();
            service.ativar(servicoId).then(function () {
                bootbox.alert("Serviço ativado com sucesso!", function () {
                    location.reload();
                });
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.desativar = function (servicoId) {
            pages.dataServices.bloquearTela();
            service.desativar(servicoId).then(function () {
                bootbox.alert("Serviço desativado com sucesso!", function () {
                    location.reload();
                });
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.excluir = function (servicoId) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do serviço?",
                buttons: {
                    nao: {
                        label: "NÃO",
                        className: "btn-sm btn-danger"
                    },
                    sim: {
                        label: "SIM",
                        className: "btn-sm btn-primary",
                        callback: function () {
                            pages.dataServices.bloquearTela();
                            service.deletar(servicoId).then(function () {
                                bootbox.alert("Serviço excluído com sucesso!", function () {
                                    location.reload();
                                });
                            }).catch(function (result) {
                                if (result.exibeMensagem)
                                    bootbox.alert(result.data);
                            }).finally(function () {
                                pages.dataServices.desbloquearTela();
                            });
                        }
                    }
                }
            });
        };      
        self.init();
    };

    ko.applyBindings(viewModelSevico, bindingBody);

    $('#datatable-servico tbody').on('click', '#btnDesativar', function (event) {
        var servicoId = event.currentTarget.value;
        viewModelSevico.desativar(servicoId);
    });

    $('#datatable-servico tbody').on('click', '#btnAtivar', function (event) {
        var servicoId = event.currentTarget.value;
        viewModelSevico.ativar(servicoId);
    });

    $('#datatable-servico tbody').on('click', '#btnEditar', function (event) {
        var servicoId = event.currentTarget.value;
        viewModelSevico.editar(servicoId);
    });  

    $('#datatable-servico tbody').on('click', '#btnExcluir', function (event) {
        var servicoId = event.currentTarget.value;
        viewModelSevico.excluir(servicoId);
    });    

}();