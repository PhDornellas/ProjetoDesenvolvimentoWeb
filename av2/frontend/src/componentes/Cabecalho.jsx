// Cabeçalho das páginas de formulário: logo + título da página
export default function Cabecalho({ titulo }) {
    return (
        <header>
            <img src="/imagens/logo.png" alt="Logo da Tech Solutions" width="200" />
            <h1>{titulo}</h1>
        </header>
    );
}
