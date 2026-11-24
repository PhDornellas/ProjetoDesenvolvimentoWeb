// Rodapé da página inicial: contatos, endereço e formas de pagamento,
// organizados numa tabela de layout (requisito da AV1)
export default function RodapeCompleto() {
    return (
        <footer>
            <table className="layout-rodape">
                <tbody>
                    <tr>
                        <td>
                            <section>
                                <h2>Contatos</h2>
                                <ul>
                                    <li>Telefone: (81) 3333-3333</li>
                                    <li>WhatsApp: (81) 99999-9999</li>
                                    <li>
                                        E-mail:{" "}
                                        <a href="mailto:contato@techsolutions.com.br">contato@techsolutions.com.br</a>
                                    </li>
                                </ul>
                            </section>
                        </td>
                        <td>
                            <section>
                                <h2>Endereço</h2>
                                <p>Rua da Tecnologia, 100 - Recife - PE</p>
                            </section>
                        </td>
                        <td>
                            <section>
                                <h2>Formas de pagamento</h2>
                                <img src="/imagens/visa.png" alt="Visa" width="80" />
                                <img src="/imagens/mastercard.png" alt="Mastercard" width="80" />
                                <img src="/imagens/pix.png" alt="Pix" width="80" />
                            </section>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p style={{ textAlign: "center" }}>Tech Solutions - Serviços de TI</p>
        </footer>
    );
}
