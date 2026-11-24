// Combo box de escolaridade, controlado pelo estado da página
const OPCOES = [
    { valor: "1grau-incompleto", texto: "1º grau incompleto" },
    { valor: "1grau-completo", texto: "1º grau completo" },
    { valor: "2grau-completo", texto: "2º grau completo" },
    { valor: "superior", texto: "Nível superior" },
    { valor: "pos-graduado", texto: "Pós-graduado" }
];

export default function Escolaridade({ valor, aoMudar }) {
    return (
        <section>
            <h2>Escolaridade</h2>
            <label htmlFor="escolaridade">Escolaridade:</label>{" "}
            <select id="escolaridade" name="escolaridade" value={valor} onChange={(e) => aoMudar(e.target.value)}>
                {OPCOES.map((o) => (
                    <option key={o.valor} value={o.valor}>{o.texto}</option>
                ))}
            </select>
        </section>
    );
}
