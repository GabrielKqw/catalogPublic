# KankosGame - Backend

Este é o backend do projeto KankosGame, um catálogo de jogos. O backend foi desenvolvido utilizando NestJS, Prisma ORM e PostgreSQL.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações server-side eficientes e escaláveis em Node.js
- **Prisma ORM**: ORM (Object-Relational Mapping) para Node.js e TypeScript
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional
- **JWT**: JSON Web Tokens para autenticação
- **Bcrypt**: Para criptografia de senhas
- **Axios**: Cliente HTTP para integração com APIs externas

## Estrutura do Projeto

```
backend/
├── src/
│   ├── auth/                  # Módulo de autenticação
│   │   ├── auth.controller.ts # Controlador para rotas de autenticação
│   │   ├── auth.module.ts     # Módulo de autenticação
│   │   ├── auth.service.ts    # Serviço de autenticação
│   │   ├── constants.ts       # Constantes para JWT
│   │   ├── jwt.strategy.ts    # Estratégia JWT para Passport
│   │   ├── jwt-auth.guard.ts  # Guard para rotas protegidas
│   │   ├── local.strategy.ts  # Estratégia local para Passport
│   │   └── local-auth.guard.ts# Guard para autenticação local
│   ├── users/                 # Módulo de usuários
│   │   ├── users.module.ts    # Módulo de usuários
│   │   └── users.service.ts   # Serviço de usuários
│   ├── games/                 # Módulo de jogos
│   │   ├── games.controller.ts# Controlador para rotas de jogos
│   │   ├── games.module.ts    # Módulo de jogos
│   │   ├── games.service.ts   # Serviço de jogos
│   │   └── comments.controller.ts # Controlador para comentários
│   ├── app.controller.ts      # Controlador principal
│   ├── app.module.ts          # Módulo principal
│   ├── app.service.ts         # Serviço principal
│   └── main.ts                # Ponto de entrada da aplicação
├── prisma/                    # Configuração do Prisma
│   └── schema.prisma          # Schema do banco de dados
├── test/                      # Testes
├── .env                       # Variáveis de ambiente
├── nest-cli.json              # Configuração do NestJS CLI
├── package.json               # Dependências e scripts
└── tsconfig.json              # Configuração do TypeScript
```

## Modelos de Dados

### User
- `id`: Identificador único
- `email`: Email do usuário (único)
- `username`: Nome de usuário (único)
- `password`: Senha criptografada
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `comments`: Relacionamento com comentários

### Game
- `id`: Identificador único
- `title`: Título do jogo
- `description`: Descrição do jogo
- `imageUrl`: URL da imagem do jogo
- `releaseDate`: Data de lançamento
- `developer`: Desenvolvedor
- `publisher`: Publicador
- `genres`: Gêneros do jogo
- `apiId`: ID do jogo na API externa (único)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `comments`: Relacionamento com comentários

### Comment
- `id`: Identificador único
- `content`: Conteúdo do comentário
- `rating`: Avaliação (1-5)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `userId`: ID do usuário que fez o comentário
- `gameId`: ID do jogo comentado

## API Endpoints

### Autenticação
- `POST /auth/register`: Registrar novo usuário
  - Body: `{ email, username, password }`
- `POST /auth/login`: Login de usuário
  - Body: `{ email, password }`

### Jogos
- `GET /games`: Listar todos os jogos
  - Query params: `platform`, `category`, `sort-by`
- `GET /games/:id`: Obter detalhes de um jogo específico
- `GET /games/search`: Pesquisar jogos
  - Query params: `term`

### Comentários
- `POST /comments`: Adicionar comentário (requer autenticação)
  - Body: `{ gameId, content, rating }`
- `DELETE /comments/:id`: Excluir comentário (requer autenticação)

## Integração com API Externa

O backend integra-se com a FreeToGame API para obter dados de jogos. A integração é feita através do serviço `GamesService`, que busca jogos da API externa e os armazena no banco de dados local para futuras consultas.

## Autenticação e Autorização

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Quando um usuário faz login, um token JWT é gerado e retornado ao cliente. Este token deve ser incluído no cabeçalho `Authorization` das requisições subsequentes para acessar rotas protegidas.

## Configuração e Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL
- Yarn

### Instalação

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd game-catalog/backend/backend-app
```

2. Instale as dependências
```bash
yarn install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/gamecatalog?schema=public"
```
Substitua `usuario` e `senha` pelas suas credenciais do PostgreSQL.

4. Execute as migrações do Prisma
```bash
npx prisma migrate dev
```

5. Gere o cliente Prisma
```bash
npx prisma generate
```

6. Inicie o servidor de desenvolvimento
```bash
yarn start:dev
```

O servidor estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

- `yarn start`: Inicia o servidor em modo de produção
- `yarn start:dev`: Inicia o servidor em modo de desenvolvimento com hot-reload
- `yarn start:debug`: Inicia o servidor em modo de debug
- `yarn build`: Compila o projeto
- `yarn test`: Executa os testes unitários
- `yarn test:e2e`: Executa os testes end-to-end
- `yarn test:cov`: Executa os testes com cobertura

## Considerações de Segurança

- Senhas são criptografadas usando bcrypt antes de serem armazenadas no banco de dados
- Autenticação é feita usando JWT com expiração de 24 horas
- Rotas sensíveis são protegidas por guards de autenticação
- Validação de entrada é feita para prevenir injeção de SQL e outros ataques
