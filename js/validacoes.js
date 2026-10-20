// Funções de validação usadas no login, na troca de senha e no cadastro

// Caracteres especiais da senha (listas do PDF)
var permitidos = "@#$%&*!?/\\|-_+.=";
var naoPermitidos = "¨{}[]´`~^:;<>,“‘\"'";

// E-mail válido: texto + @ + texto + . + texto, sem espaços (ex.: nome@site.com)
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Retorna true se algum caractere do texto estiver na lista
function temCaractere(texto, lista) {
    for (var i = 0; i < texto.length; i++) {
        if (lista.indexOf(texto[i]) != -1) {
            return true;
        }
    }
    return false;
}

// Valida login, senha e confirmação.
// Retorna a mensagem de erro, ou "" se estiver tudo certo.
function validarLoginSenha(login, senha, confirmacao) {
    if (login == "") return "O login deve ser preenchido.";
    if (!emailValido(login)) return "O login deve ter formato de e-mail válido.";
    if (senha == "") return "A senha deve ser preenchida.";
    if (confirmacao == "") return "A confirmação de senha deve ser preenchida.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (!/[0-9]/.test(senha)) return "A senha deve ter pelo menos um número.";
    if (!/[A-Z]/.test(senha)) return "A senha deve ter pelo menos uma letra maiúscula.";
    if (temCaractere(senha, naoPermitidos)) return "A senha possui caractere não permitido.";
    if (!temCaractere(senha, permitidos)) return "A senha deve ter pelo menos um caractere especial permitido.";
    if (senha != confirmacao) return "A confirmação de senha deve ser igual à senha.";
    return "";
}
