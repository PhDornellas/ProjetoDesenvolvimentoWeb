// Uma linha da tabela de solicitações
import { formatarData, formatarPreco } from "../util/formatacao.js";

export default function LinhaSolicitacao({ solicitacao, aoExcluir }) {
    return (
        <tr>
            <td>{formatarData(solicitacao.dataPedido)}</td>
            <td>{String(solicitacao.numero).padStart(3, "0")}</td>
            <td>{solicitacao.servico}</td>
            <td>{solicitacao.status}</td>
            <td>{formatarPreco(solicitacao.preco)}</td>
            <td>{formatarData(solicitacao.dataPrevista)}</td>
            <td>
                <button type="button" onClick={() => aoExcluir(solicitacao.numero)}>Excluir</button>
            </td>
        </tr>
    );
}
