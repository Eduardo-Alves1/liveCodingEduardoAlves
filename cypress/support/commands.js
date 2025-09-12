// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************



// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Importar a classe AuthAPI
import AuthAPI from '../pages/Auth';

// -- Comando de login personalizado --
Cypress.Commands.add('login', (email, password) => {
    return AuthAPI.login({
        email: email,
        password: password
    }).then((response) => {
        // Verificar se o login foi bem-sucedido
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Login realizado com sucesso');
        
        // Retornar o token para uso posterior
        return cy.wrap(response.body.authorization);
    });
});

// -- Comando de login com retorno do token --
Cypress.Commands.add('loginAndGetToken', (email, password) => {
    return cy.login(email, password).then((token) => {
        // Armazenar o token no window para uso global
        window.localStorage.setItem('authToken', token);
        return cy.wrap(token);
    });
});

// -- Comando para obter token armazenado --
Cypress.Commands.add('getStoredToken', () => {
    return cy.wrap(window.localStorage.getItem('authToken'));
});

// -- Comando para limpar token armazenado --
Cypress.Commands.add('clearStoredToken', () => {
    window.localStorage.removeItem('authToken');
});