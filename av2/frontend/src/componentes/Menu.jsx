// Menu da página inicial. O link de solicitação de serviços só aparece
// quando há usuário logado (renderização condicional com o estado do Context).
import { Link } from "react-router-dom";
import { useUsuario } from "../UsuarioContexto.jsx";

export default function Menu() {
    const { usuario } = useUsuario();

    return (
        <nav>
            <Link to="/login">Login</Link>
            <Link to="/cadastro">Cadastro</Link>
            <Link to="/cadastro-servico">Cadastrar serviço de TI</Link>
            {usuario && <Link to="/servico">Solicitar serviços de TI</Link>}
        </nav>
    );
}
