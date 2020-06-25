
export class Score {
    constructor(tableObj) {
        this.score = 0;
        this.name = 'test';
        this.table = tableObj;
    }

    getScore() {
        return this.score;
    }

    updateScore(newScore) {
        this.score += newScore;
    }

    saveScore() {
        console.log("save");
        const url = "http://127.0.0.1:8080/?score=" + this.score + "&name=" + this.name;
        const response = fetch(url)
            .then(response => response.json())
            .then(data => this.renderHighScoreList(data))
            .catch(error => console.log("Highscore Error: " + error));
        console.log(response);
    }

    renderHighscoreList(data) {
        console.log("Rendering data...")
        console.log(data);
        // data.array.forEach(score => {
        //     console.log(score);
        // });
    }

    setName(name) {
        this.name = name;
    }



    // renderHighScoreList(hs) {
    //     hs.forEach((s) => console.log(s));
    // };
}