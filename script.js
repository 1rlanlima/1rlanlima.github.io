document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const loadingIndicator = document.querySelector('.loading-indicator');

    startButton.addEventListener('click', () => {
        loadingIndicator.classList.add('active');

        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1500);
    });

});
