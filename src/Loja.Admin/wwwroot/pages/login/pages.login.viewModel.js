var pages = pages || {};
pages.login = pages.login || {};
pages.login.model = pages.login.model || {};
pages.login.services = pages.login.services || {};

pages.metadata = pages.metadata || {};
pages.dataServices = pages.dataServices || {};
pages.utils = pages.utils || {};

pages.login.viewModel = function () {
    var model = pages.login.model;
    var service = pages.login.services;

    ko.applyBindings(new function () {
        var self = this;

        pages.utils.initDataPassword();
        renderButton();
        self.ETelaLogin = service.ETelaLogin;
        self.telaAtual = ko.observable(service.ETelaLogin.LOGIN);
        self.nome = ko.observable();
        self.email = ko.observable();
        self.senha = ko.observable();
        self.confirmarSenha = ko.observable();

        self.limpar = function () {
            self.nome('');
            self.email('');
            self.senha('');
            self.confirmarSenha('');
        }

        self.alterarTela = function (telaAtual) {
            self.telaAtual(telaAtual);
            pages.utils.initDataPassword();
            fbAsyncInit();
            renderButton();
        }
        
        self.validarLogin = function () {
            var mensagens = [];

            if (isNullEmptyOrWriteSpace(self.email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(self.senha()))
                mensagens.push("<strong>Senha</strong> é obrigatório!");
           
            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        }

        self.login = function () {

            if (!self.validarLogin()) { return; }

            var parametro = {
                email: self.email(),
                senha: self.senha()             
            };

            service.login(parametro).then(function (result) {
                console.log(result)
                localStorage.setItem("token", JSON.stringify(result));
                window.location.href = "/Home/Index";
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {
                
            });
        };


        self.validarCadastro = function () {
            var mensagens = [];

            if (isNullEmptyOrWriteSpace(self.nome()))
                mensagens.push("<strong>Nome</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(self.email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(self.senha()))
                mensagens.push("<strong>Senha</strong> é obrigatório!");
            if (isNullEmptyOrWriteSpace(self.confirmarSenha()))
                mensagens.push("<strong>Confirmar Senha</strong> é obrigatório!");
            if (self.senha() !== self.confirmarSenha())
                mensagens.push("<strong>Senha</strong> e <strong>Confirmar Senha</strong> devem ser iguais!");

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        }

        self.salvar = function () {

            if (!self.validarCadastro()) { return; }

            var parametro = {
                nome: self.nome(),
                email: self.email(),
                senha: self.senha()
            };

            service.salvar(parametro).then(function () {
                bootbox.alert("Usuario cadastrado com sucesso!");
                self.limpar();
                self.alterarTela(service.ETelaLogin.LOGIN)
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        };

        self.validarRecuperarSenha = function () {
            var mensagens = [];
            
            if (isNullEmptyOrWriteSpace(self.email()))
                mensagens.push("<strong>E-mail</strong> é obrigatório!");            

            if (mensagens.any()) {
                bootbox.alert(mensagens.join("</br>"));
                return false;
            }
            return true;
        }

        self.recuperarSenha = function () {

            if (!self.validarRecuperarSenha()) { return; }

            var parametro = {               
                email: self.email()
            };

            service.recuperarSenha(parametro).then(function () {
                bootbox.alert("Enviado e-mail para cadastrar nova senha!");
                self.limpar();
                self.alterarTela(service.ETelaLogin.LOGIN)
            }).catch(function (mensagem) {
                bootbox.alert(mensagem);
            }).finally(function () {

            });
        };  

    }, bindingBody);
}();