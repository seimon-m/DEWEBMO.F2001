

export class StartStopGame {
    constructor(lives, scoreObj) {
        this.lives = lives;
        this.score = scoreObj;
        this.highscoreSaved = false;

        this.sound = new Howl({
            src: ['assets/fail.wav'],
        });
    }

    askName() {
        let name = prompt('Please enter your name:', 'Hedgehog');
        this.score.setName(name);
    }

    checkLives(ball) {
        this.ball = ball;
        if (this.lives > 0) {
            setTimeout( this.startGame.bind(this), 1000, ball);
        } else if (!this.highscoreSaved) {
            this.highscoreSaved = true;
            this.gameOver();
        }
    }

    startGame(ball) {
        ball.setPos(new Victor(1030, 600));
        ball.velocity = new Victor(0, -1);
        this.lives--;
    }

    gameOver() {
        this.sound.play();
        this.score.saveScore();
        const highscore = this.score.getScore();

        window.alert(`Game Over! Your score is ${highscore}. \nDo you want to restart the game?`);
        window.location.reload();
    }
}
