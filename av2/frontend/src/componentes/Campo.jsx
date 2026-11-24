// Campo de formulário controlado: rótulo + input.
// O valor vem do estado da página (valor) e cada digitação chama aoMudar.
export default function Campo({ id, rotulo, tipo = "text", valor, aoMudar, ...outros }) {
    return (
        <p>
            <label htmlFor={id}>{rotulo}</label>{" "}
            <input
                type={tipo}
                id={id}
                name={id}
                value={valor}
                onChange={(e) => aoMudar(e.target.value)}
                {...outros}
            />
        </p>
    );
}
