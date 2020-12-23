﻿var pages = pages || {};
pages.usuario = pages.usuario || {};
pages.usuario.model = pages.usuario.model || {};
pages.usuario.services = pages.usuario.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.usuario.viewModel = function () {   
    var model = pages.usuario.model;
    var service = pages.usuario.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.usuarios = ko.observableArray([]);
        self.datatable = ko.observable();        

        self.init = function () {            
            self.obterUsuarios();            
        };
        
        self.obterUsuarios = function () {
            pages.dataServices.bloquearTela();
            service.obterTodos().then(function (result) {
                result.data.forEach(function (item) {
                    self.usuarios.push(new model.vmUsuario(item));
                });                
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                self.inicializarDatatable();
                pages.dataServices.desbloquearTela();
            });
        };
      
        self.inicializarDatatable = function () {
            var table = $('#datatable-usuario').DataTable({
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
                    targets: [5],
                    orderable: false,
                    searchable: false,
                    className: "text-center"
                }],
                buttons: [
                    {
                        extend: 'pdfHtml5',
                        title: 'Listagem Usuários'
                    },
                ],
                language: pages.utils.languageDataTablePtBr               
            });

            table.buttons().container().appendTo('#datatable-usuario_wrapper .col-md-6:eq(0)');            
            self.datatable(table);
        }; 

        self.editar = function (item) {
            pages.dataServices.bloquearTela()
            window.location.href = "/Usuario/Edicao/" + item.usuarioId();
        };

        self.excluir = function (item) {
            bootbox.dialog({
                closeButton: false,
                message: "Confirma a exclusão do usuário <strong>" + item.nome() + "</strong>!",               
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
                            service.deletar(item.usuarioId()).then(function () {
                                bootbox.alert("Usuário excluído com sucesso!", function () {  
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

    }, bindingBody);
}();