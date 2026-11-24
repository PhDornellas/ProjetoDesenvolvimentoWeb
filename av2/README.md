# AV2 — Tech Solutions em React

O projeto da AV1 refeito em **React**, com **dois backends REST** que fazem exatamente a mesma coisa:

- **Node.js** (Express), em `backend/`, na porta **3001**
- **Java** (Spring Boot), em `backend-java/`, na porta **8080**

Os dois usam um **banco de dados SQLite**, com as mesmas tabelas e os mesmos dados iniciais. O front em React é um só e funciona com qualquer um dos dois.

## Como trocar de backend

No arquivo `frontend/src/util/api.js`, mude **só esta linha**:

```js
const URL_BACKEND = "http://localhost:3001";   // Node.js
const URL_BACKEND = "http://localhost:8080";   // Java (Spring Boot)
```

O resto do código do front não muda, e o resultado na tela é o mesmo. Cada backend tem o seu arquivo de banco: o que se grava com um não aparece no outro.

## Como rodar

Precisa do **Node.js 24** ou mais novo e, para o backend Java, do **JDK 21** (o Maven não precisa instalar: o projeto já traz o `mvnw`).

Dentro da pasta `av2`, no terminal:

```bash
npm run instalar
```

Esse só precisa rodar uma vez. Depois, para subir o backend e o front juntos, use um destes:

```bash
npm run dev        # backend Node.js + front
npm run dev:java   # backend Java + front
```

Depois, abra **http://localhost:5173**. Lembre de deixar a `URL_BACKEND` apontando para o backend que você subiu.

Na primeira vez, o backend Java demora um pouco mais, porque o `mvnw` baixa o Maven e as bibliotecas.

Usuário de teste (criado automaticamente): **joao@email.com** / **Senha@123**

O banco é criado na primeira execução, já com 4 serviços, o João e 3 solicitações dele. Ele fica em `backend/techsolutions.db` no Node e em `backend-java/techsolutions.db` no Java. Para voltar ao estado inicial, pare o servidor e apague o arquivo.

## Estrutura

```
av2/
├── backend/                     backend Node.js (Express)
│   └── src/
│       ├── db.js                tabelas e dados iniciais
│       ├── funcionalidades.js   funcionalidades do backend
│       └── server.js            endpoints REST
├── backend-java/                backend Java (Spring Boot), espelho do backend Node.js
│   ├── pom.xml                  dependências (Spring Web, JDBC, driver SQLite)
│   ├── mvnw / mvnw.cmd          Maven Wrapper
│   └── src/main/
│       ├── resources/application.properties   porta 8080 e banco
│       └── java/br/com/techsolutions/
│           ├── BancoDeDados.java       tabelas e dados iniciais      (= db.js)
│           ├── Funcionalidades.java    funcionalidades do backend    (= funcionalidades.js)
│           ├── Endpoints.java          endpoints REST                (= server.js)
│           ├── CorsConfig.java         libera o front em outra porta
│           └── TechSolutionsApplication.java   inicia o servidor
└── frontend/
    ├── public/imagens/          imagens da AV1
    └── src/
        ├── App.jsx              rotas (um componente por página)
        ├── UsuarioContexto.jsx  usuário logado (useState + Context)
        ├── estilo.css           o CSS da AV1
        ├── paginas/             Inicio, Login, TrocaSenha, Cadastro, Servico, CadastroServico
        ├── componentes/         componentes menores reutilizados
        └── util/                validações, formatação e chamadas à API (URL_BACKEND)
```

## Banco de dados

| Tabela | Campos |
|---|---|
| `cliente` | **login** (PK, e-mail), senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade |
| `servico_ti` | **id** (PK, autoincremento), nome, preco, prazo (em dias) |
| `solicitacao_servico` | **id** (PK), numero, data_pedido, status, preco, data_prevista, **servico_id** (FK → servico_ti), **cliente_login** (FK → cliente) |

## Endpoints REST (iguais nos dois backends)

| Funcionalidade | Método e rota | Entrada | Retorno |
|---|---|---|---|
| Autenticação | `POST /api/autenticacao` | `{ login, senha }` | `{ status: true/false, nome }` |
| Troca de senha | `POST /api/troca-senha` | `{ login, senhaAtual, novaSenha }` | `{ status, mensagem? }` |
| Cadastro de cliente | `POST /api/clientes` | dados do cliente | `{ status, mensagem? }` |
| Cadastro de serviço de TI | `POST /api/servicos` | `{ nome, preco, prazo }` | `{ status, mensagem? }` |
| Consulta de serviços de TI | `GET /api/servicos` | — | `{ status, servicos, mensagem? }` |
| Solicitações de um usuário | `GET /api/solicitacoes/:login` | login na URL | `{ status, solicitacoes, mensagem? }` |
| Atualização das solicitações | `PUT /api/solicitacoes/:login` | login na URL + `{ solicitacoes }` | `{ status, mensagem? }` |

`status` é `"sucesso"` ou `"erro"`; `mensagem` só vem quando dá erro.

A atualização das solicitações apaga todas as do usuário e grava a lista recebida numa **transação**: se uma inclusão falhar, nada é alterado.

Os dois backends foram testados com a mesma sequência de 20 chamadas (login certo e errado, troca de senha, cadastro duplicado, serviço sem nome, solicitação com serviço inexistente etc.). As respostas JSON saíram idênticas.

## Requisitos técnicos atendidos

- **Dois backends em plataformas diferentes** (Node.js e Java com Spring Boot), com as mesmas funcionalidades, endpoints e respostas. A troca é feita só pela `URL_BACKEND`.
- **Um componente React por página**, em `src/paginas/`.
- **Componentes menores** em `src/componentes/`: `Cabecalho`, `RodapeSimples`, `RodapeCompleto`, `Menu`, `Campo`, `Mensagem`, `RegrasSenha`, `EstadoCivil`, `Escolaridade`, `Historia`, `VideoInstitucional`, `Galeria`, `ServicosPrincipais`, `Fundadores`, `DadosUsuario`, `TabelaSolicitacoes`, `LinhaSolicitacao`, `NovaSolicitacao`.
- **Estado só com Hooks**: `useState`, `useEffect`, `useContext` e os hooks do React Router (`useNavigate`). Todos os campos são controlados pelo estado.
- **Nada de DOM**: nenhum `getElementById`, `querySelector`, `innerText`, `alert` ou `sessionStorage`.
  - O único `document.getElementById("root")` é o do `main.jsx`, a linha obrigatória onde o React se encaixa na página.
  - Para devolver o foco ao primeiro campo no botão Limpar, o formulário ganha uma `key` nova. O React recria o formulário, e o `autoFocus` do primeiro campo coloca o cursor nele.
- **Mesmo estilo e layout da AV1**: o `estilo.css` e as imagens são os mesmos.
