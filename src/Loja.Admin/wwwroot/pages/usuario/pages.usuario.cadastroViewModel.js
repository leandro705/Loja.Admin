var pages = pages || {};
pages.usuario = pages.usuario || {};
pages.usuario.model = pages.usuario.model || {};
pages.usuario.services = pages.usuario.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.usuario.cadastroViewModel = function () {   
    var model = pages.usuario.model;
    var service = pages.usuario.services;
   
    ko.applyBindings(new function () {
        var self = this;       
        
        self.usuario = ko.observable(new model.vmUsuario());  
        self.estabelecimentos = ko.observableArray([]);
        self.estados = ko.observableArray([]);
        self.municipios = ko.observableArray([]);
        self.bloqueiaSalvar = ko.observable(false);  

        self.init = function () {            
            self.obterTodosEstabelecimentos();  
            self.obterEstados();

            self.exibeEstabelecimento = ko.computed(function () {
                if (self.usuario().perfil() && self.usuario().perfil() !== 'Administrador')
                    return true;

                return false;
            });

            self.usuario().endereco().estadoId.subscribe(function (estadoId) {
                if (!estadoId) return;

                self.obterMunicipiosPorEstadoId(estadoId);
            });
        };

        self.obterTodosEstabelecimentos = function () {
            pages.dataServices.bloquearTela();
            service.obterTodosEstabelecimentos().then(function (result) {
                result.data.forEach(function (item) {
                    self.estabelecimentos.push(new model.vmEstabelecimento(item));
                });
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
            self.municipios([]);
            pages.dataServices.bloquearTela();
            service.obterMunicipioPorEstadoId(estadoId).then(function (result) {
                result.data.forEach(function (item) {
                    self.municipios.push(new model.vmMunicipio(item));
                });                   
            }).catch(function (result) {
                console.log(result.data);                   
            }).finally(function () {
                pages.dataServices.desbloquearTela();
            });           
        };

        self.validar = function () {
            var mensagens = [];

            if (isNullOrEmpty(self.usuario().estabelecimentoId()))
                mensagens.push("<strong>Estabelecimento</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().perfil()))
                mensagens.push("<strong>Perfil</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().senha()))
                mensagens.push("<strong>Senha</strong> é obrigatório!");

            if (isNullOrEmptyOrWriteSpace(self.usuario().confirmarSenha()))
                mensagens.push("<strong>Confirmar Senha</strong> é obrigatório!");

            if (self.usuario().senha() !== self.usuario().confirmarSenha())
                mensagens.push("<strong>Senha</strong> e <strong>Confirmar Senha</strong> devem ser iguais!");

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
                nome: self.usuario().nome(),
                email: self.usuario().email(),
                senha: self.usuario().senha(),
                role: self.usuario().perfil(),
                estabelecimentoId: self.usuario().estabelecimentoId(),
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

            pages.dataServices.bloquearTela();
            service.salvar(parametro).then(function () {                
                bootbox.alert("Usuário salvo com sucesso!", function () {
                    self.voltar();
                }); 
            }).catch(function (result) {
                if (result.exibeMensagem)
                    bootbox.alert(result.data);

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