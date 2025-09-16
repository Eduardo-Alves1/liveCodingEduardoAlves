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


// -- Comando de login com Cypress Session --
Cypress.Commands.add('login', (email, password) => {
    // Usar session para cachear a autenticação
    cy.session([email, password], () => {
        // Fazer login via API
        return AuthAPI.login({
            email: email,
            password: password
        }).then((response) => {
            // Verificar se o login foi bem-sucedido
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Login realizado com sucesso');
            
            // Armazenar o token na session
            const token = response.body.authorization;
            
            // Armazenar dados da sessão
            cy.window().then((win) => {
                win.sessionStorage.setItem('authToken', token);
                win.sessionStorage.setItem('userEmail', email);
            });
        });
    }, {
        validate: () => {
            // Validar se a sessão ainda é válida
            cy.window().then((win) => {
                const token = win.sessionStorage.getItem('authToken');
                expect(token).to.exist;
                expect(token).to.not.be.empty;
            });
        }
    });
    
    // Garantir que o token está disponível após a sessão
    cy.window().then((win) => {
        const token = win.sessionStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token não foi armazenado na sessão');
        }
    });
});

// -- Comando para obter token da sessão --
Cypress.Commands.add('getSessionToken', () => {
    return cy.window().then((win) => {
        const token = win.sessionStorage.getItem('authToken');
        if (!token) {
            throw new Error('Token não encontrado na sessão. Faça login primeiro.');
        }
        return cy.wrap(token);
    });
});

// -- Comando para obter email da sessão --
Cypress.Commands.add('getSessionEmail', () => {
    return cy.window().then((win) => {
        const email = win.sessionStorage.getItem('userEmail');
        return cy.wrap(email);
    });
});

// -- Comando para limpar sessão --
Cypress.Commands.add('clearSession', () => {
    cy.window().then((win) => {
        win.sessionStorage.removeItem('authToken');
        win.sessionStorage.removeItem('userEmail');
    });
    cy.clearCookies();
    cy.clearLocalStorage();
});

// -- Comando de login com retorno do token (compatibilidade) --
Cypress.Commands.add('loginAndGetToken', (email, password) => {
    return cy.login(email, password).then(() => {
        return cy.getSessionToken();
    });
});

// -- Comando para obter token armazenado (compatibilidade) --
Cypress.Commands.add('getStoredToken', () => {
    return cy.getSessionToken();
});

// -- Comando para limpar token armazenado (compatibilidade) --
Cypress.Commands.add('clearStoredToken', () => {
    cy.clearSession();
});