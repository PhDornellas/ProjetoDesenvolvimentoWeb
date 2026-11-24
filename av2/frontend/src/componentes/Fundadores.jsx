// Tabela com cargo, nome e breve CV dos fundadores
const FUNDADORES = [
    { cargo: "Diretor Executivo", nome: "João Silva", cv: "Profissional com experiência em gestão de empresas e projetos de tecnologia." },
    { cargo: "Diretora de Tecnologia", nome: "Maria Santos", cv: "Especialista em desenvolvimento de sistemas, inovação e soluções tecnológicas." },
    { cargo: "Diretor Comercial", nome: "Pedro Oliveira", cv: "Profissional com experiência em vendas, relacionamento com clientes e negócios." }
];

export default function Fundadores() {
    return (
        <section>
            <h2>Fundadores</h2>
            <table className="tabela">
                <thead>
                    <tr>
                        <th>Cargo</th>
                        <th>Nome</th>
                        <th>Breve CV</th>
                    </tr>
                </thead>
                <tbody>
                    {FUNDADORES.map((f) => (
                        <tr key={f.nome}>
                            <td>{f.cargo}</td>
                            <td>{f.nome}</td>
                            <td>{f.cv}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
