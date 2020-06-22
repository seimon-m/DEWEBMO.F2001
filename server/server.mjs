import * as fs from 'fs';
import express from 'express';
const app = express()
 
app.get('/', (req, res) => {
  res.send("Test");
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
 
  // Lese File
  fs.readFile('highscores.json', 'utf8', (err, data) => {
    let highScores = [];
    let newScore = 0;
    let newName = "";
    let insertPos = 9999;
 
    if (err) {
      console.log('Error: ' + err);
      res.write('Error: '+ err);
      return;
    } else {
      highScores = JSON.parse(data);
      newScore = Number(req.query.score);
      newName = req.query.name;
      for (let i=0; i<highScores.length; i++){
        if (newScore >= highScores[i].score){
          insertPos = i;
          break
        };
      }
      // Neuer Score in Array einfügen
      highScores.splice(insertPos,0,{"score":newScore, "name": newName});
      // letzter Score wegschneiden
      highScores.splice(10,1);
      res.json(highScores);
      fs.writeFile('highscores.json', JSON.stringify(highScores) , (err) => {
        if (err){
          console.log('Error: ' + err);
          res.write('Error: '+ err);
        } else {
          console.log('Wrote new highscore');
        }
      });
    }
  });
});

app.post('/save', ({name, score})) {
  let date = new Date;
  fs.writeFile('highscores.json', data, (err)) => {
    if (err) throw err;
  }
  console.log("new score saved!")
}
 
app.listen(8080);