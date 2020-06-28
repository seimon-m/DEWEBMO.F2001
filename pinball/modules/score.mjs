
export class Score {
    constructor(tableObj) {
        this.score = 0;
        this.name = 'test';
        this.table = tableObj;
        this.listDiv = document.getElementsByClassName('list');
    }

    getScore() {
        return this.score;
    }

    updateScore(newScore) {
        this.score += newScore;
    }

    async saveScore() {
        console.log("save");
        const url = "http://127.0.0.1:8080/?score=" + this.score + "&name=" + this.name;
        try {
            const response = await fetch(url);
            const resJson = await response.json();
            this.listDiv.innerHTML = this.renderHighscoreList(resJson);
        }
        catch (err) {
            console.log('fetch failed: ' + err);
        }
    }

    renderHighscoreList(hs) {
        let out ="<ol>";
        hs.forEach((s) => out += "<li>" + s.score + " " + s.name + "</li>");
        out += "</ol>";
        return out;
    }

    setName(name) {
        this.name = name;
    }
}