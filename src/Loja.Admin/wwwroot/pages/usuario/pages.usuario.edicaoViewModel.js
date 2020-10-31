var pages = pages || {};
pages.usuario = pages.usuario || {};
pages.usuario.model = pages.usuario.model || {};
pages.usuario.services = pages.usuario.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.usuario.edicaoViewModel = function () {   
    var model = pages.usuario.model;
    var service = pages.usuario.services;
    var id = window.location.href.split("/").lastOrDefault();
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.usuario = ko.observable();
        self.estabelecimentos = ko.observableArray([]);
        self.estados = ko.observableArray([]);
        self.municipios = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);

        self.init = function () {            
            self.obterEstados(); 
            self.obterUsuarioPorId(id);                     
        };       

        self.obterEstados = function () {
            pages.dataServices.bloquearTela();
            service.obterEstados().then(function (result) {
                result.forEach(function (item) {
                    self.estados.push(new model.vmEstado(item));
                });
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.obterMunicipiosPorEstadoId = function (estadoId) {
            return new Promise(function (sucesso, falha) {
                self.municipios([]);
                pages.dataServices.bloquearTela();
                service.obterMunicipioPorEstadoId(estadoId).then(function (result) {
                    result.forEach(function (item) {
                        self.municipios.push(new model.vmMunicipio(item));
                    });
                    sucesso();
                }).catch(function (mensagem) {
                    bootbox.alert(mensagem);
                    falha();
                }).finally(function () {
                    pages.dataServices.desbloquearTela();
                });
            });
        };

        self.obterUsuarioPorId = function (usuarioId) {
            pages.dataServices.bloquearTela();
            service.obterPorId(usuarioId).then(async function (result) {
                let usuario = new model.vmUsuario(result);

                if (result.endereco?.estadoId)
                    await self.obterMunicipiosPorEstadoId(result.endereco.estadoId);

                self.usuario(usuario);
                usuario.endereco().estadoId.subscribe(function (estadoId) {
                    if (!estadoId) return;

                    self.obterMunicipiosPorEstadoId(estadoId);
                });
                pages.utils.initDataPassword();

            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.validar = function () {
            var mensagens = [];
                        
            if (isNullOrEmptyOrWriteSpace(self.usuario().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");           

            if (isNullOrEmpty(self.usuario().celular()))
                mensagens.push("<strong>Celular</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().endereco().logradouro()))
                mensagens.push("<strong>Logradouro</strong> é obrigatório!");

            if (isNullOrEmpty(self.usuario().endereco().numero()))
                mensagens.push("<strong>Número</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().endereco().cep()))
                mensagens.push("<strong>CEP</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().endereco().bairro()))
                mensagens.push("<strong>Bairro</strong> é obrigatório!");

            if (isNullOrEmpty(self.usuario().endereco().estadoId()))
                mensagens.push("<strong>Estado</strong> é obrigatório!");

            if (isNullOrEmpty(self.usuario().endereco().municipioId()))
                mensagens.push("<strong>Município</strong> é obrigatório!");      

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        };

        self.salvar = function () {

            if (!self.validar()) { return; }

            var parametro = {
                id: self.usuario().usuarioId(),
                nome: self.usuario().nome(),
                email: self.usuario().email(),                
                telefone: self.usuario().telefone(),
                celular: self.usuario().celular(),
                endereco: {
                    logradouro: self.usuario().endereco().logradouro(),
                    numero: self.usuario().endereco().numero(),
                    cep: self.usuario().endereco().cep(),
                    bairro: self.usuario().endereco().bairro(),
                    complemento: self.usuario().endereco().complemento(),
                    municipioId: self.usuario().endereco().municipioId()
                }
            };

            self.bloqueiaSalvar(true);
            pages.dataServices.bloquearTela();
            service.atualizar(id, parametro).then(function () {
                bootbox.alert("Usuário atualizado com sucesso!", function () {
                    self.voltar();
                });                
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
                self.bloqueiaSalvar(false);
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });
        };

        self.voltar = function () {
            pages.dataServices.bloquearTela();
            window.location.href = "/Usuario/Index";
        };

        self.init();

    }, bindingBody);
}();