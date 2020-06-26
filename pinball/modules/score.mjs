
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
        // Flag setzen
        const url = "http://127.0.0.1:8080/?score=" + this.score + "&name=" + this.name;
        // const response = fetch(url,{cache: 'force-cache', redirect: 'manual'})
        //     .then(response => response.json())
        //     .then(data => this.listDiv.innerHTML = this.renderHighscoreList(data))
        //     .catch(error => console.log("Highscore Error: " + error));
        // // Flag löschen und html erzeugen
        // console.log(response);

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
        console.log("Rendering data...")

        let out ="<ol>";
        hs.forEach((s) => out += "<li>" + s.score + " " + s.name + "</li>");
        out += "</ol>";
        hs.forEach((s) => console.log(s))
        return out;
    }

    setName(name) {
        this.name = name;
    }
}