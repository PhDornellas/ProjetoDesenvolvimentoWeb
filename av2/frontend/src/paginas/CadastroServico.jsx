// Página nova da AV2: cadastro de serviço de TI.
// Valida no próprio React se todos os dados foram preenchidos e envia para /api/servicos.
import { useState } from "react";
import { Link } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho.jsx";
import RodapeSimples from "../componentes/RodapeSimples.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensagem from "../componentes/Mensagem.jsx";
import { api } from "../util/api.js";

const VAZIO = { nome: "", preco: "", prazo: "" };

export default function CadastroServico() {
    const [servico, setServico] = useState(VAZIO);
    const [mensagem, setMensagem] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [versao, setVersao] = useState(0);

    function alterar(campo) {
        return (valor) => setServico({ ...servico, [campo]: valor });
    }

    function validar() {
        if (servico.nome.trim() == "") return "O nome do serviço deve ser preenchido.";
        if (servico.preco === "") return "O preço deve ser preenchido.";
        if (Number(servico.preco) <= 0) return "O preço deve ser maior que zero.";
        if (servico.prazo === "") return "O prazo de atendimento deve ser preenchido.";
        if (!Number.isInteger(Number(servico.prazo)) || Number(servico.prazo) <= 0)
            return "O prazo deve ser um número inteiro de dias, maior que zero.";
        return "";
    }

    async function cadastrar() {
        const erro = validar();
        if (erro) {
            setMensagem({ texto: erro, sucesso: false });
            return;
        }

        setEnviando(true);
        const resposta = await api.cadastrarServico({
            nome: servico.nome.trim(),
            preco: Number(servico.preco),
            prazo: Number(servico.prazo)
        });
        setEnviando(false);

        if (resposta.status == "sucesso") {
            setServico(VAZIO);
            setVersao(versao + 1);
            setMensagem({ texto: "Serviço de TI cadastrado com sucesso.", sucesso: true });
        } else {
            setMensagem({ texto: resposta.mensagem, sucesso: false });
        }
    }

    function limpar() {
        setServico(VAZIO);
        setMensagem(null);
        setVersao(versao + 1);
    }

    return (
        <>
            <Cabecalho titulo="Cadastro de serviços de TI" />

            <main className="estreito">
                <section>
                    <form key={versao}>
                        <Campo id="nome" rotulo="Serviço de TI:" valor={servico.nome} aoMudar={alterar("nome")} autoFocus />
                        <Campo id="preco" rotulo="Preço (R$):" tipo="number" min="0" step="0.01" valor={servico.preco} aoMudar={alterar("preco")} />
                        <Campo id="prazo" rotulo="Prazo de atendimento (dias):" tipo="number" min="1" step="1" valor={servico.prazo} aoMudar={alterar("prazo")} />
                        <p>
                            <button type="button" onClick={cadastrar} disabled={enviando}>Cadastrar serviço</button>
                            <button type="button" onClick={limpar}>Limpar</button>
                        </p>
                        <Mensagem mensagem={mensagem} />
                    </form>
                </section>

                <section>
                    <p><Link to="/servico">Ir para a solicitação de serviços</Link></p>
                    <p><Link to="/">Voltar para a página inicial</Link></p>
                </section>
            </main>

            <RodapeSimples />
        </>
    );
}
