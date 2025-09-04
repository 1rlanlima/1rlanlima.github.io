document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const timeDisplay = document.getElementById('time');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');

    const victoryModal = document.getElementById('victory-modal');
    const victoryMessage = document.getElementById('victory-message');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const victoryMusic = document.getElementById('victory-music');

    const cardIcons = [
        'fas fa-graduation-cap',
        'fas fa-book',
        'fas fa-laptop-code',
        'fas fa-coffee',
        'fas fa-briefcase',
        'fas fa-building',
        'fas fa-pencil-alt',
        'fas fa-flask'
    ];

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchesFound = 0;
    let score = 0;
    let timerInterval;
    let seconds = 0;
    let timerStarted = false; // <-- NOVA VARIÁVEL AQUI

    function createCards() {
        const gameIcons = [...cardIcons, ...cardIcons];
        gameIcons.sort(() => 0.5 - Math.random());

        gameBoard.innerHTML = '';
        cards = [];

        gameIcons.forEach((iconClass) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.icon = iconClass;

            cardElement.innerHTML = `
                <div class="front-face"><i class="${iconClass}"></i></div>
                <div class="back-face"></div>
            `;

            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
            cards.push(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        // <-- LÓGICA DO CRONÔMETRO INICIA AQUI -->
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }
        // <-- FIM DA LÓGICA -->

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        firstCard.classList.add('match');
        secondCard.classList.add('match');

        score += 100;
        scoreDisplay.textContent = score;
        matchesFound++;

        resetBoard();

        if (matchesFound === cardIcons.length) {
            clearInterval(timerInterval);
            setTimeout(showVictoryMessage, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 600);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startGame() {
        resetGame();
        createCards();
        // REMOVIDO: startTimer() não é mais chamado aqui.
    }

    function resetGame() {
        clearInterval(timerInterval);
        seconds = 0;
        timeDisplay.textContent = '00:00';
        score = 0;
        scoreDisplay.textContent = '0';
        matchesFound = 0;
        resetBoard();
        victoryMusic.pause();
        victoryMusic.currentTime = 0;
        timerStarted = false; // <-- RESETANDO A VARIÁVEL
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            let minutes = Math.floor(seconds / 60);
            let remainingSeconds = seconds % 60;
            timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }, 1000);
    }
    
    function showVictoryMessage() {
        const timeBonus = Math.max(0, 1000 - (seconds * 10));
        const finalScore = score + timeBonus;

        let message = `Você completou o jogo em ${timeDisplay.textContent} `;

        if (timeBonus > 0) {
            message += `com um bônus de tempo de ${timeBonus} pontos. `;
        }

        message += `Sua pontuação final é ${finalScore} pontos!`;
        
        victoryMessage.textContent = message;
        victoryModal.classList.add('active');
        victoryMusic.play();
    }

    restartButton.addEventListener('click', startGame);

    playAgainBtn.addEventListener('click', () => {
        victoryModal.classList.remove('active');
        startGame();
    });

    startGame();
});