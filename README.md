# Projeto de automação de testes E2E e API

Projeto de automação de testes usando Playwright com JavaScript para validar a aplicação Practice Software Testing - Toolshop.

O projeto cobre testes automatizados de API e testes E2E web, com organização baseada em boas práticas de manutenção, separação de responsabilidades, Page Object Pattern para fluxos de tela e clients dedicados para chamadas de API.

## Aplicação Testada

- Web: https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com
- Swagger: https://api.practicesoftwaretesting.com/api/documentation

## Tecnologias

- JavaScript
- Node.js
- Playwright Test
- GitHub Actions

Versões usadas no desenvolvimento local:

```bash
node v22.22.0
npm 10.9.4
@playwright/test 1.61.0
```

## Estrutura do Projeto

```text
automation-test-pw/
  api/
    clients/
      AuthApiClient.js
      BaseApiClient.js
      ProductsApiClient.js
      UsersApiClient.js
    payloads/
      usersPayload.js

  data/
    checkoutData.js

  pages/
    Cart/
      CartPage.js
    Checkout/
      CheckoutPage.js
    HomePage/
      HomePage.js
    Login/
      LoginPage.js
    Product/
      ProductPage.js

  tests/
    api/
      products/
        products.api.spec.js
      users/
        users.api.spec.js
    e2e/
      checkout/
        checkout.spec.js
      login/
        login.spec.js

  utils/
    apiAssertions.js
    env.js
    randomData.js

  .github/
    workflows/
      playwright.yml

  playwright.config.js
  package.json
  README.md
```

## Decisões de Arquitetura

### API Clients

Os testes de API usam classes em `api/clients` para encapsular chamadas HTTP.

Exemplo:

```text
ProductsApiClient
UsersApiClient
AuthApiClient
```

Isso evita espalhar URLs, headers e detalhes de request dentro dos arquivos de teste.

### Page Object Pattern

Os testes E2E usam Page Objects em `pages/`.

Cada Page Object representa uma página ou etapa relevante do fluxo:

```text
LoginPage
HomePage
ProductPage
CartPage
CheckoutPage
```

Os specs ficam focados no comportamento esperado, enquanto seletores e interações ficam centralizados nos Page Objects.

### Dados de Teste

Massas reutilizáveis ficam em `data/` e `api/payloads/`.

Dados dinâmicos, como e-mails únicos, são gerados em `utils/randomData.js` usando `crypto.randomUUID()` para evitar conflito em execução paralela.

### Seletores

A aplicação usa `data-test`. Por isso, o Playwright foi configurado com:

```js
testIdAttribute: 'data-test'
```

Assim os testes podem usar:

```js
page.getByTestId('login-submit')
```

## Cobertura Implementada

### Testes de API

Arquivos:

```text
tests/api/products/products.api.spec.js
tests/api/users/users.api.spec.js
```

Cobertura de `Products API`:

- `GET /products`
  - lista produtos
  - valida status code
  - valida header `content-type`
  - valida corpo paginado
  - valida contrato básico de produto

- `GET /products/{productId}`
  - busca produto existente
  - valida produto retornado
  - valida produto inexistente com erro esperado

- `GET /products/search`
  - busca produtos por query
  - valida retorno paginado

- `DELETE /products/{productId}`
  - valida tentativa de exclusão sem autenticação

Cobertura de `Users API`:

- `POST /users/register`
  - cadastro com dados válidos
  - cadastro com campos obrigatórios ausentes
  - cadastro com e-mail duplicado

- `POST /users/login`
  - login com credenciais válidas
  - login com senha inválida

- `PUT /users/{userId}`
  - atualização de usuário autenticado

- `DELETE /users/{userId}`
  - exclusão sem autenticação

As validações incluem:

- status codes
- headers
- corpo da resposta
- cenários positivos
- cenários negativos
- evidências em JSON anexadas ao relatório do Playwright

## Testes E2E

Arquivos:

```text
tests/e2e/login/login.spec.js
tests/e2e/checkout/checkout.spec.js
```

Cobertura de login:

- login com credenciais válidas
- login com senha inválida
- validação de campos obrigatórios em branco

Observação: os usuários usados nos testes de login são criados via API antes da execução, evitando dependência de usuário fixo e reduzindo risco de bloqueio de conta compartilhada.

Cobertura de checkout:

- acesso a home
- abertura de produto
- adição ao carrinho
- acesso ao carrinho pelo link real da navbar
- checkout como convidado
- preenchimento de endereço
- seleção de pagamento por cartão de crédito
- finalização com cartão válido
- validação de erro com número de cartão inválido

## Como Instalar

Clone o repositório e instale as dependências:

```bash
npm ci
```

Instale os browsers do Playwright:

```bash
npx playwright install
```

Em ambiente Linux/CI, pode ser necessário instalar também as dependências do sistema:

```bash
npx playwright install --with-deps
```

## Como Executar

Executar todos os testes:

```bash
npm run test:all
```

Executar apenas testes de API:

```bash
npm run test:api
```

Executar apenas testes E2E:

```bash
npm run test:web
```

Abrir Playwright UI:

```bash
npm run test:ui
```

## Relatórios E Evidências

O projeto usa o HTML Reporter nativo do Playwright.

Para abrir o relatório após uma execução:

```bash
npx playwright show-report
```

Evidências configuradas:

- screenshots em falhas
- vídeos em falhas
- traces em retry
- JSON de respostas anexado aos testes de API

Configuração relevante em `playwright.config.js`:

```js
use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
}
```

Nos testes de API, as respostas são anexadas ao relatório com `testInfo.attach`, usando `application/json`.

## CI/CD

O projeto possui pipeline em GitHub Actions:

```text
.github/workflows/playwright.yml
```

O pipeline roda automaticamente em:

- push para `main`
- pull request para `main`

Jobs configurados:

```text
api-tests
e2e-tests
```

Os jobs rodam em paralelo para acelerar o feedback.

### Job API

Executa:

```bash
npm run test:api
```

Publica o artefato:

```text
playwright-report-api
```

### Job E2E

Instala o Chromium com dependências:

```bash
npx playwright install --with-deps chromium
```

Executa:

```bash
npm run test:web
```

Publica o artefato:

```text
playwright-report-e2e
```
