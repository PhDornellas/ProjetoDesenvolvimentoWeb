// Campo de saída com as regras de composição da senha (troca de senha e cadastro)
export default function RegrasSenha() {
    return (
        <fieldset>
            <legend>Regra para composição da senha</legend>
            <p>A senha deve possuir pelo menos 6 caracteres, contendo pelo menos:</p>
            <ul>
                <li>Um número;</li>
                <li>Uma letra maiúscula;</li>
                <li>Um caractere especial.</li>
            </ul>
            <p>Caracteres especiais permitidos:</p>
            <p>@ # $ % &amp; * ! ? / \ | - _ + . =</p>
            <p>Caracteres não permitidos:</p>
            <p>¨ {"{ } [ ]"} ´ ` ~ ^ : ; &lt; &gt; , “ ‘</p>
        </fieldset>
    );
}
