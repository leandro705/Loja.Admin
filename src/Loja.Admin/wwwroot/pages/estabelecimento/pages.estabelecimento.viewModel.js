﻿var pages = pages || {};
pages.estabelecimento = pages.estabelecimento || {};
pages.estabelecimento.model = pages.estabelecimento.model || {};
pages.estabelecimento.services = pages.estabelecimento.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.estabelecimento.viewModel = function () {   
    var model = pages.estabelecimento.model;
    var service = pages.estabelecimento.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.estabelecimentos = ko.observableArray([]);
        self.datatable = ko.observable();

        self.init = function () {            
            self.obterEstabelecimentos();            
        };

        self.obterEstabelecimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodos().then(function (result) {
                result.forEach(function (item) {
                    self.estabelecimentos.push(new model.vmEstabelecimento(item));
                });                
            }).catch(function (mensagem) {
                console.log(mensagem);
            }).finally(function () {
                self.inicializarDatatable();
                pages.dataServices.desbloquearTela();
            });
        };
      
        self.inicializarDatatable = function () {
            var table = $('#datatable-estabelecimento').DataTable({
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
                    targets: [6],
                    orderable: false,
                    searchable: false,
                    className: "text-center"
                }],
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: 'Listagem Estabelecimentos'
                    },
                ],
                language: pages.utils.languageDataTablePtBr               
            });

            table.buttons().container().appendTo('#datatable-estabelecimento_wrapper .col-md-6:eq(0)');            
            self.datatable(table);
        }; 

        self.editar = function (item) {
            pages.dataServices.bloquearTela();
            window.location.href = "/Estabelecimento/Edicao/" + item.estabelecimentoId();
        };

        self.excluir = function (item) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do estabelecimento <strong>" + item.nome() + "</strong>!",               
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
                            service.deletar(item.estabelecimentoId()).then(function () {
                                bootbox.alert("Estabelecimento excluído com sucesso!", function () {  
                                    var rowIdx = self.datatable().column(0).data().indexOf(item.estabelecimentoId().toString());
                                    self.datatable().row(rowIdx).remove().draw(false);
                                    self.estabelecimentos.remove(item);                                                                        
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