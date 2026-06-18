# Automação de Testes com Playwright

Projeto desenvolvido em JavaScript com Playwright para automatizar testes de API, E2E e acessibilidade na aplicação Practice Software Testing.

## Aplicações Testadas

- Web: https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com
- Swagger: https://api.practicesoftwaretesting.com/api/documentation

## Tecnologias

- Node.js e JavaScript;
- Playwright Test;
- axe-core;
- GitHub Actions;
- GitHub Pages.

## Estrutura

```text
api/
  clients/              # Clientes para autenticação, produtos e usuários
  payloads/             # Massas das requisições
pages/                  # Page Objects dos fluxos E2E
tests/
  api/                  # Testes de products e users
  e2e/                  # Testes de login e checkout
  accessibility/        # Teste de acessibilidade
utils/                  # Dados aleatórios e asserções reutilizáveis
```

Os testes E2E usam Page Object Pattern. Os testes de API usam clients para centralizar endpoints e requisições. Dados únicos são gerados com `crypto.randomUUID()` para permitir execuções paralelas.

## Cobertura

### API

Endpoints de produtos e usuários com métodos `GET`, `POST`, `PUT` e `DELETE`.

As validações incluem:

- status codes;
- headers;
- corpo da resposta;
- payloads válidos;
- campos obrigatórios ausentes;
- dados inválidos;
- recursos inexistentes;
- autenticação inválida ou ausente.

As respostas são anexadas em JSON ao relatório do Playwright.

### E2E

Fluxo de login:

- credenciais válidas;
- senha inválida;
- campos obrigatórios em branco;
- validação da navegação e do estado autenticado.

Fluxo de checkout:

- adição de produto ao carrinho;
- checkout como convidado;
- preenchimento de endereço;
- pagamento e conclusão da compra;
- cartão inválido;
- validação de que o fluxo não avança indevidamente.

### Acessibilidade

A tela de login é analisada com axe-core usando as regras `wcag2a` e `wcag2aa`.

O teste detecta uma violação crítica da regra `button-name`: o botão de mostrar ou ocultar a senha não possui nome acessível. A falha foi mantida para registrar um problema real da aplicação.

## Instalação

Requisito: Node.js 20 ou superior.

```bash
npm ci
```

O script `postinstall` instala automaticamente o Chromium usado pelo Playwright.

## Execução

```bash
npm run test:all            # Todos os testes
npm run test:api            # API
npm run test:web            # E2E
npm run test:accessibility  # Acessibilidade
npm run test:ui             # Playwright UI
```

Para abrir o último relatório local:

```bash
npx playwright show-report
```

## Relatórios e Evidências

O HTML Reporter do Playwright registra os resultados da execução.

Em caso de falha, são mantidos:

- screenshot;
- vídeo;
- trace;
- respostas JSON dos testes de API.

## CI/CD

O workflow `.github/workflows/playwright.yml` executa automaticamente em pushes e pull requests para `main`.

Os testes são divididos em jobs paralelos:

- API;
- E2E;
- acessibilidade.

Após pushes para `main`, os relatórios são reunidos e publicados no GitHub Pages.

Os relatórios também permanecem disponíveis como artifacts da execução. As evidências de falha são publicadas nos artifacts `test-results-api`, `test-results-e2e` e `test-results-accessibility`.

## Falhas Conhecidas na Pipeline

### Acessibilidade

O teste permanece vermelho enquanto a aplicação mantiver o botão de exibição da senha sem nome acessível. Esse resultado demonstra que a validação encontrou uma violação real.

### Proteção Antibot

O cenário `deve realizar login com credenciais válidas` pode ser bloqueado pelo Cloudflare nos runners do GitHub Actions. Nesse caso, a aplicação exibe uma verificação contra robôs e o fluxo não alcança a área autenticada.

CAPTCHA e proteções antibot não são burlados pelos testes. A screenshot, o vídeo e o trace permitem diferenciar esse bloqueio de uma falha funcional do login.
