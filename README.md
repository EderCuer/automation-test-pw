# Projeto de Automação de Testes E2E, API e Acessibilidade

Este projeto implementa uma suíte de testes automatizados com Playwright e JavaScript para validar a aplicação Practice Software Testing - Toolshop.

A suíte cobre testes de API, testes E2E web e um cenário de acessibilidade. A estrutura foi organizada para facilitar leitura, manutenção e evolução, usando Page Object Pattern para fluxos de tela e API Clients para chamadas HTTP.

## Aplicação Testada

- Web: https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com
- Swagger: https://api.practicesoftwaretesting.com/api/documentation

## Tecnologias

- JavaScript.
- Node.js.
- Playwright Test.
- axe-core com `@axe-core/playwright`.
- GitHub Actions.

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
    accessibility/
      login.accessibility.spec.js
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

Os testes de API usam classes em `api/clients` para encapsular chamadas HTTP:

```text
ProductsApiClient
UsersApiClient
AuthApiClient
```

Essa abordagem evita espalhar URLs, headers, payloads e detalhes de request dentro dos arquivos de teste.

### Page Object Pattern

Os testes E2E usam Page Objects em `pages/`:

```text
LoginPage
HomePage
ProductPage
CartPage
CheckoutPage
```

Com isso, os specs ficam focados no comportamento esperado, enquanto seletores e interações ficam centralizados nos Page Objects.

### Dados de Teste

Massas reutilizáveis ficam em `data/` e `api/payloads/`.

Dados dinâmicos, como e-mails únicos, são gerados em `utils/randomData.js` com `crypto.randomUUID()`. Isso reduz o risco de conflito durante execuções paralelas.

### Seletores

A aplicação usa o atributo `data-test`. Por isso, o Playwright foi configurado com:

```js
testIdAttribute: 'data-test'
```

Assim, os testes podem usar seletores mais estáveis:

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

- `GET /products`:
  - lista produtos;
  - valida status code;
  - valida header `content-type`;
  - valida corpo paginado;
  - valida contrato básico de produto.

- `GET /products/{productId}`:
  - busca produto existente;
  - valida produto retornado;
  - valida produto inexistente com erro esperado.

- `GET /products/search`:
  - busca produtos por query;
  - valida retorno paginado.

- `DELETE /products/{productId}`:
  - valida tentativa de exclusão sem autenticação.

Cobertura de `Users API`:

- `POST /users/register`:
  - cadastra usuário com dados válidos;
  - valida cadastro com campos obrigatórios ausentes;
  - valida cadastro com e-mail duplicado.

- `POST /users/login`:
  - valida login com credenciais válidas;
  - valida login com senha inválida.

- `PUT /users/{userId}`:
  - valida atualização de usuário autenticado.

- `DELETE /users/{userId}`:
  - valida exclusão sem autenticação.

As validações de API incluem:

- status codes;
- headers;
- corpo da resposta;
- cenários positivos;
- cenários negativos;
- evidências em JSON anexadas ao relatório do Playwright.

### Testes E2E

Arquivos:

```text
tests/e2e/login/login.spec.js
tests/e2e/checkout/checkout.spec.js
```

Cobertura de login:

- login com credenciais válidas;
- login com senha inválida;
- validação de campos obrigatórios em branco.

Os usuários usados nos testes de login são criados via API antes da execução. Com isso, os testes não dependem de um usuário fixo e reduzem o risco de bloqueio de conta compartilhada.

Cobertura de checkout:

- acesso a home;
- abertura de produto;
- adição ao carrinho;
- acesso ao carrinho pelo link real da navbar;
- checkout como convidado;
- preenchimento de endereço;
- seleção de pagamento por cartão de crédito;
- finalização com cartão válido;
- validação de erro com número de cartão inválido.

Os cenários negativos E2E foram reforçados para validar que o fluxo não avançou indevidamente:

- login inválido permanece em `/auth/login`;
- login inválido não exibe menu autenticado;
- campos obrigatórios mantêm o usuário na tela de login;
- cartão inválido não exibe mensagem de pagamento aprovado;
- cartão inválido mantém o usuário na etapa de pagamento.

### Testes de Acessibilidade

Arquivo:

```text
tests/accessibility/login.accessibility.spec.js
```

O teste usa `@axe-core/playwright` para analisar a tela de login com regras WCAG:

```text
wcag2a
wcag2aa
```

O widget de chat foi excluído da análise por ser um componente externo à experiência principal testada.

## Como Instalar

Instale as dependências:

```bash
npm ci
```

Instale os browsers do Playwright:

```bash
npx playwright install
```

Em ambiente Linux ou CI, pode ser necessário instalar também as dependências do sistema:

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

Executar apenas testes de acessibilidade:

```bash
npm run test:accessibility
```

Abrir o Playwright UI:

```bash
npm run test:ui
```

## Relatórios e Evidências

O projeto usa o HTML Reporter nativo do Playwright.

Para abrir o relatório após uma execução, use:

```bash
npx playwright show-report
```

Evidências configuradas:

- screenshots em falhas;
- vídeos em falhas;
- traces em falhas;
- JSON de respostas anexado aos testes de API.

Configuração relevante em `playwright.config.js`:

```js
use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
}
```

Nos testes de API, as respostas são anexadas ao relatório com `testInfo.attach`, usando o tipo `application/json`.

## CI/CD

O projeto possui pipeline em GitHub Actions:

```text
.github/workflows/playwright.yml
```

O pipeline roda automaticamente em:

- push para `main` ou `master`;
- pull request para `main` ou `master`.

Jobs configurados:

```text
api-tests
e2e-tests
accessibility-tests
```

Os jobs rodam em paralelo para acelerar o feedback.

### Job API

Executa:

```bash
npm run test:api
```

Publica sempre o artefato:

```text
playwright-report-api
```

Em caso de falha, também publica:

```text
test-results-api
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

Publica sempre o artefato:

```text
playwright-report-e2e
```

Em caso de falha, também publica:

```text
test-results-e2e
```

### Job Acessibilidade

Instala o Chromium com dependências:

```bash
npx playwright install --with-deps chromium
```

Executa:

```bash
npm run test:accessibility
```

Publica sempre o artefato:

```text
playwright-report-accessibility
```

Em caso de falha, também publica:

```text
test-results-accessibility
```

## Mapeamento com o Enunciado

### Item 1 - Testes Automatizados de API

Atendido por:

```text
tests/api/products/products.api.spec.js
tests/api/users/users.api.spec.js
api/clients/
utils/apiAssertions.js
```

O projeto valida:

- múltiplos endpoints;
- diferentes métodos HTTP: `GET`, `POST`, `PUT`, `DELETE`;
- status code;
- headers;
- corpo da resposta;
- fluxos positivos;
- fluxos negativos;
- relatório HTML com evidências.

### Item 2 - Testes End-To-End

Atendido por:

```text
tests/e2e/login/login.spec.js
tests/e2e/checkout/checkout.spec.js
pages/
```

O projeto valida:

- login positivo;
- login negativo;
- campos obrigatórios;
- fluxo completo de checkout;
- carrinho;
- endereço;
- pagamento;
- finalização de compra;
- erro esperado em pagamento inválido;
- Page Object Pattern;
- evidências em falhas.

### Evoluções de Qualidade

Também foram incluídos:

- cenário automatizado de acessibilidade;
- asserts negativos E2E mais fortes;
- evidências de falha explícitas no pipeline.

## Observações Técnicas

- O enunciado menciona Cucumber para E2E, mas este projeto usa Playwright Test puro por decisão técnica.
- Playwright Test reduz complexidade, pois possui fixtures, asserts, runner, retries e reporter integrados.
- A abordagem mantém os testes legíveis sem adicionar uma camada BDD artificial.

## Comandos Rápidos

```bash
npm ci
npx playwright install
npm run test:all
npx playwright show-report
```