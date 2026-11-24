package br.com.techsolutions;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

// Cria as tabelas e os dados iniciais (iguais aos do backend Node.js, db.js) ao iniciar o servidor
@Component
public class BancoDeDados implements CommandLineRunner {

    private final JdbcTemplate db;

    public BancoDeDados(JdbcTemplate db) {
        this.db = db;
    }

    @Override
    public void run(String... args) {
        // ---------- Tabelas ----------
        db.execute("""
            CREATE TABLE IF NOT EXISTS cliente (
                login           TEXT PRIMARY KEY,   -- e-mail do cliente
                senha           TEXT NOT NULL,
                nome            TEXT NOT NULL,
                cpf             TEXT NOT NULL,
                data_nascimento TEXT NOT NULL,      -- aaaa-mm-dd
                telefone        TEXT,
                estado_civil    TEXT NOT NULL,
                escolaridade    TEXT NOT NULL
            )""");

        db.execute("""
            CREATE TABLE IF NOT EXISTS servico_ti (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                nome  TEXT NOT NULL,
                preco REAL NOT NULL,
                prazo INTEGER NOT NULL              -- prazo de atendimento em dias
            )""");

        db.execute("""
            CREATE TABLE IF NOT EXISTS solicitacao_servico (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                numero        INTEGER NOT NULL,     -- número da solicitação
                data_pedido   TEXT NOT NULL,        -- aaaa-mm-dd
                status        TEXT NOT NULL,
                preco         REAL NOT NULL,
                data_prevista TEXT NOT NULL,        -- aaaa-mm-dd
                servico_id    INTEGER NOT NULL REFERENCES servico_ti(id),   -- chave estrangeira: serviço de TI
                cliente_login TEXT NOT NULL REFERENCES cliente(login)       -- chave estrangeira: cliente
            )""");

        // ---------- Dados iniciais (só na primeira execução) ----------
        Integer qtdServicos = db.queryForObject("SELECT COUNT(*) FROM servico_ti", Integer.class);

        if (qtdServicos == 0) {
            String inserirServico = "INSERT INTO servico_ti (nome, preco, prazo) VALUES (?, ?, ?)";
            db.update(inserirServico, "Suporte Técnico", 150, 2);
            db.update(inserirServico, "Desenvolvimento de Sistema", 1500, 10);
            db.update(inserirServico, "Infraestrutura de TI", 800, 5);
            db.update(inserirServico, "Consultoria em TI", 500, 2);

            db.update("""
                INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                "joao@email.com", "Senha@123", "João da Silva", "529.982.247-25", "1990-05-10",
                "(81) 99999-9999", "solteiro", "superior");

            String inserirSolicitacao = """
                INSERT INTO solicitacao_servico
                (numero, data_pedido, status, preco, data_prevista, servico_id, cliente_login)
                VALUES (?, ?, ?, ?, ?, ?, ?)""";
            db.update(inserirSolicitacao, 1, "2026-10-01", "EM ELABORAÇÃO", 150, "2026-10-03", 1, "joao@email.com");
            db.update(inserirSolicitacao, 2, "2026-10-02", "EM ANDAMENTO", 1500, "2026-10-12", 2, "joao@email.com");
            db.update(inserirSolicitacao, 3, "2026-10-04", "CONCLUÍDO", 500, "2026-10-06", 4, "joao@email.com");
        }
    }
}
