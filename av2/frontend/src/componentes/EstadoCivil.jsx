// Radio buttons de estado civil, controlados pelo estado da página
const OPCOES = [
    { valor: "solteiro", texto: "Solteiro(a)" },
    { valor: "casado", texto: "Casado(a)" },
    { valor: "divorciado", texto: "Divorciado(a)" },
    { valor: "viuvo", texto: "Viúvo(a)" }
];

export default function EstadoCivil({ valor, aoMudar }) {
    return (
        <section>
            <h2>Estado civil</h2>
            <p>
                {OPCOES.map((o) => (
                    <span key={o.valor}>
                        <input
                            type="radio"
                            id={o.valor}
                            name="estadoCivil"
                            value={o.valor}
                            checked={valor == o.valor}
                            onChange={() => aoMudar(o.valor)}
                        />
                        <label htmlFor={o.valor}>{o.texto}</label>{" "}
                    </span>
                ))}
            </p>
        </section>
    );
}
