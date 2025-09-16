import { Usuario } from "../pages/UserAPI";
import AuthAPI from "../pages/Auth";

describe('Usuários e Login', () => {
    let email = `eduardo_${Date.now()}@teste.com.br`; // GERAR EMAIL ALEATÓRIO

    it('CT00 - Cadastro de usuário para obter token de autenticação @usuario', () => {
        Usuario.registrarUsuario({
            nome: "Eduardo Alves Teste",
            email: email,
            password: "Teste@1234",
            administrador: "true"
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq('Cadastro realizado com sucesso');
        });
    });

    it('CT01 - Login para obter token de autenticação @login', () => {
        // USANDO O COMANDO PERSONALIZADO DE LOGIN COM CYPRESS SESSION
        cy.login(email, 'Teste@1234');

        // VERIFICAR SE O TOKEN FOI ARMAZENADO NA SESSÃO
        cy.getSessionToken().then((token) => {
            cy.log('Token obtido da sessão:', token);
            expect(token).to.not.be.undefined;
        });

        // VERIFICAR SE O EMAIL FOI ARMAZENADO NA SESSÃO
        cy.getSessionEmail().then((sessionEmail) => {
            cy.log('Email da sessão:', sessionEmail);
            expect(sessionEmail).to.eq(email);
        });
    });

    it('CT02 - Validar reutilização da sessão @login @session', () => {
        // REUTILIZAR A SESSÃO EXISTENTE (NÃO VAI FAZER NOVO LOGIN)
        cy.login(email, 'Teste@1234');

        // VERIFICAR SE A SESSÃO FOI REUTILIZADA
        cy.getSessionToken().then((token) => {
            cy.log('Token reutilizado da sessão:', token);
            expect(token).to.not.be.undefined;
        });
    });

    it('CT03 - Login com senha inválida @login @loginSenhaInvalida', () => {
        // Garantir que não há sessão ativa antes do teste negativo
        cy.clearSession();

        // Tentar logar com senha incorreta usando a API diretamente
        AuthAPI.login({
            email: email,
            password: 'Teste@SenhaErrada'
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq('Email e/ou senha inválidos');
        });

        // Validar que nenhum token foi armazenado
        cy.window().then((win) => {
            const token = win.sessionStorage.getItem('authToken');
            const sessionEmail = win.sessionStorage.getItem('userEmail');
            expect(token).to.be.null;
            expect(sessionEmail).to.be.null;
        });

    })

    // HOOK PARA EXECUTAR APÓS TODOS OS TESTES
    after(() => {
        // LIMPAR SESSÃO COMPLETA
        cy.clearSession();
        cy.log('Sessão limpa após testes de login');
    });

});

// PESSOAL COLOQUEI DENTRO DE UM DESCRIBE PARA FICAR MAIS ORGANIZADO E SUCINTO