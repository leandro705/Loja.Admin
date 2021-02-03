var pages = pages || {};
pages.atendimento = pages.atendimento || {};
pages.atendimento.model = pages.atendimento.model || {};
pages.atendimento.services = pages.atendimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.atendimento.viewModel = function () {   
    var model = pages.atendimento.model;
    var service = pages.atendimento.services;
   
    var viewModelAtendimento = new function () {
        var self = this;       
        
        self.atendimentos = ko.observableArray([]);
        self.datatable = ko.observable();    
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {            
            self.obterAtendimentos(self.usuarioLogado().isAdministrador() ? null : self.usuarioLogado().estabelecimentoId());            
        };
        
        self.obterAtendimentos = function (estabelecimentoId) {
            pages.dataServices.bloquearTela();
            service.obterTodos(estabelecimentoId).then(function (result) {
                result.data.forEach(function (item) {
                    self.atendimentos.push(new model.vmAtendimento(item));
                });                
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                self.inicializarDatatable();
                pages.dataServices.desbloquearTela();
            });
        };
      
        self.inicializarDatatable = function () {
            var table = $('#datatable-atendimento').DataTable({
                lengthChange: false,
                order: [[0, 'desc']],
                responsive: true,
                columnDefs: [                
                {
                    targets: [6],
                    orderable: false,
                    searchable: false,
                    className: "text-center"
                }],
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: 'Listagem Atendimentos'
                    },
                ],
                language: pages.utils.languageDataTablePtBr               
            });

            table.buttons().container().appendTo('#datatable-atendimento_wrapper .col-md-6:eq(0)');            
            self.datatable(table);
        }; 

        self.editar = function (atendimentoId) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Atendimento/Edicao/" + atendimentoId;
        };

        self.visualizar = function (atendimentoId) {
            pages.dataServices.bloquearTela();
            window.location.href = "/Atendimento/Visualizar/" + atendimentoId;
        };

        self.excluir = function (atendimentoId) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do atendimento?",               
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
                            service.deletar(atendimentoId).then(function () {
                                bootbox.alert("Atendimento excluído com sucesso!", function () {  
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

        self.finalizarAtendimento = function (atendimentoId) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a finalização do atendimento?",
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
                            service.finalizarAtendimento(atendimentoId).then(function () {
                                bootbox.alert("Atendimento finalizado com sucesso!", function () {
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

    ko.applyBindings(viewModelAtendimento, bindingBody);

    $('#datatable-atendimento tbody').on('click', '#btnVisualizar', function (event) {
        var atendimentoId = event.currentTarget.value;
        viewModelAtendimento.visualizar(atendimentoId);
    });

    $('#datatable-atendimento tbody').on('click', '#btnEditar', function (event) {
        var atendimentoId = event.currentTarget.value;
        viewModelAtendimento.editar(atendimentoId);
    });

    $('#datatable-atendimento tbody').on('click', '#btnFinalizarAtendimento', function (event) {
        var atendimentoId = event.currentTarget.value;
        viewModelAtendimento.finalizarAtendimento(atendimentoId);
    });

    $('#datatable-atendimento tbody').on('click', '#btnExcluir', function (event) {
        var atendimentoId = event.currentTarget.value;
        viewModelAtendimento.excluir(atendimentoId);
    });    
    
}();