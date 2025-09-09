class AuthAPI {
  static login(credentials) {
    return cy.api({
      method: 'POST',
      url: '/login',
      body: credentials,
      failOnStatusCode: false
    });
  }
}

export default AuthAPI;