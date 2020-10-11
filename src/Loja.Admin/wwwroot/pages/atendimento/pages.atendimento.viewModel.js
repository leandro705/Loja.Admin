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
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.atendimentos = ko.observableArray([]);
        self.datatable = ko.observable();        

        self.init = function () {            
            self.obterAtendimentos();            
        };
        
        self.obterAtendimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodos().then(function (result) {
                result.forEach(function (item) {
                    self.atendimentos.push(new model.vmAtendimento(item));
                });                
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                self.inicializarDatatable();
                pages.dataServices.desbloquearTela();
            });
        };
      
        self.inicializarDatatable = function () {
            var table = $('#datatable-atendimento').DataTable({
                lengthChange: false,
                order: [[1, 'asc']],
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

        self.editar = function (item) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Atendimento/Edicao/" + item.atendimentoId();
        };

        self.excluir = function (item) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do atendimento <strong>" + item.atendimentoId() + "</strong>!",               
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
                            service.deletar(item.atendimentoId()).then(function () {
                                bootbox.alert("Atendimento excluído com sucesso!", function () {  
                                    var rowIdx = self.datatable().column(0).data().indexOf(item.atendimentoId().toString());
                                    self.datatable().row(rowIdx).remove().draw(false);
                                    self.atendimentos.remove(item);                                                                        
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