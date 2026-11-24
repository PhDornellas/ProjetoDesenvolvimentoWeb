// Apresentação estática dos principais serviços de TI
const SERVICOS = [
    { titulo: "Desenvolvimento de Sistemas", texto: "Desenvolvimento e manutenção de sistemas personalizados para atender às necessidades dos clientes." },
    { titulo: "Suporte Técnico", texto: "Atendimento técnico para solucionar problemas relacionados a computadores, sistemas e tecnologia." },
    { titulo: "Infraestrutura de TI", texto: "Planejamento, configuração e manutenção da infraestrutura tecnológica das empresas." },
    { titulo: "Consultoria em Tecnologia", texto: "Orientação para empresas que desejam utilizar a tecnologia de maneira mais eficiente." }
];

export default function ServicosPrincipais() {
    return (
        <section className="caixa destaque quadrada">
            <h2>Principais serviços de TI</h2>
            <div className="servicos">
                {SERVICOS.map((s) => (
                    <article key={s.titulo}>
                        <h3>{s.titulo}</h3>
                        <p>{s.texto}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
