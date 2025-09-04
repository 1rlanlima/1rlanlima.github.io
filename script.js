document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const loadingIndicator = document.querySelector('.loading-indicator');

    startButton.addEventListener('click', () => {
        // Ativa o indicador de carregamento
        loadingIndicator.classList.add('active');

        // Simula um tempo de carregamento antes de ir para a próxima página
        setTimeout(() => {
            window.location.href = 'game.html'; // Redireciona para a página do jogo
        }, 1500); // 1.5 segundos de "carregamento"
    });
});