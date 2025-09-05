

class Produto{
    static novoProduto(produto, token){
        return cy.request({
            method: 'POST',
            url: '/produtos',
            headers: { Authorization: token },
            body: produto,
            failOnStatusCode: false
        });
    }   

    static buscarProduto() {
        return cy.request({
            method: 'GET',
            url: '/produtos',
            failOnStatusCode: false
        });
    }

    static buscarProdutoPorNome(nome) {
        return cy.request({
            method: 'GET',
            url: `/produtos?nome=${nome}`,
            failOnStatusCode: false
        });
    }

}
export default Produto;