// Página de cadastro de clientes: valida e depois chama o endpoint /api/clientes
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho.jsx";
import RodapeSimples from "../componentes/RodapeSimples.jsx";
import Campo from "../componentes/Campo.jsx";
import Mensagem from "../componentes/Mensagem.jsx";
import RegrasSenha from "../componentes/RegrasSenha.jsx";
import EstadoCivil from "../componentes/EstadoCivil.jsx";
import Escolaridade from "../componentes/Escolaridade.jsx";
import {
    validarLogin, validarNovaSenha, validarNome, validarCpf,
    validarNascimento, validarTelefone, mascaraCpf, mascaraTelefone
} from "../util/validacoes.js";
import { api } from "../util/api.js";

// Valores iniciais (default): solteiro(a) e 2º grau completo
const VAZIO = {
    email: "", senha: "", confirmacao: "", nome: "", cpf: "",
    nascimento: "", telefone: "", estadoCivil: "solteiro", escolaridade: "2grau-completo"
};

export default function Cadastro() {
    const [dados, setDados] = useState(VAZIO);
    const [mensagem, setMensagem] = useState(null);
    const [enviando, setEnviando] = useState(false);
    const [versao, setVersao] = useState(0);
    const navegar = useNavigate();

    // Devolve uma função que atualiza só um campo do objeto "dados"
    function alterar(campo) {
        return (valor) => setDados({ ...dados, [campo]: valor });
    }

    async function incluir() {
        const erro =
            validarLogin(dados.email) ||
            validarNovaSenha(dados.senha, dados.confirmacao) ||
            validarNome(dados.nome) ||
            validarCpf(dados.cpf) ||
            validarNascimento(dados.nascimento) ||
            validarTelefone(dados.telefone);
        if (erro) {
            setMensagem({ texto: erro, sucesso: false });
            return;
        }

        setEnviando(true);
        const resposta = await api.cadastrarCliente({
            login: dados.email.trim(),
            senha: dados.senha,
            nome: dados.nome.trim(),
            cpf: dados.cpf,
            dataNascimento: dados.nascimento,
            telefone: dados.telefone,
            estadoCivil: dados.estadoCivil,
            escolaridade: dados.escolaridade
        });
        setEnviando(false);

        if (resposta.status == "sucesso") {
            setMensagem({ texto: "Validação realizada com sucesso. Cliente cadastrado!", sucesso: true });
        } else {
            setMensagem({ texto: resposta.mensagem, sucesso: false });
        }
    }

    function limpar() {
        setDados(VAZIO); // volta textos, data, radio e combo para os valores default
        setMensagem(null);
        setVersao(versao + 1); // recria o formulário e o foco volta para o e-mail
    }

    return (
        <>
            <Cabecalho titulo="Cadastro de clientes" />

            <main className="estreito">
                <form key={versao}>
                    <section>
                        <h2>Dados de acesso</h2>
                        <Campo id="email" rotulo="E-mail / Login:" tipo="email" valor={dados.email} aoMudar={alterar("email")} autoFocus />
                        <Campo id="senha" rotulo="Senha:" tipo="password" valor={dados.senha} aoMudar={alterar("senha")} />
                        <Campo id="confirmacao" rotulo="Confirmação da senha:" tipo="password" valor={dados.confirmacao} aoMudar={alterar("confirmacao")} />
                        <RegrasSenha />
                    </section>

                    <section>
                        <h2>Dados pessoais</h2>
                        <Campo id="nome" rotulo="Nome:" valor={dados.nome} aoMudar={alterar("nome")} />
                        <Campo id="cpf" rotulo="CPF:" valor={dados.cpf} placeholder="000.000.000-00" maxLength={14}
                               aoMudar={(v) => alterar("cpf")(mascaraCpf(v))} />
                        <Campo id="nascimento" rotulo="Data de nascimento:" tipo="date" valor={dados.nascimento} aoMudar={alterar("nascimento")} />
                        <Campo id="telefone" rotulo="Telefone / WhatsApp:" tipo="tel" valor={dados.telefone} placeholder="(00) 00000-0000" maxLength={15}
                               aoMudar={(v) => alterar("telefone")(mascaraTelefone(v))} />
                    </section>

                    <EstadoCivil valor={dados.estadoCivil} aoMudar={alterar("estadoCivil")} />
                    <Escolaridade valor={dados.escolaridade} aoMudar={alterar("escolaridade")} />

                    <section>
                        <button type="button" onClick={incluir} disabled={enviando}>Incluir</button>
                        <button type="button" onClick={limpar}>Limpar</button>
                        <button type="button" onClick={() => navegar(-1)}>Voltar</button>
                        <Mensagem mensagem={mensagem} />
                    </section>
                </form>
            </main>

            <RodapeSimples />
        </>
    );
}
