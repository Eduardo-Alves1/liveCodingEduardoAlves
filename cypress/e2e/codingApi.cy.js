import { Usuario } from "../pages/UserAPI";
import AuthAPI from "../pages/Auth";
import Produto from "../pages/produto";

describe('Testes da API Live Coding EDUARDO ALVES', () => {
    let token; // AQUI VAI FICAR O TOKEN DE AUTENTICAÇÃO
    
    let email = `eduardo_${Date.now()}@teste.com.br`; // GERAR EMAIL ALEATÓRIO

    let produto = 'produto_teste_' + Date.now(); // GERAR NOME DE PRODUTO ALEATÓRIO

    it('CT00 - [cadastro]Cadastro de usuário para obter token de autenticação', () => {
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

    it('CT01 - [login]Login para obter token de autenticação', () => { 
        AuthAPI.login({
            email: email,
            password: 'Teste@1234'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Login realizado com sucesso');
            token = response.body.authorization;
        });
    });

    it('CT02 - [produto]Cadastro de produto com sucesso', () => {
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

    it('CT03 - [produto]Listar produtos', () => {
        Produto.buscarProduto().then((response) => {
            cy.log(JSON.stringify(response.body.produtos)); // COLOQUEI ESSE LOG PARA VER A LISTAGE NO CONSOLE
            expect(response.status).to.eq(200);
            
        });
    });

    it('CT04 - [produto]Buscar produto por nome', () => {
        Produto.buscarProdutoPorNome(produto).then((response) => {
            cy.log(JSON.stringify(response.body.produtos)); // COLOQUEI ESSE LOG PARA VER A LISTAGE NO CONSOLE
            expect(response.status).to.eq(200);
            expect(response.body.produtos[0].nome).to.eq(produto);
        });
    });
});

// PESSOAL COLOQUEI DENTRO DE UM DESCRIBE PARA FICAR MAIS ORGANIZADO E SUCINTO