# Stock Control

Sistema de controle de estoque composto por uma API REST e uma interface web. Permite cadastrar empresas fornecedoras, gerenciar produtos e associar fornecedores a produtos.

## Estrutura do projeto

```
stock-controll/
├── api-stock-controll/   # Backend — NestJS + TypeORM + SQLite
└── web-stock-controll/   # Frontend — React 19 + Vite + Tailwind CSS
```

## Tecnologias

| Camada    | Tecnologia                                       |
|-----------|--------------------------------------------------|
| Backend   | NestJS 11, TypeORM, SQLite, Multer               |
| Frontend  | React 19, Vite, Tailwind CSS 4, React Router 7   |
| Validação | class-validator (API), React Hook Form + Zod (Web)|
| HTTP      | Axios                                            |

## Funcionalidades

- **Empresas / Fornecedores** — cadastro, edição, listagem e remoção de fornecedores (CNPJ, endereço, contato)
- **Produtos** — cadastro, edição, listagem e remoção de produtos com imagem, código de barras, quantidade em estoque e data de validade
- **Associações** — vinculação e desvinculação de fornecedores a produtos

## Pré-requisitos

- [Node.js](https://nodejs.org) >= 18
- npm >= 9

---

## Como rodar

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd stock-controll
```

### 2. API (backend)

```bash
cd api-stock-controll
npm install
npm run start:dev
```

A API ficará disponível em **http://localhost:3333**.  
O banco de dados SQLite (`database.db`) é criado automaticamente na primeira execução — nenhuma configuração extra é necessária.

### 3. Web (frontend)

Em outro terminal:

```bash
cd web-stock-controll
npm install
npm run dev
```

A interface ficará disponível em **http://localhost:5173**.

> O frontend já está configurado para consumir a API em `http://localhost:3333/api/v1`. Certifique-se de que a API está rodando antes de abrir o frontend.

---

## Rotas da API

Base: `http://localhost:3333/api/v1`

### Empresas

| Método | Rota              | Descrição              |
|--------|-------------------|------------------------|
| GET    | `/company`        | Lista todas as empresas |
| GET    | `/company/:id`    | Busca empresa por ID   |
| POST   | `/company`        | Cria nova empresa      |
| PUT    | `/company/:id`    | Atualiza empresa       |
| DELETE | `/company/:id`    | Remove empresa         |

### Produtos

| Método | Rota              | Descrição                        |
|--------|-------------------|----------------------------------|
| GET    | `/product`        | Lista todos os produtos          |
| GET    | `/product/:id`    | Busca produto por ID             |
| POST   | `/product`        | Cria produto (suporta upload de imagem via `multipart/form-data`) |
| PUT    | `/product/:id`    | Atualiza produto                 |
| DELETE | `/product/:id`    | Remove produto                   |

### Associações

| Método | Rota                                    | Descrição                            |
|--------|-----------------------------------------|--------------------------------------|
| POST   | `/product/:productId/company/:companyId`  | Associa fornecedor ao produto        |
| DELETE | `/product/:productId/company/:companyId`  | Desassocia fornecedor do produto     |
| GET    | `/product/:productId/companies`           | Lista fornecedores de um produto     |
| GET    | `/company/:companyId/products`            | Lista produtos de um fornecedor      |

### Imagens

Imagens enviadas ficam acessíveis em:

```
http://localhost:3333/uploads/products/<nome-do-arquivo>
```

---

## Scripts disponíveis

### API

| Comando              | Descrição                        |
|----------------------|----------------------------------|
| `npm run start:dev`  | Inicia em modo watch (desenvolvimento) |
| `npm run start:prod` | Inicia a build de produção       |
| `npm run build`      | Compila o projeto                |
| `npm test`           | Executa testes unitários         |
| `npm run test:e2e`   | Executa testes end-to-end        |

### Web

| Comando          | Descrição                       |
|------------------|---------------------------------|
| `npm run dev`    | Inicia servidor de desenvolvimento |
| `npm run build`  | Gera build de produção          |
| `npm run preview`| Pré-visualiza a build           |
