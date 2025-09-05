class AuthAPI {
  static login(credentials) {
    return cy.request({
      method: 'POST',
      url: '/login',
      body: credentials,
      failOnStatusCode: false
    });
  }
}

export default AuthAPI;