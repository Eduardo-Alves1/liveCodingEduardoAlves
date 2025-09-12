import { Usuario } from "../pages/UserAPI";

describe('Usuários e Login', () => {
    let token; // AQUI VAI FICAR O TOKEN DE AUTENTICAÇÃO
    
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
        // Usando o comando personalizado de login
        cy.login(email, 'Teste@1234').then((authToken) => {
            token = authToken;
            cy.log('Token obtido:', token);
        });
    });

    after(() => {
        // LIMPAR TOKEN ARMAZENADO
        cy.clearStoredToken();
        cy.log('Token limpo após testes de produto');
    });

});

// PESSOAL COLOQUEI DENTRO DE UM DESCRIBE PARA FICAR MAIS ORGANIZADO E SUCINTO