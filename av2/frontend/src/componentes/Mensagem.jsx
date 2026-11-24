// Label de mensagem: vermelho para erro, verde para sucesso.
// Recebe { texto, sucesso } ou null (não mostra nada).
export default function Mensagem({ mensagem }) {
    if (!mensagem) return null;
    return (
        <p className={mensagem.sucesso ? "mensagem sucesso" : "mensagem"}>
            {mensagem.texto}
        </p>
    );
}
