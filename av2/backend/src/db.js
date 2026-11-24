// Banco de dados SQLite (módulo nativo do Node 24, não precisa instalar nada)
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pasta = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(pasta, "..", "techsolutions.db"));

db.exec("PRAGMA foreign_keys = ON;");

// ---------- Tabelas ----------
db.exec(`
    CREATE TABLE IF NOT EXISTS cliente (
        login           TEXT PRIMARY KEY,   -- e-mail do cliente
        senha           TEXT NOT NULL,
        nome            TEXT NOT NULL,
        cpf             TEXT NOT NULL,
        data_nascimento TEXT NOT NULL,      -- aaaa-mm-dd
        telefone        TEXT,
        estado_civil    TEXT NOT NULL,
        escolaridade    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS servico_ti (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        nome  TEXT NOT NULL,
        preco REAL NOT NULL,
        prazo INTEGER NOT NULL              -- prazo de atendimento em dias
    );

    CREATE TABLE IF NOT EXISTS solicitacao_servico (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        numero        INTEGER NOT NULL,     -- número da solicitação
        data_pedido   TEXT NOT NULL,        -- aaaa-mm-dd
        status        TEXT NOT NULL,
        preco         REAL NOT NULL,
        data_prevista TEXT NOT NULL,        -- aaaa-mm-dd
        servico_id    INTEGER NOT NULL REFERENCES servico_ti(id),   -- chave estrangeira: serviço de TI
        cliente_login TEXT NOT NULL REFERENCES cliente(login)       -- chave estrangeira: cliente
    );
`);

// ---------- Dados iniciais (só na primeira execução) ----------
const qtdServicos = db.prepare("SELECT COUNT(*) AS qtd FROM servico_ti").get().qtd;

if (qtdServicos == 0) {
    const inserirServico = db.prepare("INSERT INTO servico_ti (nome, preco, prazo) VALUES (?, ?, ?)");
    inserirServico.run("Suporte Técnico", 150, 2);
    inserirServico.run("Desenvolvimento de Sistema", 1500, 10);
    inserirServico.run("Infraestrutura de TI", 800, 5);
    inserirServico.run("Consultoria em TI", 500, 2);

    db.prepare(`INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run("joao@email.com", "Senha@123", "João da Silva", "529.982.247-25", "1990-05-10",
           "(81) 99999-9999", "solteiro", "superior");

    const inserirSolicitacao = db.prepare(`INSERT INTO solicitacao_servico
        (numero, data_pedido, status, preco, data_prevista, servico_id, cliente_login)
        VALUES (?, ?, ?, ?, ?, ?, ?)`);
    inserirSolicitacao.run(1, "2026-10-01", "EM ELABORAÇÃO", 150, "2026-10-03", 1, "joao@email.com");
    inserirSolicitacao.run(2, "2026-10-02", "EM ANDAMENTO", 1500, "2026-10-12", 2, "joao@email.com");
    inserirSolicitacao.run(3, "2026-10-04", "CONCLUÍDO", 500, "2026-10-06", 4, "joao@email.com");
}

export default db;
