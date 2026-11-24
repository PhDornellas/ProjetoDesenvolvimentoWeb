// Vídeo institucional de 1 minuto, em streaming do YouTube
export default function VideoInstitucional() {
    return (
        <section>
            <h2>Vídeo institucional</h2>
            <p>Conheça um pouco mais sobre a nossa empresa:</p>
            <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/ouNDxTlm-HM"
                title="Vídeo institucional da Tech Solutions"
                allowFullScreen
            ></iframe>
        </section>
    );
}
