import { Usuario } from "../pages/UserAPI";
import Produto from "../pages/produto";

describe('PATH /carrinho', () =>{
    let email = `usuarioCarrinho_${Date.now()}@teste.com.br`; // EMAIL ÚNICO PARA CADA EXECUÇÃO
    let produto = 'produto_testeCarrinho_' + Date.now(); // GERAR NOME DE PRODUTO ALEATÓRIO

    // HOOK PARA EXECUTAR ANTES DE TODOS OS TESTES
    before(() => {
        // CADASTRAR USUÁRIO
        Usuario.registrarUsuario({
            nome: "Usuario Teste Carrinho",
            email: email,
            password: "Teste@1234",
            administrador: "true"
        });

        // FAZER LOGIN COM CYPRESS SESSION
        cy.login(email, 'Teste@1234');
    });

    it('CT06 - Criar carrinho', () => {
        // OBTER TOKEN DA SESSÃO
        cy.getSessionToken().then((token) => {
            // CRIAR UM NOVO PRODUTO PARA O CARRINHO
            const produtoCarrinho = 'produto_carrinho_' + Date.now();
            
            Produto.novoProduto({
                nome: produtoCarrinho,
                preco: 50,
                descricao: "Produto para carrinho",
                quantidade: 5
            }, token).then((response) => {
                expect(response.status).to.eq(201);
                
                // BUSCAR O PRODUTO CRIADO PARA OBTER O ID
                Produto.buscarProdutoPorNome(produtoCarrinho).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.produtos).to.have.length.greaterThan(0);
                    
                    const produtoId = response.body.produtos[0]._id;
                    
                    // CRIAR CARRINHO COM O PRODUTO
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
    });

    it('CT07 - Listar carrinho', () => {
        // OBTER TOKEN DA SESSÃO
        cy.getSessionToken().then((token) => {
            Produto.listarCarrinho(token).then((response) => {
                console.log('Response status:', response.status);
                console.log('Response body:', JSON.stringify(response.body));
                
                expect(response.status).to.eq(200);
                expect(response.body.carrinhos).to.have.length.greaterThan(0);
            });
        });
    });

    // HOOK PARA EXECUTAR APÓS TODOS OS TESTES
    after(() => {
        // LIMPAR SESSÃO COMPLETA
        cy.clearSession();
        cy.log('Sessão limpa após testes de carrinho');
    });

})