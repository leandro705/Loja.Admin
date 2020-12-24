var pages = pages || {};
pages.agendamento = pages.agendamento || {};
pages.agendamento.model = pages.agendamento.model || {};
pages.agendamento.services = pages.agendamento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.agendamento.viewModel = function () {   
    var model = pages.agendamento.model;
    var service = pages.agendamento.services;
   
    var viewModelAgendamento = new function () {
        var self = this;       
        
        self.agendamentos = ko.observableArray([]);
        self.datatable = ko.observable();        
        self.usuarioLogado = ko.observable(new pages.menu.model.vmUsuarioLogado(getDataToken()));

        self.init = function () {           
            self.obterAgendamentos(self.usuarioLogado().isAdministrador() ? null : self.usuarioLogado().estabelecimentoId());                    
        };
        
        self.obterAgendamentos = function (estabelecimentoId) {
            pages.dataServices.bloquearTela();
            service.obterTodos(estabelecimentoId).then(function (result) {
                result.data.forEach(function (item) {
                    self.agendamentos.push(new model.vmAgendamentoListagem(item));
                });                
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                self.inicializarDatatable();
                pages.dataServices.desbloquearTela();
            });
        };
      
        self.inicializarDatatable = function () {
            var table = $('#datatable-agendamento').DataTable({
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
                        title: 'Listagem Agendamentos'
                    },
                ],
                language: pages.utils.languageDataTablePtBr               
            });

            table.buttons().container().appendTo('#datatable-agendamento_wrapper .col-md-6:eq(0)');            
            self.datatable(table);
        }; 

        self.editar = function (agendamentoId) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Agendamento/Edicao/" + agendamentoId;
        };

        self.iniciarAtendimento = function (agendamentoId) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Atendimento/Cadastro?agendamentoId=" + agendamentoId;
        };

        self.excluir = function (agendamentoId) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do agendamento?",               
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
                            service.deletar(agendamentoId).then(function () {
                                bootbox.alert("Agendamento excluído com sucesso!", function () {  
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

    ko.applyBindings(viewModelAgendamento, bindingBody);   

    $('#datatable-agendamento tbody').on('click', '#btnEditar', function (event) {
        var agendamentoId = event.currentTarget.value;
        viewModelAgendamento.editar(agendamentoId);
    });

    $('#datatable-agendamento tbody').on('click', '#btnIniciarAtendimento', function (event) {
        var agendamentoId = event.currentTarget.value;
        viewModelAgendamento.iniciarAtendimento(agendamentoId);
    });

    $('#datatable-agendamento tbody').on('click', '#btnExcluir', function (event) {
        var agendamentoId = event.currentTarget.value;
        viewModelAgendamento.excluir(agendamentoId);
    });    
}();