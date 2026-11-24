// Validações da AV1, reescritas como funções puras: recebem valores e
// devolvem a mensagem de erro, ou "" quando está tudo certo.

export const PERMITIDOS = "@#$%&*!?/\\|-_+.=";
export const NAO_PERMITIDOS = "¨{}[]´`~^:;<>,“‘\"'";

export function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function temCaractere(texto, lista) {
    for (let i = 0; i < texto.length; i++) {
        if (lista.includes(texto[i])) return true;
    }
    return false;
}

export function validarLogin(login) {
    if (login.trim() == "") return "O login deve ser preenchido.";
    if (!emailValido(login.trim())) return "O login deve ter formato de e-mail válido.";
    return "";
}

// Regras da senha (troca de senha e cadastro)
export function validarNovaSenha(senha, confirmacao) {
    if (senha == "") return "A senha deve ser preenchida.";
    if (confirmacao == "") return "A confirmação de senha deve ser preenchida.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!/[0-9]/.test(senha)) return "A senha deve ter pelo menos um número.";
    if (!/[A-Z]/.test(senha)) return "A senha deve ter pelo menos uma letra maiúscula.";
    if (temCaractere(senha, NAO_PERMITIDOS)) return "A senha possui caractere não permitido.";
    if (!temCaractere(senha, PERMITIDOS)) return "A senha deve ter pelo menos um caractere especial permitido.";
    if (senha != confirmacao) return "A confirmação de senha deve ser igual à senha.";
    return "";
}

export function validarNome(nome) {
    const limpo = nome.trim();
    const palavras = limpo.split(/\s+/);
    if (limpo == "") return "O nome deve ser preenchido.";
    if (palavras.length < 2) return "O nome deve ter pelo menos duas palavras.";
    if (palavras[0].length < 2) return "A primeira palavra do nome deve ter pelo menos 2 caracteres.";
    if (temCaractere(limpo, PERMITIDOS + NAO_PERMITIDOS)) return "O nome não pode ter caracteres especiais.";
    return "";
}

// Algoritmo dos dígitos verificadores do CPF
export function cpfValido(cpf) {
    const d = cpf.replace(/\D/g, "");
    if (d.length != 11 || /^(\d)\1+$/.test(d)) return false;
    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i);
        let dv = (soma * 10) % 11;
        if (dv == 10) dv = 0;
        if (dv != Number(d[t])) return false;
    }
    return true;
}

export function validarCpf(cpf) {
    if (cpf == "") return "O CPF deve ser preenchido.";
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) return "O CPF deve estar no formato NNN.NNN.NNN-NN.";
    if (!cpfValido(cpf)) return "O CPF é inválido.";
    return "";
}

export function calcularIdade(dataIso) {
    const [ano, mes, dia] = dataIso.split("-").map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;
    const m = hoje.getMonth() + 1 - mes;
    if (m < 0 || (m == 0 && hoje.getDate() < dia)) idade--;
    return idade;
}

export function validarNascimento(data) {
    if (data == "") return "A data de nascimento deve ser preenchida.";
    if (calcularIdade(data) < 18) return "O cliente deve ser maior de idade.";
    return "";
}

export function validarTelefone(telefone) {
    if (telefone != "" && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone))
        return "O telefone deve estar no formato (NN) NNNNN-NNNN.";
    return "";
}

// Máscaras: recebem o texto digitado e devolvem o texto formatado
export function mascaraCpf(valor) {
    const d = valor.replace(/\D/g, "").substring(0, 11);
    if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
    if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    if (d.length > 3) return d.replace(/(\d{3})(\d+)/, "$1.$2");
    return d;
}

export function mascaraTelefone(valor) {
    const d = valor.replace(/\D/g, "").substring(0, 11);
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
    if (d.length > 6) return d.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    if (d.length > 2) return d.replace(/(\d{2})(\d+)/, "($1) $2");
    return d;
}
