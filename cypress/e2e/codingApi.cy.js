import { Usuario } from "../pages/UserAPI";
import AuthAPI from "../pages/Auth";
import Produto from "../pages/produto";

describe('Testes da API Live Coding EDUARDO ALVES', () => {
    let token; // AQUI VAI FICAR O TOKEN DE AUTENTICAÇÃO
    
    let email = `eduardo_${Date.now()}@teste.com.br`; // GERAR EMAIL ALEATÓRIO

    let produto = 'produto_teste_' + Date.now(); // GERAR NOME DE PRODUTO ALEATÓRIO

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
        AuthAPI.login({
            email: email,
            password: 'Teste@1234'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Login realizado com sucesso');
            token = response.body.authorization;
        });
    });

    it('CT02 - Cadastro de produto com sucesso @produto @cadastroProduto', () => {
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

    it('CT03 - Listar produtos @produto @listarProduto', () => {
        Produto.buscarProduto().then((response) => {
            cy.log(JSON.stringify(response.body.produtos)); // COLOQUEI ESSE LOG PARA VER A LISTAGE NO CONSOLE
            expect(response.status).to.eq(200);
            
        });
    });

    it('CT04 - Buscar produto por nome @produto @buscarProdutoNome', () => {
        Produto.buscarProdutoPorNome(produto).then((response) => {
            cy.log(JSON.stringify(response.body.produtos)); // COLOQUEI ESSE LOG PARA VER A LISTAGE NO CONSOLE
            expect(response.status).to.eq(200);
            expect(response.body.produtos[0].nome).to.eq(produto);
        });
    });

    it('CT05 - Deletar produto @produto @deletarProduto',() => {
        // Aqui eu busco o produto primeiro para pegar o ID
        Produto.buscarProdutoPorNome(produto).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.produtos).to.have.length.greaterThan(0);
            
            const produtoId = response.body.produtos[0]._id;
            
            // Aqui eu deleto o produto usando o ID obtido
            Produto.deletarProduto(produtoId, token).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(200);
                expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso');
            });
        });
    });

    it('CT06 - Criar carrinho', () => {
        // Criar um novo produto para o carrinho, já que o anterior foi deletado
        const produtoCarrinho = 'produto_carrinho_' + Date.now();
        
        Produto.novoProduto({
            nome: produtoCarrinho,
            preco: 50,
            descricao: "Produto para carrinho",
            quantidade: 5
        }, token).then((response) => {
            expect(response.status).to.eq(201);
            
            // Buscar o produto criado para obter o ID
            Produto.buscarProdutoPorNome(produtoCarrinho).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.produtos).to.have.length.greaterThan(0);
                
                const produtoId = response.body.produtos[0]._id;
                
                // Criar carrinho com o produto
                const carrinhoBody = {
                    produtos: [{
                        idProduto: produtoId,
                        quantidade: 1
                    }]
                };
                
                Produto.criarCarrinho(token, carrinhoBody).then((response) => {
                    
                    if (response.status !== 201) {
                        console.log('ERRO: Status não é 201. Resposta completa:', response);
                        throw new Error(`Erro ${response.status}: ${JSON.stringify(response.body)}`);
                    }
                    
                    expect(response.status).to.eq(201);
                    expect(response.body.message).to.eq('Cadastro realizado com sucesso');
                });
            });
        });
    });

    it('CT07 - Listar carrinho', () => {
        Produto.listarCarrinho(token).then((response) => {
            console.log('Response status:', response.status);
            console.log('Response body:', JSON.stringify(response.body));
            
            expect(response.status).to.eq(200);
            expect(response.body.carrinhos).to.have.length.greaterThan(0);
        });
    });
});

// PESSOAL COLOQUEI DENTRO DE UM DESCRIBE PARA FICAR MAIS ORGANIZADO E SUCINTO