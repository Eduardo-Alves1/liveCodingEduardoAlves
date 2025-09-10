

class Produto{
    static novoProduto(produto, token){
        return cy.api({
            method: 'POST',
            url: '/produtos',
            headers: { Authorization: token },
            body: produto,
            failOnStatusCode: false
        });
    }   

    static buscarProduto() {
        return cy.api({
            method: 'GET',
            url: '/produtos',
            failOnStatusCode: false
        });
    }

    static buscarProdutoPorNome(nome) {
        return cy.api({
            method: 'GET',
            url: `/produtos?nome=${nome}`,
            failOnStatusCode: false
        });
    }

    static deletarProduto(id, token) {
        return cy.api({
            method: 'DELETE',
            url: `/produtos/${id}`,
            headers: { Authorization: token },
            failOnStatusCode: false
        });
    }

    static criarCarrinho(token, carrinho) {
        return cy.api({
            method: 'POST',
            url: '/carrinhos',
            headers: { Authorization: token },
            body: carrinho,
            failOnStatusCode: false
        });
    }

    static listarCarrinho(token) {
        return cy.api({
            method: 'GET',
            url: '/carrinhos',
            headers: { Authorization: token },
            failOnStatusCode: false
        });
    }

}
export default Produto;