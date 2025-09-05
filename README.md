# Testes de API - Live Coding Eduardo Alves

Este projeto contém testes automatizados para a API do Serverest, utilizando o framework **Cypress**. Os testes incluem funcionalidades como cadastro de usuários, login, cadastro de produtos e listagem de produtos. Live Conding EDUARDO ALVES

---

## 📂 Estrutura do Projeto

- **`cypress/e2e/codingApi.cy.js`**: Contém os testes principais para as funcionalidades da API.
- **`cypress/pages/UserAPI.js`**: Classe responsável pelas requisições relacionadas a usuários.
- **`cypress/pages/Auth.js`**: Classe responsável pelas requisições de autenticação.
- **`cypress/pages/produto.js`**: Classe responsável pelas requisições relacionadas a produtos.

---

## 🧪 Testes Implementados

### **Usuários**

- **CT00 - Cadastro de usuário para obter token de autenticação**

  - Cria um novo usuário administrador com e-mail dinâmico.
  - Verifica se o cadastro foi realizado com sucesso.

- **CT01 - Login para obter token de autenticação**
  - Realiza login com o usuário cadastrado no teste anterior.
  - Valida a mensagem de sucesso e armazena o token de autenticação.

### **Produtos**

- **CT02 - Cadastro de produto com sucesso**

  - Cadastra um novo produto com nome dinâmico.
  - Valida a mensagem de sucesso.

- **CT03 - Listar produtos**

  - Lista todos os produtos cadastrados.
  - Exibe os produtos no console para depuração.

- **CT04 - Buscar produto por nome**
  - Busca um produto específico pelo nome.
  - Valida se o produto retornado corresponde ao nome buscado.

---

## 🚀 Como Executar os Testes

### 1. **Pré-requisitos**

- Node.js instalado na máquina.
- Cypress instalado no projeto:
  ```bash
  npm install cypress --save-dev
  ```
