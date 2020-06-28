export class StartStopGame {
    constructor(lives, scoreObj) {
        this.lives = lives;
        this.score = scoreObj;

        this.sound = new Howl({
            src: ['assets/fail.wav'],
            volume: 0.5
        });
    }

    askName() {
        let name = prompt('Please enter your name:', 'Magic Platypus');
        this.score.setName(name);
    }

    checkLives(ball, abortGameLoop) {
        this.ball = ball;
        if (this.lives > 0) {
            setTimeout( this.startGame.bind(this), 1000, ball);
        } else {
            abortGameLoop();
            this.gameOver(ball);
        }
    }

    startGame(ball) {
        ball.setPos(new Victor(1030, 600));
        ball.velocity = new Victor(0, -1);
        this.lives--;
    }

    gameOver(ball) {
        ball.gameFinished = true;
        this.sound.play();
        this.score.saveScore();
        const highscore = this.score.getScore();

        window.location.href = 'highscore.html';
        window.alert(`Game Over! Your score is ${highscore}!`);
        console.log("redirecting")
    }
}
