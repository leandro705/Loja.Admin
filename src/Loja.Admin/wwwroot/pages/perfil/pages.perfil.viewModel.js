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
            pages.dataServices.bloquearTela();
            service.obterUsuarioPorId(userId).then(async function (result) {
                let usuario = new model.vmUsuario(result.data);
                                
                if (result.data.endereco?.estadoId)
                    await self.obterMunicipiosPorEstadoId(result.data.endereco.estadoId);
                                
                self.dadosUsuario(usuario);
                usuario.endereco().estadoId.subscribe(function (estadoId) {
                    if (!estadoId) return;

                    self.obterMunicipiosPorEstadoId(estadoId);
                });
                pages.utils.initDataPassword();
                
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterEstados = function () {
            pages.dataServices.bloquearTela();
            service.obterEstados().then(function (result) {
                result.data.forEach(function (item) {
                    self.estados.push(new model.vmEstado(item));
                });
            }).catch(function (result) {
                console.log(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterMunicipiosPorEstadoId = function (estadoId) {
            return new Promise(function (sucesso, falha) {
                self.municipios([]);  
                pages.dataServices.bloquearTela();
                service.obterMunicipioPorEstadoId(estadoId).then(function (result) {
                    result.data.forEach(function (item) {
                        self.municipios.push(new model.vmMunicipio(item));
                    });
                    sucesso();
                }).catch(function (result) {
                    console.log(result.data);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.validarAtualizacao = function () {
            var mensagens = [];

            if (isNullOrEmptyOrWriteSpace(self.dadosUsuario().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.dadosUsuario().email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");

            if (isNullOrEmpty(self.dadosUsuario().celular()))
                mensagens.push("<strong>Celular</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.dadosUsuario().endereco().logradouro()))
                mensagens.push("<strong>Logradouro</strong> é obrigatório!");

            if (isNullOrEmpty(self.dadosUsuario().endereco().numero()))
                mensagens.push("<strong>Número</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.dadosUsuario().endereco().cep()))
                mensagens.push("<strong>CEP</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.dadosUsuario().endereco().bairro()))
                mensagens.push("<strong>Bairro</strong> é obrigatório!");

            if (isNullOrEmpty(self.dadosUsuario().endereco().estadoId()))
                mensagens.push("<strong>Estado</strong> é obrigatório!");

            if (isNullOrEmpty(self.dadosUsuario().endereco().municipioId()))
                mensagens.push("<strong>Município</strong> é obrigatório!");

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

            pages.dataServices.bloquearTela();
            service.atualizarUsuario(self.dadosUsuario().id(), parametro).then(function () {
                bootbox.alert("Usuário atualizado com sucesso!");                   
                pages.menu.viewModel.atualizarNome(self.dadosUsuario().nome());
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.validarAtualizacaoSenha = function () {
            var mensagens = [];

            var dadosAlterarSenha = self.dadosUsuario().alterarSenha();

            if (isNullOrEmptyOrWriteSpace(dadosAlterarSenha.senhaAtual()))
                mensagens.push("<strong>Senha Atual</strong> é obrigatório!");
            if (isNullOrEmptyOrWriteSpace(dadosAlterarSenha.novaSenha()))
                mensagens.push("<strong>Nova Senha</strong> é obrigatório!");
            if (isNullOrEmptyOrWriteSpace(dadosAlterarSenha.confirmarSenha()))
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

            pages.dataServices.bloquearTela();
            service.atualizarSenhaUsuario(self.dadosUsuario().id(), parametro).then(function (result) {
                if (result.data) {
                    bootbox.alert("Senha alterada com sucesso!", function () {
                        location.reload();
                    });
                }
                else {
                    bootbox.alert("Senha atual incorreta!");
                }
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        }; 

        self.init();

    }, bindingBody);
}();