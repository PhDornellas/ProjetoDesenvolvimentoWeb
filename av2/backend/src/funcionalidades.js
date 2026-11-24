// Funcionalidades do backend. Cada função corresponde a um item do enunciado da AV2.
// As que "retornam void ou mensagem de erro" devolvem null quando dá certo, ou o texto do erro.
import db from "./db.js";

// Autenticação: lê o cliente pelo login e compara a senha. Retorna true ou false.
export function autenticar(login, senha) {
    const cliente = db.prepare("SELECT senha FROM cliente WHERE login = ?").get(login);
    return cliente != undefined && cliente.senha == senha;
}

// Troca de senha: autentica com a senha atual e, se der certo, grava a nova senha.
export function trocarSenha(login, senhaAtual, novaSenha) {
    if (!autenticar(login, senhaAtual)) {
        return "Login ou senha atual inválidos.";
    }
    try {
        db.prepare("UPDATE cliente SET senha = ? WHERE login = ?").run(novaSenha, login);
        return null;
    } catch (erro) {
        return "Erro ao trocar a senha: " + erro.message;
    }
}

// Cadastro de cliente: verifica apenas se o login já existe.
export function cadastrarCliente(cliente) {
    const existe = db.prepare("SELECT login FROM cliente WHERE login = ?").get(cliente.login);
    if (existe) {
        return "Já existe um cliente cadastrado com este login.";
    }
    try {
        db.prepare(`INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(cliente.login, cliente.senha, cliente.nome, cliente.cpf, cliente.dataNascimento,
               cliente.telefone || "", cliente.estadoCivil, cliente.escolaridade);
        return null;
    } catch (erro) {
        return "Erro ao cadastrar o cliente: " + erro.message;
    }
}

// Cadastro de serviço de TI: a chave primária (id) é autoincremento.
export function cadastrarServico(servico) {
    try {
        db.prepare("INSERT INTO servico_ti (nome, preco, prazo) VALUES (?, ?, ?)")
          .run(servico.nome, Number(servico.preco), Number(servico.prazo));
        return null;
    } catch (erro) {
        return "Erro ao cadastrar o serviço de TI: " + erro.message;
    }
}

// Atualização das solicitações: apaga todas as do usuário e inclui as recebidas.
// Tudo numa transação: se algo falhar, nada é alterado.
export function atualizarSolicitacoes(login, solicitacoes) {
    try {
        db.exec("BEGIN");
        db.prepare("DELETE FROM solicitacao_servico WHERE cliente_login = ?").run(login);
        const inserir = db.prepare(`INSERT INTO solicitacao_servico
            (numero, data_pedido, status, preco, data_prevista, servico_id, cliente_login)
            VALUES (?, ?, ?, ?, ?, ?, ?)`);
        for (const s of solicitacoes) {
            inserir.run(s.numero, s.dataPedido, s.status, s.preco, s.dataPrevista, s.servicoId, login);
        }
        db.exec("COMMIT");
        return null;
    } catch (erro) {
        db.exec("ROLLBACK");
        return "Erro ao atualizar as solicitações: " + erro.message;
    }
}

// Consulta de serviços de TI: retorna todos.
export function consultarServicos() {
    return db.prepare("SELECT id, nome, preco, prazo FROM servico_ti ORDER BY nome").all();
}

// Consulta das solicitações de um usuário, já com o nome do serviço.
export function consultarSolicitacoes(login) {
    return db.prepare(`
        SELECT s.numero, s.data_pedido AS dataPedido, s.status, s.preco,
               s.data_prevista AS dataPrevista, s.servico_id AS servicoId, t.nome AS servico
        FROM solicitacao_servico s
        JOIN servico_ti t ON t.id = s.servico_id
        WHERE s.cliente_login = ?
        ORDER BY s.data_pedido, s.numero
    `).all(login);
}

// Auxiliar: nome do cliente, para mostrar na tela de solicitações.
export function buscarNomeCliente(login) {
    const cliente = db.prepare("SELECT nome FROM cliente WHERE login = ?").get(login);
    return cliente ? cliente.nome : "";
}
