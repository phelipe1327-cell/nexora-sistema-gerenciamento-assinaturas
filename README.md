# Nexora Subscriptions — Frontend

Aplicação de portfólio para gerenciamento de pessoas, planos e assinaturas, com controle de responsáveis e dependentes.

## Tecnologias

- React 19
- TypeScript
- Vite
- Axios
- React Router
- Styled Components
- React Icons

## Arquitetura

O projeto está organizado por responsabilidade:

- `src/api`: configuração do Axios e comunicação com o backend.
- `src/components`: componentes compartilhados, layout, menu lateral e proteção de rotas.
- `src/context`: armazenamento da autenticação do usuário.
- `src/hooks`: hooks de autenticação, tema e carregamento dos dados da API.
- `src/pages`: telas de login, usuários, planos e assinaturas.
- `src/styles`: estilos globais, tema e estilos do catálogo.
- `src/types`: tipos utilizados pelas entidades do sistema.

A regra principal da interface impede que uma pessoa vinculada a uma assinatura ativa apareça novamente como responsável ou dependente. Os limites de dependentes respeitam o plano escolhido: Solo não permite dependentes, Duo permite até 1 e Família permite até 3.

## Pré-requisitos

- Node.js 20.19 ou superior
- npm
- Backend do Sistema de Gerenciamento de Assinaturas configurado e em execução

## Como rodar

### 1. Clone o repositório

```bash
git clone <URL-DO-REPOSITORIO>
cd nexora-sistema-gerenciamento-assinaturas
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto seguindo o modelo do `.env.example`:

```env
VITE_API_URL=http://localhost:5184/api
```

Altere a URL caso o backend esteja sendo executado em outra porta.

### 3. Instale as dependências

```bash
npm install
```

### 4. Compile o projeto

```bash
npm run build
```

### 5. Execute o frontend

```bash
npm run dev
```

O frontend será iniciado em `http://localhost:5173`.

## Como acessar

Com o backend e o frontend em execução, abra no navegador:

```text
http://localhost:5173
```

Em ambiente de desenvolvimento, utilize um usuário cadastrado no banco e a senha configurada em `AUTH_PASSWORD` no backend. Caso essa variável não esteja definida, a senha padrão é `123`.

## Funcionalidades

- Login integrado ao backend e persistência da sessão.
- Rotas protegidas para usuários autenticados.
- Cadastro, listagem e exclusão de usuários.
- Exibição dos planos fixos Solo, Duo e Família.
- Cadastro, listagem, edição, cancelamento e exclusão de assinaturas.
- Vinculação e exclusão de usuários dependentes.
- Controle da capacidade de dependentes conforme o plano.
- Bloqueio de pessoas que já possuem vínculo com uma assinatura ativa.
- Alternância de contraste e ajuste do tamanho da fonte.
- Tratamento de carregamento e mensagens de erro da API.

## Validação

Execute o lint e a compilação antes de enviar alterações:

```bash
npm run lint
npm run build
```
