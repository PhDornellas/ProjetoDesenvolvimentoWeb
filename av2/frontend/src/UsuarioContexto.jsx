// Guarda o usuário logado em um estado do React (hook useState)
// e o compartilha com todas as páginas pelo Context.
import { createContext, useContext, useState } from "react";

const UsuarioContexto = createContext(null);

export function UsuarioProvider({ children }) {
    // null = ninguém logado; senão { login, nome }
    const [usuario, setUsuario] = useState(null);

    return (
        <UsuarioContexto.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContexto.Provider>
    );
}

export function useUsuario() {
    return useContext(UsuarioContexto);
}
