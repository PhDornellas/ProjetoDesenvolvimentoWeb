// Endpoints REST que usam as funcionalidades do backend
import express from "express";
import {
    autenticar, trocarSenha, cadastrarCliente, cadastrarServico,
    atualizarSolicitacoes, consultarServicos, consultarSolicitacoes, buscarNomeCliente
} from "./funcionalidades.js";

const app = express();
app.use(express.json());

// Libera o front (http://localhost:5173) para chamar este backend, que está em outra porta
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method == "OPTIONS") return res.sendStatus(204);
    next();
});

// Monta a resposta padrão a partir do retorno "null ou mensagem de erro"
function resposta(erro) {
    return erro == null ? { status: "sucesso" } : { status: "erro", mensagem: erro };
}

// Autenticação. Entrada: login e senha. Retorno: status do login.
app.post("/api/autenticacao", (req, res) => {
    const { login, senha } = req.body;
    const ok = autenticar(login, senha);
    res.json({ status: ok, nome: ok ? buscarNomeCliente(login) : "" });
});

// Troca de senha. Entrada: login, senha atual e nova senha.
app.post("/api/troca-senha", (req, res) => {
    const { login, senhaAtual, novaSenha } = req.body;
    res.json(resposta(trocarSenha(login, senhaAtual, novaSenha)));
});

// Cadastro de cliente. Entrada: dados do cliente.
app.post("/api/clientes", (req, res) => {
    res.json(resposta(cadastrarCliente(req.body)));
});

// Cadastro de serviço de TI. Entrada: dados do serviço.
app.post("/api/servicos", (req, res) => {
    const { nome, preco, prazo } = req.body;
    if (!nome || preco === "" || preco == null || prazo === "" || prazo == null) {
        return res.json(resposta("Nome, preço e prazo do serviço são obrigatórios."));
    }
    res.json(resposta(cadastrarServico(req.body)));
});

// Consulta de serviços de TI. Retorno: lista de serviços + status.
app.get("/api/servicos", (req, res) => {
    try {
        res.json({ status: "sucesso", servicos: consultarServicos() });
    } catch (erro) {
        res.json({ status: "erro", mensagem: "Erro ao consultar os serviços: " + erro.message, servicos: [] });
    }
});

// Leitura das solicitações de um usuário. Entrada: login do usuário.
app.get("/api/solicitacoes/:login", (req, res) => {
    try {
        res.json({ status: "sucesso", solicitacoes: consultarSolicitacoes(req.params.login) });
    } catch (erro) {
        res.json({ status: "erro", mensagem: "Erro ao consultar as solicitações: " + erro.message, solicitacoes: [] });
    }
});

// Atualização das solicitações. Entrada: login do usuário e a nova lista de solicitações.
app.put("/api/solicitacoes/:login", (req, res) => {
    res.json(resposta(atualizarSolicitacoes(req.params.login, req.body.solicitacoes || [])));
});

const PORTA = 3001;
app.listen(PORTA, () => {
    console.log("Backend rodando em http://localhost:" + PORTA);
});
