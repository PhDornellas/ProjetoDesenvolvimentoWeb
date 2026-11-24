// Seção com nome e login do usuário logado (vêm do Context, não mais fixos)
export default function DadosUsuario({ usuario }) {
    return (
        <section>
            <h2>Usuário logado</h2>
            <p>
                <strong>Nome:</strong> <label>{usuario.nome}</label>
            </p>
            <p>
                <strong>Login:</strong> <label>{usuario.login}</label>
            </p>
        </section>
    );
}
