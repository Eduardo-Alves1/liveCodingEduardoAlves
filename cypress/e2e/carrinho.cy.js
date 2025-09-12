import { Usuario } from "../pages/UserAPI";
import Produto from "../pages/produto";

describe('PATH /carrinho', () =>{

    let token; // VARIÁVEL PARA ARMAZENAR O TOKEN DE AUTENTICAÇÃO
    let email = `usuarioCarrinho_${Date.now()}@teste.com.br`; // EMAIL ÚNICO PARA CADA EXECUÇÃO
    let produto = 'produto_testeCarrinho_' + Date.now(); // GERAR NOME DE PRODUTO ALEATÓRIO

    before(()=>{
        Usuario.registrarUsuario({
            nome: "Usuario Teste Carrinho",
            email: email,
            password: "Teste@1234",
            administrador: "true"
        })

        cy.loginAndGetToken(email, 'Teste@1234').then((authToken)=>{
            token = authToken;
            cy.log('Token obtido:', token)
        })
    })

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

    after(() => {
        // LIMPAR TOKEN ARMAZENADO
        cy.clearStoredToken();
        cy.log('Token limpo após testes de produto');
    });

})