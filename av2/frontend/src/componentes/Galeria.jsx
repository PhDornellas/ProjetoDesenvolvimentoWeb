// Galeria de fotos: os dados ficam numa lista e o JSX gera um <figure> para cada foto
const FOTOS = [
    { arquivo: "empresa1.jpg", alt: "Instalações da empresa", legenda: "Instalações da empresa" },
    { arquivo: "empresa2.jpg", alt: "Equipe da empresa", legenda: "Equipe Tech Solutions" },
    { arquivo: "empresa3.jpg", alt: "Funcionários trabalhando", legenda: "Equipe trabalhando" },
    { arquivo: "empresa4.jpg", alt: "Sala de reunião", legenda: "Sala de reuniões" }
];

export default function Galeria() {
    return (
        <section>
            <h2>Galeria</h2>
            <div className="galeria">
                {FOTOS.map((foto) => (
                    <figure key={foto.arquivo}>
                        <img src={"/imagens/" + foto.arquivo} alt={foto.alt} width="300" />
                        <figcaption>{foto.legenda}</figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}
