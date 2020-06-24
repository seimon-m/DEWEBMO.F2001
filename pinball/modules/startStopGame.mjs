

export class StartStopGame {
    constructor(lives) {
        this.lives = lives;
    }

    checkLives(ball) {
        this.ball = ball;
        if (this.lives > 0) {
            setTimeout( this.startGame.bind(this), 1000, ball);
        } else {
            this.gameOver();
        }
    }

    startGame(ball) {
        ball.setPos(new Victor(1030, 600));
        ball.velocity = new Victor(0, -1);
        this.lives--;
    }

    gameOver() {
        console.log("Game over!")

        // setTimeout(() => {
        //     window.alert('Game Over! Do you want to restart the game?');
        // }, 1000)
        // window.location.reload();
    }
}
