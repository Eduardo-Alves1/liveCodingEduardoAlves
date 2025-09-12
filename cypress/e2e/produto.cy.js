import { Usuario } from "../pages/UserAPI";
import Produto from "../pages/produto";

describe('PATH /produtos - @produto @cadastro produto', () =>{
    let email = `usuarioProduto_${Date.now()}@teste.com.br`; // EMAIL ÚNICO PARA CADA EXECUÇÃO
    let produto = 'produto_teste_' + Date.now(); // GERAR NOME DE PRODUTO ALEATÓRIO

    // HOOK PARA EXECUTAR ANTES DE TODOS OS TESTES
    before(() => {
        // CADASTRAR USUÁRIO
        Usuario.registrarUsuario({
            nome: "Usuário Teste Produto",
            email: email,
            password: "Teste@1234",
            administrador: "true"
        });

        // FAZER LOGIN COM CYPRESS SESSION
        cy.login(email, 'Teste@1234');
    });
    it('CT02 - Cadastro de produto com sucesso @produto @cadastroProduto', () => {
        // OBTER TOKEN DA SESSÃO
        cy.getSessionToken().then((token) => {
            Produto.novoProduto({
                nome: produto,
                preco: 100,
                descricao: "Descrição do produto teste",
                quantidade: 10
            }, token).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.message).to.eq('Cadastro realizado com sucesso');
            });
        });
    });
    
    it('CT03 - Listar produtos @produto @listarProduto', () => {
        Produto.buscarProduto().then((response) => {
            cy.log(JSON.stringify(response.body.produtos)); // COLOQUEI ESSE LOG PARA VER A LISTAGEM NO CONSOLE
            expect(response.status).to.eq(200);
            
        });
    });

    it('CT04 - Buscar produto por nome @produto @buscarProdutoNome', () => {
        Produto.buscarProdutoPorNome(produto).then((response) => {
            cy.log(JSON.stringify(response.body.produtos)); 
            expect(response.status).to.eq(200);
            expect(response.body.produtos[0].nome).to.eq(produto);
        });
    });

    it('CT05 - Deletar produto @produto @deletarProduto',() => {
        // OBTER TOKEN DA SESSÃO
        cy.login(email, 'Teste@1234');
        cy.getSessionToken().then((token) => {
            cy.log('Token obtido para deletar:', token);
            
            // AQUI EU BUSCO O PRODUTO PRIMEIRO PARA PEGAR O ID
            Produto.buscarProdutoPorNome(produto).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.produtos).to.have.length.greaterThan(0);
                
                const produtoId = response.body.produtos[0]._id;
                cy.log('ID do produto a ser deletado:', produtoId);
                
                // AQUI EU DELETO O PRODUTO USANDO O ID OBTIDO
                Produto.deletarProduto(produtoId, token).then((deleteResponse) => {
                    cy.log('Resposta da deleção:', deleteResponse);
                    expect(deleteResponse.status).to.eq(200);
                    expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
                });
            });
        });
    });

    // HOOK PARA EXECUTAR APÓS TODOS OS TESTES
    after(() => {
        // LIMPAR SESSÃO COMPLETA
        cy.clearSession();
        cy.log('Sessão limpa após testes de produto');
    });
})