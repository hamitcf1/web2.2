class RockPaperScissors {
    constructor() {
        this.score = parseInt(localStorage.getItem('rpsScore')) || 0;
        this.choices = ['rock', 'paper', 'scissors'];
        this.emojis = {
            rock: '✊',
            paper: '✋',
            scissors: '✌️'
        };
        this.init();
    }

    init() {
        this.updateScore();
        
        document.querySelectorAll('.choice-btn').forEach(button => {
            button.addEventListener('click', () => {
                this.playRound(button.dataset.choice);
                
                // Add click feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);

                // Haptic feedback
                if (window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
            });
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetScore();
        });
    }

    playRound(playerChoice) {
        const computerChoice = this.choices[Math.floor(Math.random() * 3)];
        
        // Display choices
        const playerDisplay = document.getElementById('player-choice');
        const computerDisplay = document.getElementById('computer-choice');
        const resultMessage = document.getElementById('result-message');
        
        playerDisplay.textContent = this.emojis[playerChoice];
        computerDisplay.textContent = '';
        
        // Animate computer choice
        setTimeout(() => {
            computerDisplay.textContent = this.emojis[computerChoice];
            
            // Determine winner
            const result = this.determineWinner(playerChoice, computerChoice);
            
            // Update score and display result
            if (result === 'win') {
                this.score++;
                this.updateScore();
                resultMessage.textContent = 'You Win! 🎉';
                resultMessage.className = 'result-message win';
                playerDisplay.classList.add('winning-choice');
                computerDisplay.classList.remove('winning-choice');
            } else if (result === 'lose') {
                resultMessage.textContent = 'You Lose! 😢';
                resultMessage.className = 'result-message lose';
                playerDisplay.classList.remove('winning-choice');
                computerDisplay.classList.add('winning-choice');
            } else {
                resultMessage.textContent = "It's a Draw! 🤝";
                resultMessage.className = 'result-message draw';
                playerDisplay.classList.remove('winning-choice');
                computerDisplay.classList.remove('winning-choice');
            }
            
            document.getElementById('game-result').classList.add('active');
        }, 500);
    }

    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'draw';
        
        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'win';
        }
        
        return 'lose';
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        localStorage.setItem('rpsScore', this.score.toString());
    }

    resetScore() {
        this.score = 0;
        this.updateScore();
        
        // Animate reset button
        const resetBtn = document.getElementById('reset-btn');
        resetBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resetBtn.style.transform = '';
        }, 100);
        
        // Clear result display
        document.getElementById('game-result').classList.remove('active');
        document.getElementById('player-choice').textContent = '';
        document.getElementById('computer-choice').textContent = '';
        document.getElementById('result-message').textContent = '';
    }
}

const game = new RockPaperScissors(); 