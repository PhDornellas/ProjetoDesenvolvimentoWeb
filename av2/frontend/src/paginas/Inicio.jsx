// Página inicial (index da AV1), montada com componentes menores
import Menu from "../componentes/Menu.jsx";
import Historia from "../componentes/Historia.jsx";
import VideoInstitucional from "../componentes/VideoInstitucional.jsx";
import Galeria from "../componentes/Galeria.jsx";
import ServicosPrincipais from "../componentes/ServicosPrincipais.jsx";
import Fundadores from "../componentes/Fundadores.jsx";
import RodapeCompleto from "../componentes/RodapeCompleto.jsx";
import "./Inicio.css";

export default function Inicio() {
    return (
        <>
            <header className="cabecalho-inicio">
                <img src="/imagens/logo.png" alt="Logo da Tech Solutions" />
                <h1>Tech Solutions</h1>
                <p>Soluções inteligentes em tecnologia para transformar o seu negócio.</p>
                <Menu />
            </header>

            <main>
                <Historia />
                <VideoInstitucional />
                <Galeria />
                <ServicosPrincipais />
                <Fundadores />
            </main>

            <RodapeCompleto />
        </>
    );
}
