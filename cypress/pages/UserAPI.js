class Usuario {
  static registrarUsuario(dadosUsuario) {
    return cy.request({
      method: 'POST',
      url: '/usuarios',
      body: dadosUsuario,
      failOnStatusCode: false,
    });
  }
}

export { Usuario };