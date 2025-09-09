class Usuario {
  static registrarUsuario(dadosUsuario) {
    return cy.api({
      method: 'POST',
      url: '/usuarios',
      body: dadosUsuario,
      failOnStatusCode: false,
    });
  }
}

export { Usuario };