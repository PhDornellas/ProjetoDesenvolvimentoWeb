// Página de troca de senha: valida e depois chama o endpoint /api/troca-senha.
// Na AV2 entrou o campo "Senha atual", que o endpoint usa para autenticar.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho.jsx";
import RodapeSimples from "../componentes/RodapeSimples.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensagem from "../componentes/Mensagem.jsx";
import RegrasSenha from "../componentes/RegrasSenha.jsx";
import { validarLogin, validarNovaSenha } from "../util/validacoes.js";
import { api } from "../util/api.js";

export default function TrocaSenha() {
    const [login, setLogin] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [mensagem, setMensagem] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [versao, setVersao] = useState(0);
    const navegar = useNavigate();

    async function trocarSenha() {
        const erro =
            validarLogin(login) ||
            (senhaAtual == "" ? "A senha atual deve ser preenchida." : "") ||
            validarNovaSenha(senha, confirmacao);
        if (erro) {
            setMensagem({ texto: erro, sucesso: false });
            return;
        }

        setEnviando(true);
        const resposta = await api.trocarSenha(login.trim(), senhaAtual, senha);
        setEnviando(false);

        if (resposta.status == "sucesso") {
            setMensagem({ texto: "Validação realizada com sucesso. Senha alterada!", sucesso: true });
            setTimeout(() => navegar(-1), 1500); // volta para a página anterior
        } else {
            setMensagem({ texto: resposta.mensagem, sucesso: false });
        }
    }

    function limpar() {
        setLogin("");
        setSenhaAtual("");
        setSenha("");
        setConfirmacao("");
        setMensagem(null);
        setVersao(versao + 1);
    }

    return (
        <>
            <Cabecalho titulo="Troca de senha de clientes" />

            <main className="estreito">
                <section>
                    <form key={versao}>
                        <Campo id="login" rotulo="Login (e-mail):" tipo="email" valor={login} aoMudar={setLogin} autoFocus />
                        <Campo id="senhaAtual" rotulo="Senha atual:" tipo="password" valor={senhaAtual} aoMudar={setSenhaAtual} />
                        <Campo id="senha" rotulo="Nova senha:" tipo="password" valor={senha} aoMudar={setSenha} />
                        <Campo id="confirmacao" rotulo="Confirmação da senha:" tipo="password" valor={confirmacao} aoMudar={setConfirmacao} />
                        <RegrasSenha />
                        <p>
                            <button type="button" onClick={trocarSenha} disabled={enviando}>Troca Senha</button>
                            <button type="button" onClick={limpar}>Limpar</button>
                        </p>
                        <Mensagem mensagem={mensagem} />
                    </form>
                </section>

                <section>
                    <p><Link to="/login">Voltar para o Login</Link></p>
                </section>
            </main>

            <RodapeSimples />
        </>
    );
}
