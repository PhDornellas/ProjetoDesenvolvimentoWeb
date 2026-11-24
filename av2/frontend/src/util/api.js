// Chamadas aos endpoints REST do backend.
// Se o backend estiver fora do ar, devolve um erro no mesmo formato das respostas.

// Endereço do backend. Para trocar de backend, mude SÓ esta linha:
//   Node.js (Express):        "http://localhost:3001"
//   Java (Spring Boot):       "http://localhost:8080"
const URL_BACKEND = "http://localhost:3001";

async function chamar(rota, metodo = "GET", corpo) {
    try {
        const resposta = await fetch(URL_BACKEND + rota, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: corpo ? JSON.stringify(corpo) : undefined
        });
        return await resposta.json();
    } catch {
        return { status: "erro", mensagem: "Não foi possível conectar ao servidor." };
    }
}

export const api = {
    autenticar: (login, senha) => chamar("/api/autenticacao", "POST", { login, senha }),
    trocarSenha: (login, senhaAtual, novaSenha) => chamar("/api/troca-senha", "POST", { login, senhaAtual, novaSenha }),
    cadastrarCliente: (cliente) => chamar("/api/clientes", "POST", cliente),
    cadastrarServico: (servico) => chamar("/api/servicos", "POST", servico),
    consultarServicos: () => chamar("/api/servicos"),
    consultarSolicitacoes: (login) => chamar("/api/solicitacoes/" + encodeURIComponent(login)),
    atualizarSolicitacoes: (login, solicitacoes) =>
        chamar("/api/solicitacoes/" + encodeURIComponent(login), "PUT", { solicitacoes })
};
