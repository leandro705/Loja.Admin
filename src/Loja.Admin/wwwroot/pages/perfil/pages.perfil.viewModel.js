var pages = pages || {};
pages.perfil = pages.perfil || {};
pages.perfil.model = pages.perfil.model || {};
pages.perfil.services = pages.perfil.services || {};

pages.menu = pages.menu || {};
pages.menu.viewModel = pages.menu.viewModel || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.perfil.viewModel = function () {   
    var model = pages.perfil.model;
    var service = pages.perfil.services;
    var id = window.location.href.split("/").lastOrDefault();

    ko.applyBindings(new function () {
        var self = this;       
        
        self.dadosUsuario = ko.observable();
        self.estados = ko.observableArray([]);
        self.municipios = ko.observableArray([]);

        self.init = function () {
            self.obterUsuarioPorId(id);
            self.obterEstados();            
        };

        self.obterUsuarioPorId = function (userId) {
            service.obterUsuarioPorId(userId).then(async function (result) {
                let usuario = new model.vmUsuario(result);
                                
                if (result.endereco.estadoId)
                    await self.obterMunicipiosPorEstadoId(result.endereco.estadoId);
                                
                self.dadosUsuario(usuario);
                usuario.endereco().estadoId.subscribe(function (estadoId) {
                    if (!estadoId) return;

                    self.obterMunicipiosPorEstadoId(estadoId);
                });
                pages.utils.initDataPassword();
                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        };

        self.obterEstados = function () {
            service.obterEstados().then(function (result) {
                result.forEach(function (item) {
                    self.estados.push(new model.vmEstado(item));
                });
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        };

        self.obterMunicipiosPorEstadoId = function (estadoId) {
            return new Promise(function (sucesso, falha) {
                self.municipios([]);            
                service.obterMunicipioPorEstadoId(estadoId).then(function (result) {
                    result.forEach(function (item) {
                        self.municipios.push(new model.vmMunicipio(item));
                    });
                    sucesso();
                }).catch(function (mensagem) {
                    bootbox.alert(mensagem);
                    falha();
                }).finally(function () {
                    
                });
            });
        };

        self.validarAtualizacao = function () {
            var mensagens = [];

            if (isNullEmptyOrWriteSpace(self.dadosUsuario().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validarAtualizacao()) { return; }

            var parametro = {
                id: self.dadosUsuario().id(),
                nome: self.dadosUsuario().nome(),
                telefone: self.dadosUsuario().telefone(),
                celular: self.dadosUsuario().celular(),
                endereco: {
                    logradouro: self.dadosUsuario().endereco().logradouro(),
                    numero: self.dadosUsuario().endereco().numero(),
                    cep: self.dadosUsuario().endereco().cep(),
                    bairro: self.dadosUsuario().endereco().bairro(),
                    complemento: self.dadosUsuario().endereco().complemento(),
                    municipioId: self.dadosUsuario().endereco().municipioId()
                }
            };

            service.atualizarUsuario(self.dadosUsuario().id(), parametro).then(function () {
                bootbox.alert("Usuario atualizado com sucesso!");                   
                //pages.menu.viewModel.atualizaNome(self.dadosUsuario().nome());
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        };

        self.validarAtualizacaoSenha = function () {
            var mensagens = [];

            var dadosAlterarSenha = self.dadosUsuario().alterarSenha();

            if (isNullEmptyOrWriteSpace(dadosAlterarSenha.senhaAtual()))
                mensagens.push("<strong>Senha Atual</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(dadosAlterarSenha.novaSenha()))
                mensagens.push("<strong>Nova Senha</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(dadosAlterarSenha.confirmarSenha()))
                mensagens.push("<strong>Confirmar Senha</strong> é obrigatório!");
            if (dadosAlterarSenha.novaSenha() !== dadosAlterarSenha.confirmarSenha())
                mensagens.push("<strong>Nova Senha</strong> e <strong>Confirmar Senha</strong> devem ser iguais!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.atualizarSenhaUsuario = function () {

            if (!self.validarAtualizacaoSenha()) { return; }

            var parametro = {
                id: self.dadosUsuario().id(),
                senha: self.dadosUsuario().alterarSenha().senhaAtual(),
                novaSenha: self.dadosUsuario().alterarSenha().novaSenha()                
            };

            service.atualizarSenhaUsuario(self.dadosUsuario().id(), parametro).then(function () {
                bootbox.alert("Senha alterada com sucesso!");                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        }; 

        self.init();

    }, bindingBody);
}();