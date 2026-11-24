// Formatação de valores para exibição

export function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// aaaa-mm-dd -> dd/mm/aaaa
export function formatarData(dataIso) {
    const [ano, mes, dia] = dataIso.split("-");
    return dia + "/" + mes + "/" + ano;
}

// Data de hoje (ou somando dias) no formato aaaa-mm-dd
export function dataIso(diasSomados = 0) {
    const data = new Date();
    data.setDate(data.getDate() + diasSomados);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return data.getFullYear() + "-" + mes + "-" + dia;
}
