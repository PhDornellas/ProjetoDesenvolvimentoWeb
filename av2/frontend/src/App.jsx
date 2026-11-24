// Rotas: um componente React por página
import { Routes, Route } from "react-router-dom";
import Inicio from "./paginas/Inicio.jsx";
import Login from "./paginas/Login.jsx";
import TrocaSenha from "./paginas/TrocaSenha.jsx";
import Cadastro from "./paginas/Cadastro.jsx";
import Servico from "./paginas/Servico.jsx";
import CadastroServico from "./paginas/CadastroServico.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/troca-senha" element={<TrocaSenha />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/servico" element={<Servico />} />
            <Route path="/cadastro-servico" element={<CadastroServico />} />
        </Routes>
    );
}
