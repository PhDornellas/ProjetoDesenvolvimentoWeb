// Página de login: valida os campos e depois autentica no endpoint /api/autenticacao
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho.jsx";
import RodapeSimples from "../componentes/RodapeSimples.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensagem from "../componentes/Mensagem.jsx";
import { useUsuario } from "../UsuarioContexto.jsx";
import { validarLogin } from "../util/validacoes.js";
import { api } from "../util/api.js";

export default function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState(null);
    const [enviando, setEnviando] = useState(false);
    // Mudar a "versao" recria o formulário; o autoFocus coloca o cursor no login de novo
    const [versao, setVersao] = useState(0);
    const { setUsuario } = useUsuario();
    const navegar = useNavigate();

    async function realizarLogin() {
        const erro = validarLogin(login) || (senha == "" ? "A senha deve ser preenchida." : "");
        if (erro) {
            setMensagem({ texto: erro, sucesso: false });
            return;
        }

        setEnviando(true);
        const resposta = await api.autenticar(login.trim(), senha);
        setEnviando(false);

        if (resposta.status === true) {
            setMensagem({ texto: "Validação realizada com sucesso", sucesso: true });
            setUsuario({ login: login.trim(), nome: resposta.nome });
            setTimeout(() => navegar("/"), 1200);
        } else {
            setMensagem({ texto: resposta.mensagem || "Login ou senha inválidos.", sucesso: false });
        }
    }

    function limpar() {
        setLogin("");
        setSenha("");
        setMensagem(null);
        setVersao(versao + 1);
    }

    return (
        <>
            <Cabecalho titulo="Login de clientes" />

            <main className="estreito">
                <section>
                    <form key={versao}>
                        <Campo id="login" rotulo="Login (e-mail):" tipo="email" valor={login} aoMudar={setLogin} autoFocus />
                        <Campo id="senha" rotulo="Senha:" tipo="password" valor={senha} aoMudar={setSenha} />
                        <p>
                            <button type="button" onClick={realizarLogin} disabled={enviando}>Realizar Login</button>
                            <button type="button" onClick={limpar}>Limpar</button>
                        </p>
                        <Mensagem mensagem={mensagem} />
                    </form>
                </section>

                <section>
                    <p><Link to="/troca-senha">Trocar senha</Link></p>
                    <p><Link to="/cadastro">Cadastrar novo cliente</Link></p>
                    <p><Link to="/">Voltar para a página inicial</Link></p>
                </section>
            </main>

            <RodapeSimples />
        </>
    );
}
