// Página de solicitação de serviços de TI (carrinho).
// Carrega serviços e solicitações do backend; incluir/excluir alteram só a lista na tela,
// e o botão "Atualizar solicitações" grava a lista inteira no backend.
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho.jsx";
import RodapeSimples from "../componentes/RodapeSimples.jsx";
import Mensagem from "../componentes/Mensagem.jsx";
import DadosUsuario from "../componentes/DadosUsuario.jsx";
import TabelaSolicitacoes from "../componentes/TabelaSolicitacoes.jsx";
import NovaSolicitacao from "../componentes/NovaSolicitacao.jsx";
import { useUsuario } from "../UsuarioContexto.jsx";
import { api } from "../util/api.js";

export default function Servico() {
    const { usuario, setUsuario } = useUsuario();
    const [servicos, setServicos] = useState([]);
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [mensagem, setMensagem] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [alterado, setAlterado] = useState(false); // há mudanças ainda não gravadas?
    const [enviando, setEnviando] = useState(false);
    const navegar = useNavigate();

    // Ao abrir a página: consulta os serviços de TI e as solicitações do usuário logado
    useEffect(() => {
        if (!usuario) return;
        async function carregar() {
            const [respServicos, respSolicitacoes] = await Promise.all([
                api.consultarServicos(),
                api.consultarSolicitacoes(usuario.login)
            ]);
            if (respServicos.status == "sucesso") setServicos(respServicos.servicos);
            if (respSolicitacoes.status == "sucesso") setSolicitacoes(respSolicitacoes.solicitacoes);
            const erro = respServicos.status != "sucesso" ? respServicos.mensagem
                : respSolicitacoes.status != "sucesso" ? respSolicitacoes.mensagem : null;
            if (erro) setMensagem({ texto: erro, sucesso: false });
            setCarregando(false);
        }
        carregar();
    }, [usuario]);

    function incluir(nova) {
        const proximoNumero = solicitacoes.reduce((maior, s) => Math.max(maior, s.numero), 0) + 1;
        setSolicitacoes([...solicitacoes, { ...nova, numero: proximoNumero }]);
        setAlterado(true);
        setMensagem(null);
    }

    function excluir(numero) {
        setSolicitacoes(solicitacoes.filter((s) => s.numero != numero));
        setAlterado(true);
        setMensagem(null);
    }

    async function atualizar() {
        setEnviando(true);
        const resposta = await api.atualizarSolicitacoes(usuario.login, solicitacoes);
        setEnviando(false);
        if (resposta.status == "sucesso") {
            setAlterado(false);
            setMensagem({ texto: "Solicitações atualizadas com sucesso.", sucesso: true });
        } else {
            setMensagem({ texto: resposta.mensagem, sucesso: false });
        }
    }

    function sair() {
        setUsuario(null);
        navegar("/");
    }

    // Sem login não há de quem mostrar as solicitações
    if (!usuario) {
        return (
            <>
                <Cabecalho titulo="Solicitação de serviços de TI" />
                <main className="estreito">
                    <section>
                        <p className="mensagem">Faça login para solicitar serviços de TI.</p>
                        <p><Link to="/login">Ir para o login</Link></p>
                    </section>
                </main>
                <RodapeSimples />
            </>
        );
    }

    return (
        <>
            <Cabecalho titulo="Solicitação de serviços de TI" />

            <main>
                <DadosUsuario usuario={usuario} />

                <section>
                    <h2>Minhas solicitações</h2>
                    {carregando ? (
                        <p>Carregando...</p>
                    ) : (
                        <TabelaSolicitacoes solicitacoes={solicitacoes} aoExcluir={excluir} />
                    )}
                    <p>
                        <button type="button" onClick={atualizar} disabled={enviando || carregando}>
                            Atualizar solicitações
                        </button>
                        {alterado && <em> Há alterações ainda não gravadas.</em>}
                    </p>
                    <Mensagem mensagem={mensagem} />
                </section>

                <NovaSolicitacao servicos={servicos} aoIncluir={incluir} />

                <section>
                    <p><Link to="/">Voltar para a página inicial</Link></p>
                    <p><Link to="/cadastro-servico">Cadastrar novo serviço de TI</Link></p>
                    <p><button type="button" onClick={sair}>Sair</button></p>
                </section>
            </main>

            <RodapeSimples />
        </>
    );
}
