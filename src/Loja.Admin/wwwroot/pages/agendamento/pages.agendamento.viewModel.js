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
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.agendamentos = ko.observableArray([]);
        self.datatable = ko.observable();        

        self.init = function () {            
            self.obterAgendamentos();            
        };
        
        self.obterAgendamentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodos().then(function (result) {
                result.forEach(function (item) {
                    self.agendamentos.push(new model.vmAgendamento(item));
                });                
            }).catch(function (mensagem) {
                console.log(mensagem);
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

        self.editar = function (item) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Agendamento/Edicao/" + item.agendamentoId();
        };

        self.excluir = function (item) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do agendamento <strong>" + item.dataAgendamentoStr() + ' ' + item.horaInicial() + "</strong>!",               
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
                            service.deletar(item.agendamentoId()).then(function () {
                                bootbox.alert("Agendamento excluído com sucesso!", function () {  
                                    var rowIdx = self.datatable().column(0).data().indexOf(item.agendamentoId().toString());
                                    self.datatable().row(rowIdx).remove().draw(false);
                                    self.agendamentos.remove(item);                                                                        
                                });                                 
                            }).catch(function (mensagem) {
                                bootbox.alert(mensagem);
                            }).finally(function () {
                                pages.dataServices.desbloquearTela();
                            });                            
                        }
                    }                    
                }
            });            
        };       

        self.init();

    }, bindingBody);
}();