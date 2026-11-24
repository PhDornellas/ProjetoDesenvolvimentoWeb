// Formulário de nova solicitação. Os serviços vêm do endpoint de consulta de serviços de TI;
// preço, prazo e data prevista são calculados a partir do serviço selecionado.
import { useState } from "react";
import { formatarData, formatarPreco, dataIso } from "../util/formatacao.js";

const STATUS_INICIAL = "EM ELABORAÇÃO";

export default function NovaSolicitacao({ servicos, aoIncluir }) {
    const [servicoId, setServicoId] = useState("");

    const servico = servicos.find((s) => String(s.id) == servicoId);

    function incluir() {
        if (!servico) return;
        aoIncluir({
            dataPedido: dataIso(),
            servicoId: servico.id,
            servico: servico.nome,
            status: STATUS_INICIAL,
            preco: servico.preco,
            dataPrevista: dataIso(servico.prazo)
        });
        setServicoId("");
    }

    return (
        <section>
            <h2>Nova solicitação de serviço</h2>
            <form>
                <p>
                    <label htmlFor="servico">Serviço de TI:</label>{" "}
                    <select id="servico" name="servico" value={servicoId} onChange={(e) => setServicoId(e.target.value)}>
                        <option value="">Selecione um serviço</option>
                        {servicos.map((s) => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                        ))}
                    </select>
                </p>
                <p>
                    <strong>Preço:</strong>{" "}
                    <label>{servico ? formatarPreco(servico.preco) : "Selecione um serviço"}</label>
                </p>
                <p>
                    <strong>Prazo de atendimento:</strong>{" "}
                    <label>{servico ? servico.prazo + (servico.prazo == 1 ? " dia" : " dias") : "Selecione um serviço"}</label>
                </p>
                <p>
                    <strong>Data prevista de atendimento:</strong>{" "}
                    <label>{servico ? formatarData(dataIso(servico.prazo)) : "A definir"}</label>
                </p>
                <p>
                    <strong>Status:</strong> <label>{STATUS_INICIAL}</label>
                </p>
                <p>
                    <button type="button" onClick={incluir} disabled={!servico}>Incluir solicitação</button>
                </p>
            </form>
        </section>
    );
}
