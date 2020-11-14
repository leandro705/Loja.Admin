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
   
    ko.applyBindings(new function () {
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
                result.forEach(function (item) {
                    self.servicos.push(new model.vmServico(item));
                });                
            }).catch(function (mensagem) {
                console.log(mensagem);
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

        self.editar = function (item) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Servico/Edicao/" + item.servicoId();
        };

        self.excluir = function (item) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do serviço <strong>" + item.nome() + "</strong>!",               
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
                            service.deletar(item.servicoId()).then(function () {
                                bootbox.alert("Serviço excluído com sucesso!", function () {  
                                    location.reload();                                                        
                                });                                 
                            }).catch(function (mensagem) {
                                console.log(mensagem);
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