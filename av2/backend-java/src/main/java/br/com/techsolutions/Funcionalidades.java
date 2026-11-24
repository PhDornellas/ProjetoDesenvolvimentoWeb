package br.com.techsolutions;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.core.NestedExceptionUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

// Funcionalidades do backend. Cada método corresponde a um item do enunciado da AV2
// e faz exatamente o mesmo que a função de mesmo nome no backend Node.js (funcionalidades.js).
// Os que "retornam void ou mensagem de erro" devolvem null quando dá certo, ou o texto do erro.
@Service
public class Funcionalidades {

    // Dados recebidos do front (mesmos nomes de campo do JSON)
    public record Cliente(String login, String senha, String nome, String cpf, String dataNascimento,
                          String telefone, String estadoCivil, String escolaridade) {}

    public record Servico(String nome, Double preco, Integer prazo) {}

    public record Solicitacao(Integer numero, String dataPedido, String status, Double preco,
                              String dataPrevista, Integer servicoId) {}

    private final JdbcTemplate db;
    private final TransactionTemplate transacao;

    public Funcionalidades(JdbcTemplate db, TransactionTemplate transacao) {
        this.db = db;
        this.transacao = transacao;
    }

    // Texto do erro original do SQLite (ex.: "FOREIGN KEY constraint failed"),
    // igual ao que o backend Node.js mostra. O Spring embrulha a mensagem, então pegamos só o motivo.
    public static String motivo(Exception erro) {
        String texto = NestedExceptionUtils.getMostSpecificCause(erro).getMessage();
        Matcher m = Pattern.compile("\\(([^()]*)\\)$").matcher(texto == null ? "" : texto);
        return m.find() ? m.group(1) : texto;
    }

    // Autenticação: lê o cliente pelo login e compara a senha. Retorna true ou false.
    public boolean autenticar(String login, String senha) {
        List<String> senhas = db.queryForList("SELECT senha FROM cliente WHERE login = ?", String.class, login);
        return !senhas.isEmpty() && senhas.get(0).equals(senha);
    }

    // Troca de senha: autentica com a senha atual e, se der certo, grava a nova senha.
    public String trocarSenha(String login, String senhaAtual, String novaSenha) {
        if (!autenticar(login, senhaAtual)) {
            return "Login ou senha atual inválidos.";
        }
        try {
            db.update("UPDATE cliente SET senha = ? WHERE login = ?", novaSenha, login);
            return null;
        } catch (Exception erro) {
            return "Erro ao trocar a senha: " + motivo(erro);
        }
    }

    // Cadastro de cliente: verifica apenas se o login já existe.
    public String cadastrarCliente(Cliente cliente) {
        Integer existe = db.queryForObject("SELECT COUNT(*) FROM cliente WHERE login = ?", Integer.class, cliente.login());
        if (existe > 0) {
            return "Já existe um cliente cadastrado com este login.";
        }
        try {
            db.update("""
                INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                cliente.login(), cliente.senha(), cliente.nome(), cliente.cpf(), cliente.dataNascimento(),
                cliente.telefone() == null ? "" : cliente.telefone(), cliente.estadoCivil(), cliente.escolaridade());
            return null;
        } catch (Exception erro) {
            return "Erro ao cadastrar o cliente: " + motivo(erro);
        }
    }

    // Cadastro de serviço de TI: a chave primária (id) é autoincremento.
    public String cadastrarServico(Servico servico) {
        try {
            db.update("INSERT INTO servico_ti (nome, preco, prazo) VALUES (?, ?, ?)",
                    servico.nome(), servico.preco(), servico.prazo());
            return null;
        } catch (Exception erro) {
            return "Erro ao cadastrar o serviço de TI: " + motivo(erro);
        }
    }

    // Atualização das solicitações: apaga todas as do usuário e inclui as recebidas.
    // Tudo numa transação: se algo falhar, nada é alterado.
    public String atualizarSolicitacoes(String login, List<Solicitacao> solicitacoes) {
        try {
            transacao.executeWithoutResult(estado -> {
                db.update("DELETE FROM solicitacao_servico WHERE cliente_login = ?", login);
                for (Solicitacao s : solicitacoes) {
                    db.update("""
                        INSERT INTO solicitacao_servico
                        (numero, data_pedido, status, preco, data_prevista, servico_id, cliente_login)
                        VALUES (?, ?, ?, ?, ?, ?, ?)""",
                        s.numero(), s.dataPedido(), s.status(), s.preco(), s.dataPrevista(), s.servicoId(), login);
                }
            });
            return null;
        } catch (Exception erro) {
            return "Erro ao atualizar as solicitações: " + motivo(erro);
        }
    }

    // Consulta de serviços de TI: retorna todos.
    public List<Map<String, Object>> consultarServicos() {
        return db.queryForList("SELECT id, nome, preco, prazo FROM servico_ti ORDER BY nome");
    }

    // Consulta das solicitações de um usuário, já com o nome do serviço.
    public List<Map<String, Object>> consultarSolicitacoes(String login) {
        return db.queryForList("""
            SELECT s.numero, s.data_pedido AS dataPedido, s.status, s.preco,
                   s.data_prevista AS dataPrevista, s.servico_id AS servicoId, t.nome AS servico
            FROM solicitacao_servico s
            JOIN servico_ti t ON t.id = s.servico_id
            WHERE s.cliente_login = ?
            ORDER BY s.data_pedido, s.numero""", login);
    }

    // Auxiliar: nome do cliente, para mostrar na tela de solicitações.
    public String buscarNomeCliente(String login) {
        List<String> nomes = db.queryForList("SELECT nome FROM cliente WHERE login = ?", String.class, login);
        return nomes.isEmpty() ? "" : nomes.get(0);
    }
}
