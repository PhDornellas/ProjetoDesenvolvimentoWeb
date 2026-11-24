package br.com.techsolutions;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.techsolutions.Funcionalidades.Cliente;
import br.com.techsolutions.Funcionalidades.Servico;
import br.com.techsolutions.Funcionalidades.Solicitacao;

import static br.com.techsolutions.Funcionalidades.motivo;

// Endpoints REST que usam as funcionalidades do backend.
// Mesmas rotas, mesmas entradas e mesmas respostas JSON do backend Node.js (server.js).
@RestController
@RequestMapping("/api")
public class Endpoints {

    // Entradas que só existem para um endpoint
    public record Login(String login, String senha) {}
    public record TrocaSenha(String login, String senhaAtual, String novaSenha) {}
    public record ListaSolicitacoes(List<Solicitacao> solicitacoes) {}

    private final Funcionalidades funcionalidades;

    public Endpoints(Funcionalidades funcionalidades) {
        this.funcionalidades = funcionalidades;
    }

    // Monta a resposta padrão a partir do retorno "null ou mensagem de erro"
    private Map<String, Object> resposta(String erro) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        if (erro == null) {
            corpo.put("status", "sucesso");
        } else {
            corpo.put("status", "erro");
            corpo.put("mensagem", erro);
        }
        return corpo;
    }

    // Autenticação. Entrada: login e senha. Retorno: status do login.
    @PostMapping("/autenticacao")
    public Map<String, Object> autenticacao(@RequestBody Login entrada) {
        boolean ok = funcionalidades.autenticar(entrada.login(), entrada.senha());
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("status", ok);
        corpo.put("nome", ok ? funcionalidades.buscarNomeCliente(entrada.login()) : "");
        return corpo;
    }

    // Troca de senha. Entrada: login, senha atual e nova senha.
    @PostMapping("/troca-senha")
    public Map<String, Object> trocaSenha(@RequestBody TrocaSenha entrada) {
        return resposta(funcionalidades.trocarSenha(entrada.login(), entrada.senhaAtual(), entrada.novaSenha()));
    }

    // Cadastro de cliente. Entrada: dados do cliente.
    @PostMapping("/clientes")
    public Map<String, Object> cadastroCliente(@RequestBody Cliente cliente) {
        return resposta(funcionalidades.cadastrarCliente(cliente));
    }

    // Cadastro de serviço de TI. Entrada: dados do serviço.
    @PostMapping("/servicos")
    public Map<String, Object> cadastroServico(@RequestBody Servico servico) {
        if (servico.nome() == null || servico.nome().isEmpty() || servico.preco() == null || servico.prazo() == null) {
            return resposta("Nome, preço e prazo do serviço são obrigatórios.");
        }
        return resposta(funcionalidades.cadastrarServico(servico));
    }

    // Consulta de serviços de TI. Retorno: lista de serviços + status.
    @GetMapping("/servicos")
    public Map<String, Object> consultaServicos() {
        Map<String, Object> corpo = new LinkedHashMap<>();
        try {
            List<Map<String, Object>> servicos = funcionalidades.consultarServicos();
            corpo.put("status", "sucesso");
            corpo.put("servicos", servicos);
        } catch (Exception erro) {
            corpo.put("status", "erro");
            corpo.put("mensagem", "Erro ao consultar os serviços: " + motivo(erro));
            corpo.put("servicos", List.of());
        }
        return corpo;
    }

    // Leitura das solicitações de um usuário. Entrada: login do usuário.
    @GetMapping("/solicitacoes/{login}")
    public Map<String, Object> consultaSolicitacoes(@PathVariable String login) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        try {
            List<Map<String, Object>> solicitacoes = funcionalidades.consultarSolicitacoes(login);
            corpo.put("status", "sucesso");
            corpo.put("solicitacoes", solicitacoes);
        } catch (Exception erro) {
            corpo.put("status", "erro");
            corpo.put("mensagem", "Erro ao consultar as solicitações: " + motivo(erro));
            corpo.put("solicitacoes", List.of());
        }
        return corpo;
    }

    // Atualização das solicitações. Entrada: login do usuário e a nova lista de solicitações.
    @PutMapping("/solicitacoes/{login}")
    public Map<String, Object> atualizacaoSolicitacoes(@PathVariable String login, @RequestBody ListaSolicitacoes entrada) {
        List<Solicitacao> lista = entrada.solicitacoes() == null ? List.of() : entrada.solicitacoes();
        return resposta(funcionalidades.atualizarSolicitacoes(login, lista));
    }
}
