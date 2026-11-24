// Tabela "Minhas solicitações", sempre em ordem crescente de data do pedido
import LinhaSolicitacao from "./LinhaSolicitacao.jsx";

export default function TabelaSolicitacoes({ solicitacoes, aoExcluir }) {
    // Ordena uma cópia: data do pedido e, no mesmo dia, número da solicitação
    const ordenadas = [...solicitacoes].sort(
        (a, b) => a.dataPedido.localeCompare(b.dataPedido) || a.numero - b.numero
    );

    return (
        <table className="tabela">
            <thead>
                <tr>
                    <th>Data do pedido</th>
                    <th>Nº da solicitação</th>
                    <th>Serviço de TI</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th>Data prevista</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                {ordenadas.length == 0 && (
                    <tr>
                        <td colSpan="7">Nenhuma solicitação.</td>
                    </tr>
                )}
                {ordenadas.map((s) => (
                    <LinhaSolicitacao key={s.numero} solicitacao={s} aoExcluir={aoExcluir} />
                ))}
            </tbody>
        </table>
    );
}
